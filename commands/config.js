const fs = require("fs");
const vars = JSON.parse(fs.readFileSync("./variables.json"));

module.exports = {
    name: 'config',
    description: 'Sets enviroment variables',
    execute(message, args, file){
        if (args.length > 0){
            if (args[0] === "all"){
                message.channel.send(`\`\`\`json\n${JSON.stringify(vars, null, 2)}\`\`\``);
                return 0;
            } else if (args[0] === "help"){
                message.channel.send(
                    "**Config**: Allows for setting and reading bot configuration.\n" +
                    "**Example A**:\n" +
                    "> config location/saveDir/path\n" +
                    "returns\n" +
                    `> ${getObj("location/saveDir/path")}\n` +
                    "\n" +
                    "**Example B**:\n" +
                    "> config config/pathSep -\n" +
                    "Will set the variable at" +
                    "```json\n\"config\": {\n  pathSep\n}```" +
                    "to:\n" +
                    "> '-'\n" +
                    "\n" +
                    "*Tip*: Running 'config all' will read out all variables.");
                return 0;
            }

            const value = getObj(vars, args[0]);
            if (value === -1){
                message.channel.send("Could not find requested parameter. :confused:");
            }
        } else {
            message.channel.send("Invalid number of arguments. Must at least specify a variable to read (ie: 'config path')");
        }
    }
}

function getObj(obj, path){
    path = path.split(vars.config.pathSep);
    let key = obj;
    for (let i = 0; i < path.length; i++){
        key = key[path[i]];
        if (!key){
            return -1;
        }
    }

    console.log(key);

}

function updateVar(obj, path, key){

}