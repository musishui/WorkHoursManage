var Project = require('../modules/modules.js').Project,
    Q = require('q'),
    projection = 'name comment';

module.exports = {
    /*
     * 获取所有可以工作类型
     */
    getAll: function () {
        return Project.getAll(projection);
    },
    /*
     * 添加工作类型
     */
    add: function (project) {
        project._id == null && (project._id = project.id);
        delete project.id;
        var deferred = Q.defer();
        Project.create(project).then(function (doc) {
            deferred.resolve(doc._doc);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    },
    /*
     * 删除工作类型
     */
    remove: function (id, isLogical) {
        return Project.remove({ _id: id });
    },
    /*
     * 修改工作类型
     */
    update: function (project) {
        return Project.update({ _id: project._id }, project);
    }
}