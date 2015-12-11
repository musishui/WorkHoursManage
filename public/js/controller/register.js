var app = angular.module('app', ['services']);
app.controller('registerController', ['$scope', 'User', 
    function ($scope, User) {
        $scope.register = function () {
            var user = $scope.user;
            User.save({}, user, function (res) {
                console.log(res);
            }, function (err) {
                console.error(err);
            })
        }
    }]);