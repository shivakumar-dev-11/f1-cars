import mongoose from 'mongoose';
import { env, requireEnv } from './env.js';

export async function connectMongo() {
  requireEnv();

  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongoUri, {
    dbName: env.mongoDbName,
    serverSelectionTimeoutMS: 12000
  });

  return mongoose.connection;
}

export async function disconnectMongo() {
  await mongoose.disconnect();
}
