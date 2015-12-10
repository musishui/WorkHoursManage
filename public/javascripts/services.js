'use strict';
var resource = angular.module('resource', ['ngResource']);

resource.factory('Resource', ['$resource', function ($resource) {
        return function (url, params, methods) {
            var defaults = {
                update: { method: 'put', isArray: false },
                create: { method: 'post' },
                query: { isArray: false }
            };
            
            methods = angular.extend(defaults, methods);
            
            var resource = $resource(url, params, methods);
            
            resource.prototype.$save = function () {
                if (!this.id) {
                    return this.$create();
                }
                else {
                    return this.$update();
                }
            };
            
            return resource;
        };
    }]);


var services = angular.module('services', ['resource']);

services.factory('User', ['$resource', 
    function ($resource) {
        return $resource('/api/users/:id', { id: '@id' });
    }]);

services.factory('Project', ['$resource', 
    function ($resource) {
        return $resource('/api/projects/:id', { id: '@id' });
    }]);

services.factory('WorkType', ['$resource', 
    function ($resource) {
        return $resource('/api/workTypes/:id', { id: '@id' });
    }]);

services.factory('Login', ['$resource', 
    function ($resource) {
        return $resource('/api/login', {}, { on: { method: 'GET', isArray: false } });
    }]);