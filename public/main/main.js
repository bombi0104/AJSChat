'use strict';

angular.module('AJSChat.main', [
	'ngRoute', 
	'luegg.directives', 
	'ui.bootstrap',
	'AJSChat.factories',
	'ngCookies',
	'ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$rootScope', '$scope', '$timeout', 'User', 'Groups', 'Messages', '$modal', '$cookies', '$window',
	function($rootScope, $scope, $timeout, User, Groups, Messages, $modal, $cookies, $window) {
	$scope.glued = true;
	$scope.user = $cookies.getObject('user');
	$scope.groups = [];
	$scope.group = {}; //Selected group;
	$scope.inputMsg = "";
	$scope.selectUserPopover = {
		content: 'Hello, World!',
    	templateUrl: 'SelectToUserTemplate.html',
    	title: 'Select users'
	}

	$scope.isSseOffline = true;
	$rootScope.header = "AJSChat";

	var unread = 0;
	var socket = null;

	/**
	 * SignUp dialog
     **/
	var openSignUpDialog = function(){
		//notifyMe($scope.group.name, $scope.group.messages[0].content);
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'SignUpTemplete.html',
			controller: 'SignUpCtrl',
			size: "sm",  // sm, lg
			backdrop: 'static',
			keyboard: false
		});

		modalInstance.result.then(function(user) {
			// console.log("Return user = ", User.me)
			$scope.user = user;	
			$cookies.putObject('user', user);

			//startSSE();
			startSocketIO();
			getGroups();
		}, function (dismiss_msg) {
			// console.log('Modal dismissed at: ' + new Date() + "    " + dismiss_msg);
		})
	}
	
	
	/**
	 * Login dialog
     **/
	var openLoginDialog = function(){
		//notifyMe($scope.group.name, $scope.group.messages[0].content);
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'LoginTemplete.html',
			controller: 'LoginCtrl',
			size: "sm",  // sm, lg
			backdrop: 'static',
			keyboard: false
		});

		modalInstance.result.then(function(user) {
			// console.log("Return user = ", User.me)
			$scope.user = user;	
			$cookies.putObject('user', user);
			// startSSE();
			startSocketIO();
			getGroups();
		}, function (dismiss_msg) {
			if (dismiss_msg == "signup"){
				openSignUpDialog();
			}
			// console.log('Modal dismissed at: ' + new Date() + "    " + dismiss_msg);
		})
	}

	/**
	 * Start REAL-TIME stream
	 **/
	var startSSE = function(){
		var chatEvents = new EventSource('/stream/' + $scope.user._id);
	    chatEvents.addEventListener("chat", function(event) {
	        $scope.$apply(function(){
	            var chat = JSON.parse(event.data);
	            // console.log(chat);
	            receiveMsg(chat);
	        });
	    });

	    chatEvents.onopen = function(event) {
	    	console.log("SSE-onopen: ", event);
	    	$scope.$apply(function(){
	    		$scope.isSseOffline = false;
	    	});
	    };

	    chatEvents.onerror = function(event) {
	    	console.log("SSE-onerror: ", event);
	    	$scope.$apply(function(){
	    		$scope.isSseOffline = true;
	    	});
	    };
	}

	/**
	 * Start websocket/socket.io
	 **/
	var startSocketIO = function() {
		socket = io();

		socket.on('connect', function(){
  			console.log("Connected !");
  			$scope.$apply(function(){
	    		$scope.isSseOffline = false;
	    	});
  		});

  		socket.on('disconnect', function(){
  			console.log("Disconnected !");
  			$scope.$apply(function(){
	    		$scope.isSseOffline = true;
	    	});
  		});

		socket.on('message', function(msg){
			console.log( "Msg: ", msg);
			$scope.$apply(function(){
	            //var chat = JSON.parse(msg);
	            receiveMsg(msg);
	        });
  		});
	}

	/**
	 *
     **/
    var getGroups = function(){
		Groups.getAllGroupOfUser($scope.user._id)
			.success(function(groups){
				if (groups != null) {
					$scope.groups = groups;
					if ($scope.groups.length > 0){
						$scope.selectGroup($scope.groups[0]);
					}
				}
			})
			.error(function (error) {
				console.log("getGroups Error : ", error);
	        });
    }

	if ($scope.user == null) {
		openLoginDialog();
	} else {
		//startSSE();
		startSocketIO();
		getGroups();
	}


	var sendMsgToWC = function() {
		var msgObj = {
                group: $scope.group._id,
                from_user: $scope.user._id,
                content: $scope.inputMsg
            }
		socket.emit('message', msgObj);
	}

	/**
	 *
     **/
	$scope.sendMsg = function(e){
		if (e.shiftKey && (e.keyCode == 13)) {
			if ($scope.inputMsg.trim().length > 0){
				if ($scope.group.email) {
					// Private message
					console.log("send private message");
					sendMsgToWC();
					Messages.sendPrivateMsg($scope.group._id, $scope.user._id, $scope.inputMsg)
					.success(function(msg){
						receiveMsg(msg);
						//console.log("Send msg : ", msg.content);
					})
					.error(function (error) {
				        alert("aaa   = " + error.messages);
			        });	
				} else {
					// Group message
					sendMsgToWC();
					Messages.sendMessage($scope.group._id, $scope.user._id, $scope.inputMsg)
					.success(function(msg){
						receiveMsg(msg);
						//console.log("Send msg : ", msg.content);
					})
					.error(function (error) {
				        alert("aaa   = " + error.messages);
			        });	
				}
				
			}
		    $scope.inputMsg = ""; //Clear inputed message
		}
	}


	/**
	 *
     **/
	$scope.selectGroup = function(gr){
		if (gr.messages == null){
			if (gr.email) {
				Messages.getPrivateMsg(gr._id, $scope.user._id)
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
			}
		} else {
			$scope.group = gr;
			if ($scope.group.unread != undefined){
				unread = unread - $scope.group.unread;
			}
			$scope.group.unread = 0;
			updateActiveGroup(gr);
			updateHeader();
		}
	}

	var updateHeader = function() {
		if (unread <= 0){
			$rootScope.header = "AJSChat";
		} else {
			$rootScope.header = "(" + unread + ") AJSChat";
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
		var gr = null;
		if (msg.group) {
			// is Group message
			gr = $scope.groups.getbyId(msg.group);
		} else {
			// is Private message
			console.log('Private message:', msg);
			var guest_user = null;
			if (msg.from_user._id == $scope.user._id) {
				guest_user = msg.to_users[0];
			} else {
				guest_user = msg.from_user._id;
			}
			gr = $scope.groups.getbyId(guest_user);
		}

		// Update message to screen.
		if (gr.messages != null ) {
			if (!isExistMsgInGroup(gr, msg)){
				gr.messages.push(msg);

				// Update unread count
				plusOneToUnread(gr);
				if (msg.from_user._id != $scope.user._id){
					notifyMe(gr.name, msg.content);	
				}

				$scope.groups.moveTop(gr);
			}
		} else {
			// This group have no chat data
			// first, get messages of this group from server
			if (gr.email) {
				// private message
				Messages.getPrivateMsg(gr._id, $scope.user._id)
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
				// Group message
				Messages.getMessagesOfGroup(gr._id)
				.success(function(msg){
					if (msg != null) {
						gr.messages = msg;
						// Update unread count
						plusOneToUnread(gr);

						$scope.groups.moveTop(gr);
					}
				})
				.error(function (error) {
		        	alert("aaa   = " + error.messages);
	        	});
			}
		}

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
			unread++;
			updateHeader();
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
			controller: 'UpdateGroupUsersCtrl',
			size: "lg",  // sm, lg
			resolve: {
				_group: function () {
					return $scope.group;
				},
				_user: function(){
					return $scope.user;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
			}, function () {
				// console.log('Modal dismissed at: ' + new Date());
			});
	}

	/**
	 * Load more message
     **/
	$scope.loadMore = function(){
		Messages.loadMore($scope.group._id, $scope.group.messages[0].created_at)
			.success(function(msgs){
				if ((msgs != null) && (msgs.length > 0)){
					for (var i = msgs.length - 1; i >= 0; i--) {
						msgs[i]
						$scope.group.messages.unshift(msgs[i]);
					};
				}
			})
			.error(function (error) {
	        	alert("aaa   = " + error.messages);
        	});
	}

	/**
	 * Add group dialog
     **/
	$scope.openCreateGroupDialog = function(){
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: 'CreateGroupTemplete.html',
			controller: 'CreateGroupCtrl',
			size: "lg",  // sm, lg
			resolve: {
				_user: function(){
					return $scope.user;
				}
			}
		});

		modalInstance.result.then(function (group) {
			$scope.groups.push(group);
			}, function () {
				// console.log('Modal dismissed at: ' + new Date());
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
      			body: msg,
      			tag: 'AJSChat',
      			icon: 'images/icon_large.png'
  			}
            
            var notification = new Notification(groupName, options);

            notification.onclick = function(){
            	$window.focus();
            }

            // $timeout(function(){
            // 	notification.close();
            // }, 30000);
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

    $scope.formatDate = function(st){
    	var tmp = st.match(/^\d{4}-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    	return tmp[2] + '/' + tmp[1] + ' ' + tmp[3] + ':' + tmp[4];  //dd/MM hh:mm
    }

    $scope.selectToUser = function(user){
    	
    }

    $scope.onMessageClick = function(index){
    	if (index == 0){
    		$scope.loadMore();
    		// console.log("loadMore");
    	}
    }

    $scope.reload = function(){
    	window.location.reload();
    }

    $scope.signout = function(){
    	$cookies.remove('user');
    	$scope.user = null;
    	$scope.groups = null;

    	window.location.reload();
    }
}])

