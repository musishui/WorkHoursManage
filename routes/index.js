var express = require('express'),
    common = require('../lib/common.js'),
    user = require('../modules/user'), 
    team = require('../modules/team'), 
    workType = require('../modules/workType'), 
    project = require('../modules/project');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});
router.get('/index_new', function (req, res) {
    res.render('index_new', { title: 'Express' });
});

router.get('/export', function (req, res) {
    res.render('export', { title: 'Express' });
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.get('/worktype', function (req, res) {
    var query = workType.find();
    query.then(function (result) {
        res.render('worktype', { items: result||[] });
    });
});

router.get('/project', function (req, res) {
    var query = project.find();
    query.then(function (result) {
        res.render('project', { items: (result || []) });
    });
});

router.get('/team', function (req, res) {
    var query = team.find();
    query.then(function (result) {
        res.render('team', { items: (result || []) });
    });
});

/*router.get('/workhours', function (req, res) {
    Q.all([wokeType.getAll(), project.getAll()])
    .then(function (workTypes, projects) {
        res.render('workhours', { workTypes: workType, projects: projects });
    });
});*/

module.exports = router;