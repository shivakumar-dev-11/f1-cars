import { connectMongo, disconnectMongo } from '../config/mongo.js';
import { Driver } from '../models/Driver.js';
import { driverRecords } from '../seedData.js';

try {
  await connectMongo();

  for (const record of driverRecords) {
    await Driver.updateOne(
      { slug: record.slug },
      { $set: record },
      { upsert: true }
    );
  }

  const total = await Driver.countDocuments();
  console.log(`Seeded ${driverRecords.length} driver records. Database now has ${total} drivers.`);
} catch (error) {
  console.error('Driver seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await disconnectMongo();
}
