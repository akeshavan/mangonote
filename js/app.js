var myApp = angular.module('myApp', ['ngSanitize','evgenyneu.markdown-preview',
                                     'monospaced.elastic','xeditable',
									 'tableEdit','ipynbAdd','ui.bootstrap']);

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
		console.log($('#'+$scope.sidebars[0].href));
      }
    });

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


	$scope.recordId = function(id){
	
		currentPage = $scope.sidebars[id]
		console.log(currentPage)

	}

	$scope.addText = function(idx){
	
		console.log($scope.sidebars[idx].content)
		$scope.sidebars[idx].content.push({type:"text", text:"Edit Me", class:""})
	
	}

	$scope.addImage = function(idx){
		console.log(idx)
		console.log("add_image",$scope.sidebars[idx].content)
		$scope.sidebars[idx].content.push({type:"image", data:{data:"",size:"100"}, class:""})
	
	}

	$scope.addTable = function(idx){
		console.log("Table added")
		console.log($scope.sidebars[idx].content)
		$scope.sidebars[idx].content.push({type:"table", data:{names:["Edit"], vals:[["me"]]},class:""})
	
	}

	$scope.addipynb = function(idx){
		console.log("ipynbadded")
		console.log($scope.sidebars[idx].content)
		$scope.sidebars[idx].content.push({type:"ipynb", info:{url:"http://nbviewer.ipython.org"},height:"1000"})
	
	}


    $scope.addCarousel = function(idx){
    	
		console.log("carousel add")
		$scope.sidebars[idx].content.push({
			type:"carousel",
			info:{
				height:6000,
				interval:5000,
				data:[{image:"img/mangonote-logo-prototype.png",
				caption:"Double click to edit"}],
			}
		})
		
    }

	$scope.remove = function(idx_parent,idx){
        console.log(idx_parent, idx)
		$scope.sidebars[idx_parent].content.splice(idx,1)
	}
	
	$scope.moveUp = function(idx_parent,idx){
		console.log("moveUp",idx)
		if (idx>0){
			tmp = $scope.sidebars[idx_parent].content[idx-1]
			$scope.sidebars[idx_parent].content[idx-1] = $scope.sidebars[idx_parent].content[idx]
			$scope.sidebars[idx_parent].content[idx] = tmp
		}
		console.log($scope.sidebars[idx_parent].content)
	}
	
	$scope.moveDown = function(idx_parent,idx){
		console.log("moveDown",idx,$scope.sidebars[idx_parent].content.length-1)
		if (idx < $scope.sidebars[idx_parent].content.length-1){
			tmp = $scope.sidebars[idx_parent].content[idx+1]
			$scope.sidebars[idx_parent].content[idx+1] = $scope.sidebars[idx_parent].content[idx]
			$scope.sidebars[idx_parent].content[idx] = tmp
		}
		console.log($scope.sidebars[idx_parent].content)
	}

	$scope.setAllInactive = function() {
	        angular.forEach($scope.sidebars, function(sidebar) {
	            sidebar.class = "";
	        });
	    };

	$scope.set_active = function(idx){
		$scope.setAllInactive()
		$scope.sidebars[idx].class="active"
	
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
    controller: function($scope) {

	  $scope.setFiles = function(element) {
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
	            // Render thumbnail.
	            
	            console.log("data result: "+e.target.result)
				$scope.data_upload = e.target.result

	          };
	        })($scope.files[0]);

	        // Read in the image file as a data URL.
	        reader.readAsDataURL($scope.files[0]);
	      }
	  
			
	        )
	      };
    },
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

	  if (!scope.data.data & scope.data.data != undefined){
		  scope.exist_uri = true;
		  scope.data.data = "img/placeholder.png"
		  scope.data_tmp = "img/placeholder.png"
	  }
	  else{
		  console.log("uri already exists")
		  scope.exist_uri=true
		  scope.data_tmp = scope.data.data
	  }
	  
	  scope.$watch("exist_uri", function(value) {
		  if (!value && value != undefined){
			  console.log($("#"+scope.name))
	          $("#"+scope.name).modal("show")
	              }
			  });

	  scope.$watch("data", function(value) {
		  if (!value && value != undefined){
			  scope.data.data = "img/placeholder.png"
	              }
			  });
			  
    }
  };
});


myApp.directive('imgList', function(){
  // The above name 'myDirective' will be parsed out as 'my-directive'
  // for in-markup uses.
  return {
    // restrict to an element (A = attribute, C = class, M = comment)
    // or any combination like 'EACM' or 'EC'
    restrict: 'E',
    scope: {
      name: '@', // set the name on the directive's scope
                    // to the name attribute on the directive element.
	  info: '=ngModel',
	  //exist_uri: '@'
    },
    //the template for the directive.
    templateUrl: '/templates/carousel.html',
    //the controller for the directive
    controller: function($scope) {
      
	  $scope.addSlide = function(image,caption){
		  $scope.info.data.push({image:image, caption:caption})
	  }
	  
	  $scope.removeSlide = function(idx){$scope.info.data.splice(idx,1)}
	  
	  $scope.setFiles = function(element) {
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
	            // Render thumbnail.
	            
	            console.log("data result: "+e.target.result)
				$scope.data_upload = e.target.result

	          };
	        });//($scope.files[0]);

	        // Read in the image file as a data URL.
			for (var i = 0; i < $scope.files.length; i++) {
		        reader.readAsDataURL($scope.files[i]);
			}
	      
		  }
	  
			
	        )
	      };
    },
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