var app = angular.module('ChatApp', []);

app.controller('MainCtrl', function($scope, $http) {
  $scope.name = 'World';
  $http.get('http://localhost:3000/users').
        success(function(data) {
            $scope.groups = data;
        });

        $http.get('http://localhost:3000/messages.json').
        success(function(data) {
            $scope.messages = data;
        });
});