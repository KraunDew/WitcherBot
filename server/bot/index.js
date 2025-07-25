const { Client, Collection, REST, Routes } = require("discord.js");
const client = new Client({ intents: 53608447 });
const fs = require("node:fs");
const path = require("node:path");
const music = require("./config/music.json");
const { Poru } = require('poru');
//conect to firebase
const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
//Poru config
client.poru = new Poru(client, music.NODES, {
  library: 'discord.js',
  deezer: {
    enabled: true,
    playlistLimit: 10,
    searchLimit: 5,
  },
  spotify: {
    enabled: true,
    clientId: music.SPOTIFY.clientID,
    clientSecret: music.SPOTIFY.clientSecret,
    playlistLimit: 10,
    searchLimit: 5,
  },
  apple: {
    enabled: true,
    playlistLimit: 10,
    searchLimit: 5,
  },
  leaveOnEmpty: true,
  leaveOnStop: true,
  leaveOnFinish: false,
  autoSelfDeaf: true, 
  volume: 100,
})
//colections for handlers
client.commands = new Collection();
client.events = new Collection();
client.prefixcommands = new Collection();

const commands = []
//handles
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] El comando ${filePath} nececita data y/o la funcion execute`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

const prefixFolderPath = path.join(__dirname, "prefixCommands");
const prefixFolders = fs.readdirSync(prefixFolderPath);
for (folder of prefixFolders) {
  const commandsPath = path.join(prefixFolderPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.prefixcommands.set(command.name, command);
  }
}

const poruEvents = fs.readdirSync(path.join(__dirname, "poruEvents")).filter((file) => file.endsWith(".js"));
for (const file of poruEvents) {
  try {
    const pull = require(`${path.join(__dirname, "poruEvents")}/${file}`);
    if(pull.event && typeof pull.event !== 'string'){
      console.log(`[WARNING] Event propety should be string: ${file}`)
      continue
    }
    pull.event = pull.event || file.replace(".js", "");
    client.poru.on(pull.event, pull.execute.bind(null, client));
  } catch (error) {
    
  }
}


//slash command register
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENTID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

client.login(process.env.TOKEN);//bot on

module.exports = client;