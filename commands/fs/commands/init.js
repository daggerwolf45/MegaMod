const fs = require("fs");
const lib = require("../lib")
let setup = false;
module.exports = {
    run: f => {
        if (!setup){
            setup = true;
            return init();
        } else return lib.returns.error(1);
    },
    var: {
        args: 0,
        argDesc: "no arguments required"
    }
}

/*
    First time initialization
 */
function init(){
    //Setup safe command running, no lib.func[""].run() here mr...
    lib.run = function (command, arguments, channel) {
        if (lib.func.list.includes(command)){
            arguments.shift()
            if (lib.func[command].var.args <= arguments.length){
                const ret = lib.func[command].run(arguments)        // Ret format documented in README.MD
                if (ret.res === 1){                                 // Return mode 1: (output directly to discord)
                    lib.sdmsg(ret.msg, channel);
                } else if (ret.res === 2){                          // Return mode 2: (output to discord encapsulated in code block)
                    const msg = "```\n" + ret.msg + "```";
                    lib.sdmsg(msg, channel);
                }

            } else {    //Invalid arg count
                lib.sdmsg("FS: Invalid argument count; " + lib.func[command].var.argDesc, channel);
            }
        } else {    //Unknown command
            lib.sdmsg("FS: Command not found.", channel);
        }
    }

    //TODO generate initial file structure
    //if (Filesystem) {generateFS()}

    console.log("VirtualFS Initialized.");
    return lib.returns.none;
}