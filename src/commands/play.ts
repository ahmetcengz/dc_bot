import { head } from 'lodash';

import { EmbedBuilder } from 'discord.js';
import { GuildQueue, Track } from 'discord-player';
import { SlashCommandBuilder } from '@discordjs/builders';
import { YoutubeExtractor } from '@discord-player/extractor';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oynat')
    .setDescription('İstediğin türküyü oynatır.')
    .addStringOption(opt =>
      opt.setName('şarkı').setDescription('birkaç kelime gir:'),
    ),

  run: async (args: any) => {
    const { client, interaction, player } = args;

    if (!interaction?.member?.voice?.channel)
      return interaction.editReply('Ses kanalında değilsin.');

    player.extractors.register(YoutubeExtractor, {});
    const queue = (await player.nodes.create(interaction.guild)) as GuildQueue;

    await queue.connect(client);
    if (!queue.connection) {
      await queue.connect(interaction.member.voice.channel);
    }

    const embed = new EmbedBuilder();

    const url = interaction.options.getString('şarkı');
    const result = await player.search(url, {
      requestedBy: interaction.user,
      searchEngine: `ext:${YoutubeExtractor.identifier}`,
    });

    if (result.tracks.length === 0) {
      return interaction.editReply('Böyle bir şarkı bulamadım, cik.');
    }

    const song = head(result.tracks) as Track;

    if (!queue.isPlaying()) {
      await queue.play(song);
    } else {
      queue.addTrack(song);
      return interaction.reply('Added to the queue');
    }

    embed
      .setDescription(
        `**[${song.title}](${song.url})** has been added to the Queue`,
      )
      .setThumbnail(song.thumbnail)
      .setFooter({ text: `Duration: ${song.duration}` });

    await interaction.editReply({ embeds: [embed] });
  },
};
