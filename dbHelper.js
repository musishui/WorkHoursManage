var mongoose = require('mongoose'),
    url = require('./settings.js').mongodb.url;

var connection = mongoose.connect(url);
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + url);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

module.exports = {
    connection : connection,
    mongoose: mongoose,
};