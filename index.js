const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require("discord-player-youtubei") //PREVIEW VERSION - WILL BE REMOVED IN THE FUTURE
// new client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

//new discord player
const player = new Player(client);

//register extractors
player.extractors.register(YoutubeiExtractor, {});
//player event listeners
player.events.on('playerStart', (queue, track) => {
	queue.metadata.send(`🎶 | Now playing: **${track.title}**`);
});
player.events.on('trackAdd', (queue, track) => {
	queue.metadata.send(`🎶 | **${track.title}** has been added to the queue!`);
});	
player.events.on('channelEmpty', (queue) => {
	queue.metadata.send(`🎶 | Nobody is in the voice channel, leaving...`);
});
player.events.on('botDisconnect', (queue) => {
	queue.metadata.send(`🎶 | I was manually disconnected from the voice channel, clearing queue!`);
});
player.events.on('queueEnd', (queue) => {
	queue.metadata.send(`🎶 | Queue finished!`);
});
player.events.on('trackError', (queue, track, error) => {
	queue.metadata.send(`🎶 | An error occurred while playing: ${error}!`);
});
player.events.on('error', (error, queue) => {
	console.error(`An error occurred in the queue: ${error}!`);
	console.log(error);
});
player.events.on('playerError', (queue, error) => {
	queue.metadata.send(`🎶 | An error occurred while playing: ${error}!`);
});
//command registration
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//command event listener
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);
    const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
//login event listener
client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

// login
client.login(token);