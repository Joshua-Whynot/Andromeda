const { SlashCommandBuilder } = require('discord.js'); // import the SlashCommandBuilder class from discord.js

module.exports = {
    data: new SlashCommandBuilder() // create a new SlashCommandBuilder object
        .setName('ping') // set the command name to 'ping'
        .setDescription('Replies with Pong!'), // set the command description to 'Replies with Pong!'
    async execute(interaction) { // execute function
        await interaction.reply('Pong!'); // reply to the interaction with 'Pong!'
    },
};
