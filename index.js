const api = require("./keys.json");
const fs = require('fs');

const Discord = require('discord.js');
const bIntents = new Discord.Intents();
const client = new Discord.Client({ intents: ["DIRECT_MESSAGES", "GUILDS", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGES", "GUILD_EMOJIS_AND_STICKERS", ""], partials: ["CHANNEL"] });

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

for (const handler of fs.readdirSync('./handlers/').filter(file => file.endsWith('.js'))){
    require(`./handlers/${handler}`)(client, Discord);
}

//Connect to Dicord
client.login(api.discordToken);