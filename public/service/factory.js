'use strict';

angular.module('AJSChat.factories', [])

.factory('User', ['$http', function($http) {
	var urlBase = '/users';
	var _factory = {};
	_factory.me = null;

	_factory.login = function(email, password){
		var jsonData = {
            email:email,
            password:password
        }

        return $http.post(urlBase + '/login', jsonData);
	}
	
	_factory.signup = function(email, name, pass){
		var userData = {
			email: email,
			name: name,
			password: pass
		}
		
		return $http.post(urlBase, userData);
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
		return $http.get(urlBase + '/user2/' + userId);
	}

	_factory.create = function(name, userId) {
		var groupData = {
			name: name,
			users: [userId]
		}

		return $http.post(urlBase, groupData);
	}

	_factory.removeUser = function(groupid, userid){
		var jsonData = {
			users : [ userid ]
		}
		return $http.post(urlBase + '/' + groupid + "/removeUsers", jsonData);
	}

	_factory.addUser = function(groupid, userid){
		var jsonData = {
			users : [userid]
		}
		return $http.post(urlBase + '/' + groupid + "/addUsers", jsonData);	
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

	_factory.send2User = function(from_uid, to_uid, msg){
		var msgObj = {
                from_user: from_uid,
                to_user: to_uid,
                content: msg
            }

        return $http.post(urlBase + '/2user', msgObj);
	}

	_factory.loadMore = function(groupId, time){
		return $http.get(urlBase + '/group/' + groupId + "/from/" + time);
	}

	return _factory;
}])