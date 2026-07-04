const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ override: true });

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

const uri = buildMongoUri();
console.log('PORT=', process.env.PORT);
console.log('BUILT_URI=', uri);

mongoose.connect(uri)
  .then(() => {
    console.log('Atlas connect success');
    return mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Atlas connect failed');
    console.error(err);
    process.exit(1);
  });
