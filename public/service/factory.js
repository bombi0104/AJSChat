'use strict';

angular.module('AJSChat.factories', [])

.factory('User', ['$http', function($http) {
	var urlBase = '/users';
	var _factory = {};
	_factory.me = null;

	_factory.login = function(username, password){
		var jsonData = {
            username:username,
            password:password
        }

        return $http.post(urlBase + '/login', jsonData);
	}

	_factory.getAll = function(){
		return $http.get(urlBase);
	}


	return _factory;
}])

.factory('Groups', ['$http', function($http){
	var urlBase = '/groups';
	var _factory = {};
	
	_factory.getAllGroupOfUser = function(userId){
		return $http.get(urlBase + '/user/' + userId);
	}

	return _factory;
}])

.factory('Messages', ['$http', function($http){
	var urlBase = '/messages';
	var _factory = {};

	_factory.getMessagesOfGroup = function(groupId){
		return $http.get(urlBase + '/group/' + groupId);
	}

	_factory.sendMessage = function(groupId, userId, msg){
		var msgObj = {
                group: groupId,
                from_user: userId,
                content: msg
            }

        return $http.post(urlBase, msgObj);
	}

	return _factory;
}])