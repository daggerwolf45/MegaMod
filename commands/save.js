const fs = require('fs');
const fetch = require('node-fetch');

const vars = JSON.parse(fs.readFileSync("./config.json", 'utf8'));
const location = vars.location;

const handlers = loadHandlers();

module.exports = {
    name: 'save',
    description: 'Stores message',
    execute(message, args, client) {
        let folder = "";
        let links = [];
        let customFilename = false;

        /*
        Determine links + save directory
         */
        if (message.attachments.size > 0) {       //If received attachment
            if (message.attachments.size !== 0) {        //Determine naming and folder hierarchy
                if (args.length > 1) {
                    folder = `/${args[0]}`;
                    if (args.length > 2 && message.attachments.size === 1) {
                        customFilename = args[1];
                    }
                }
            }

            for (const attachment of message.attachments.entries()) {
                const link = {
                    name: attachment[1].name,
                    url: attachment[1].url
                }

                links.push(link);
            }
        } else {                    //If received just text
            if (args.length > 0){
                const text = args[args.length - 1];
                const link = textToLink(text);
                links.push(link);

                if (args.length > 1) {
                    folder = `/${args[0]}`;
                    if (args.length > 2) {
                        customFilename = args[1];
                    }
                }
            } else {
                console.error('Nothing to save...');
                return -1;
            }
        }

        //Create/Set dirs
        const authorDir = "/" + message.author.username;
        const dir = `${location.saveDir.root}${location.saveDir.path}${authorDir}${folder}`

        //Check if directories exist
        if (!fs.existsSync(dir)) {
            fs.mkdir(dir, {recursive: true}, error => {
                if (error) {
                    console.error(error);
                    return -1;
                }
            })
        }

        console.log("Started save..");

        //Save links
        if (links.size !== 0) {
            for (let link of links) {
                let linkHandler = async function(i,j){return i};
                let downloader = download;
                let saveAgent = saveFile;

                //Check handlers
                if (handlers){                                      //Check if any custom link handlers exist
                    const handler = handlers.getHandler(link.url);      //Get handler for link
                    if (handler){                                       //Check if handler exists
                        if (handler.downloader){                            //If the handler requires a custom download function
                            if (handler.saveAgent){                             //If the handler requires a fully custom download solution
                                saveAgent = handler.saveAgent;                      //Set saveAgent to the handler's
                            }
                            downloader = handler.downloader;                  //Set downloader to handler's
                        }
                        linkHandler = handler.linkHandler;                  //Set linkHandler to handler's
                    }
                }


                linkHandler(link, customFilename).then(newlink => {
                    if (!newlink){
                        void logSave(true, link.name, link.url);
                        return;
                    }
                    link = newlink;

                    let filename = link.name;
                    if (customFilename) filename = customFilename;
                    let fullPath = `${dir}/${link.name}`;

                    if (fs.existsSync(fullPath)) {
                        console.log("Found pre-existing file");
                        const names = incrementFilename(fullPath, filename);
                        fs.closeSync(fs.openSync(fullPath, 'w'));
                        fullPath = names[0];
                        filename = names[1];
                    }


                    //Save File
                    downloader(link.url).then(data => {
                        void saveAgent(fullPath, filename, data);
                    });
                })
            }

            const dm = (message.channel.type === "DM");
            if (!dm) {
                message.delete();
            }

            return 0;
        }

        async function saveFile(path, filename, data){
            fs.writeFile(path, data, null, err => logSave(err, path, filename));
        }


        async function logSave(error, path, file) {
            const channel = client.channels.cache.get(location.log.channel);
            const dm = (message.channel.type === "DM");

            if (error) {
                console.error(error);
                channel.send(`ERROR! Failed to save\n> ${file}\nto\n> ${path}`);
                if (dm) {
                    message.channel.send(":thumbsdown:");
                }
            } else {
                console.log("Saved!");
                channel.send(`Successfully saved \n> ${path}`);
                if (dm) {
                    message.channel.send(":thumbsup:");
                }
            }
        }

        async function download(url) {
            console.log("Got here");
            const response = await fetch(url);
            return await response.buffer();
        }

        function textToLink(text) {
            const split = text.split("/");

            let index = split.length - 1;
            if (split[index].size < 1) {
                index--;
            }

            let name = split[index];
            if (!name.includes(".")) {
                name += ".html";
            }

            const link = {
                name: name,
                url: text
            }

            console.log(link);
            return link
        }

        function incrementFilename(path, file, i, ext) {
            if (!i) {
                ext = "." + file.split('.').pop();

                path = path.substr(0, path.length - file.length);
                file = file.substr(0, file.length - ext.length);
                file += " (0)" + ext;
                path += file;
                i = 1;
            }

            path = path.substr(0, path.length - file.length);
            file = file.substr(0, file.length - ext.length - 2);
            file += `${i})${ext}`;
            path += file;

            if (fs.existsSync(path)) {
                return incrementFilename(path, file, i + 1, ext);
            }

            return [path, file];
        }
    }
}

function loadHandlers(){
    if (vars.useLinkHandlers) {
        const handlers = {};
        handlers.list = [];

        const handlerFiles = fs.readdirSync("./commands/linkHandlers/").filter(file => file.endsWith('.js'));
        for (const file of handlerFiles){
            const name = file.split('.')[0];
            handlers[name] = require("./linkHandlers/" + file);
            handlers.list.push(name);
        }

        handlers.getHandler = function (link){
            for (const handler of handlers.list){
                if (link.includes(handler)){
                    return handlers[handler];
                }
            }
            return null;
        }

        return handlers;
    } else return null;
}