const lib = require("../lib")
const fs = require("fs");
const {returns} = require("../lib");
module.exports = {
    run(args){
        return displayPath(args)
    },
    var: {
        args: 0,
        argDesc: "no arguments required"
    }
}

/*
    Primary function
 */
function displayPath(input){
    lib.vmsg(`Running LS=>\nInput: ${input}\nCursor:${lib.cursor.at}`)

    let files = [], path, message = "> "
    if (input == null || input.length <= 0){ //Reformat input
        input = lib.cursor.at
    }

    //Reformat path to be system path
    path = lib.pathRec(input);

    // Verify path exists & is valid
    if (!isNaN(path) || !fs.existsSync(path)){
        return {
            code: 1,
            res: 1,
            msg: `ls: cannot access \`${input}\`: No such directory`
        }
    }

    //Verify path goes to a directory
    if (!fs.lstatSync(path).isDirectory()){
        return {
            code: 2,
            res: 1,
            msg: `ls: \`${input}\`: not a directory`
        }
    }

    //Read files from path
    files = fs.readdirSync(path);
    if (files.join("") === ""){
        return {
            code: 0,
            res: 2,
            msg: " "
        }
    }

    //Determine if each file is folder or file
    files.forEach(file => {
        if(fs.lstatSync(path + "/" + file).isDirectory()){
            message += "*" + file + "*\n> "
        } else {
            message += file + "\n> "
        }
    })

    message = message.substring(0, message.length-2);

    return {
        code: 0,
        res: 1,
        msg: message
    }
}
