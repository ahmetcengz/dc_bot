import { Client } from 'discord.js';
import { Commands, SlashCommandMap } from '../utils/types/getCommandFiles';
import { Player } from 'discord-player';

export interface InitializeFunctionArguments {
  client: Client;
  commands: Commands;
  slashCommandMap: SlashCommandMap;
  getPlayer: (client: Client) => Player;
}
