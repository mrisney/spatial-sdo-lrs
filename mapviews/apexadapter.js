function apexAdapter() {
	//constructor
	
	//add map event listeners
	document.addEventListener('mapLoadedEvent', onMapLoaded);
	document.addEventListener('mapRecenteredEvent', onMapRecentered);
	document.addEventListener('rectangleEndEvent', onRectangleEnd);

	document.addEventListener("intersectionShortcutEvent", onIntersectionShortcut);
	document.addEventListener("addIntersectionEvent", onIntersectionAdded);
	document.addEventListener("addIntersectionLegEvent", onIntersectionLegAdded);
	document.addEventListener("mergeIntersectionsEvent", onIntersectionsMerged);
	document.addEventListener("moveIntersectionEvent", onIntersectionMoved);
	document.addEventListener("deleteIntersectionEvent", onIntersectionDeleted);

	document.addEventListener('enableMapFunctionsEvent', enableMapFunctions);
	document.addEventListener('disableMapFunctionsEvent', disableMapFunctions);

	
	//public variables
	this.buttons;
	this.currentIntersection;
	
	//private variables
	var properties = this;

	
	//public methods (click handlers)
	this.onMapHomeClick			= function() {onMapHomeClick();};
	this.onMapSelectClick		= function() {onMapSelectClick();};
	this.onMapClearClick		= function() {onMapClearClick();};
	this.onMapAddClick			= function() {onMapAddClick();};
	this.onMapMergeClick		= function() {onMapMergeClick();};
	this.onMapMoveClick			= function() {onMapMoveClick();};
	this.onMapDeleteClick		= function() {onMapDeleteClick();};
	this.onShowInactiveClick	= function() {onShowInactiveClick();};
	
	this.setMapCenter			= function(lon, lat, zoom) {setMapCenter(lon, lat, zoom);};

	this.setLayersVisible		= function(isVisible) {setLayersVisible(isVisible);};
	
	
	//public methods (event handlers)
	this.onReturnMessage		= function(zoom) {onReturnMessage(zoom);};
	this.onErrorMessage			= function() {onErrorMessage();};
	
	
	//private functions (click handlers)
	function onMapHomeClick() {
		clearAppItems(true);
		
		var args;
		if ($v(properties.currentIntersection)) {
			
			setAppItems({
				'P0_SELECTED_IDS'	: $v(properties.currentIntersection),
				'P0_MAP_FUNCTION'	: 'POINT'
			});
	
			if ($v('P0_RETURN_MESSAGE') == 'TRUE'){
				args = {
					'x' : Number($v('P0_POINT_LON')),
					'y' : Number($v('P0_POINT_LAT')), 
					'z' : 16			
				}
			}; //end if
		
		}; //end if
		
		//use intersection id if set
		map.onMapHomeClick(args); 
		
	}; 


	function onMapSelectClick() {
		map.onMapSelectClick();
		clearAppItems();
	}; 


	function onMapClearClick() {
		map.onMapClearClick();
	}; 

	
	function onMapAddClick() {
		map.onMapAddClick();
	}; 
	
	
	function onMapMergeClick() {
		map.onMapMergeClick();
	}; 

	
	function onMapMoveClick() {
		map.onMapMoveClick();
	}; 

	
	function onMapDeleteClick() {
		map.onMapDeleteClick();
	}; 
	

	function onShowInactiveClick() {
		var isChecked = document.getElementById('showInactiveLegs').checked;
		
		if (isChecked) {
			setAppItems({'P0_SHOW_INACTIVE_LEGS' : 'Y'}, true);
		} else {
			setAppItems({'P0_SHOW_INACTIVE_LEGS' : null}, true);
		}
		
		//dispatch event to trigger custom dynamic action after setting session state
		apex.event.trigger(document, 'DAEvent');

	}; //end function 
	
	
	function setMapCenter(lon, lat, zoom) {
		map.setMapCenter(lon, lat, zoom);
	}; //end function
	

	function setLayersVisible(isVisible) {
		map.setLayersVisible(isVisible);
		if (isVisible) {
			setAppItems({'P0_SHOW_OVERLAYS' : 'Y'}, true);
		} else {
			setAppItems({'P0_SHOW_OVERLAYS' : null}, true);
		} 
	}; //end function
	
	
	//private functions (dynamic action event handlers)
	
	//moved to pageadapter01
	/*
	function onReturnMessage(zoom) {
		//alert('onReturnMessage()')
		//refreshMap();
		//alert(zoom)
		
		if ($v('P0_RETURN_MESSAGE') == 'TRUE') {
			//convert coordinates to numbers and update map
			var x = Number($v('P0_POINT_LON'));
			var y = Number($v('P0_POINT_LAT'));
			var z = 16
			
			//override zoom value if submitted as a parameter
			if (zoom) {
				z = Number(zoom);
			}
		
			map.setMapCenter(x, y, z);
		
		}; //end if
		
	};
	*/
	
	function onReturnMessage() {
		//do nothing
	};
	

	function onErrorMessage() {
		//alert('onErrorMessage()')
		if ($v('P0_ERROR_MESSAGE')){
		
			switch($v('P0_ERROR_MESSAGE').substring(0,9)) {
				case 'ORA-02064':
					// disregard ORA-020604: distributed operation not supported
					// package functions using dblinks return this exception after successful completion
					break;
				default:
					alert('Error: \n' + $v(P0_ERROR_MESSAGE))
			}; //end switch 
	
		}; //end if
	
	};
	

	//map event handlers
	function onMapLoaded() {
		//alert('onMapLoaded')	
		//clearAppItems(true);
		
		//dispatch event to trigger custom dynamic action after map load
		//apex.event.trigger(document, 'DAEvent');
	}	
	
	
	function onMapRecentered() {	
		var mapCenterPointGoogle = map.mapCenter;  //centerpoint returned in SRID 3857 (Google)
        var mapCenterPointLatLon = mapCenterPointGoogle.transform(config.mapSRID)  //transform centerpoint to SRID 8307 (lat/lon)
		
		//display coordinates
		var msg = '';
		msg += 'google = ' + mapCenterPointGoogle.getX() + ', ' + mapCenterPointGoogle.getY() + '\n'
		msg += 'lon/lat = ' + mapCenterPointLatLon.getX() + ', ' + mapCenterPointLatLon.getY()
		//alert(msg); 	
		
		setAppItems({
			'P0_MAP_ZOOM'		: map.mapZoom,
			
			//set google coordinates (for plsql functions)
			'P0_MAP_CENTER_X'	: mapCenterPointGoogle.getX(),
			'P0_MAP_CENTER_Y'	: mapCenterPointGoogle.getY(),
			
			//set lat/lon coordinates (for map functions)
			'P0_MAP_CENTER_LON'	: mapCenterPointLatLon.getX(),
			'P0_MAP_CENTER_LAT'	: mapCenterPointLatLon.getY()
		}, true); //save session state values
	} // end function
	

	function onRectangleEnd(event) {
		var args = event.detail;
		
		setAppItems({
			'P0_SELECTED_IDS'		: args.id_list,
			'P0_RECTANGLE_CENTER_X'	: args.rectangle_center_x,
			'P0_RECTANGLE_CENTER_Y'	: args.rectangle_center_y,
			'P0_MAP_LINE_COORDS'	: args.map_line_coordinates
		}, true); //save session state values
	} //end function
	
	
	function onIntersectionShortcut(event) {
		var args = event.detail;
		
		//setAppItems({
		//	'P0_SELECTED_IDS'	: args.id,
		//	'P0_MAP_FUNCTION'	: 'POINT'
		//}, true); //save session state values
		
		setAppItems({
			'P30_INTERSECTION_ID' : args.id
		}, true);
		
		
	} // end function

	
	function onIntersectionAdded(event) {
		var args = event.detail;
		
		var msg = '';
		msg += 'rectangleCenterX	= ' + args.rectangleCenterX + '\n';
		msg += 'rectangleCenterY	= ' + args.rectangleCenterY + '\n';
		msg += 'lastFunction		= ' + args.lastFunction + '\n';
		//alert(msg)
	
		setAppItems({
			'P0_RECTANGLE_CENTER_X'	: args.rectangleCenterX,
			'P0_RECTANGLE_CENTER_Y'	: args.rectangleCenterY,
			'P0_MAP_FUNCTION'		: 'ADD'
		});
	
		map.refreshMap();	
	} //end function

	
	function onIntersectionLegAdded(event) {
		var args = event.detail;
		
		var msg = '';
		msg += 'id				= ' + args.id + '\n';
		msg += 'lineGeometry	= ' + args.lineGeometry + '\n';
		msg += 'lastFunction	= ' + args.lastFunction + '\n';
		//alert(msg)
		
		setAppItems({
			'P0_SELECTED_IDS'		: args.id,
			'P0_MAP_LINE_COORDS'	: args.lineGeometry,
			'P0_MAP_FUNCTION'		: 'LEG'
		});
	
		map.refreshMap('legs');	
	} //end function
	
	
	function onIntersectionsMerged(event) {
		var args = event.detail;
		
		var msg = '';
		msg += 'ids				= ' + args.ids + '\n';
		//alert(msg)
		
		setAppItems({
			'P0_SELECTED_IDS'		: args.ids,
			'P0_MAP_FUNCTION'		: 'MERGE'
		});
	
		map.refreshMap();
	} //end function	
	
	
	function onIntersectionMoved(event) {
		var args = event.detail;
		
		var msg = '';
		msg += 'id  = ' + args.id + '\n';
		msg += 'lon = ' + args.lon + '\n';
		msg += 'lat = ' + args.lat + '\n';
		//alert(msg)

		setAppItems({
			'P0_SELECTED_IDS'	: args.id,
			'P0_DEST_LON'		: args.lon,
			'P0_DEST_LAT'		: args.lat,
			'P0_MAP_FUNCTION'	: 'MOVE'
		});
		
		map.refreshMap('intersections');
	}
	
	
	function onIntersectionDeleted(event) {
		var args = event.detail;
		
		var msg = '';
		msg += 'id  = ' + args.id + '\n';
		//alert(msg)
		
		setAppItems({
			'P0_SELECTED_IDS'	: args.id,
			'P0_MAP_FUNCTION'	: 'DELETE'
		});

		map.refreshMap();
	} //end function
	
	
	function enableMapFunctions(e) {
		var functions = e.detail;
						
		//enable buttons passed as argument	
		for (var i = 0; i < functions.length; i++) {
			$x(properties.buttons[functions[i]]).disabled = false;
		}; //end for
	} //end function
		
	
	function disableMapFunctions() {
		//disable all buttons	
		for (var key in properties.buttons) {
			$x(properties.buttons[key]).disabled = true;
		} //end for		
	} //end function

		
	function clearAppItems(saveState) {
		setAppItems({
			'P0_CHECKBOX' 			: null,
			'P0_MAP_ZOOM' 			: null,
	
			'P0_MAP_CENTER_X' 		: null,
			'P0_MAP_CENTER_Y' 		: null,
			'P0_POINT_X'			: null,
			'P0_POINT_Y'			: null,
			'P0_RECTANGLE_CENTER_X'	: null,
			'P0_RECTANGLE_CENTER_Y'	: null,
			'P0_MAP_LINE_COORDS'	: null,
			
			'P0_MAP_CENTER_LON' 	: null,
			'P0_MAP_CENTER_LAT' 	: null,
			'P0_POINT_LON'			: null,
			'P0_POINT_LAT'			: null,
			'P0_DEST_LON'			: null,
			'P0_DEST_LAT'			: null,
		
			'P0_SELECTED_IDS'		: null,
			'P0_MAP_FUNCTION'		: null,
			'P0_RETURN_MESSAGE'		: null,
			'P0_ERROR_MESSAGE'		: null
		}, saveState);
	}; //end function
	
	
	//set session state values
    function setAppItems(obj, saveState) {
	
		if (saveState) {
		
			//deprecated
			var a = new htmldb_Get();
			for (var p_App_Item_Name in obj){
				var p_Value_to_Set = obj[p_App_Item_Name];
				//alert(p_App_Item_Name + ' = ' + p_Value_to_Set)
		
				//set DOM node value
				$s(p_App_Item_Name, p_Value_to_Set)

				//set session state value
				a.add(p_App_Item_Name, p_Value_to_Set);
			
			} //end for
			var r = a.get();
			
			
			//Apex 5
			/*
			apex.server.process ( "MY_PROCESS", {
					x01: "test",
					pageItems: "#P1_DEPTNO,#P1_EMPNO"
				}, {
					success: function( pData ) { ... do something here ... }
				}
			);
			*/


			/*
			apex.server.process ('MY_PROCESS', {
					pageItems: '#P1_DEPTNO,#P1_EMPNO'
				}, {
					success: function(pData) { ... do something here ... }
				} 
			);
			*/


			/*
			apex.server.process ('MY_PROCESS', {
					p_arg_name: 'F_APP_ITEM',
					p_arg_value: vNewAppItemValue
				}, {
					success: function(pData) { ... do something here ... }
				} 
			);			
			*/
			
		} else {
			for (var p_App_Item_Name in obj){
				var p_Value_to_Set = obj[p_App_Item_Name];
				//alert(p_App_Item_Name + ' = ' + p_Value_to_Set)
			
				//set DOM node value
				$s(p_App_Item_Name, p_Value_to_Set)
			} //end for
		}; //end if
		
    } //end function
	
	
	function stringToBoolean(string){
		// check for truthy; if not: undefined, null, empty string (""), NaN, 0, false
		if (string) {
			//check for true equivalents
			switch(string.toLowerCase()){
				case "true": 
				case "yes": 
				case "1": 
					return true;
					break;
				default:
					return false;
					break;
			}; //end switch
		} else {
			return false;
		}; //end if
	}; //end function

	
}; //end class
