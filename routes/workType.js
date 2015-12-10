var baseAPI = require('./baseAPI.js'),
    express = require('express'),
    module = require('../modules/workType'),
    router = express.Router();

module.exports = baseAPI(router, module);