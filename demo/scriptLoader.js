var script;

function loadScript(path, url, fn){
    script = document.createElement("script")
    script.type = "text/javascript";
    script.src = path + url;
	document.getElementsByTagName("head")[0].appendChild(script);

	// Runs the function fn IF you intend to do something after loading the script
	// Obviously you can use this to load the scripts one after the other, but we don't need this
	if (fn !== undefined) {
		// For IE compatibility
		script.onreadystatechange = function () {
			/*	You get either one of these based on version of IE.
				But you don't get both

				Read "http://www.phpied.com/javascript-include-ready-onload/"
				and "http://unixpapa.com/js/dyna.html" for more information
			*/
			if (script.readyState == "complete") {
				fn();
			} else if (script.readyState == "loaded") {
				fn();
			}
		}

		script.onload = function() {fn();};
	}

	console.log("Loaded: " + url);
}