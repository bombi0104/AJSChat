var app = angular.module('ChatApp', ['luegg.directives']);

app.controller('MainCtrl', function($scope, $http) {
    $scope.glued = true;
	$scope.name = null;
    $scope.token = null;
    $scope.currentGroup = null;

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
                    }
                );
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
        $scope.groups.forEach(function(r) {
            if (r._id != group._id) {
                r.active = false;
            } else {
                r.active = true;
            }
        });

        if (group.messages == null){
            $http.get('/messages/group/' + group._id).
                success(function(data) {
                    group.messages = data;
                    $scope.messages = group.messages;
                }
            );    
        } else {
            $scope.messages = group.messages;
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
                    //$scope.messages = data;
                    // Reset inputed message
                    $scope.inputMsg = "";
                    
                    data.from_user = {name:$scope.name};
                    $scope.messages.push(data);
                }
            );
        }
    };
});