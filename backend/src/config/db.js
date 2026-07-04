const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const normalizeCluster = (cluster) => {
  if (!cluster) return null;
  return cluster.replace(/^mongodb\+srv:\/\//, '').replace(/\/?\?.*$/, '');
};

const buildMongoUri = () => {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (mongoUri) return mongoUri;

  const user = process.env.MONGO_USER?.trim();
  const password = process.env.MONGO_PASSWORD?.trim();
  const cluster = normalizeCluster(process.env.MONGO_CLUSTER?.trim());
  const dbName = process.env.MONGO_DB_NAME?.trim();

  if (user && password && cluster && dbName) {
    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${cluster}/${dbName}?retryWrites=true&w=majority`;
  }

  return null;
};

const connectDB = async () => {
  const configuredUri = buildMongoUri();
  const localUri = 'mongodb://127.0.0.1:27017/disaster-portal';

  const connect = async (uri) => {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  };

  if (configuredUri) {
    try {
      return await connect(configuredUri);
    } catch (error) {
      console.error('MongoDB Atlas connection failed:', error.message);
      console.error('Verify your Atlas username, password, cluster host, database name, and IP whitelist.');
      throw error;
    }
  }

  try {
    return await connect(localUri);
  } catch (error) {
    console.warn('Local MongoDB connection failed, trying in-memory MongoDB fallback...');
  }

  try {
    const mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    console.warn('Using in-memory MongoDB for development. Data will not persist after restart.');
    return await connect(memoryUri);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
