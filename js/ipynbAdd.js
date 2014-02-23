angular.module('ipynbAdd', [])

.controller('ipynbCtrl', ['$scope', '$window', '$http', '$sce',
  function($scope, $window, $http, $sce) {
	  //$scope.columns = $scope.data.names
	  //$scope.values = $scope.data.vals
      $scope.Url = $sce.trustAsResourceUrl($scope.url);
	  console.log($scope.Url)
	  
}])

.directive('ipynb', function() {
  return {
    templateUrl: "templates/ipynbAdd.html",
    restrict: 'EC',
    replace: true,
    controller: 'ipynbCtrl',
    scope: {url: '=ngModel'},
    link: function(scope, element, attrs) {
     //do stuff 
	
    }
  };
});