const { Pool, Client } = require("pg");
let client;
module.exports = {
    setup: function (){
        const credentials = {
            user: "postgres",
            host: "192.168.1.196",
            database: "megamod",
            password: "Trimmer71&!",
            port: 5432,
        };
        client = new Client(credentials);
        client.connect();


    }
}