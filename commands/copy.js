const clipboard = [];

module.exports = {
    name: 'copy',
    description: 'Copy to last message to bot clipboard',
    aliases: ["paste"],
    execute(message, args, Discord){
        message.channel.send("Pong!");
    }
}