var User = require('../modules/modules.js').User,
    Q = require('q'),
    common = require('../lib/common.js'),
    projection = 'id name displayName';

module.exports = {
    add: function (user) {
        var deferred = Q.defer();
        User.create(user).then(function (doc) {
            var data = common.successData();
            deferred.resolve(data);
        }, function (err) {
            var data = common.errorData(err);
            deferred.resolve(data);
        });
        
        return deferred.promise;
    },
    update: function (user) {

    },
    updatePwd: function (id, oldPwd, newPwd) {

    },
    findById: function (id) {
        return User.findById(id, projection);
    },
    login: function (name, pwd) {
        var deferred = Q.defer();
        User.findOne({ name: name, password: pwd }, projection).then(function (doc) {
            if (doc == null) {
                var data = common.errorData('用户名或密码不正确', '用户名或密码不正确');
                deferred.resolve(data);
            } else {
                var data = common.successData(doc._doc);
                deferred.resolve(data);
            }
        }, function (err) {
            var data = common.errorData(err);
            deferred.resolve(data);
        });
        return deferred.promise;
    }

}