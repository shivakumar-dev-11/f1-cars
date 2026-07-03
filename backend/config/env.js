import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 3001),
  mongoUri: process.env.MONGODB_URI,
  mongoDbName: process.env.MONGODB_DB_NAME || 'apex01'
};

export function requireEnv() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is required. Add it to .env or export it before starting the API.');
  }
}
