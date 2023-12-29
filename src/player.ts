import { Client } from 'discord.js';

import { Player } from 'discord-player';

export default (client: Client) =>
  new Player(client, {
    ytdlOptions: {
      quality: 'highestaudio',
      highWaterMark: 1 << 25,
    },
  });
