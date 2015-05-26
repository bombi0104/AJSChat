'use strict';

angular.module('ChatApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {
	setTimeout(function(){
		window.location = "#/chat";
	}, 2000);
}]);