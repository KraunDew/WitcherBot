const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply(
        `The command ${interaction.commandName} don't exists, try use \`/help\``
      );
    } else {
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
