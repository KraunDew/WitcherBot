const translate = require("@iamtraction/google-translate");

module.exports = {
    name: "setlanguaje",
    aliases: ["setlan", "lan"],
    desc: "set the languaje of the bot",
    async execute(client, message, args, db, lang){
        if (args.length > 0) {
            let langu = args[0];

            db.collection('guilds').doc(message.guild.id).update({'lang': langu}).then(async () => {
                const translated = await translate(`Languaje has been set to ***\`${langu}\`***`, {to: lang})
                return message.reply(translated.text);
            });
        } else {
            return await message.reply("Missing languaje");
        };
    }
};