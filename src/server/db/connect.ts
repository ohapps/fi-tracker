import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

if (!MONGODB_DATABASE) {
    throw new Error('Please define the MONGODB_DATABASE environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 */
type MongooseGlobalCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    var mongoose: MongooseGlobalCache | undefined;
}

const cached: MongooseGlobalCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise && MONGODB_URI) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            dbName: MONGODB_DATABASE,
        }).then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;