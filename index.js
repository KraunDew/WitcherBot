const {Client, Collection, GatewayIntentBits} = require('discord.js');
const client = new Client({intents: 53608447});
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config()

//conect to firebase
const firebase = require('firebase/app');
const fieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = db

//colections for handlers
client.commands = new Collection();
client.events = new Collection();
client.prefixcommands = new Collection();

//handles first commands, second events, third prefix commands.
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for(const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        }else{
            console.log(`[WARNING] El comando ${filePath} nececita data y/o la funcion execute`);
        }
    }
};

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for(const file of eventFiles){
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    }else{
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
};

const prefixFolderPath = path.join(__dirname, "prefixCommands");
const prefixFolders = fs.readdirSync(prefixFolderPath);
for (folder of prefixFolders) {
    const commandsPath = path.join(prefixFolderPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for(const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        client.prefixcommands.set(command.name, command);
    }
};

client.login(process.env.TOKEN)