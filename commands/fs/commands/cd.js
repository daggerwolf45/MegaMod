const lib = require("../lib")
const fs = require("fs");
module.exports = {
    run(args){
      return changeDirectory(args)
    },
    var: {
        args: 0,
        argDesc: "no arguments required"
    }
}

function changeDirectory(path){
    if (Array.isArray(path)) {
        path = path.join(" ");
    }
    path = path.trim();

    if (path === ""){
        lib.cursor.at = lib.vfs.aliases.home;
        lib.dmsg(`Changed path to ${lib.cursor.at}`);
        return lib.returns.none;
    }
    const realPath = lib.pathRec(path);

    //Verify path exists
    if (!isNaN(realPath) || !fs.existsSync(realPath)){
        return {
            code: 1,
            res: 1,
            msg: `cd: cannot access \`${path}\`: No such directory`
        }
    }

    //Verify path goes to a directory
    if (!fs.lstatSync(realPath).isDirectory()){
        return {
            code: 2,
            res: 1,
            msg: `cd: \`${path}\`: not a directory`
        }
    }

    lib.cursor.at = realPath.substring(12);;
    lib.dmsg(`Changed cursor to ${lib.cursor.at}`);

    return lib.returns.none;
}