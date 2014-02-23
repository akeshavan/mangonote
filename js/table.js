angular.module('tableEdit', [])

.controller('TCtrl', ['$scope', '$window', '$http', '$sce',
  function($scope, $window, $http, $sce) {
	  //$scope.columns = $scope.data.names
	  //$scope.values = $scope.data.vals
		
	  $scope.setTables = function(element) {
	      $scope.$apply(function(scope) {
	        console.log('files:', element.files);
	        // Turn the FileList object into an Array
	          $scope.files = []
	          for (var i = 0; i < element.files.length; i++) {
	            $scope.files.push(element.files[i])
	          }
	        $scope.progressVisible = false
			console.log($scope.files)
			
			var reader = new FileReader();
			
	        reader.onload = (function(theFile) {
	          return function(e) {
	            // Load Data
	            var contents = e.target.result;
				$scope.datatable = d3.csv.parse(contents)
                console.log("tableData:", $scope.datatable)
				$scope.data = {}
				$scope.data["names"] = Object.keys($scope.datatable[0])
				$scope.data["vals"] = $scope.datatable
				console.log($scope.data)
	          };
	        })($scope.files[0]);

	        // Read in the image file as a data URL.
	        reader.readAsText($scope.files[0]);
	      })
	  }
  
}])

.directive('tabler', function() {
  return {
    templateUrl: "templates/table.html",
    restrict: 'EC',
    replace: true,
    controller: 'TCtrl',
    scope: {data: '=ngModel'},
    link: function(scope, element, attrs) {
     //do stuff 
	
    }
  };
});