var express = require('express'),
    user = require('../user');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res) {
    res.render('login');
});
router.post('/login', function (req, res) {
    var name = req.body.name,
        pwd = req.body.pwd;
    
    var query = user.login(name, pwd);
    query.then(
        function (user) {
            return user;
        }, 
        function (err) {
            return err;
        });
    
});

router.get('/register', function (req, res) {
    res.render('register');
});
router.post('/register', function (req, res) {
    var data = req.body;   
    var query = user.add(data);
    query.then(
        function (user) {
            return user;
        }, 
        function (err) {
            return err;
        });
    
});



module.exports = router;