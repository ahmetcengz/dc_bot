import fs from 'fs';

import { Commands, SlashCommandMap } from './types/getCommandFiles';

const LOAD_SLASH = process.argv[2] === 'load';

const commands: Commands = [];
const slashCommandMap: SlashCommandMap = {};

const slashFiles = fs
  .readdirSync(__dirname + '/../commands')
  .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of slashFiles) {
  const slashcmd = require(`../commands/${file}`);
  slashCommandMap[slashcmd.data.name] = slashcmd;
  if (LOAD_SLASH) commands.push(slashcmd.data.toJSON());
}

export default () => ({
  commands,
  slashCommandMap,
});
