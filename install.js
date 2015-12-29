var scriptPath = require('path').join(__dirname, 'bin\\www'),
    Service = require('node-windows').Service;

var svc = new Service({
    name: 'WorkHours Manage',
    description: '工时管理系统',
    script: scriptPath
});

svc.on('install', function () {
    svc.start();
});

svc.install();