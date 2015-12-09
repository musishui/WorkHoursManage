var express = require('express'),
    common = require('../lib/common.js'),
    user = require('../modules/user'), 
    workType = require('../modules/workType');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res) {
    res.render('login');
});
router.post('/login', function (req, res) {
    var name = req.body.name,
        pwd = req.body.password;
    
    var query = user.login(name, pwd);
    query.then(function (result) {
        res.json(common.successData(result));
    }, function (err) { 
        res.json(common.errorData(err));
    });
    
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {
    var data = req.body;
    var deffered = user.add(data);
    deffered.then(function (result) {
        res.json(common.successData(result));
    }, function (err) {
        res.json(common.errorData(err));
    });
});

router.get('/worktype', function (req, res) {
    var deffered = workType.getAll();
    deffered.then(function (result) {
        res.render('worktype', { items: result });
    });
});

router.post('/worktype/add', function (req, res) {
    var data = req.body;
    var deffered = workType.add(data);
    deffered.then(function (result) {
        res.json(common.successData(result));
    }, function (err) {
        res.json(common.errorData(err));
    });
});

router.get('/workhours', function (req, res) {
    res.render('workhours');
});

module.exports = router;