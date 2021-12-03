const fs = require('fs');
const fetch = require('node-fetch');
const Collection = require('discord.js').Collection;

location = JSON.parse(fs.readFileSync("./variables.json")).location;

module.exports = {
    name: 'save',
    description: 'Stores message',
    execute(message, args, client){
        let folder = "";
        let text;
        let filename;
        let links = [];

        console.log(args);

        /*
        Determine links + save directory
         */
        if (message.attachments.size > 0){       //If received attachment
            console.log("Got file");
            if (message.attachments.size !== 0){        //Determine naming and folder hierarchy
                if (args.length > 0) {
                    folder = `/${args[0]}`;
                    if (args.length > 1 && message.attachments.size === 1) {
                        message.attachments.at(0).name = args[1];
                    }
                }
            }

            for (const attachment of message.attachments.entries()){
                const link = {
                    name: attachment[1].name,
                    url: attachment[1].url
                }

                links.push(link);
            }
        } else {                    //If received just text
            console.log("Got link");

            const text = args[args.length-1];
            const link = textToLink(text);
            links.push(link);

            if (args.length > 0) {

            } else {
                console.error('Nothing to save...');
                return -1;
            }
        }


        console.log("Analyzed input");

        //Create/Set dirs
        const authorDir = "/" + message.author.username;
        const dir = `${location.saveDir.root}${location.saveDir.path}${authorDir}${folder}`

        console.log(dir);

        //Check if directories exist
        if (!fs.existsSync(dir)){
            fs.mkdir(dir, { recursive: true }, error => {
                if (error){
                    console.error(error);
                    return;
                }
            })
        }

        console.log("Started save..");

        //Save links
        if (links.size !== 0){
            for (const link of links){
                let filename = link.name;
                let fullPath = `${dir}/${link.name}`;
                console.log(fullPath);

                if (fs.existsSync(fullPath)){
                    console.log("Found pre-existing file");
                    const names = incrementFilename(fullPath, filename);
                    fullPath = names[0];
                    filename = names[1];
                }
                console.log(fullPath);

                //Save File
                download(link.url).then(data=>{
                    fs.writeFile(fullPath, data, null, err => logSave(err, fullPath, filename));
                });

            }
            return 0;
        }


        async function logSave(error, path, file){
            const channel = client.channels.cache.get(location.log.channel);
            const dm = (message.channel.type === "DM");

            if (error){
                console.error(error);
                channel.send(`ERROR! Failed to save\n> ${file}\nto\n> ${path}`);
                if (dm){
                    message.channel.send(":thumbsdown:");
                }
            } else {
                console.log("Saved!");
                channel.send(`Successfully saved \n> ${path}`);
                if (dm){
                    message.channel.send(":thumbsup:");
                }
            }

            if (!dm){
                message.delete();
            }
        }

        async function download(url){
            console.log(url);
            const response = await fetch(url);
            return await response.text();
        }

        function textToLink(text){
            const split = text.split("/");

            let index = split.length-1;
            if (split[index].size < 1) {
                index--;
            }

            let name = split[index];
            if (!name.includes(".")){
                name += ".html";
            }

            const link = {
                name: name,
                url: text
            }

            console.log(link);
            return link
        }

        function incrementFilename(path, file, i, ext){
            if (!i){
                ext = "." + file.split('.').pop();

                path = path.substr(0, path.length-file.length);
                file = file.substr(0, file.length-ext.length);
                file += " (0)" + ext;
                path += file;
                i = 1;
            }

            path = path.substr(0, path.length-file.length);
            file = file.substr(0, file.length-ext.length-2);
            file += `${i})${ext}`;
            path += file;

            if (fs.existsSync(path)){
                return incrementFilename(path, file, i+1, ext);
            }

            return [path, file];
        }
    }
}