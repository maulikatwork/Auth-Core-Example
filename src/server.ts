import config from './config';
import app from './app';
import mongoose from 'mongoose';

let server: any;

const startServer = async () => {
  await mongoose.connect(config.mongodb.url as string);
  console.log('\x1b[36mDatabase connection successfull\x1b[0m');

  server = app.listen(config.server.port || 5002, () => {
    console.log(`\x1b[32mServer is listening on port ${config.server.port || 5002}\x1b[0m`);
  });
};

process.on('unhandledRejection', (reason, promise) => {
  console.log(`unhandle rejection at ${promise} and reason ${reason}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received.');
  server.close(() => {
    console.log('Server closed.');
  });
});

startServer();
