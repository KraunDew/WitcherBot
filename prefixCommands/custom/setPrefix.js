module.exports = {
    name: "setprefix",
    aliases: ["sprefix", "prefix"],
    async execute(client, message, args, db){
        if (args.length > 0) {
            let prefix = args[0];

            db.collection('guilds').doc(message.guild.id).update({prefix}).then(() => {
                return message.reply(`Prefix has been set to \`***${prefix}***\``);
            });
        } else {
            return await message.reply("Missing prefix");
        };
    }
};