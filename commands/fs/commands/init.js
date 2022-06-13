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

function init(){
    //Setup safe command running, no lib.func[""].run() here mr...
    lib.run = function (command, arguments, channel) {
        if (lib.func.list.includes(command)){
            arguments.shift()
            if (lib.func[command].var.args <= arguments.length){
                const ret = lib.func[command].run(arguments)
                if (ret.res === 1){
                    lib.sdmsg(ret.msg, channel);
                } else if (ret.res === 2){
                    const msg = "```\n" + ret.msg + "```";
                    lib.sdmsg(msg, channel);
                }

            } else {
                lib.sdmsg("FS: Invalid argument count; " + lib.func[command].var.argDesc, channel);
            }
        } else {
            lib.sdmsg("FS: Command not found.", channel);
        }
    }

    console.log("VirtualFS Initialized.");
    return lib.returns.none;
}