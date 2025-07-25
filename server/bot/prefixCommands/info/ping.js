module.exports = {
    name: "ping",
    aliases: ["p"],
    desc: 'reply Pong! and the ms ping of bot',
    async execute(client, message, args){
        message.reply(`Pong! 🔮🧙‍♂️\n***Latency: \`${client.ws.ping}ms\`***`)
    }
};