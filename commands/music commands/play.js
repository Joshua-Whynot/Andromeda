const { useMainPlayer } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song. Only accepts youtube for now')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song to play')
                .setRequired(true)
        ),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('You need to join a voice channel first!');
        if (!channel.joinable) return interaction.reply('I cannot join your voice channel!');
        if (!channel.speakable) return interaction.reply('I cannot speak in your voice channel!');
        const query = interaction.options.getString('query');

        // defer
        await interaction.deferReply();

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction,
                }
            });

            return interaction.followUp(`Added to queue: ${track.title}`);
        } catch (e) {
            console.error(e);
            return interaction.followUp('An error occurred while processing the command.');
        }
    },
};
