const fs = require("fs");
const vars = JSON.parse(fs.readFileSync("./config.json", 'utf8')).messageCreate;

let only = false;
let onlyCom = "";

module.exports = (Discord, client, message) => {
    if(message.author.bot){
        // If message is from the bot, don't do anything
        return;
    }


    if (!(message.channel.type == "DM" || vars.channelNames.includes(message.channel.name) || vars.guilds.includes(message.guild.name))) {
        return;                                                                         //Stop processing the message
    }

    
    args = message.content.split(/ +/);
    const command = args.shift().toLowerCase();                                     //Make command lowercase

    if (vars.override === false) {
        if (command === "only") {
            if (!only && client.commands.has(args[0]) && args.length === 1) {
                onlyCom = args[0]
                only = true;
                message.channel.send("Exclusively running '" + args[0] + "'. Run the command 'only' again to quit back to console");
                return;
            } else {
                only = false;
                return;
            }
        }
    }

    if (!only && vars.override === false){
        if (client.commands.has(command)){
            try {
                client.commands.get(command).execute(message, args, client); //Run the selected command
                console.log(`[Message]: ${message.author.username} triggered ${command} ${args}`);
            } catch(e) {
                console.error(e);
            }
        } else {
            console.error("Unknown command: " + command);
        }
    } else {
        if (vars.override !== false){
            onlyCom = vars.override;
        }
        args = message.content.split(/ +/);
        try {
            client.commands.get(onlyCom).execute(message, args, client);
            console.log(`[Message]: ${message.author.username} triggered ${onlyCom} ${args}`);
        } catch(e) {
            console.error(e);
        }
    }

}