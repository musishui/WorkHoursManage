module.exports = {
    successData: function (data) {
        return {
            result: 0,
            data: data
        }
    },
    errorData: function (error, message) {
        return {
            result: 1,
            error: error,
            message: message
        }
    }
}