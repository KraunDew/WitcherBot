const { Events } = require("discord.js");
const db = require("../index.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
  name: Events.MessageCreate,
  async execute(client, message) {
    if (message.author.bot) return;

    async function messageTranslated(text, languaje) {
      await translate(text, { to: languaje })
        .then((res) => message.reply(res.text))
        .catch((e) => console.log(e));
    }

    const q = await db.collection("guilds").doc(message.guild.id).get();
    const prefix = q.exists ? q.data().prefix : process.env.PREFIX;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd =
      client.prefixcommands.get(command) ||
      client.prefixcommands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(command)
      );

    if (cmd) {
      if (cmd.owner) {
        const owner = process.env.OWNERID.split(" ");
        if (!owner.includes(message.author.id))
          return messageTranslated(
            `*You don't have permission* to use this command. 🧙🏻🔮\n ***Only the owner(s) bot can use:*** ${owner
              .map((ownerID) => `<@${ownerID}>`)
              .join(", ")}`,
            q.data().lang
          );
      };
      if (command.userPermissions) {
        if (!message.member.permissions.has(command.userPermissions))
          return messageTranslated(`You need the next permission(s) ${command.userPermissions.map((permission) => `\`${permission}\``).join(", ")}}`, q.data().lang)
      };
    } else
      return messageTranslated(
        `This command doesn't exist. Try this command ***\`/help\`***`,
        q.data().lang
      );

    try {
      cmd.execute(client, message, args, db, q.data().lang, messageTranslated);
    } catch (error) {
      console.error(error);
    }
  },
};
