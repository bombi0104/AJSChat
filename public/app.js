'use strict';

// Declare app level module which depends on views, and components
angular.module('ChatApp', [
  'ngRoute',
  'ChatApp.chat',
  'ChatApp.login'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
