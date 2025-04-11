// ticketbot
require("./misc/ticketbot/src/index")

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { logStartup, setupShutdownLogging } = require('./utils/botLogger')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages], partials: [Partials.Channel] });
client.commands = new Collection();

const commandFiles = fs
  .readdirSync(path.join(__dirname, 'commands'))
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
  await logStartup(client);
  setupShutdownLogging(client);

  const statuses = [
    { name: "over Equestria", type: 3 }, 
    { name: "Ukrainians fighting for freedom", type: 3 },
    { name: "Luna's Royal Orders", type: 2 }, 
    { name: "with magic spells", type: 0 }, 
    { name: "the night sky", type: 3 }, 
    { name: "Celestia’s nonsense", type: 2 },
    { name: "ponies arguing in chat", type: 3 }, 
    { name: "for royal decrees", type: 2 }, 
    { name: "the moon’s whispers", type: 2 }, 
    { name: "Twilight’s lectures", type: 2 }, 
    { name: "the Canterlot Gossip", type: 3 },
    { name: "ponies make bad life choices", type: 3 }, 
    { name: "royal taxes being wasted", type: 3 }, 
    { name: "Celestia take credit for my work", type: 3 }, 
    { name: "ponies struggle with basic math", type: 3 }, 
    { name: "the royal treasury drain", type: 3 },
    { name: "ponies speedrun bad decisions", type: 3 }, 
    { name: "Celestia snore", type: 2 },
    { name: "ponies scream at each other", type: 2 },
    { name: "the cries of sleep-deprived students", type: 2 },
    { name: "Fluttershy whisper ASMR", type: 2 }, 
    { name: "Rainbow Dash complain about everything", type: 2 }, 
    { name: "ponies write fanfiction about me", type: 3 },
    { name: "the chaos unfold", type: 3 }, 
    { name: "ponies misquote royal history", type: 3 },
    { name: "the sun set... finally", type: 3 },
  ];

  let index = 0;
  setInterval(() => {
    client.user.setPresence({ activities: [statuses[index]], status: 'idle' });
    index = (index + 1) % statuses.length;
  }, 10000); // Changes status every 10 seconds
});

client.on('interactionCreate', async interaction => {
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (command && command.autocomplete) {
      try {
        await command.autocomplete(interaction);
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error('Error executing command:', error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
});

client.login(process.env.BOT_TOKEN);