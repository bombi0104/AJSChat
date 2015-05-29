var app = angular.module('ChatApp', ['luegg.directives', 'ui.bootstrap']);

app.controller('MainCtrl', function($scope, $http, $modal) {
    $scope.glued = true;
	$scope.name = null;
    $scope.token = null;
    $scope.currentGroup = null;
    $scope.currentGroupIndex = 0;
    $scope.groups = [];

    $scope.openModal = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: "sm",
            resolve: {
                items: function () {
                    
                }
            }
        });
    };

    if ($scope.name == null) {
        $scope.openModal();
    }

    $scope.login = function() {
        var jsonData = {
            username:$scope.login_name,
            password:$scope.login_pass
        }
        
        $http.post('/users/login', jsonData)
            .success(function(data) {
                $scope.name = data.name;
                $scope.user = data;

                $scope.login_name = "";
                $scope.login_pass = "";

                $http.get('/groups/user/' + data._id).
                    success(function(groups) {  
                        $scope.groups = groups;
                        initUnread();
                    }
                );

                // live-updates
                var chatEvents = new EventSource('/stream/' + data._id);
                chatEvents.addEventListener("chat", function(event) {
                    $scope.$apply(function(){
                        var chat = JSON.parse(event.data);
                        console.log(chat);
                        receiveMsg(chat);    
                    });
                });
                
            })
            .error(function(data, status, headers, config) {
                alert("Login error");
            });

            $scope.login_name = "";
            $scope.login_pass = "";
    }

	

    $scope.selectGroup = function(group) {
        $scope.currentGroup = group._id;
        // $scope.Logs = room.chats;

        // Update selected row.
        for (var i = $scope.groups.length - 1; i >= 0; i--) {
            if ($scope.groups[i]._id != group._id) {
                $scope.groups[i].active = false;
                console.log("Select log : ", i);
            } else {
                $scope.currentGroupIndex = i;
                $scope.groups[i].active = true;
                $scope.groups[i].unread = 0;        // Reset unread message no.
            }
        };

        if (group.messages == null){
            $http.get('/messages/group/' + group._id).
                success(function(data) {
                    group.messages = data;
                }
            );
        }
	};

    $scope.sendMsg = function(e) {
        // When touch shift-enter
        if (e.shiftKey && (e.keyCode == 13)){
            if (!$scope.user || !$scope.currentGroup)
                return;

            //alert($scope.inputMsg);
            var msgObj = {
                group:$scope.currentGroup,
                from_user:$scope.user._id,
                content:$scope.inputMsg
            }

            $http.post('/messages', msgObj)
                .success(function(data) {
                    // Reset inputed message
                    $scope.inputMsg = "";
                    //$scope.messages.push(data);
                    receiveMsg(data);
                }
            );
        }
    };

    var receiveMsg = function(msg){
        $scope.groups.forEach(function(group) {
            if (group._id == msg.group) {
                if (group.messages != null) {
                    var isExist = false;
                    group.messages.forEach(function(m){
                        if (m._id == msg._id)
                            isExist = true;
                    });
                    if (!isExist){
                        group.messages.push(msg);

                        // Just add new message count in case not showed group.
                        if (group._id != $scope.groups[$scope.currentGroupIndex]._id){
                            group.unread = group.unread + 1;
                            notifyMe("From : " + msg.from_user.name + " \n " + msg.content);

                        }
                    }
                } else {
                    $http.get('/messages/group/' + group._id).
                        success(function(data) {
                            group.messages = data;
                            group.unread = group.unread + 1;
                        }
                    );
                }
            }
        });
    }

    var initUnread = function(){
        $scope.groups.forEach(function(r) {
            r.unread = 0;
        });
    }

    var notifyMe = function(msg){
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(msg);
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
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});