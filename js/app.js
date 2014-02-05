var myApp = angular.module('myApp', ['ngSanitize','evgenyneu.markdown-preview']);


myApp.controller("ClickToEditCtrl", function($scope) {
	// default should be from a json file
  $scope.title = "Project Name";
  $scope.editorEnabled = false;
  
  $scope.enableEditor = function() {
    $scope.editorEnabled = true;
    $scope.editableTitle = $scope.title;
  };
  
  $scope.disableEditor = function() {
    $scope.editorEnabled = false;
  };
  
  $scope.save = function() {
    $scope.title = $scope.editableTitle;
    $scope.disableEditor();
  };
})

myApp.controller("SidebarCtrl", function($scope){

	//This will be loaded from a json file
$scope.sidebars = [{"title":"Reports","href":"Reports","content":[{type:"text", text:"**hello!**\n\nThis is markdown!"}]},
                   {"title":"Analytics","href":"Analytics","content":[{type:"text", text:"**analystics**\n\n* This is markdown!"}]},
                   {"title":"Export","href":"Export","content":[{type:"text", text:"**export yay**\n\n* This is markdown!"}]}]

$scope.addSection = function (){
	href = $scope.sectionName.replace(" ","-")
	console.log(href)
	$scope.sidebars.push({"title":$scope.sectionName, 
	                       "href":href, 
						   "content":""})
						   
}

$scope.recordId = function(id){
	
	currentPage = $scope.sidebars[id]
	console.log(currentPage)

}

$scope.addText = function(idx){
	
	console.log($scope.sidebars[idx].content)
	$scope.sidebars[idx].content.push({type:"text", text:"Edit Me"})
	
}

$scope.deleteSection = function(idx){
	console.log(idx)
	console.log($scope.sidebars.length)
	$scope.sidebars.splice(idx,1)
    console.log($scope.sidebars.length)
	$('#myTab a:first').tab('show')
}

})

myApp.directive('contenteditable', function() {
    return {

        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            // view -> model
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(elm.html());
                });
            });

            // model -> view
            ctrl.render = function(value) {
                elm.html(value);
				console.log(attr.ngModel);
            };

            // load init value from DOM
            ctrl.$render();
            //console.log(scope.sidebars)
			//console.log(attrs.ngModel)
            elm.bind('keydown', function(event) {
				//console.log("keydown " + event.which);
                var esc = event.which == 27,
                    el = event.target;

                if (esc) {
                        console.log("esc");
                        ctrl.$setViewValue(elm.html());
                        el.blur();
                        event.preventDefault();                        
                    }
                    
            });
            
        }
    };
});

