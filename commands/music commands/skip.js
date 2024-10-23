const { useMainPlayer } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('You need to join a voice channel first!');
        if (!channel.joinable) return interaction.reply('I cannot join your voice channel!');
        if (!channel.speakable) return interaction.reply('I cannot speak in your voice channel!');

        // defer
        await interaction.deferReply();

        try {
            await player.skip(channel);

            return interaction.followUp('Skipped the current song');
        } catch (e) {
            console.error(e);
            return interaction.followUp('An error occurred while processing the command.');
        }
    },
};
