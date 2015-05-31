'use strict';

angular.module('AJSChat.main', ['ngRoute', 'luegg.directives', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope', '$location', function($scope, $location) {
	$scope.glued = true;
	$scope.contacts = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];
	$scope.Messages = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];
	$scope.group = "aaa";

	$scope.sendMsg = function(e){
		if (e.keyCode == 13){
			$scope.Messages.push($scope.inputMsg);
			$scope.inputMsg = "";
		}
	}

	$scope.selectGroup = function(gr){
		$scope.group = gr;
	}
}]);