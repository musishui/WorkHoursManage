var User = require('../modules/modules.js').User,
    Q = require('q'),
    projection='-password -isDel -createTime',
    baseBLL = require('./baseBLL.js')(User, projection);

baseBLL.updatePwd = function (id, oldPwd, newPwd) {
    var deferred = Q.defer();
    var query = baseBLL.updateOne({ _id: id, password: oldPwd }, { $set: { password: newPwd } });
    query.then(function () {
        deferred.resolve(true);
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

baseBLL.login= function (name, pwd) {
    var deferred = Q.defer();
    baseBLL.findOne({ name: name, password: pwd, isDel: false }).then(function (doc) {
        if (doc == null) {
            deferred.reject('用户名或密码不正确', '用户名或密码不正确');
        } else {
            deferred.resolve(doc);
        }
    }, function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
}


module.exports = baseBLL;