const { Events } = require("discord.js");
const db = require("../index.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
  name: Events.MessageCreate,
  async execute(client, message) {
    if (message.author.bot) return;
  
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
  
    if (!cmd) {
      const dontCMD = await translate(`This command doesn't exist. Try this command `, {to: q.data().lang})
      await message.reply(dontCMD.text + `***\`${prefix}help\`***`);
      return;
    }
  
    try {
      cmd.execute(client, message, args, db, q.data().lang);
    } catch (error) {
      console.error(error);
    }
  }  
};
