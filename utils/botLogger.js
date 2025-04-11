require('dotenv').config();
const { Client } = require('discord.js');

async function sendDM(client, message) {
    try {
        const user = await client.users.fetch(process.env.ALERT_USER_ID);
        await user.send(message);
    } catch (error) {
        console.error("Failed to send DM:", error);
    }
}
  
async function logStartup(client) {
    console.log(`Logged in as ${client.user.tag}`);
    await sendDM(client, "I am back from the stars, here to guard the dreams of mortal ponies! I was also auto-deployed.");
}

function setupShutdownLogging(client) {
    process.on('SIGINT', async () => {
        console.log("Bot is shutting down...");
        await sendDM(client, "I have to go, bye!");
        process.exit(0);
    });

    process.on('uncaughtException', async (error) => {
        console.error("Uncaught Exception:", error);
        await sendDM(client, 'MAYDAY MAYDAY I AM FALLING AHHH! Error:\n\`${error.message}\``)');
        process.exit(1);
    });
}

module.exports = { logStartup, setupShutdownLogging };
  