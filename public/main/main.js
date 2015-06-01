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

.controller('MainCtrl', ['$scope', '$location', 'User', 'Groups', 'Messages', '$modal', 
	function($scope, $location, User, Groups, Messages, $modal) {
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
						notifyMe(gr.name, msg.content);
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
		//notifyMe($scope.group.name, $scope.group.messages[0].content);
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'addUserToGroup.html',
			controller: 'ModalInstanceCtrl',
			size: "lg",  // sm, lg
			resolve: {
				group: function () {
					return $scope.group;
				},
				user: function(){
					return $scope.user;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
	}

	/**
	 * Show Notification
	 * https://developer.mozilla.org/en/docs/Web/API/notification
     **/
	var notifyMe = function(groupName, msg){
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var options = {
      			body: msg
      			// icon: theIcon
  			}
            
            var notification = new Notification(groupName, options);
        }

          // Otherwise, we need to ask the user for permission
          // Note, Chrome does not implement the permission static property
          // So we have to check for NOT 'denied' instead of 'default'
          else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {

              // Whatever the user answers, we make sure we store the information
              if(!('permission' in Notification)) {
                Notification.permission = permission;
              }

              // If the user is okay, let's create a notification
              if (permission === "granted") {
                var notification = new Notification(msg);
              }
          });
        }
    }
}])

.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'User', function ($scope, $modalInstance, User, _group, _user) {
	$scope.group = _group;
	$scope.user = _user;
	$scope.users = {};

	User.getAll()
		.success(function(users){
			if (users != null) {
				$scope.users = users;
			}
		})
		.error(function(err){

		});


	$scope.ok = function () {
	$modalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);