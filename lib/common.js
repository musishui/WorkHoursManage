var Q = require('q');
var common = {
    successData: function (data) {
        return {
            result: 0,
            data: data
        }
    },
    errorData: function (error, errmsg) {
        return {
            result: 1,
            error: error,
            errmsg: errmsg || error.message
        }
    },
    dealJsonResponse: function (res, deffered) {
        deffered.then(function (result) {
            res.json(common.successData(result));
        }, function (err) {
            res.json(common.errorData(err));
        });
    }
};
module.exports = common;