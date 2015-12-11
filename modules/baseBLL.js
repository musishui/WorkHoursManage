var Q = require('q'),
    defProjection = '-isDel -createTime -_v -v -__v';

function getBaseBLL(mod, projection) {
    if (!mod) return;
    defProjection = getProjection(projection, defProjection);
    
    return {
        add: function (doc) {
            if (doc.id != null) {
                doc._id = doc.id;
                delete doc.id;
            }
            var deferred = Q.defer();
            mod.create(doc).then(function (doc) {
                deferred.resolve(doc._doc);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        },
        remove: function (conditions, isLogical) {
            return mod.remove(conditions);
        },
        removeOne: function (conditions, isLogical) {
            return mod.findOneAndRemove(conditions);
        },
        update: function (conditions, doc) {
            return mod.update(conditions, { $set: doc });
        },
        updateOne: function (conditions, doc) {
            return mod.findOneAndUpdate(conditions, { $set: doc });
        },
        find: function (conditions, projection) {
            return mod.find(conditions, getProjection(projection, defProjection));
        },
        findOne: function (conditions, projection) {
            return mod.findOne(conditions, getProjection(projection, defProjection));
        }
    }
    
    function getProjection(projection, def) {
        return projection == null?def:projection;
    }
}


module.exports = getBaseBLL;