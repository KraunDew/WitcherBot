const { Events } = require("discord.js");

module.exports={
    name: Events.Raw,
    async execute(client, data){
        client.poru.packetUpdate(data)
    }
}