const {Events} = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client){
        console.log(`Bot encendido como ${client.user.username}`);
    }
};