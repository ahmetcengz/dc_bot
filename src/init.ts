import { Client } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { Player } from 'discord-player';
import { REST } from '@discordjs/rest';

import { Commands, SlashCommandMap } from './utils/types/getCommandFiles';
import CONSTANTS_ENV from './constants/env';

interface InitFunctionArgs {
  client: Client;
  commands: Commands;
  slashCommandMap: SlashCommandMap;
  getPlayer: (client: Client) => Player;
}

export default (args: InitFunctionArgs) => {
  const { client, commands, slashCommandMap, getPlayer } = args;

  if (CONSTANTS_ENV.LOAD_SLASH) {
    const rest = new REST({ version: '9' }).setToken(CONSTANTS_ENV.TOKEN);
    console.log('Deploying slash commands');

    rest
      .put(
        Routes.applicationGuildCommands(
          CONSTANTS_ENV.CLIENT_ID,
          CONSTANTS_ENV.GUILD_ID,
        ),
        {
          body: commands,
        },
      )
      .then(() => {
        console.log('Successfully loaded');
        process.exit(0);
      })
      .catch(err => {
        if (err) {
          console.log(err);
        }
      });
  } else {
    client.on('ready', () => {
      console.log(`Logged in as ${client.user?.tag}`);
    });

    client.on('interactionCreate', interaction => {
      async function handleCommand() {
        if (!interaction.isCommand()) return;

        const slashcmd = slashCommandMap[interaction.commandName];
        if (!slashcmd) interaction.reply('Not a valid slash command');

        await interaction.deferReply();
        await slashcmd.run({ client, interaction, player: getPlayer(client) });
      }

      handleCommand();
    });

    client.login(CONSTANTS_ENV.TOKEN);
  }
};
