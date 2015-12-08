var express = require('express'),
    user = require('../modules/user');
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
        res.json(result);
    });
    
});

router.get('/register', function (req, res) {
    res.render('register');
});
router.post('/register', function (req, res) {
    var data = req.body;
    var deffered = user.add(data);
    deffered.then(function (result) {
        res.json(result);
    });
});



module.exports = router;