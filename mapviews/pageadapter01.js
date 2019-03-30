var map;
var config;
var adapter;


$(document).ready(function() {
	//load apex adapter
	adapter = new apexAdapter();

	//set location of current intersection id
	adapter.currentIntersection = 'P1_SELECTED_IDS';

	//use object literal to manage button state
	adapter.buttons = {
		'clear'	: 'p1_unselect'
	}; //end object

	//load config
	config = new configReader('/mapviews/xml/config.xml');
	document.addEventListener('ixnMapConfigLoadedEvent', onConfigLoaded);
	config.read();

}); //end document.ready


function onConfigLoaded() {
	if (config.loaded == true) {

		//set controls
		$s('P1_CHECKBOX', $v('P0_SHOW_OVERLAYS'), '', true); //suppress change event

		//set starting map location
		var args;
		if ($v('P0_MAP_CENTER_LON')){
			//use previous map location if set
			args = {
				'x' : Number($v('P0_MAP_CENTER_LON')),
				'y' : Number($v('P0_MAP_CENTER_LAT')),
				'z' : Number($v('P0_MAP_ZOOM'))
			}
		}; //end if

		map = new mapViewerClass(document.getElementById('map'), config, args);

		//set starting layer visibility
		adapter.setLayersVisible($v('P1_CHECKBOX')? true: false)

	} else {
		alert('Error: Unable to load IXN configuration file!')
	} //end if
}; //end function


//click handlers
function onMapHomeClick()	{adapter.onMapHomeClick();};
function onMapSelectClick()	{adapter.onMapSelectClick();};
function onMapClearClick()	{adapter.onMapClearClick();};
function onCheckBoxChange() {adapter.setLayersVisible($v('P1_CHECKBOX')? true: false)};

function onSubmit() {
	//execute function if not null
	if ($v('P0_SELECTED_IDS')){

		//convert coordinates to numbers and update map
		var x = Number($v('P0_POINT_LON'));
		var y = Number($v('P0_POINT_LAT'));
		var z = Number($v('P1_ZOOM'));

		adapter.setMapCenter(x, y, z);
	};
};


//event handlers
function setMapCenter(lon, lat, zoom) {
	alert('setMapCenter')
	//adapter.setMapCenter(lon, lat, zoom);
};

function onIntersectionChange() {
	$s('P0_SELECTED_IDS', $v('P1_INTERSECTION_ID'));

	//execute if not null
	if ($v('P0_SELECTED_IDS')) {
		$s('P0_MAP_FUNCTION', 'POINT');
	};
};

//function onReturnMessage() {adapter.onReturnMessage($v('P1_ZOOM'));};

//moved from apexadapter
function onReturnMessage() {
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

function onErrorMessage() {adapter.onErrorMessage();};
