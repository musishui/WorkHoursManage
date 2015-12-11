var Work = require('../modules/modules.js').Work,
    baseBLL = require('./baseBLL.js')(Work), 
    Q = require('q');
module.exports = baseBLL;