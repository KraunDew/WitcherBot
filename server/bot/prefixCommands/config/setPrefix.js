const translate = require("@iamtraction/google-translate");

module.exports = {
    name: "setprefix",
    aliases: ["sprefix", "prefix"],
    desc: "set the prefix of the bot",
    async execute(client, message, args, db, lang){
        if (args.length > 0) {
            let prefix = args[0];

            db.collection('guilds').doc(message.guild.id).update({prefix}).then(async () => {
                const translated = await translate(`Prefix has been set to ***\`${prefix}\`***`, {to: lang})
                return message.reply(translated.text);
            });
        } else {
            return await message.reply("Missing prefix");
        };
    }
};