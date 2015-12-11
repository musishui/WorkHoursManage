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
            var query = mod.create(doc);
            return dealQuery(query);
        },
        remove: function (conditions, isLogical) {
            var query = mod.remove(conditions);
            return dealQuery(query);
        },
        removeOne: function (conditions, isLogical) {
            var query = mod.findOneAndRemove(conditions);
            return dealQuery(query);
        },
        update: function (conditions, doc) {
            var query = mod.update(conditions, { $set: doc });
            return dealQuery(query);
        },
        updateOne: function (conditions, doc) {
            var query = mod.findOneAndUpdate(conditions, { $set: doc });
            return dealQuery(query);
        },
        find: function (conditions, projection) {
            var query = mod.find(conditions, getProjection(projection, defProjection));
            return dealQuery(query);
        },
        findOne: function (conditions, projection) {
            var query = mod.findOne(conditions, getProjection(projection, defProjection));
            return dealQuery(query);
        }
    }
    
    function dealQuery(query){
        var deferred = Q.defer();
        query.then(function (doc) {
            deferred.resolve(doc?doc._doc:null);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    function getProjection(projection, def) {
        return projection == null?def:projection;
    }
}


module.exports = getBaseBLL;