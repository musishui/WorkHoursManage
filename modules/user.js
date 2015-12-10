var User = require('../modules/modules.js').User,
    Q = require('q'),
    projection = 'id name displayName';

module.exports = {
    add: function (user) {
        var deferred = Q.defer();
        User.create(user).then(function () {
            deferred.resolve(true);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },
    update: function (id, user) {
        return User.findByIdAndUpdate(id, user);
    },
    updatePwd: function (id, oldPwd, newPwd) {

    },
    findById: function (id) {
        return User.findById(id, projection);
    },
    login: function (name, pwd) {
        var deferred = Q.defer();
        User.findOne({ name: name, password: pwd, isDel: false }, projection).then(function (doc) {
            if (doc == null) {
                deferred.reject('用户名或密码不正确', '用户名或密码不正确');
            } else {
                deferred.resolve(doc._doc);
            }
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

}