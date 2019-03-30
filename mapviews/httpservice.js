function HTTPService(){ 
	// constructor

	// public member variables
	this.url;
	this.result;
	
	// private member variables
	var properties = this;
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
		xmlhttp.open("GET", this.url, true);
		
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState != 4)return;
			if(!xmlhttp.status || xmlhttp.status == 200)
				//alert(xmlhttp.responseText);
				parseText(xmlhttp)
			else
				alert("Request failed!");
		}; //end onreadystatechange
		
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
			
		//alert(xmlToString(xmlDoc))
		properties.result = xmlDoc;
		
		var event = document.createEvent('Event');
		event.initEvent('result', true, true);
		document.dispatchEvent(event);
	} //end function
	
	// testing
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
    } //end function
	
}; //end class	

