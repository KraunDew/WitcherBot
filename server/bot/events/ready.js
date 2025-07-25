const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    client.poru.init(client);
    console.log(`Bot encendido como ${client.user.username}`);
    let index = 0;
    const act = [
      { name: `${client.guilds.cache.size} servidores`, type: 3 },
      { name: `${client.users.cache.size} usuarios`, type: 3 },
    ];

    setInterval(() => {
      const activity = act[index];
      client.user.setPresence({ activities: [activity], status: "online" });
      index = (index + 1) % act.length;
    }, 10 * 1000);
  },
};
