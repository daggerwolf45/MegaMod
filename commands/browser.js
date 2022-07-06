const db = require('../database/db.js');
const fs = require("fs");
const lib = require("./fs/lib")
setupBrowser();

module.exports = {
    name: 'browser',
    description: 'Browse Files on Host',
    aliases: ["fs", "files"],
    execute(message, args, Discord){
        if (args.length > 0){
            lib.run(args[0], args, message.channel);
        }
    },

}

function setupBrowser(){
    const commands = {};
    commands.list = [];

    const handlerFiles = fs.readdirSync("./commands/fs/commands/").filter(file => file.endsWith('.js'));
    for (const file of handlerFiles){
        const name = file.split('.')[0];
        commands[name] = require('./fs/commands/' + file);
        commands.list.push(name);
    }

    lib.func = commands;
    commands["init"].run();

    return commands;
}