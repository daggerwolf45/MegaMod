### HybridFS

* Root point
* reletive path
* assume 1 user for now
* user home

reserved
* /mnt/
* /home/user

## TODO
* Auto setup
* config validation
* config editor
* gui...


## Spec
### Function
    const lib = require("../lib")
    module.exports = {
        run: f => {console.log("Pong"); return lib.noRet},
        var: {
        args: 0,
        argDesc: "no arguments required"
        }
    }
    
### Return
    {
        code: int
        res: int
        //Type of response (0:None, 1:Message, 2:Codeify Message, 3:...)
        msg: string
    }