var express = require('express'),
    common = require('../lib/common.js'),
    user = require('../modules/user'), 
    team = require('../modules/team'), 
    workType = require('../modules/workType'),
    work = require('../modules/work'),
    project = require('../modules/project'),
    extend = require('extend');

var router = express.Router();


// 注册Login路由
buildRoute({
    baseUrl: '/login',
    methods: {
        'get': {
            '/': function (req, res) {
                var name = req.query.name,
                    pwd = req.query.password;
                
                var query = user.login(name, pwd);
                common.dealJsonResponse(res, query);
            }
        }
    },
    isDefault: false
});
// 注册users路由
buildRoute({
    baseUrl: '/users',
    module: user
});
// 注册teams路由
buildRoute({
    baseUrl: '/teams',
    module: team
});
// 注册projects路由
buildRoute({
    baseUrl: '/projects',
    module: project
});
// 注册workTypes路由
buildRoute({
    baseUrl: '/workTypes',
    module: workType
});
// 注册works路由
buildRoute({
    baseUrl: '/works',
    module: work,
    methods: {
        'get': {
            '/': function (req, res) {
                var params = req.query,
                    condition = {};
                if (params.userIds) {
                    condition.userId = { $in: params.userIds };
                }
                if (params.start) {
                    condition.workday = { $gte : params.start };
                }
                if (params.end) {
                    condition.workday = condition.workday || {},
                    condition.workday.$lte = params.end;
                }
                if (params.projectIds) {
                    condition.projectId = { $in: params.projectIds };
                }
                if (params.workTypes) {
                    condition.workType = { $in: params.workTypes };
                }
                
                var query = work.find(condition);
                common.dealJsonResponse(res, query);
            }
        }
    }
});

// 注册统计路由
buildRoute({
    baseUrl: '/statistics/work',
    methods: {
        'get': {
            '/': function (req, res) {
                var params = req.query;
                var query = work.statistics('2015-12-15T00:00:00');
                common.dealJsonResponse(res, query);
            }
        }
    },
    isDefault: false
});

function buildRoute(option) {
    var methods = option.methods;
    if (option.isDefault !== false) {
        var _default = {
            'get': {
                // 查询
                '/': function (req, res) {
                    var condition = req.query,
                        query = option.module.find(condition);
                    common.dealJsonResponse(res, query);
                },
                // 根据ID 查询
                '/:id': function (req, res) {
                    var id = req.params.id,
                        query = option.module.findOne({ _id: id });
                    common.dealJsonResponse(res, query);
                }
            },
            'post': {
                // 新增
                '/' : function (req, res) {
                    var data = req.body,
                        query = option.module.add(data);
                    common.dealJsonResponse(res, query);
                },
                // 更新
                '/:id' : function (req, res) {
                    var id = req.params.id,
                        data = req.body,
                        query = option.module.updateOne({ _id: id }, data);
                    common.dealJsonResponse(res, query);
                }
            },
            'delete': {
                // 删除
                '/:id' : function (req, res) {
                    var id = req.params.id,
                        query = option.module.removeOne({ _id: id });
                    common.dealJsonResponse(res, query);
                }
            }
        }
        methods = extend(true, _default, methods);
    }
    for (var m in methods) {
        for (var path in methods[m]) {
            router[m](option.baseUrl + path, methods[m][path]);
        }
    }
}

module.exports = router;
