const { Events, MessageFlags } = require("discord.js");
const db = require("../../../index.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;
    const q = await db.collection("guilds").doc(interaction.guildId).get();

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply({
        content: `The command ***${interaction.commandName}*** don't exists, try use ***\`/help\`***`,
        flags: MessageFlags.Ephemeral
    });
    } else {
      try {
        await command.execute(client, interaction, db, q.data().lang);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
