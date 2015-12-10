var WorkType = require('../modules/modules.js').WorkType,
    Q = require('q'),
    projection = 'name comment';

module.exports = {
    /*
     * 获取所有可以工作类型
     */
    getAll: function () {
        return WorkType.getAll(projection);
    },
    /*
     * 添加工作类型
     */
    add: function (workType) {
        workType._id == null && (workType._id = workType.id);
        delete workType.id;
        var deferred = Q.defer();
        WorkType.create(workType).then(function (doc) {
            deferred.resolve(doc._doc);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },
    /*
     * 删除工作类型
     */
    remove: function (id, isLogical){
        return WorkType.remove({ _id: id });
    },
    /*
     * 修改工作类型
     */
    update: function (workType){
        return WorkType.update({ _id: workType._id }, workType);
    }
}