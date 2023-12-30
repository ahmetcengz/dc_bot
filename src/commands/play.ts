import { head } from 'lodash';

import { EmbedBuilder } from 'discord.js';
import { GuildQueue, QueryType, Track } from 'discord-player';
import { SlashCommandBuilder } from '@discordjs/builders';
import { YouTubeExtractor } from '@discord-player/extractor';

const playCommandBuild = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Plays the song that you would like to play')
  .addStringOption(opt =>
    opt
      .setName('song')
      .setDescription('enter key words that would find the song:'),
  );

const run = async (args: any) => {
  const { interaction, player } = args;

  if (!interaction?.member?.voice?.channel) {
    return interaction.editReply('You are not in a voice channel.');
  }

  player.extractors.register(YouTubeExtractor, {});
  const queue = (await player.nodes.create(interaction.guild)) as GuildQueue;

  if (!queue.connection) {
    await queue.connect(interaction.member.voice.channel);
  }

  const embed = new EmbedBuilder();

  const url = interaction.options.getString('song');
  const result = await player.search(url, {
    requestedBy: interaction.user,
    searchEngine: `ext:${YouTubeExtractor.identifier}`,
  });

  if (result.tracks.length === 0) {
    return interaction.editReply('I could not find such a song');
  }

  const song = head(result.tracks) as Track;
  await queue.play(song);

  embed
    .setDescription(
      `**[${song.title}](${song.url})** has been added to the Queue`,
    )
    .setThumbnail(song.thumbnail)
    .setFooter({ text: `Duration: ${song.duration}` });

  await interaction.editReply({ embeds: [embed] });
};

module.exports = {
  data: playCommandBuild,
  run,
};
