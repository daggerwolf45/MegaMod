const fs = require("fs");

/*
    Objects required for vfs runtime
 */

exports.vars = JSON.parse(fs.readFileSync("./config.json", 'utf8'));
exports.cursor = {
    at: exports.vars.fs.alias.home, //Should be changed

}

//VirtualFS
exports.vfs = {
    root: exports.vars.fs.root,
    symbols: exports.vars.fs.symbols,
    aliases: exports.vars.fs.alias,
    mounts: exports.vars.fs.mounts,

}

/*
    Default Return Codes
 */
const returns = {};
returns.none = {
    code: 0,
    res: 0,
    msg: ""
}
returns.success = returns.none;

returns.error = function(code){
    return {
        code: code,
        res: 0,
        msg: ""
    }
}

exports.returns = returns;

/*
    Functions
 */


/*
    Converts vFS path to actual path
    TODO add support for mount points...
    FUTURE-TODO add file metadata and virtual unix perms
    Returns:
        String: Valid path translation
        1: Illegal path
 */
exports.pathRec = function (path){
    let root = exports.vfs.root, recPath;
    if (Array.isArray(path)) {
        path = path.join(" ");
    }

    const fc = path.charAt(0);
    if (exports.vfs.symbols[fc] != null){                       //Symbol is first char in path
        root += exports.vfs.aliases[exports.vfs.symbols[fc]]
    } else if (fc === "/") {                                     //Slash is first char in path
        root = root;
    } else {                                                    //No special char at start of path
        root += exports.cursor.at + "/";
    }
    recPath = path

    let newPath = root + recPath;

    //Check depth
    //NOTE this doesn't allow for // as it currently breaks the check and is tricky to account for.
    //This could be fixed by re-writing to make a slash count only count if it's followed by a letter.

    //Analyze path
    const climbers = (newPath.match(/\.\.\//g) || []).length;
    let climbVar;
    if (climbers > 0){
        climbVar = climbers*2 + 1;
    } else climbVar = 0;
    const slashes = (newPath.match(/\//g) || []).length;
    const doubleSlashes = (newPath.match(/\/\//g) || []).length;
    let decent = slashes - climbVar  - 1
    if (newPath.charAt(newPath.length -1) === "/" && (newPath.charAt(newPath.length -2) !== "." && newPath.charAt(newPath.length -3) !== ".")) decent -= 1;

    vmsg(`Path Stats\nClimbers: ${climbers}\nClimbVar: ${climbVar}\nSlashes: ${slashes}\nDouble Slashes: ${doubleSlashes}\nDecent: ${decent}\n\n`)
    let newPath2 = newPath;
    for (let i = 0; i < climbers; i++) {
        newPath2 = newPath2.substring(0, newPath2.indexOf("../"))
    }

    dmsg(`Converted '${path}' into '${newPath}', alt path: ${newPath2}`);
    if (decent < 0){
        return 1;   //Goes out of range
    } else if (doubleSlashes > 0) {
        return 2;   //Uses double slashes
    }

    return newPath
}

//Debug message
exports.dmsg = function (msg){
    if (exports.vars.debug === true){
        console.debug("[DEBUG]: " + msg);
    }
}

//Verbose message
exports.vmsg = function (msg){
    if (exports.vars.debug === true && exports.vars.verbose === true){
        console.debug("[DEBUG]: " + msg);
    }
}

//Debug discord message
exports.sdmsg = function (msg, channel){
    if (exports.vars.debug === true){
        console.info("[DEBUG-SENDING]: " + msg);
    }
    channel.send(msg);
}

//Ease of use wrapper
const dmsg = function (msg){
    return exports.dmsg(msg);
}
const vmsg = function (msg){
    return exports.vmsg(msg);
}