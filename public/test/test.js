'use strict';

angular.module('AJSChat.test', ['emoji','ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/test', {
    templateUrl: 'test/test.html',
    controller: 'TestCtrl'
  });
}])

.controller('TestCtrl', ['$scope','$sce', function($scope, $sce) {
	$scope.message = "String including Emoji codes :smiley:";
	$scope.trustHTML = function(str){
		return $sce.trustAsHtml(str);
	}
}]);