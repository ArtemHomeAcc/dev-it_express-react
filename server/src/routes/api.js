const express = require('express');
const { httpGetIndex } = require('../controllers/index.controller');

const api = express.Router();

api.get('/:index', httpGetIndex);

module.exports = api;
