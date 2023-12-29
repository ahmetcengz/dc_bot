import { Client, Interaction, SlashCommandBuilder } from 'discord.js';
import { Player } from 'discord-player';

export interface RunCommandArgs {
  client: Client;
  interaction: Interaction;
  player: Player;
}

export type RunCommand = (args: RunCommandArgs) => void;

export interface SlashCommandMap {
  [key: string]: {
    data: SlashCommandBuilder;
    run: RunCommand;
  };
}

export type Commands = Array<string>;
