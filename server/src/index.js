'use strict';

const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').availableParallelism();
const process = require('process');

require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 8000;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  console.log(`Worker ${process.pid} started`);
}
