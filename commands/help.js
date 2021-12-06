module.exports = {
    name: 'help',
    description: 'Gets usage instructions for specified command',
    aliases: ["man"],
    execute(message, args, file){
        if (args.length > 0){
            switch (args[0]){
                case "config":
                    message.channel.send(
                        "**Config**: Allows for setting and reading bot configuration.\n" +
                        "**Example A**:\n" +
                        "> config location/saveDir/path\n" +
                        "returns\n" +
                        `> files\n` +
                        "\n" +
                        "**Example B**:\n" +
                        "> config config/pathSep -\n" +
                        "Will set the variable at" +
                        "```json\n\"config\": {\n  pathSep\n}```" +
                        "to:\n" +
                        "> '-'\n" +
                        "\n" +
                        "*Tip*: Running 'config all' will read out all variables.");
                    break;
            }

        } else {
            message.channel.send(
                "MegaMod Help:\n" +
                "*Available Commands*:\n" +
                "```" +
                "* save: Saves attachments and links to specified folder\n" +
                "* config: Sets/Reads bot settings\n" +
                "* help: You're here..." +
                "```");
        }
    }
}