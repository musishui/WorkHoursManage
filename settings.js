/**
 * 配置文件
 * @authors Xinjie.Ren<rxj_2008@foxmail.com>
 * @date    2015-12-07 09:52:21
 * @version 1.0.0
 * @note    
 */
var _ = require('lodash');
var env = 'dev';
var devloper = 'renxinjie'
var settings = {
    base: {
        appName: 'WorkHourManage',
        version: '0.0.1',
        env: env,
        cookie: {
            secret: "0o80ilpoablog",
            id: 'ablog'
        },
        session: {
            secret: "0o80ilpoablog",
            id: 'ablog'
        },
        desc: '基本配置'
    },
    dev: {
        defaults: {
            hostname: {
                host: "127.0.0.1",
                port: 3000
            },
            mongodb: {
                host: "localhost",
                port: "27017",
                dbname: "blog",
                username: "",
                password: ""
            },
            mysql: {
                host: '127.0.0.1://mysql',
                username: 'mysql',
                password: 'test'
            }
        },
        renxinjie: {
            hostname: {
                host: "127.0.0.1",
                port: 3000
            },
            mongodb: {
                host: "localhost",
                port: "27017",
                dbname: "workManage",
                username: "",
                password: ""
            },
            mysql: {
                host: '127.0.0.1://mysql',
                username: 'mysql',
                password: 'test'
            }
        },
        desc: '开发环境配置'
    },
    product: {
        hostname: {
            host: "https://www.ablog.com",
            port: 80
        },
        mongodb: {
            host: "",
            port: "",
            name: "ablog",
            username: "uname",
            password: "pwd"
        },
        mysql: {
            host: '192.168.1.88://mysql',
            username: 'ablog',
            password: 'test'
        },
        desc: '网站发布地址配置'
    }
}

var c = env === 'dev' ? settings[env][devloper] : settings[env],
    mongo = c.mongodb,
    hostname = c.hostname;
c.mongodb.url = "mongodb://" + mongo.host + ":" + mongo.port + "/" + mongo.dbname;
//c.hostname.url = http + hostname.host + ":" + hostname.port;
module.exports = _.merge(settings.base, c);
