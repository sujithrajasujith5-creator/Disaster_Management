require('dotenv').config({ override: true });
const app = require('./app');
const connectDB = require('./config/db');

const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.syscall !== 'listen') throw error;

      const bind = `Port ${PORT}`;

      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges.`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use.`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
