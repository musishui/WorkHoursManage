var Q = require('q'),
    defProjection = '-isDel -createTime';

function getBaseBLL(mod, projection) {
    if (!mod) return;
    defProjection = getProjection(projection, defProjection);
    
    return {
        add: function (doc) {
            if (doc._id == null || doc._id == '') {            
                delete doc._id;
            }
            if (doc.id != null) {
                doc._id = doc.id;
                delete doc.id;
            }
            var query = mod.create(doc);
            return this.dealQuery(query);
        },
        remove: function (conditions, isLogical) {
            var query = mod.remove(conditions);
            return this.dealQuery(query);
        },
        removeOne: function (conditions, isLogical) {
            var query = mod.findOneAndRemove(conditions);
            return this.dealQuery(query);
        },
        update: function (conditions, doc) {
            var query = mod.update(conditions, { $set: doc });
            return this.dealQuery(query);
        },
        updateOne: function (conditions, doc) {
            var query = mod.findOneAndUpdate(conditions, { $set: doc });
            return this.dealQuery(query);
        },
        find: function (conditions, projection) {
            var query = mod.find(conditions, getProjection(projection, defProjection));
            return this.dealQuery(query);
        },
        findOne: function (conditions, projection) {
            var query = mod.findOne(conditions, getProjection(projection, defProjection));
            return this.dealQuery(query);
        },
        dealQuery: function (query) {
            var deferred = Q.defer();
            query.then(function (doc) {
                if (doc instanceof Array) {
                    doc._doc = doc.map(function (item) {
                        return item._doc;
                    });
                }
                deferred.resolve(doc?doc._doc:null);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    }

    function getProjection(projection, def) {
        return projection == null?def:projection;
    }
}


module.exports = getBaseBLL;