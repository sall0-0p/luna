require('dotenv').config();
const fs = require('fs');
const sharp = require('sharp');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sticker')
    .setDescription('Resize and send a sticker')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the sticker')
        .setRequired(true)
        .setAutocomplete(true)
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
    const filtered = stickerNames.filter(name =>
      name.toLowerCase().startsWith(focusedValue.toLowerCase())
    );
    const suggestions = filtered.slice(0, 25).map(name => ({ name, value: name }));
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
      await interaction.reply({ files: [attachment] });
    } catch (error) {
      console.error('Error processing sticker:', error);
      await interaction.reply({
        content: 'Sorry, something went wrong while processing the sticker.',
        ephemeral: true,
      });
    }
  },
};
