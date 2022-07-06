const fs = require("fs");
const lib = require("../lib");
module.exports = {
    run: f => saveConf(),
    var: {
        args: 0,
        argDesc: "no arguments required"
    }
}

/*
    Primary Function

    Writes vfs config to fs
 */
function saveConf(){
    fs.writeFileSync("./config.json", JSON.stringify(lib.vars, null, 2));
    return {
        code: 0,
        res: 1,
        msg: "Saved!"
    }
}