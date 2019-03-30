function mapViewerClass(targetDiv, config, args) {
    //constructor

    //set resource path
    OM.gv.setResourcePath(config.resourcePath); //css, images (o_loading.gif)

    //public functions
    this.onMapHomeClick = function (args) {
        onMapHomeClick(args);
    }
    this.onMapSelectClick = function () {
        onMapSelectClick();
    }
    this.onMapClearClick = function () {
        onMapClearClick();
    }
    this.onMapAddClick = function () {
        onMapAddClick();
    }
    this.onMapMergeClick = function () {
        onMapMergeClick();
    };
    this.onMapMoveClick = function () {
        onMapMoveClick();
    };
    this.onMapDeleteClick = function () {
        onMapDeleteClick();
    };
    this.setMapCenter = function (mapCenterLon, mapCenterLat, mapZoom) {
        setMapCenter(mapCenterLon, mapCenterLat, mapZoom);
    };
    this.refreshMap = function (mapLayer) {
        refreshMap(mapLayer);
    };
    this.setLayersVisible = function (isVisible) {
        setLayersVisible(isVisible);
    };

    //public variables
    this.mapCenter;
    this.mapZoom;

    //private variables
    var properties = this;
    var id_list = ''; //comma delimited list of selected intersection ids
    var rectangle_center_x = 0;
    var rectangle_center_y = 0;
    var lastFunction = null; //global variable for selected add function
    var lastIntersection = null; //global variable for selected intersection

    //objects
    var rectangleTool = null;
    var point1 = null;
    var line1 = null;
    var toolbar = null;
    var lineGeometry = null;


    //blue marker style (intersection)
    var markerStyle = new OM.style.Marker({
        width: 30,
        height: 30,
        src: config.markerImage
    });

    var markerStyle2 = new OM.style.Marker({
        width: 30,
        height: 30,
        src: config.markerImage2
    });

    //blue line style (leg)
    var lineStyle = new OM.style.Line({
        stroke: "#025DFF",
        strokeThickness: 6
    });

    //initialize map marker layer
    var markerLayer = new OM.layer.MarkerLayer("markerlayer1");
    var mm = new OM.MapMarker();
    markerLayer.addMapMarker(mm);


    //Oracle Map V2 API (HTML5)
    var map = new OM.Map(targetDiv, {
            mapviewerURL: config.baseURL
        } //end options
    ); //end map


    var afterRefresh = function () {
        map.deleteListener(OM.event.MapEvent.MAP_AFTER_REFRESH, afterRefresh);
        addDTLs();
    };
    map.addListener(OM.event.MapEvent.MAP_AFTER_REFRESH, afterRefresh);

    // Oracle Maps HTML5 Javascript API Reference:
    // "OM.layer.GoogleTileLayer defines a map tile layer that displays Google Maps using Google Maps Javascript API V3."
    // (* uses lat/lon for inputs [EPSG:8307] but returns spherical mercator [EPSG:3857])
    var tileLayer1 = new OM.layer.GoogleTileLayer("baseMap1", {
            key: config.googleMapKey,
            mapTypeList: "OM.layer.GoogleTileLayer.TYPE_ROAD;OM.layer.GoogleTileLayer.TYPE_SATELLITE",
            mapTypeVisible: true
        } //end options
    ); //end tilelayer

    //State boundary overlay
    var tileLayer2 = new OM.layer.TileLayer("baseMap2", {
            dataSource: config.dataSource,
            tileLayer: config.tileLayer2
        } //end options
    ); //end tilelayer

    //Intersections point layer
    var vectorlayer1 = new OM.layer.VectorLayer("vectorLayer1", {
            def: {
                type: OM.layer.VectorLayer.TYPE_PREDEFINED,
                url: config.baseURL,
                dataSource: config.dataSource,
                theme: config.vectorLayer1,
                loadOnDemand: true
            } // end def
        } //end options
    ); //end vectorlayer

    //Intersection legs polygon layer
    var vectorlayer2 = new OM.layer.VectorLayer("vectorLayer2", {
            def: {
                type: OM.layer.VectorLayer.TYPE_PREDEFINED,
                url: config.baseURL,
                dataSource: config.dataSource,
                theme: config.vectorLayer2,
                loadOnDemand: true
            } //end def
        } //end options
    ); //end vectorlayer


    //JDBC type
    /*
    	var vectorlayer3 = new OM.layer.VectorLayer("vectorLayer3", {
    		def: {
    			type			: OM.layer.VectorLayer.TYPE_JDBC,
    			url			: config.baseURL,
    			dataSource		: config.dataSource,
                            theme                   : config.vectorLayer3,
                            sql			: "select geometry from CRASH_LOCATIONS_EXTNDED_MV where ROUTE = 'ML43B'",
    			geometryColumn          : "geometry",
    			loadOnDemand            : true
    			}, //end def
    		} //end options
    	);  //end vectorlayer
      */

    //vectorlayer1.setLabelingStyle(vectorLabel);


    vectorlayer1.setZoomLevelRange(16, 19);
    vectorlayer2.setZoomLevelRange(16, 19);
    //   vectorlayer3.setZoomLevelRange(1, 19);

    vectorlayer1.setLabelsVisible(true);
    vectorlayer1.setSelectStyle(markerStyle);
    //vectorlayer3.setSelectStyle(markerStyle2);

    map.addLayer(tileLayer1); // google tiles
    map.addLayer(tileLayer2); // mapviewer tiles
    map.addLayer(vectorlayer2); // mapviewer vectors (intersection legs)
    map.addLayer(vectorlayer1); // mapviewer vectors (intersection markers)
    //map.addLayer(vectorlayer3) ; // mapviewer vectors (intersection markers)

    var nav = new OM.control.NavigationPanelBar({
        orientation: 1,
        style: 2,
        anchorPosition: 1
    });
    nav.setZoomLevelInfoTips({
        3: '3',
        6: '6',
        9: '9',
        12: '12',
        15: '15',
        18: '18'
    });

    map.addMapDecoration(nav);

    map.addListener(OM.event.MapEvent.MAP_RECENTERED, onMapRecentered);
    map.addListener(OM.event.MapEvent.MAP_AFTER_ZOOM, onMapRecentered);

    var x = config.mapCenterLon;
    var y = config.mapCenterLat;
    var z = config.mapZoom;

    if (args) {
        x = args.x;
        y = args.y;
        z = args.z;
    }

    map.setMapCenterAndZoomLevel(new OM.geometry.Point(x, y, config.mapSRID), z, true);

    //onMapHomeClick(args)

    addSelectedButtons();
    map.init();

    var event = document.createEvent('Event');
    event.initEvent('mapLoadedEvent', true, true);
    document.dispatchEvent(event);


    //PRIVATE METHODS
    function addSelectedButtons() {
        if (toolbar) {
            //map.removeToolbar(toolbar);
        }

        toolbar = new OM.control.ToolBar(
            "toolbar1", {
                builtInButtons: [
				//OM.control.ToolBar.BUILTIN_CIRCLE,
				//OM.control.ToolBar.BUILTIN_RECTANGLE,
				//OM.control.ToolBar.BUILTIN_REDLINE,
				OM.control.ToolBar.BUILTIN_DISTANCE,
				OM.control.ToolBar.BUILTIN_MARQUEE_ZOOM
			]
            }
        );

        toolbar.setPosition(0.45, 0.05);
        map.addToolBar(toolbar);
    } //end function


    //set all properties after a map marker is added, srid is default (8307)
    var insertMapMarker1 = function (id, cx, cy, label, draggable) {
        //var mm = new OM.MapMarker();
        //layer.addMapMarker(mm);   // add a map marker into marker layer
        mm.setPosition(cx, cy);
        mm.setLabel(label); // it will also set the marker text.
        mm.setID(id);
        mm.setDraggable(draggable);
        mm.setDragEndListener(dragEnd);
    };


    /*
    //an obj with all properties to instantiate a map marker
    var insertMapMarker3 = function(id, cx, cy, srid, label, draggable) {
    	var myobj = {
    		'id'		: id,
    		'label'		: label,
    		'draggable'	: draggable,
    		'dragEnd'	: dragEnd,
    		'position'	: {'x': cx, 'y': cy,'srid': srid}
    	};
    	var mm = new OM.MapMarker(myobj);
    	layer.addMapMarker(mm);   // add a map marker into marker layer
    };
    */


    var dragEnd = function (evt) {
        var point_xy = new OM.geometry.Point(evt.markerX, evt.markerY, 3857); //coordinates returned in SRID 3857 (google)
        var point_x = point_xy.getX();
        var point_y = point_xy.getY();

        var point_lonlat = point_xy.transform(config.mapSRID) //transform coordinates to SRID 8307 (lon/lat)
        var point_lon = point_lonlat.getX();
        var point_lat = point_lonlat.getY();

        //display coordinates
        var msg = '';
        msg += "marker coordinates (x, y) = (" + evt.markerX.toFixed(4) + ", " + evt.markerY.toFixed(4) + ")." + '\n';
        msg += "google coordinates (x, y) = (" + point_x + ", " + point_y + ")." + '\n';
        msg += "lon/lat coordinates (lon, lat) = (" + point_lon + ", " + point_lat + ")." + '\n';
        //alert(msg)

        map.removeLayer(markerLayer);
        disableMapFunctions();

        var args = {
            'id': id_list,
            'lon': point_lon,
            'lat': point_lat
        }

        //dispatch custom event
        var event = new CustomEvent('moveIntersectionEvent', {
            detail: args
        });
        document.dispatchEvent(event);
    };






    //MAP EVENTS

    function onMapRecentered() {
        //alert('onMapRecentered()');

        properties.mapCenter = map.getMapCenter(); //centerpoint returned in SRID 3857 (Google)
        properties.mapZoom = map.getMapZoomLevel();

        //var mapCenterPointGoogle = map.getMapCenter()  //centerpoint returned in SRID 3857 (Google)
        //var mapCenterPointLatLon = mapCenterPointGoogle.transform(config.mapSRID)  //transform centerpoint to SRID 8307 (lat/lon)

        //display coordinates
        //var msg = '';
        //msg += 'google = ' + mapCenterPointGoogle.getX() + ', ' + mapCenterPointGoogle.getY() + '\n'
        //msg += 'lon/lat = ' + mapCenterPointLatLon.getX() + ', ' + mapCenterPointLatLon.getY()
        //alert(msg);

        var event = document.createEvent('Event');
        event.initEvent('mapRecenteredEvent', true, true);
        document.dispatchEvent(event);

    } //end function



    function addRectangleFilter() {
        //alert('addRectangleFilter(' + page +')');

        //remove existing
        if (rectangleTool) {
            removeRectangleFilter();
        }

        rectangleTool = new OM.tool.RectangleTool(map);

        //standard listener
        rectangleTool.on(OM.event.ToolEvent.TOOL_END, rectangleEndAction);

        //custom function to append parameters
        //OM.event.ToolEvent.prototype.customFunction = function() {
        //	rectangleEndAction(page)
        //}

        //rectangleTool.on(OM.event.ToolEvent.TOOL_END, function(event){
        //	event.customFunction();
        //});


        rectangleTool.start();
    } //end function


    function rectangleEndAction() {
        lastFunction = null;
        lastIntersection = null;

        //var lineGeometry = null;

        //3857
        var rectangle_xy = rectangleTool.getGeometry(); //SRID 3857 (google)
        rectangle_center_x = rectangle_xy.getCenter().getX();
        rectangle_center_y = rectangle_xy.getCenter().getY();

        parseObject(rectangle_xy) //display geometry object in console window
            //alert(config.mapSRID)

        //8307
        var rectangle_latlon = rectangle_xy.transform(config.mapSRID) //SRID 8307 (lon/lat)
        var rectangle_center_lon = rectangle_latlon.getCenter().getX();
        var rectangle_center_lat = rectangle_latlon.getCenter().getY();

        var rectangle_height = rectangle_latlon.getHeight();
        var rectangle_width = rectangle_latlon.getWidth();

        var rectangle_min_x = rectangle_latlon.getMinX();
        var rectangle_max_x = rectangle_latlon.getMaxX();
        var rectangle_min_y = rectangle_latlon.getMinY();
        var rectangle_max_y = rectangle_latlon.getMaxY();

        //alert('loadOnDemand (before filter) = ' + vectorlayer1.loadOnDemand) //true

        var filter0 = new OM.filter.InsidePolygon(rectangle_xy);
        vectorlayer1.selectFeatureByFilter(filter0);

        //alert('loadOnDemand = (after filter) ' + vectorlayer1.loadOnDemand) //false

        vectorlayer1.loadOnDemand = true; //explicitly reset property

        var ixns_selected = vectorlayer1.getSelectedFeatures();
        //alert('ixns_selected = ' + ixns_selected.length)

        if (ixns_selected.length < 1) {
            //no intersections selected (add new intersection)

            point1 = new OM.tool.RedlineTool(map, OM.tool.RedlineTool.TYPE_POINT)
            point1.setStyle({
                type: OM.tool.RedlineTool.TYPE_POINT,
                style: markerStyle
            });

            point1.start();
            point1.addVertex(0, new OM.geometry.Point(rectangle_center_lon, rectangle_center_lat, config.mapSRID));

            lastFunction = 'add'
            enableMapFunctions(['add']);

        } else {
            //one or more intersection(s) selected

            //build list of selected intersection id's
            id_list = '';
            for (var n = 0; n < ixns_selected.length; n++) {
                if (n > 0) {
                    id_list += ', '
                };

                //check for null attribute
                if (ixns_selected[n].getAttributeValue('INTERSECTION_ID')) {
                    id_list += ixns_selected[n].getAttributeValue('INTERSECTION_ID'); //itis-db3 & JDBC vectorLayer type
                } else if (ixns_selected[n].getAttributeValue('ID')) {
                    id_list += ixns_selected[n].getAttributeValue('ID') //itis-db4
                }

            }; //end for

            if (ixns_selected.length < 2) {
                //single intersection selected

                var intersection = ixns_selected[0].getGeometry();
                //alert(intersection.getSRID())
                intersection = intersection.transform(config.mapSRID);
                //alert(intersection.getSRID())

                lastIntersection = intersection; //set global variable

                //var intersection_x = intersection.getX();
                //var intersection_y = intersection.getY();

                var intersection_lon = intersection.getX();
                var intersection_lat = intersection.getY();



                var distance; //distance from rectangle boundary as percent
                var distanceThreshold = 25; //percent value to determine if rectangle selection is a leg
                var legOffset = 0; //distance from intersection center to leg begin
                //				var legOffset 			= .00007;	//distance from intersection center to leg begin
                var legLength = .0005; //length of leg
                var legHorizontalAdjust = 1.41; //horizontal leg adjustment factor (length of 1 degree lat / length of 1 degree lon e.g. 364604/258683)

                if (rectangle_height > rectangle_width) {
                    //alert('vertical box');

                    var max_y_dif = rectangle_max_y - intersection_lat; //distance from top
                    var min_y_dif = intersection_lat - rectangle_min_y; //distance from bottom

                    if (max_y_dif < min_y_dif) {
                        //alert('intersection at top')

                        distance = (max_y_dif / rectangle_height) * 100; //distance from top of rectangle as percent

                        //variable leg length (rectangle limit)
                        //var pointA =  new OM.geometry.Point(rectangle_min_x + rectangle_width / 2, intersection_lat - legOffset, config.mapSRID); //top left
                        //var pointB =  new OM.geometry.Point(rectangle_min_x + rectangle_width / 2, rectangle_min_y, config.mapSRID); //bottom left

                        //fixed leg length
                        var pointA = new OM.geometry.Point(rectangle_min_x + rectangle_width / 2, intersection_lat - legOffset, config.mapSRID); //top left
                        var pointB = new OM.geometry.Point(rectangle_min_x + rectangle_width / 2, intersection_lat - legLength, config.mapSRID); //bottom left

                    } else {
                        //alert('intersection at bottom')

                        distance = (min_y_dif / rectangle_height) * 100; //distance from bottom of rectangle as percent

                        //variable leg length (rectangle limit)
                        //var pointA =  new OM.geometry.Point(rectangle_min_x + rectangle_width / 2, rectangle_max_y, config.mapSRID); //top left
                        //var pointB =  new OM.geometry.Point(rectangle_min_x + rectangle_width / 2, intersection_lat + legOffset, config.mapSRID); //bottom left

                        //fixed leg length
                        var pointA = new OM.geometry.Point(rectangle_min_x + rectangle_width / 2, intersection_lat + legLength, config.mapSRID); //top left
                        var pointB = new OM.geometry.Point(rectangle_min_x + rectangle_width / 2, intersection_lat + legOffset, config.mapSRID); //bottom left

                    }; //end if

                } else {
                    //alert('horizontal box');

                    var min_x_dif = intersection_lon - rectangle_min_x; //distance from left
                    var max_x_dif = rectangle_max_x - intersection_lon; //distance from right

                    if (max_x_dif > min_x_dif) {
                        //alert('intersection at left')

                        distance = (min_x_dif / rectangle_width) * 100; //distance from left of rectangle as percent

                        //variable leg length (rectangle limit)
                        //var pointA =  new OM.geometry.Point(intersection_lon - legOffset, rectangle_min_y + rectangle_height / 2, config.mapSRID); //top left
                        //var pointB =  new OM.geometry.Point(rectangle_max_x, rectangle_min_y + rectangle_height / 2, config.mapSRID); //top right

                        //fixed leg length
                        var pointA = new OM.geometry.Point(intersection_lon - legOffset, rectangle_min_y + rectangle_height / 2, config.mapSRID); //top left
                        var pointB = new OM.geometry.Point(intersection_lon + legLength * legHorizontalAdjust, rectangle_min_y + rectangle_height / 2, config.mapSRID); //top right

                    } else {
                        //alert('intersection at right')
                        distance = (max_x_dif / rectangle_width) * 100; //distance from right of rectangle as percent

                        //variable leg length (rectangle limit)
                        //var pointA =  new OM.geometry.Point(rectangle_min_x, rectangle_min_y + rectangle_height / 2, config.mapSRID); //top left
                        //var pointB =  new OM.geometry.Point(intersection_lon + legOffset, rectangle_min_y + rectangle_height / 2, config.mapSRID); //top right

                        //fixed leg length
                        var pointA = new OM.geometry.Point(intersection_lon - legLength * legHorizontalAdjust, rectangle_min_y + rectangle_height / 2, config.mapSRID); //top left
                        var pointB = new OM.geometry.Point(intersection_lon + legOffset, rectangle_min_y + rectangle_height / 2, config.mapSRID); //top right

                    }; //end if

                }; //end if


                if (distance < distanceThreshold) {
                    //draw line (rectangle select)

                    vectorlayer1.deselectFeature(ixns_selected[0]);

                    //define line
                    line1 = new OM.tool.RedlineTool(map, OM.tool.RedlineTool.TYPE_LINESTRING)
                    line1.setStyle({
                        type: OM.tool.RedlineTool.TYPE_LINESTRING,
                        style: lineStyle
                    });
                    line1.addListener(OM.event.ToolEvent.REDLINE_EDITED, onRedLineEdited);
                    line1.start();

                    //draw line
                    line1.addVertex(0, pointA);
                    line1.addVertex(1, pointB);
                    line1.finish();


                    //var geom = line1.getGeometry();
                    //var ords = geom.getOrdinates();
                    //var geoString = ords.toString();

                    //alert('geom = ' + geom)
                    //alert('ords = ' + ords)
                    //alert('geostring = ' + geoString)

                    //lineGeometry = geoString;

                    onRedLineEdited();

                    rectangleTool.clear();

                    lastFunction = 'leg';
                    enableMapFunctions(['add']);

                } else {
                    //single intersection selected (square select)
                    enableMapFunctions(['merge', 'move', 'delete']);
                }; //end if

            } else if (ixns_selected.length < 4) {
                //two or three intersections selected
                enableMapFunctions(['merge']);
            };

        }; //end if

        //clean up
        filter1 = null;

    } //end function


    function onRedLineEdited() {
        var geom = line1.getGeometry();
        var ords = geom.getOrdinates();
        var geoString = ords.toString();

        var msg = ''
        msg += 'geom = ' + geom + '\n'
        msg += 'ords = ' + ords + '\n'
        msg += 'geostring = ' + geoString + '\n'
            //alert(msg)

        lineGeometry = geoString;
    } //end function


    function removeRectangleFilter() {
        //alert('removeRectangleFilter()');
        if (!rectangleTool) return;
        rectangleTool.deleteListener(OM.event.ToolEvent.TOOL_END, rectangleEndAction);
        rectangleTool.clear();
        rectangleTool = null;
        vectorlayer1.clearSelectedFeatures()

        //clear line features from map
        line1 && line1.clear();

        //clear point features from map
        point1 && point1.clear();

        //remove objects
        point1 = null;

        //clear line features from map
        line1 && line1.clear();

    }; //end function

    /*    function enableMapFunctions(functions=[]) {
    		var event = new CustomEvent('enableMapFunctionsEvent', {detail: functions});
    		document.dispatchEvent(event);
        }; //end function
    */

    function enableMapFunctions() {
        var event = new CustomEvent('enableMapFunctionsEvent', {
            detail: functions
        });
        document.dispatchEvent(event);
    }; //end function


    function disableMapFunctions() {
        var event = document.createEvent('Event');
        event.initEvent('disableMapFunctionsEvent', true, true);
        document.dispatchEvent(event);
    }; //end function




    // MAP FUNCTIONS


    /*
    function onMapUpdate(){
      alert('onMapUpdate()');
        removeRectangleFilter();
        disableMapFunctions();
    }; //end function
	*/




    //private functions
    function onMapHomeClick(args) {

        if (rectangleTool) {

            //alert((id_list.match(/,/g) || []).length);
            //alert((id_list.match(new RegExp(",", "g")) || []).length);

            //match regex comma count to determine if multiple intersections are selected
            if ((id_list.match(/,/g) || []).length === 0) {
                removeRectangleFilter();
                disableMapFunctions();

                var args = {
                    'id': id_list
                }

                //dispatch custom event
                var event = new CustomEvent('intersectionShortcutEvent', {
                    detail: args
                });
                document.dispatchEvent(event);
            } //end if

        } //end if


        var x = config.mapCenterLon;
        var y = config.mapCenterLat;
        var z = config.mapZoom;

        if (args) {
            x = args.x;
            y = args.y;
            z = args.z;
        }

        map.setMapCenterAndZoomLevel(new OM.geometry.Point(x, y, config.mapSRID), z, true);

        //disableMapFunctions();

    }; //end function


    function onMapSelectClick() {
        disableMapFunctions();
        enableMapFunctions(['clear']);
        addRectangleFilter();
    }; //end function


    function onMapClearClick() {
        removeRectangleFilter();
        map.removeLayer(markerLayer);
        disableMapFunctions();
    }; //end function


    function onMapAddClick() {
        removeRectangleFilter();
        disableMapFunctions();

        switch (lastFunction) {
            case 'add':
                var args = {
                    'rectangleCenterX': rectangle_center_x.toString(10),
                    'rectangleCenterY': rectangle_center_y.toString(10),
                    'lastFunction': 'ADD'
                }

                //dispatch custom event
                var event = new CustomEvent('addIntersectionEvent', {
                    detail: args
                });
                document.dispatchEvent(event);
                break;
            case 'leg':
                var args = {
                    'id': id_list,
                    'lineGeometry': lineGeometry,
                    'lastFunction': 'LEG'
                }

                //dispatch custom event
                var event = new CustomEvent('addIntersectionLegEvent', {
                    detail: args
                });
                document.dispatchEvent(event);
                break;
        }; //end switch

    }; //end function


    function onMapMergeClick() {
        removeRectangleFilter();
        disableMapFunctions();

        var args = {
            'ids': id_list
        }

        //dispatch custom event
        var event = new CustomEvent('mergeIntersectionsEvent', {
            detail: args
        });
        document.dispatchEvent(event);
    }; //end function


    function onMapMoveClick() {
        removeRectangleFilter();

        disableMapFunctions();
        enableMapFunctions(['clear']);

        var lon = lastIntersection.getX();
        var lat = lastIntersection.getY();

        insertMapMarker1('m1', lon, lat, '', true);

        map.addLayer(markerLayer)
    }; //end function


    function onMapDeleteClick() {
        var reply = confirm('Delete?');
        if (reply) {
            removeRectangleFilter();
            disableMapFunctions();

            var args = {
                'id': id_list
            }

            //dispatch custom event
            var event = new CustomEvent('deleteIntersectionEvent', {
                detail: args
            });
            document.dispatchEvent(event);
        }; //end if
    }; //end function


    function setMapCenter(pMapCenterLon, pMapCenterLat, pMapZoom) {
        map.setMapCenterAndZoomLevel(new OM.geometry.Point(pMapCenterLon, pMapCenterLat, config.mapSRID), pMapZoom, true);
    } //end function


    function refreshMap(pMapLayer) {
        switch (pMapLayer) {
            case 'intersections':
                vectorlayer1.refresh();
                break;
            case 'legs':
                vectorlayer2.refresh();
                break;
            default:
                map.refreshMap();
        }; //end switch
    } //end function


    function setLayersVisible(isVisible) {
        switch (isVisible) {
            case true:
                tileLayer2.setVisible(true)
                vectorlayer1.setVisible(true);
                vectorlayer2.setVisible(true);
                break;
            default:
                tileLayer2.setVisible(false)
                vectorlayer1.setVisible(false);
                vectorlayer2.setVisible(false);
                break;
        }; //end switch
    }; //end function


    //diagnostics
    function parseObject(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                //alert(key + " -> " + obj[key]);
                console.log(key + " -> " + obj[key]);
            }
        } // end for
    } // end function


    function addDTLs() {
        // step 0: create universe, config, and dtl needed properties
        var myuniv = map.getMapContext().getUniverse();
        var myconfig = new OM.layer.TileLayerConfig({
            tileImageWidth: 256,
            tileImageHeight: 256,
        });

        var dtl_props = { // those are dtl specific
            //dataSource:"MVDEMO", // if not provided, it comes from ServerMapRequest;
            universe: myuniv,
            tileLayerConfig: myconfig,
            tileServerURL: "http://dev.itis-map.com/mapviewer/omserver",
            enableUTFGrid: true,
            enableUTFGridInfoWindow: true,
            utfGridResolution: 4
        };
        //-------------------------------------------------
        // DTL1: states using jdbc theme
        // step 1: create styles and themes
        // step 1.1 create style
        var myc1 = new OM.style.Color({
            styleName: "mycolor1",
            stroke: "#333333",
            strokeOpacity: 1.0,
            fill: "#F2EFE9",
            fillOpacity: 0.5
        });
        /*
                //
                // step 2: create themes (jdbc theme)
                var jdbcTStates= new OM.server.ServerJDBCTheme('states');
                jdbcTStates.setDataSourceName(config.dataSource);
                jdbcTStates.setSRID('3857');
                jdbcTStates.setGeometryColumnName('geom');
              var sql='select totpop, poppsqmi, state, state_abrv, geom from mvdemo.states_3857_mv';
                jdbcTStates.setQuery(sql);
                jdbcTStates.addInfoColumn({column: 'state_abrv', name:'State'});
                jdbcTStates.addInfoColumn({column: 'totpop', name:'Population'});
                jdbcTStates.addInfoColumn({column: 'poppsqmi', name:'Pop. Density'});
                jdbcTStates.setRenderingStyleName('mycolor1');

                var req = new OM.server.ServerMapRequest(config.baseURL);
                req.setProperties({
                    dataSource:config.dataSource,
                    transparent:true,
                    antialiase:"false"
                });
                req.addTheme(jdbcTStates);
                req.addStyle(myc1);

                var layerStates = new OM.layer.DynamicTileLayer("layerStates", dtl_props, req);
                map.addLayer(layerStates);
        */

        var m1 = new OM.style.Marker({
            styleName: 'myCityCircle',
            width: 16, // circle's display width
            height: 16, // circle's display height
            lengthUnit: "pixel",
            vectorDef: [{
                shape: {
                    type: "circle",
                    cx: 0,
                    cy: 0
                },
                style: {
                    fill: "#FF0000",
                    fillOpacity: 0.3,
                    stroke: "#0000FF",
                    strokeOpacity: 0.8
                }
                }]
        });

        var jdbcCrashes = new OM.server.ServerJDBCTheme('theme_jdbc_crashes');
        jdbcCrashes.setDataSourceName(config.dataSource);
        jdbcCrashes.setSRID('3857');
        jdbcCrashes.setGeometryColumnName('geometry');
        //            var sql2="SELECT cl.geometry FROM (SELECT rdwy.*,crsh.intcrashid,crsh.decmilepost FROM ( SELECT route, from_mile, MIN(from_mile) from_rm, MAX(to_rm) to_rm, ABS(MIN(from_mile)-MAX(to_rm)) dist FROM ( SELECT route, from_rm, to_rm, from_mile FROM mapviews.roadway_tenths_mv WHERE (facility_type = 'RuFl2') ) GROUP BY route, from_mile) rdwy,(SELECT intcrashid,route,decmilepost FROM mapviews.crash_5_years_vw WHERE (tintcrashseverity < to_number('3'))) crsh WHERE rdwy.route = crsh.route AND crsh.decmilepost+.0001 BETWEEN rdwy.from_rm AND rdwy.to_rm) cr, mapviews.crash_locations_3857_mv CL WHERE cr.intcrashid=CL.intcrashid and cl.geometry is not null and rownum<100";
        var sql2 = "select geometry from mapviews.crash_locations_3857_mv where route='ML43B'";
        jdbcCrashes.setQuery(sql2);
        //jdbcCrashes.addInfoColumn({column: 'intcrashid', name:'Crash ID'});
        jdbcCrashes.setRenderingStyleName('myCityCircle');

        var req2 = new OM.server.ServerMapRequest(config.baseURL);
        req2.setProperties({
            dataSource: config.dataSource,
            transparent: true,
            antialiase: "false"
        });
        req2.addTheme(jdbcCrashes);
        req2.addStyle(m1);

        var dtl_props2 = { // those are dtl specific
            universe: myuniv,
            tileLayerConfig: myconfig,
            tileServerURL: "http://dev.itis-map.com/mapviewer/omserver",
            enableUTFGrid: true,
            enableUTFGridInfoWindow: false,
            utfGridResolution: 4
        }

        var layerjdbcCrashes = new OM.layer.DynamicTileLayer("layerjdbcCrashes", dtl_props2, req2);
        layerjdbcCrashes.setZoomLevelRange(6, 19);
        map.addLayer(layerjdbcCrashes);

    }




}; //end class

function mapViewQuery(obj) {
    alert("Hello World");
    //alert(String(obj));
}
