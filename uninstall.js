var scriptPath = require('path').join(__dirname, 'bin\\www'),
    Service = require('node-windows').Service;

var svc = new Service({
    name: 'WorkHours Manage',
    description: '工时管理系统',
    script: scriptPath
});

svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

svc.uninstall();