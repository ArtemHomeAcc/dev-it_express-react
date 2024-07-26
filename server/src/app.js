const path = require('path');
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const api = require('./routes/api');
const { errorMiddleware } = require('./middlewares/errorMiddleware');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', api);

app.use(errorMiddleware);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
