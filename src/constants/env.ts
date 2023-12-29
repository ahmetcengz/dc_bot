import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../.env' });

const LOAD_SLASH = process.argv[2] === 'load';
const TOKEN = process.env.TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;
const GUILD_ID = process.env.GUILD_ID as string;

export default {
  CLIENT_ID,
  GUILD_ID,
  LOAD_SLASH,
  TOKEN,
};
