const fs = require('fs');
const fetch = require('node-fetch');

/*
    Flags
 */
exports.requireDownloader = false;      //Requires custom downloader implementation (takes link, returns file data)
exports.requireDirectFS = false;        //Requires custom implementation to write the file/s to the fs (takes link and path, downloads to path)

/*
    Functions
 */
exports.linkHandler = function (input){
    console.log(input);
    return 0;
}