module.exports = {
    name: 'stash',
    description: 'Allows post-send saving of files',
    aliases: ["get"],
    execute(message, args, file){
        message.channel.send("Pong!");
    }
}