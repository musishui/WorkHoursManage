var express = require('express'),
    common = require('../lib/common.js'),
    user = require('../modules/user'), 
    workType = require('../modules/workType'), 
    project = require('../modules/project'),
    Q = require('q');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res) {
    res.render('login');
});
router.get('/user', function (req, res) {
    var name = req.body.name,
        pwd = req.body.password;
    
    var query = user.login(name, pwd);
    dealJsonResponse(res, query);
});



router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {
    var data = req.body,
        query = user.add(data);
    dealJsonResponse(res, query);
});

router.get('/worktype', function (req, res) {
    var query = workType.getAll();
    query.then(function (result) {
        res.render('worktype', { items: result });
    });
});

router.post('/worktype', function (req, res) {
    var query = workType.getAll();
    dealJsonResponse(res, query);
});

router.post('/worktype/add', function (req, res) {
    var data = req.body, 
        query = workType.add(data);
    dealJsonResponse(res, query);
});

router.get('/project', function (req, res) {
    var query = project.getAll();
    query.then(function (result) {
        res.render('project', { items: result });
    });
});

router.post('/project', function (req, res) {
    var query = project.getAll();
    dealJsonResponse(res, query);
});

router.post('/project/add', function (req, res) {
    var data = req.body, 
        query = project.add(data);
    dealJsonResponse(res, query);
});

router.get('/workhours', function (req, res) {
    Q.all([wokeType.getAll(), project.getAll()])
    .then(function (workTypes, projects) {
        res.render('workhours', { workTypes: workType, projects: projects });
    });
});

function dealJsonResponse(res, deffered) {
    deffered.then(function (result) {
        res.json(common.successData(result));
    }, function (err) {
        res.json(common.errorData(err));
    });
}

module.exports = router;