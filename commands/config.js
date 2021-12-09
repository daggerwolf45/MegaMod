const fs = require("fs");
const vars = JSON.parse(fs.readFileSync("./variables.json"));

module.exports = {
    name: 'config',
    description: 'Sets enviroment variables',
    execute(message, args, file) {
        if (args.length === 1) {
            if (args[0] === "all") {
                message.channel.send(`\`\`\`json\n${JSON.stringify(vars, null, 2)}\`\`\``);
                return 0;
            } else if (args[0] === "reload"){
            }

            const value = getObj(vars, args[0]);
            if (value === -1) {
                message.channel.send("Could not find requested parameter. :confused:");
            } else {
                message.channel.send(`\`\`\`json\n${JSON.stringify(value, null, 2)}\`\`\``);
            }
        } else if (args.length > 1){
            console.log(getObj(vars, args[0]));
            updateVar(vars, args[0], args[1]);
            console.log(getObj(vars, args[0]));

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

    return key;
}

function updateVar(obj, path, key){
    console.log(`Setting ${path}, to ${key}`);
    path = path.split(vars.config.pathSep);

    for (let i = 0; i < path.length-1; i++){
        obj = obj[path[i]];
        if (!obj){
            return -1;
        }
    }

    obj[path[path.length-1]] = key;
    saveVars();
}

function saveVars(){
    
    fs.writeFileSync("./variables.json", JSON.stringify(vars, null, 2));
}

