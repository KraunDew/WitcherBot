const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        if(message.author.bot) return;
        if(!message.content.startsWith(process.env.PREFIX)) return;
        const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/)
        const command = args.shift().toLowerCase();

        const cmd = client.prefixcommands.get(command) || client.prefixcommands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

        if(!cmd){
            await message.reply("This command don't exists, try use \`/help\`")
        } else {
            try {
                cmd.execute(client, message, args)
            } catch (error) {
                console.error(error);
            }
        };
    },
};