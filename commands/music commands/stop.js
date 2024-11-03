const { useMainPlayer } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

//this is not pause, this disconnects the bot and clears the player queue
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the player'),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('You need to join a voice channel first!');
        if (!channel.joinable) return interaction.reply('I cannot join your voice channel!');
        if (!channel.speakable) return interaction.reply('I cannot speak in your voice channel!');

        // defer
        await interaction.deferReply();
        //stop the player
        player.stop(channel);
        //disconnect the bot
        channel.leave();
        //reply
        return interaction.followUp('Stopped the player');
        
    },
};