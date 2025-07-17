const { Events } = require("discord.js");
const db = require("../index.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(client, message) {
    let prefix;
    db.collection("guilds")
      .doc(message.guild.id)
      .get()
      .then((q) => {
        if (q.exists) {
          prefix = q.data().prefix;
        }
      })
      .then(async () => {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;
        const args = message.content
          .slice(prefix.length)
          .trim()
          .split(/ +/);
        const command = args.shift().toLowerCase();

        const cmd =
          client.prefixcommands.get(command) ||
          client.prefixcommands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(command)
          );

        if (!cmd) {
          await message.reply(`This command don't exists, try use ***\`${prefix}help\`***`);
        } else {
          try {
            cmd.execute(client, message, args, db);
          } catch (error) {
            console.error(error);
          }
        }
      });
  },
};
