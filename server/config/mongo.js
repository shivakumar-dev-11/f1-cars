import mongoose from 'mongoose';
import { env, requireEnv } from './env.js';

export async function connectMongo() {
  requireEnv();

  mongoose.set('strictQuery', true);

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise();
    return mongoose.connection;
  }

  await mongoose.connect(env.mongoUri, {
    dbName: env.mongoDbName,
    serverSelectionTimeoutMS: 12000
  });

  return mongoose.connection;
}

export async function disconnectMongo() {
  await mongoose.disconnect();
}
