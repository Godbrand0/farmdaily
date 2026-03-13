import mongoose from "mongoose";

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  failedAt: number | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

const RETRY_AFTER_MS = 10_000; // don't retry a failed connection for 10s

async function connectDB(): Promise<typeof mongoose> {
  if (global.mongoose?.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null, failedAt: null };
  }

  // If we recently failed, don't hammer reconnects — throw immediately
  if (
    global.mongoose.failedAt &&
    Date.now() - global.mongoose.failedAt < RETRY_AFTER_MS
  ) {
    throw new Error("MongoDB unavailable");
  }

  if (!global.mongoose.promise) {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.warn(
        "MONGODB_URI environment variable not defined. Using mock data mode.",
      );
      throw new Error("MongoDB not configured");
    }

    global.mongoose.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
    global.mongoose.failedAt = null;
  } catch (e) {
    global.mongoose.promise = null;
    global.mongoose.failedAt = Date.now();
    console.warn("Failed to connect to MongoDB. Using mock data mode.");
    throw e;
  }

  return global.mongoose.conn;
}

export default connectDB;
