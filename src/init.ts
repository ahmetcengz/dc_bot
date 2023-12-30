import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';

import CONSTANTS_ENV from './constants/env';
import { InitializeFunctionArguments } from './types/common';

export default (args: InitializeFunctionArguments) => {
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
        slashcmd.run({ client, interaction, player: getPlayer(client) });
      }

      handleCommand();
    });

    client.login(CONSTANTS_ENV.TOKEN);
  }
};
