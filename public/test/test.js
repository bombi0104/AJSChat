'use strict';

angular.module('AJSChat.test', ['ngSanitize', 'ui.bootstrap'])

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

	//var ele = angular.element('#aaa').focus();
	$scope.selected = undefined;
	$scope.str = "";
	$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

	$scope.startsWith = function(state, viewValue) {
		// console.log(state, viewValue);
		var lastword = viewValue.split(" ").pop();
      return state.substr(0, lastword.length).toLowerCase() == lastword.toLowerCase();
    }

    $scope.formatLabel = function(model) {
    	console.log("formatLabel", model);
    	return model;
	};

	$scope.onSelect = function (item, model, label) {
		console.log("$scope.selected: ", $scope.selected);
		console.log("onSelect item: ", item);
		console.log("onSelect $model: ", model);
		console.log("onSelect $label: ", label);
		$scope.str = $scope.str + " " + item;
		$scope.selected = $scope.str;
	};
}]);