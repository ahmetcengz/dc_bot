import Discord, { Client } from 'discord.js';

import CONSTANTS_INTENTS from './constants/intents';
import getCommandFiles from './utils/getCommandFiles';
import player from './player';
import init from './init';

const { commands, slashCommandMap } = getCommandFiles();

const client: Client = new Discord.Client({
  intents: CONSTANTS_INTENTS,
});

init({
  client,
  getPlayer: player,
  commands,
  slashCommandMap,
});
