var express = require('express'),
    common = require('../lib/common.js'),
    user = require('../modules/user'), 
    team = require('../modules/team'), 
    workType = require('../modules/workType'), 
    project = require('../modules/project'),
    baseAPI = require('./baseAPI.js');

var api = {
    login: express.Router(),
    user: baseAPI(user),
    project: baseAPI(project),
    workType: baseAPI(workType),
    team: baseAPI(team),
    //work: baseAPI( team),
}

api.login.get('/', function (req, res) {
    var name = req.query.name,
        pwd = req.query.password;
    
    var query = user.login(name, pwd);
    common.dealJsonResponse(res, query);
});

module.exports = api;
