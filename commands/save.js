const fs = require('fs');
const fetch = require('fetch');
const Collection = require('discord.js').Collection;

location = JSON.parse(fs.readFileSync("./variables.json")).location;

module.exports = {
    name: 'save',
    description: 'Stores message',
    execute(message, args, client){
        let folder = ""; 
        let text;
        let filename;
        let links = new Collection();

        console.log("Starting save");

        if (args.length > 0) {
            if (message.attachments.size != 0){
                folder = "/" + args[0];
                if (args.length > 1 && message.attachments.size == 1) {
                    filename = args[1];
                }
                links = message.attachments;
            } else {
                let shifts = 1;
                folder = "/" + args[0];

                if (args.length > 1){
                    filename = args[1];

                    shifts = 2;
                } else {
                    let found;
                    if (message.guild){
                        found = message.guild.name;
                    } else {
                        found = "DM";
                    }
                    
                    const date = new Date();
                    const timestamp = date;

                    filename = `${found} - ${timestamp}.txt`;
                }
                
                
                const content = message.content.split(" ");
                for (let i = 0; i < (shifts+1); i++){
                    content.shift();
                }
                text = content.join(" ");
            }
        } else {
            if (!message.attachments){
                console.error('Nothing to save...');
                return;
            }
        }

        console.log("Analized input");

        const authorDir = "/" + message.author.username;
        const dir = `${location.saveDir.root}${location.saveDir.path}${authorDir}${folder}`
        
        let fullPath = `${dir}/${filename}`;
        

        if (links.size != 0){
            links.attachments.each(link => {
                console.log(link);
            });
        }
        
        if (text){
            if (!fs.existsSync(dir)){
                fs.mkdir(dir, { recursive: true }, error => {
                    if (error){
                        console.error(error);
                        return;
                    }
                })
            }

            if (fs.existsSync(fullPath)){
                const names = incrementFilename(fullPath, filename);
                fullPath = names[0];
                filename = names[1]
            }
            
            fs.writeFile(fullPath, text, null, err => logSave(err, fullPath, filename));
        }

        console.log("Started save..");



        async function logSave(error, path, file){
            const channel = client.channels.cache.get(location.log.channel);
            const dm = (message.channel.type == "DM");

            if (error){
                console.error(error);
                channel.send(`ERROR! Failed to save\n> ${file}\nto\n> ${path}`);
                if (dm){
                    message.channel.send(":thumbsdown");
                }
            } else {
                console.log("Saved!");
                channel.send(`Successfuly saved \n> ${path}`);
                if (dm){
                    message.channel.send(":thumbsup:");
                }
            }

            if (!dm){
                message.delete();
            }
        }

        async function fileSave(data){

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