'use strict';

// Declare app level module which depends on views, and components
angular.module('AJSChat', [
  'ngRoute',
  'AJSChat.login',
  'AJSChat.main'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
