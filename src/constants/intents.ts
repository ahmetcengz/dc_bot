import { IntentsBitField } from 'discord.js';

const intents = new IntentsBitField();

intents
  .add(IntentsBitField.Flags.Guilds)
  .add(IntentsBitField.Flags.GuildVoiceStates);

export default intents as IntentsBitField;
