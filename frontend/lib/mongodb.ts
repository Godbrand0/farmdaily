import mongoose from 'mongoose';

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

async function connectDB(): Promise<typeof mongoose> {
  if (global.mongoose?.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose) {
    global.mongoose = {
      conn: null,
      promise: null,
    };
  }

  if (!global.mongoose.promise) {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    global.mongoose.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
  } catch (e) {
    global.mongoose.promise = null;
    throw e;
  }

  return global.mongoose.conn;
}

export default connectDB;