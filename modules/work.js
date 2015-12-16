var Work = require('../modules/modules.js').Work,
    baseBLL = require('./baseBLL.js')(Work), 
    Q = require('q');

baseBLL.statistics = function (day) {
    var deferred = Q.defer(),
        query = Work.aggregate(
            { $match: { workday: { '$lte': new Date('2015-12-15T00:00:00') } } }, 
            { $group: { _id: '$workTypeId', totalHours: { $sum: '$hours' } } },
            function (err, res) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(res);
                }
            });
    return deferred.promise;
}
module.exports = baseBLL;