const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(client, interaction) {
        await interaction.reply(`Pong! 🔮🧙‍♂️\n***Latency: \`${client.ws.ping}ms\`***`)
    }
}