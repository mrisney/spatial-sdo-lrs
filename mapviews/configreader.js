function configReader(url){ 
	// constructor

	// public member variables
	this.baseURL;
	this.resourcePath;
	this.dataSource;
	this.tileLayer2;
    this.vectorLayer1;
    this.vectorLayer2;
	this.markerImage;
	this.googleMapKey;
	this.mapCenterLat;
	this.mapCenterLon;
	this.mapZoom;
	this.mapSRID;
	
	// load indicator flag
	this.loaded; 

	// private member variables
 	var config = this;
 	var displayConfig = false;
	
	var xmlhttp = false;
		
	// running locally on IE5.5, IE6, IE7                                               ; 
	if(location.protocol == "file:"){
		if(!xmlhttp)try{ xmlhttp=new ActiveXObject("MSXML2.XMLHTTP"); }catch(e){xmlhttp=false;}
		if(!xmlhttp)try{ xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); }catch(e){xmlhttp=false;}
	};
	
	// IE7, Firefox, Safari, Opera...  
	if(!xmlhttp)try{ xmlhttp=new XMLHttpRequest(); }catch(e){xmlhttp=false;}

	// IE6 
	if(typeof ActiveXObject != "undefined"){
		if(!xmlhttp)try{ xmlhttp=new ActiveXObject("MSXML2.XMLHTTP"); }catch(e){xmlhttp=false;}
		if(!xmlhttp)try{ xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); }catch(e){xmlhttp=false;}
	}

	// IceBrowser 
	if(!xmlhttp)try{ xmlhttp=createRequest(); }catch(e){xmlhttp=false;}

		
		
	this.read = function() {	
		// handle error
		if(!xmlhttp)return alert("Your browser doesn't seem to support XMLHttpRequests.");
		
		//make sure open appears before onreadystatechange lest IE will encounter issues beyond the first request
		xmlhttp.open("GET", url, true);
		
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState != 4)return;
			if(!xmlhttp.status || xmlhttp.status == 200)
				//alert(xmlhttp.responseText);
				parseText(xmlhttp)
			else
				alert("Request failed!");
		};//onreadystatechange
		
		//xmlhttp.send(null);
		xmlhttp.send();
	}
	
	
	function parseText(xmlhttp){
		var text = xmlhttp.responseText
			
		try { // code for IE
			//alert('trying ActiveX...')
			var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML(text);
		}catch(error) { // code for Mozilla, Firefox, Opera, etc.
			try {
				//alert('trying DOM Parser...')
				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(text,"text/xml");
			}catch(error) {
				alert(error.message);
				return;
			}
		}
			
		parseXML(xmlDoc);
	} //end function
	
	
	function parseXML(xmlDoc){
		config.loaded = false;
		
		var docRoot = xmlDoc.documentElement		
		
		//check for undefined docRoot (bad XML)
		if(docRoot){
			var elements = docRoot.childNodes

			//elements loop 
			for (j = 0; j < elements.length; j++){
				if (elements[j].nodeType == 1){ //element node
				
					//alert('elements[' + j + ']=' + elements[j].nodeName + ' load=' + elements[j].getAttribute('load'))

					if (elements[j].getAttribute('load') == 'true'){
						var nodes = elements[j].childNodes	
		
						//nodes loop
						for(i = 0; i < nodes.length; i++){
							if (nodes[i].nodeType == 1){ //element node
					
								//alert(nodes[i].nodeName)
					
								switch(nodes[i].nodeName) {
									case 'default-location':
										//if (nodes[i].getAttribute('load') == 'true'){
											subNodes = nodes[i].childNodes;
											for (var j = 0; j < subNodes.length; j++) {
												if (subNodes[j].nodeType == 1){ //element node
												
													//alert(subNodes[j].nodeName)
												
													// set property values
													if (subNodes[j].nodeName == 'map-center-lat')	{config.mapCenterLat	= subNodes[j].childNodes[0].nodeValue;};
													if (subNodes[j].nodeName == 'map-center-lon')	{config.mapCenterLon	= subNodes[j].childNodes[0].nodeValue;};
													if (subNodes[j].nodeName == 'map-zoom')			{config.mapZoom			= Number(subNodes[j].childNodes[0].nodeValue);};
													if (subNodes[j].nodeName == 'map-srid')			{config.mapSRID			= Number(subNodes[j].childNodes[0].nodeValue);};
												}; //end if
											}; //end for
										//}; //end if
										break;
									default:
										// set property values
										if (nodes[i].nodeName == 'base-url')		{config.baseURL			= nodes[i].childNodes[0].nodeValue;};
										if (nodes[i].nodeName == 'resource-path')	{config.resourcePath	= nodes[i].childNodes[0].nodeValue;};
										if (nodes[i].nodeName == 'data-src')		{config.dataSource		= nodes[i].childNodes[0].nodeValue;};
										if (nodes[i].nodeName == 'tile-layer-2')	{config.tileLayer2   	= nodes[i].childNodes[0].nodeValue;};
										if (nodes[i].nodeName == 'vector-layer-1')	{config.vectorLayer1	= nodes[i].childNodes[0].nodeValue;};
										if (nodes[i].nodeName == 'vector-layer-2')	{config.vectorLayer2	= nodes[i].childNodes[0].nodeValue;};
										if (nodes[i].nodeName == 'marker-image')	{config.markerImage		= nodes[i].childNodes[0].nodeValue;};
										if (nodes[i].nodeName == 'google-map-key')	{config.googleMapKey	= nodes[i].childNodes[0].nodeValue;};
										break;
								} //end switch
								
							} //end if					
						} //end for
		
					} //end if
		
				} // end if
			} //end for
		
			config.loaded = true;
			
			//verify config
			if (displayConfig){
				var strVars  = 'Variable Values: \n\n';
				strVars += 'baseURL			= ' + config.baseURL		+ '\n';
				strVars += 'dataSource		= ' + config.dataSource		+ '\n';
				strVars += 'tileLayer2		= ' + config.tileLayer2		+ '\n';
				strVars += 'vectorLayer_1	= ' + config.vectorLayer1	+ '\n';
				strVars += 'vectorLayer_2	= ' + config.vectorLayer2	+ '\n';
				strVars += 'markerImage		= ' + config.markerImage	+ '\n';
				strVars += 'googleMapKey	= ' + config.googleMapKey	+ '\n';
				strVars += 'mapCenterLat	= ' + config.mapCenterLat	+ '\n';
				strVars += 'mapCenterLon	= ' + config.mapCenterLon	+ '\n';
				strVars += 'mapZoom			= ' + config.mapZoom		+ '\n';
				strVars += 'mapSRID			= ' + config.mapSRID		+ '\n';
				strVars += '\n';
		
				alert(strVars);
			}; //end if
			
		} else{
			alert('Error: Missing XML no root node')
		} //end if
		
		//dispatch event
		var event = document.createEvent('Event');
		event.initEvent('ixnMapConfigLoadedEvent', true, true);
		document.dispatchEvent(event);
		
	}; //end function
	
	
	function xmlToString(xml_node) {
        if (xml_node.xml)
            return xml_node.xml;
        else if (XMLSerializer) {
            var xml_serializer = new XMLSerializer();
            return xml_serializer.serializeToString(xml_node);
        } else {
            alert("ERROR: Extremely old browser");
            return "";
        }
    }
	
	
	function stringToBoolean(string){
		switch(string.toLowerCase()){
			case "true": case "yes": case "1": return true;
			case "false": case "no": case "0": case null: return false;
			default: return Boolean(string);
		}
	} //end function

	
}; //end configReader	

