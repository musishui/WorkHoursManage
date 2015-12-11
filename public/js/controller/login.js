var app = angular.module('app', ['services']);
app.controller('loginController', ['$scope', 'Login', 
    function ($scope, Login) {
        $scope.isPwd = true;
        $scope.login = function () {
            var user = $scope.user;
            $scope.result = Login.on(user);
        }
    }]);