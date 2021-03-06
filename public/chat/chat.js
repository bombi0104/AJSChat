'use strict';

angular.module('ChatApp.chat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chat', {
    templateUrl: 'chat/chat.html',
    controller: 'ChatCtrl'
  });
}])

.controller('ChatCtrl', ['$scope', '$location','$http', function($scope, $location, $http) {
	$scope.name = 'World';
    $scope.currentGroup = null;
	$http.get('/groups').
        success(function(data) {
            $scope.groups = data;
        });

	// $http.get('http://localhost:3000/messages.json').
	// success(function(data) {
	//     $scope.messages = data;
	// });

    $scope.selectGroup = function(group) {
        $scope.currentGroup = group._id;
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
            //alert($scope.inputMsg);
            var msgObj = {
                group:$scope.currentGroup,
                from_user:"555d49ee8383e7bc044136e3",
                content:$scope.inputMsg
            }

            $http.post('/messages', msgObj)
                .success(function(data) {
                    //$scope.messages = data;
                    // Reset inputed message
                    $scope.inputMsg = "";
                    $scope.messages.push(data);
                }
            );

            
            
        }
    };
}]);