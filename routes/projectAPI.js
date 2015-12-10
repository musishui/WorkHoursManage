var baseAPI = require('./baseAPI.js'),
    express = require('express'),
    module = require('../modules/project'),
    router = express.Router();

module.exports = baseAPI(router, module);