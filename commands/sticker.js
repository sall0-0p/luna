require('dotenv').config();
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const { SlashCommandBuilder, AttachmentBuilder, InteractionContextType } = require('discord.js');

const stickersFile = path.join(__dirname, '../stickers.json'); // Path to stickers.json
let stickerData = {};

if (fs.existsSync(stickersFile)) {
  stickerData = JSON.parse(fs.readFileSync(stickersFile, 'utf8'));
} else {
  console.warn("stickers.json not found. Autocomplete will work without emojis.");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sticker')
    .setDescription('Resize and send a sticker')
    .setContexts([InteractionContextType.PrivateChannel, InteractionContextType.Guild, InteractionContextType.BotDM])
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the sticker')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption(option => 
        option.setName('caption')
            .setDescription('The message sent together with sticker')
            .setRequired(false)
    )
    .addIntegerOption(option =>
      option.setName('size')
        .setDescription(`Size of the sticker (default: ${process.env.DEFAULT_SIZE})`)
        .setRequired(false)
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    let stickerNames = [];
    try {
      stickerNames = fs
        .readdirSync('./stickers')
        .filter(file => file.endsWith('.png'))
        .map(file => file.replace('.png', ''));
    } catch (err) {
      console.error('Error reading stickers directory:', err);
    }

    const filtered = stickerNames.filter(name => {
      const parts = name.toLowerCase().split('_');
      return parts.some(part => part.startsWith(focusedValue.toLowerCase()));
    });
    
    const suggestions = filtered.slice(0, 25).map(name => ({
        name: `${stickerData[name]?.emoji || ''} ${name}`.trim(),
        value: name
    }));
  
    await interaction.respond(suggestions);
    return;
  },

  async execute(interaction) {
    const stickerName = interaction.options.getString('name');
    const size = interaction.options.getInteger('size') || Number(process.env.DEFAULT_SIZE);
    const filePath = `./stickers/${stickerName}.png`;

    try {
      const resizedBuffer = await sharp(filePath)
        .resize(size, size)
        .toBuffer();
      const attachment = new AttachmentBuilder(resizedBuffer, {
        name: `${stickerName}-${size}x${size}.png`,
      });

      await interaction.reply({ content: interaction.options.getString('caption') || null, files: [attachment] });

    } catch (error) {
      console.error('Error processing sticker:', error);
      await interaction.reply({
        content: 'Sorry, something went wrong while processing the sticker.',
        ephemeral: true,
      });
    }
  },
};
