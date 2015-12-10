var app = angular.module('app', ['services']);
app.controller('registerController', ['$scope', 'User', 
    function ($scope, User) {
        $scope.register = function () {
            var user = $scope.user;
            User.save({ id: '566935eb2ef606802b829cf7' }, user, function (res) {
                console.log(res);
            }, function (err) {
                console.error(err);
            })
        }
    }]);