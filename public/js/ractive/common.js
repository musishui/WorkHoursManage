﻿Date.prototype.format = function (fmt) {
    if (!this.valueOf()) {
        return '';
    }
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    fmt || (fmt = 'yyyy-MM-dd');
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.addDate = function (days) {
    var date = new Date(this);
    date.setDate(date.getDate() + days);
    return date;
}

var common = (function () {
    var storage = window.sessionStorage;
    function getStorageItem(key) {
        if (!storage || !key) return;
        var data = storage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
    }
    
    function setStorageItem(key, value) {
        if (!storage || !key || !value) return;
        storage.setItem(key, JSON.stringify(value));
    }
    
    function removeStorageItem(key) {
        if (!storage || !key) return;
        var data = storage.removeItem(key);
    }
    
    return {
        getProjects: function () {
            var projects = getStorageItem('projects');
            return $.when(projects || $.get('/api/projects').then(function (obj) {
                if (obj.result == 0) {
                    setStorageItem('projects', obj.data);
                    return obj.data;
                }
            }));
        },
        getWorkTypes: function () {
            var workTypes = getStorageItem('workTypes');
            return $.when(workTypes || $.get('/api/workTypes').then(function (obj) {
                if (obj.result == 0) {
                    setStorageItem('workTypes', obj.data);
                    return obj.data;
                }
            }));
        },
        setStorage: function (key, value) { return setStorageItem(key, value); },
        getStorage: function (key) { return getStorageItem(key); },
        removeStorage: function (key) { removeStorageItem(key); },
        resetProjects: function () { removeStorageItem('projects') },
        resetWorkTypes: function () { removeStorageItem('workTypes') },
        getTeamMembers: function (teamId) {
            var members = getStorageItem('team_' + teamId);
            return $.when(members || $.get('/api/users', { teamId: teamId }).then(function (obj) {
                if (obj.result == 0) {
                    setStorageItem('team_' + teamId, obj.data);
                    return obj.data;
                }
            }));
        },
        login: function (user){
            var uid = '803d4de2-afa1-4f92-b51e-b7d602fb33cc';
            return $.get('/api/login', user).then(function (obj) {
                if (obj.result == 0) {
                    // 设置Cookie
                    Cookies.set(uid, obj.data);
                    //
                    common.setStorage('user', user);
                    return { result: 0, user: obj.data };
                } else {
                    user = null;
                    return { result: 1 };
                }

            }, function (err) {
                console.log(err);
                return { result: 2 };
            });
        },
        getCurrUser: function () {
            var user = common.getStorage('user');
            if (!user) {

            }
        }
    }
}());