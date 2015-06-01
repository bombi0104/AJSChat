'use strict';

angular.module('AJSChat.login', [
	'ngRoute',
	'AJSChat.factories'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$location', 'User', function($scope, $location, User) {

	// Login funcion, when success, move to main screen.
	$scope.login = function(){
		User.login($scope.login_name, $scope.login_pass)
			.success(function (user) {
				if (user != null){
					User.me = user;
	            	window.location = "#/main";	
				} else {
					alert("Wrong username or password");
				}
	        })
	        .error(function (error) {
	            alert(error);
            });
	}
}]);