const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmovie')
        .setDescription('Add a movie to the list of movies'),
    async execute(interaction) {
        await interaction.reply('Under construction');
    },
};