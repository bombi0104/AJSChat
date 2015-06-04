'use strict';

// Declare app level module which depends on views, and components
angular.module('AJSChat', [
  'ngRoute',
  'AJSChat.main',
  'AJSChat.admin',
  'AJSChat.test'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
