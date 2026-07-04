require('dotenv').config({ override: true });
const mongoose = require('mongoose');
console.log('NODE VERSION:', process.version);
console.log('ENV PORT:', process.env.PORT);
const envUri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : null;
const uri = envUri || 'mongodb+srv://' + encodeURIComponent(process.env.MONGO_USER.trim()) + ':' + encodeURIComponent(process.env.MONGO_PASSWORD.trim()) + '@' + process.env.MONGO_CLUSTER.trim() + '/' + process.env.MONGO_DB_NAME.trim() + '?retryWrites=true&w=majority';
console.log('MONGO URI:', uri);

(async () => {
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('CONNECT OK:', conn.connection.host);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('CONNECT ERR:', err.message);
    if (err.reason) console.error('REASON:', err.reason);
    console.error(err.stack);
    process.exit(1);
  }
})();
