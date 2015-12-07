var User = require('./modules.js').User,
    db = require('./dbHelper.js'),
    projection = 'id name displayname';

module.exports = {
    add: function (user){
        return User.create(user);
    },
    update: function (user){

    },
    updatePwd: function (id, oldPwd, newPwd){

    },
    findById: function (id){
        return User.findById(id, projection);
    },
    login: function (name, pwd){
        return User.findOne({ name: name, password: pwd }, projection);
    }

}