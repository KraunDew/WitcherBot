const translate = require("@iamtraction/google-translate");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("setprefix").setDescription("Set the prefix").addStringOption(option => option.setName("prefix").setDescription("New prefix").setRequired(true)),
    async execute(client, interaction, db, lang) {
        const prefix = interaction.options.getString("prefix");

        db.collection('guilds').doc(interaction.guild.id).update({prefix}).then(async () => {
            let message = await translate(`Prefix has been set to ***\`${prefix}\`***`, {to: lang})
            return await interaction.reply({content: message.text});
        });
    },
};