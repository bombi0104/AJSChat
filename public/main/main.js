'use strict';

angular.module('AJSChat.main', [
	'ngRoute', 
	'luegg.directives', 
	'ui.bootstrap',
	'AJSChat.factories'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope', '$location', 'User', 'Groups', 'Messages', function($scope, $location, User, Groups, Messages) {
	$scope.glued = true;
	$scope.user = User.me;
	$scope.groups = {};
	$scope.group = {}; //Selected group;

	if (User.me == null) {
		// Goto Login page
		window.location = "#/login";
	}

	/**
	 * Start REAL-TIME stream
	 **/
    var chatEvents = new EventSource('/stream/' + $scope.user._id);
    chatEvents.addEventListener("chat", function(event) {
        $scope.$apply(function(){
            var chat = JSON.parse(event.data);
            // console.log(chat);
            receiveMsg(chat);
        });
    });


    /**
	 *
     **/
	Groups.getAllGroupOfUser($scope.user._id)
		.success(function(groups){
			if (groups != null) {
				$scope.groups = groups;
			}
		})
		.error(function (error) {
	        alert("aaa   = " + error.messages);
        });

	/**
	 *
     **/
	$scope.sendMsg = function(e){
		if (e.shiftKey && (e.keyCode == 13)) {
			Messages.sendMessage($scope.group._id, $scope.user._id, $scope.inputMsg)
				.success(function(msg){
					$scope.inputMsg = ""; //Clear inputed message
					receiveMsg(msg);
					console.log("Send msg : ", msg.content);
				})
				.error(function (error) {
			        alert("aaa   = " + error.messages);
		        });
		}
	}

	/**
	 *
     **/
	$scope.selectGroup = function(gr){
		if (gr.messages == null){
			Messages.getMessagesOfGroup(gr._id)
			.success(function(msg){
				if (msg != null) {
					gr.messages = msg;
					$scope.group = gr;
					updateActiveGroup(gr);
				}
			})
			.error(function (error) {
	        	alert("aaa   = " + error.messages);
        	});
		} else {
			$scope.group = gr;
			$scope.group.unread = 0;
			updateActiveGroup(gr);
		}
	}

	/**
	 *
     **/
	var updateActiveGroup = function(gr){
		$scope.groups.forEach(function(g){
			if (g._id == gr._id){
				g.active = true;
			} else {
				g.active = false;
			}
		})
	};


	/**
	 * receiveMsg
     **/
	var receiveMsg = function(msg){
		$scope.groups.forEach(function(gr){
			if (gr._id == msg.group) {
				if (gr.messages != null ) {
					if (!isExistMsgInGroup(gr, msg)){
						gr.messages.push(msg);

						// Update unread count
						plusOneToUnread(gr);
					}
				} else {
					// This group have no chat data
					// first, get messages of this group from server
					Messages.getMessagesOfGroup(gr._id)
						.success(function(msg){
							if (msg != null) {
								gr.messages = msg;
								// Update unread count
								plusOneToUnread(gr);
							}
						})
						.error(function (error) {
				        	alert("aaa   = " + error.messages);
			        	});
				}
			}
		})
	};

	/**
	 *
     **/
	var isExistMsgInGroup = function(gr, msg){
		var exist = false;
		gr.messages.forEach(function(m){
			if (m._id == msg._id){
				exist = true;
			}
		});
		return exist;
	}

	/**
	 *
     **/
	var plusOneToUnread = function(gr){
		if (gr.unread == null) {
			gr.unread = 0;
		}

		if (gr._id != $scope.group._id){
			gr.unread = gr.unread + 1;
		}
	}

	/**
	 *
     **/
	$scope.addUserToGroup = function(){
		alert("Add user to group");
	}

}]);