'use strict';

angular.module('AJSChat.admin', [])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'admin/admin.html',
    controller: 'AdminCtrl'
  });
}])

.controller('AdminCtrl', ['$scope', function($scope) {


}]);