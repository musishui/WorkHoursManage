module.exports = {
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
    }
}