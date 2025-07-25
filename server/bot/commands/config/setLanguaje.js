const translate = require("@iamtraction/google-translate");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("setlanguaje").setDescription("Set the languaje of bot in the server").addStringOption(option => option.setName("lang").setDescription("New languaje").setRequired(true)),
    async execute(client, interaction, db, lang) {
        const langu = interaction.options.getString("lang");

        db.collection('guilds').doc(interaction.guild.id).update({'lang': langu}).then(async () => {
            let message = await translate(`Languaje has been set to ***\`${langu}\`***`, {to: lang})
            return await interaction.reply({content: message.text});
        });
    },
};