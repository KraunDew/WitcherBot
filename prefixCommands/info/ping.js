module.exports = {
    name: "ping",
    aliases: ["p"],
    async execute(client, message, args){
        message.reply(`Pong! 🔮🧙‍♂️\n***Latency: \`${client.ws.ping}ms\`***`)
    }
};