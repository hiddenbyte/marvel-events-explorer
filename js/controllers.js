(function(angular) {
	
	var app = angular.module('marvelEventsApp', []);

	app.controller('ExplorerCtrl', function ($scope, $http) {
		
		$scope.characters = [];
		$scope.query = '';

		$scope.nameChanged = function() {
			$http({
					method: 'GET', 
					url: 'http://localhost:8081/v1/public/characters?apikey=cf5a2b8136384639ab72cd893c4ce6d2&nameStartsWith=' + $scope.query ,
					transformResponse : function(data) {
						return eval('(' + data + ')');
					},
				}).
				success(function(data, status, headers, config) {
					var results = data.data.results;

					$scope.characters.length = 0;
					
					for(var i in results)
						$scope.characters.push(results[i].name);

			    }).
			    error(function(	data, status, headers, config) {
			    	console.log(status);
			    });
		};
	});

})(angular);