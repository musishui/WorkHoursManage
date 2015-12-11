var common = require('../lib/common.js'),
    express = require('express'),
    router = express.Router();

function baseAPI(app) {
    // 查询
    router.get('/' , function (req, res) {
        var condition = req.query,
            query = app.find(condition);
        common.dealJsonResponse(res, query);
    });
    // 新增
    router.post('/' , function () {
        var data = req.body,
            query = app.add(data);
        common.dealJsonResponse(res, query);
    });
    // 根据ID 查询
    router.get('/:id' , function () {
        var id = req.params.id,
            query = app.findOne({ _id: id });
        common.dealJsonResponse(res, query);
    });
    // 更新
    router.post('/:id' , function () {
        var id = req.params.id,
            data = req.body,
            query = app.updateOne({ _id: id }, data);
        common.dealJsonResponse(res, query);
    });
    // 删除
    router.delete('/:id' , function () {
        var id = req.params.id,
            query = app.removeOne({ _id: id });
        common.dealJsonResponse(res, query);
    });
    return router;
};

module.exports = baseAPI;