.controller('UpdateGroupUsersCtrl', ['$scope', '$modalInstance', 'User', 'Groups', '_group', '_user', 
	function($scope, $modalInstance, User, Groups, _group, _user) {
	$scope.group = _group;
	$scope.user = _user;
	$scope.users = {};

	// console.log("Group Users : ", $scope.group);
	// console.log("Users : ", $scope.user);

	User.getAll()
		.success(function(users){
			if (users != null) {
				$scope.group.users.forEach(function(gu){
					var index = -1;
					for (var i = 0; i < users.length; i++) {
						if (users[i].email == gu.email){
							// Remove this user from users list.
							index = i;
							break;
						}
					};
					if (index > -1){
						users.splice(index, 1);
					}
				});
				$scope.users = users;
			}
		})
		.error(function(err){

		});

	$scope.addUser = function (user) {
		Groups.addUser(_group._id, user._id)
		.success(function(users){
			$scope.group.users.push(user);
			for (var i = 0; i < $scope.users.length; i++) {
				if ($scope.users[i].email == user.email){
					$scope.users.splice(i,1);
					break;
				}
			};

		})
		.error(function(err){

		});
	}	

	$scope.removeUser = function (user) {
		Groups.removeUser(_group._id, user._id)
		.success(function(users){
			$scope.users.push(user);
			for (var i = 0; i < $scope.group.users.length; i++) {
				if ($scope.group.users[i].email == user.email){
					$scope.group.users.splice(i,1);
					break;
				}
			};
			
		})
		.error(function(err){

		});
	}

	$scope.close = function () {
		$modalInstance.dismiss('close');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}])

.controller('LoginCtrl', ['$scope', '$modalInstance', 'User', function ($scope, $modalInstance, User) {
	$scope.ok = function () {
		User.login($scope.login_email, $scope.login_pass)
			.success(function (user) {
				if (user != null){
					User.me = user;
					$modalInstance.close(user);
				} else {
					alert("Wrong username or password");
				}
	        })
	        .error(function (error) {
	            alert(error);
            });
	};	

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.signup = function () {
		$modalInstance.dismiss('signup');
	};
}])

.controller('SignUpCtrl', ['$scope', '$modalInstance', 'User', function ($scope, $modalInstance, User) {
	$scope.ok = function () {
		User.signup($scope.email, $scope.name, $scope.password)
			.success(function (user) {
				if (user != null){
					User.me = user;
					$modalInstance.close(user);
				} else {
					alert("Wrong username or password");
				}
	        })
	        .error(function (error) {
	            alert(error);
            });
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}])

.controller('CreateGroupCtrl', ['$scope', '$modalInstance', 'Groups', '_user', function ($scope, $modalInstance, Groups, _user) {
	$scope.ok = function () {
		Groups.create($scope.name, _user._id)
			.success(function (gr) {
				if (gr != null){
					$modalInstance.close(gr);
				} else {
					alert("Wrong username or password");
				}
	        })
	        .error(function (error) {
	            alert(error);
            });
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);
