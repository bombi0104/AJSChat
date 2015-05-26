var app = angular.module('ChatApp', []);

app.controller('MainCtrl', function($scope, $http) {
	$scope.name = 'World';
    $scope.currentGroup = null;
	$http.get('http://172.30.46.99:3000/groups').
        success(function(data) {
            $scope.groups = data;
        });

	// $http.get('http://localhost:3000/messages.json').
	// success(function(data) {
	//     $scope.messages = data;
	// });

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
            $http.get('http://172.30.46.99:3000/messages/group/' + group._id).
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
            //alert($scope.inputMsg);
            var msgObj = {
                group:$scope.currentGroup,
                from_user:"555d49ee8383e7bc044136e3",
                content:$scope.inputMsg
            }

            $http.post('http://172.30.46.99:3000/messages', msgObj)
                .success(function(data) {
                    //$scope.messages = data;
                    // Reset inputed message
                    $scope.inputMsg = "";
                    $scope.messages.push(data);
                }
            );

            
            
        }
    };
});