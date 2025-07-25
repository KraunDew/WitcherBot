const { Events } = require("discord.js");
const db = require("../index.js");

module.exports = {
    name: Events.GuildCreate,
    async execute(client, guild){
        db.collection("guilds").doc(guild.id).set({
            'guildID': guild.id,
            'guildName': guild.name,
            'guildOwner': guild.ownerId,
            'guildIcon': guild.iconURL(),
            'prefix': process.env.PREFIX,
            'lang': 'en'
        });
    }
}