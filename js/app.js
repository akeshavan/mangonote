var myApp = angular.module('myApp', ['ngSanitize','evgenyneu.markdown-preview']);

myApp.controller("SidebarCtrl", function($scope){

    foo = $.ajax({
    cache: false,
    url: "/static/mangonote.json",
    dataType: "json",
    success: function(data) {
		console.log(foo)
		data = foo.responseJSON
		$scope.title = data.title;
		$scope.sidebars = data.sidebars;
      }
    });
	
	
	//$.getJSON("/static/mangonote.json", function(json){
//		console.log(foo)
//		data = foo.responseJSON
//		$scope.title = data.title;
//		$scope.sidebars = data.sidebars;
//    })
	//console.log(foo)
	//console.log(foo.responseJSON)
	
	//$scope.title = "mangonote";

	//This will be loaded from a json file
    //$scope.sidebars = [{"title":"Reports","href":"Reports","content":[{type:"text", text:"**hello!**\n\nThis is markdown!"},{type:"image", data:"img/placeholder.png"}]},
    //               {"title":"Analytics","href":"Analytics","content":[{type:"text", text:"**analystics**\n\n* This is markdown!"}]},
    //               {"title":"Export","href":"Export","content":[{type:"text", text:"**export yay**\n\n* This is markdown!"}]}]




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

$scope.addSection = function (){
	href = $scope.sectionName.replace(" ","-")
	console.log(href)
	$scope.sidebars.push({"title":$scope.sectionName, 
	                       "href":href, 
						   "content":[]})
						   
}

$scope.random = function(){
	var rand = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
	console.log(rand)
		return "rand"
}

$scope.recordId = function(id){
	
	currentPage = $scope.sidebars[id]
	console.log(currentPage)

}

$scope.addText = function(idx){
	
	console.log($scope.sidebars[idx].content)
	$scope.sidebars[idx].content.push({type:"text", text:"Edit Me"})
	
}

$scope.addImage = function(idx){
	console.log(idx)
	console.log("add_image",$scope.sidebars[idx].content)
	$scope.sidebars[idx].content.push({type:"image", data:""})
	
}

$scope.remove = function(idx_parent,idx){
	$scope.sidebars[idx_parent].content.splice(idx,1)
}

$scope.showTrash = function(){
	$scope.showtrash=true
}

$scope.deleteSection = function(idx){
	console.log(idx)
	console.log($scope.sidebars.length)
	$scope.sidebars.splice(idx,1)
    console.log($scope.sidebars.length)
	$('#myTab a:first').tab('show')
}


$scope.save_note_handler = function(){
	
	allData = {title:$scope.title, sidebars:JSON.stringify($scope.sidebars)}
	console.log(allData)
	$.ajax( {
	      type: "POST",
	      url: "/save_note",
	      data: allData,
		  traditional:true,
	      success: function( response ) {
	        console.log( response )},
		  data: allData,
		  dataType: 'json', 
		  //contentType: 'application/json; charset=utf-8'
	      
	    } );
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

myApp.directive('imageDir', function(){
  // The above name 'myDirective' will be parsed out as 'my-directive'
  // for in-markup uses.
  return {
    // restrict to an element (A = attribute, C = class, M = comment)
    // or any combination like 'EACM' or 'EC'
    restrict: 'E',
    scope: {
      name: '@', // set the name on the directive's scope
                    // to the name attribute on the directive element.
	  data: '=ngModel',
	  //exist_uri: '@'
    },
    //the template for the directive.
    templateUrl: '/templates/img.html',
    //the controller for the directive
    /*controller: function($scope) {
      $scope.validateImage = function(){
		  if ($scope.data){
			  console.log("data in validation"+$scope.data)
		$scope.data = $scope.data_tmp
	}
		else{
			$scope.data="img/placeholder.png"
		}
		$scope.exist_uri=true
      };

    },*/
    replace: true, //replace the directive element with the output of the template.
    //the link method does the work of setting the directive
    // up, things like bindings, jquery calls, etc are done in here
    link: function(scope, elem, attr) {
      // scope is the directive's scope,
      // elem is a jquery lite (or jquery full) object for the directive root element.
      // attr is a dictionary of attributes on the directive element.

	  elem.bind('dblclick', function() {
        scope.exist_uri = false;
        scope.$apply();
      });

	  if (!scope.data & scope.data != undefined){
		  scope.exist_uri = true;
		  scope.data = "img/placeholder.png"
		  scope.data_tmp = "img/placeholder.png"
	  }
	  else{
		  console.log("uri already exists")
		  scope.exist_uri=true
		  scope.data_tmp = scope.data
	  }
	  
	  scope.$watch("exist_uri", function(value) {
		  if (!value && value != undefined){
			  console.log($("#"+scope.name))
	          $("#"+scope.name).modal("show")
	              }
			  });

	  scope.$watch("data", function(value) {
		  if (!value && value != undefined){
			  scope.data = "img/placeholder.png"
	              }
			  });
			  
    }
  };
});

	
// directive for a single list
myApp.directive('dndList', function() {
 
    return function(scope, element, attrs) {
 
        // variables used for dnd
        var toUpdate;
        var startIndex = -1;
 
        // watch the model, so we always know what element
        // is at a specific position
        scope.$watch(attrs.dndList, function(value) {
            toUpdate = value;
        },true);
 
        // use jquery to make the element sortable (dnd). This is called
        // when the element is rendered
        $(element[0]).sortable({
            items:'li',
            start:function (event, ui) {
                // on start we define where the item is dragged from
                startIndex = ($(ui.item).index());
            },
            stop:function (event, ui) {
                // on stop we determine the new index of the
                // item and store it there
                var newIndex = ($(ui.item).index());
                var toMove = toUpdate[startIndex];
                toUpdate.splice(startIndex,1);
                toUpdate.splice(newIndex,0,toMove);
 
                // we move items in the array, if we want
                // to trigger an update in angular use $apply()
                // since we're outside angulars lifecycle
                scope.$apply(scope.model);
            },
            axis:'y'
        })
    }
});