angular.module('ipynbAdd', [])

.controller('ipynbCtrl', ['$scope', '$window', '$http', '$sce',
  function($scope, $window, $http, $sce) {
	  //$scope.columns = $scope.data.names
	  //$scope.values = $scope.data.vals
      $scope.Url = $sce.trustAsResourceUrl($scope.info.url);
	  console.log("info", $scope.info)
	  console.log($scope.Url)
	  $scope.show_ipynb_input = false
	  $scope.updateipynb = function(){
		  console.log($scope.info.url)
		  $scope.Url = $sce.trustAsResourceUrl($scope.info.url);
	  }
	  
}])

.directive('ipynb', function() {
  return {
    templateUrl: "templates/ipynbAdd.html",
    restrict: 'EC',
    replace: true,
    controller: 'ipynbCtrl',
    scope: {info: '=ngModel'},
    link: function(scope, element, attrs) {
     //do stuff 
	
	
	
    }
  };
});