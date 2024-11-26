const { useMainPlayer, VolumeTransformer } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Get or change volume')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Volume level(0-100)')
                .setRequired(false)
        ),
    async execute(interaction) {
        const level = interaction.options.getString('query');
        const player = useMainPlayer();
        new VolumeTransformer();
        if (!level) {
            return interaction.reply({})
        }

        // defer
        await interaction.deferReply();
        try {
            player.setVolume(interaction.member.voice.channel, level);
            return interaction.followUp(`Volume set to ${level}`);
        } catch (e) {
            console.error(e);
            return interaction.followUp('An error occurred while processing the command.');
        }
    },
};