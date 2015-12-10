var express = require('express'),
    common = require('../lib/common.js'),
    user = require('../modules/user'), 
    team = require('../modules/team'), 
    workType = require('../modules/workType'), 
    project = require('../modules/project'),
    baseAPI = require('./baseAPI.js');

var router = express.Router();

var api = {
    login: express.Router(),
    user: baseAPI(express.Router(), user),
    project: baseAPI(express.Router(), project),
    workType: baseAPI(express.Router(), workType),
    team: baseAPI(express.Router(), team),
    work: baseAPI(express.Router(), team),
}

api.login.get('/login', function (req, res) {
    var name = req.query.name,
        pwd = req.query.password;
    
    var query = user.login(name, pwd);
    dealJsonResponse(res, query);
});

module.exports = api;
