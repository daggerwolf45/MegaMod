const fs = require('fs');
const fetch = require('node-fetch');
/*
Reddit link handler, writen by SamLaird

Note:
   This should use reddit's api in order to properly conform to TOS.
   Given that I don't really see anyone else using this, this is OK for now....
 */

/*
    Functions
 */
exports.linkHandler = async function (input, custname){
    let link = input.url;
    let video = false;

    //Verify link
    if (!link.includes("reddit.com/r/")){
        console.error("ERROR: LinkHandler expected reddit.com link, got unknown");
        console.log("input");
    }

    //Create redditsave link.
    link = link.replaceAll(":", "%3A");
    link = link.replaceAll("/", "%2F");
    const firstUrl = "https://redditsave.com/info?url=" + link;

    //Get redditsave page.
    const res = await fetch(firstUrl);
    const body = await res.text();
    if (!body){
        return null;
    }

    //Filter out line containing download link.
    let filerHTMLRegex = /.*https:\/\/i.redd.it.*\n/g;
    let line = body.match(filerHTMLRegex);
    try {
        line = line[0];
    } catch (e){
        filerHTMLRegex = /.*https:\/\/v.redd.it.*\n/g;
        line = body.match(filerHTMLRegex);
        video = true;
        try {
            line = line[2];
        } catch {
            console.log(`Error failed to set finalurl`);
            return null;
        }
    }

    //Filter out exact download link.
    let filterLineRegex = /(?<=href=").*?(?=")/g;
    let finalUrl = line.match(filterLineRegex);
    try {
        finalUrl = finalUrl[0];
    } catch {
        console.log(`Error failed to set finalurl`);
        return null;
    }

    //Determine filename
    let filename;
    if (custname){
        filename = custname;
    } else {
        let filenameReg
        if (video){
            filenameReg = /(?<=https:\/\/v\.redd\.it\/).*?(?=\/)/;
            filename = finalUrl.match(filenameReg) + ".mp4"
        } else{
            filename = finalUrl.substr(17);
        }
    }

    return {
        name: filename,
        url: finalUrl
    }
}

exports.downloader = false;
exports.saveAgent = false;