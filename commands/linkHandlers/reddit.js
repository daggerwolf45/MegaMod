const fs = require('fs');
const fetch = require('node-fetch');
/*
Reddit link handler, writen by SamLaird

Note:
   This should use reddit's api in order to properly conform to TOS.
   Given that I don't really see anyone else using this, this is OK for now....
 */


/*
    Flags
 */
exports.requireDownloader = false;      //Requires custom downloader implementation (takes link, returns file data)
exports.requireDirectFS = false;        //Requires custom implementation to write the file/s to the fs (takes link and path, downloads to path)

/*
    Functions
 */
exports.linkHandler = async function (input){
    //Verify link
    if (!(input.startsWith("https://reddit.com/r/") && input.contains("/comments/"))){
        console.error("ERROR: LinkHandler expected reddit.com link, got unknown");
    }

    //Create redditsave link.
    input = input.replaceAll(":", "%3A");
    input = input.replaceAll("/", "%2F");
    const firstUrl = "https://redditsave.com/info?url=" + input;

    //Get redditsave page.
    const res = await fetch(firstUrl);
    const body = await res.text();

    //Filter out line containing download link.
    const filerHTMLRegex = /.*((https:\/\/i.redd.it)|(http\/\/sd.redditsave.com)).*\\n/;
    const line = body.match(filerHTMLRegex);

    //Filter out exact download link.
    const filterLineRegex = /(?<=href=").*?(?=")/;
    return line.match(filterLineRegex);
}