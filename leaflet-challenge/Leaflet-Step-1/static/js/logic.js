// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    console.log(data.features);
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


//---LEGEND---//
//color function for legend and map
function getColor(d) {
	return d > 5 ? '#ef5c16' :
	       d > 4  ? '#ef8016' :
	       d > 3  ? '#efca16' :
	       d > 2  ? '#efe816' :
	       d > 1  ? '#c3ef59' :
	                 '#9ccf16';
}



// Add legend information
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	  var div = L.DomUtil.create('div', 'info legend'),
		  mags = [0, 1, 2, 3, 4, 5],
		  labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
 	  for (var i = 0; i < mags.length; i++) 
    {
 		  div.innerHTML +=
 			  '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
 			  mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
 	  }
 	return div;
};




function createFeatures(earthquakeData){

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  var earthquakes = L.geoJSON(earthquakeData,{
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 4,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        fillOpacity: 0.9})
   
    // Create marker popup:  magnitude, date/time & location
        .bindPopup("<h3>"+feature.properties.place +"</h3><hr><p>"
      + new Date(feature.properties.time)+"</p><p><strong>Magnitude: "
      + feature.properties.mag+"</strong></p>");
  }   
});

  // Sending our earthquakes layer to the createMap function   *****LINE 32 ADDED ";"
  createMap(earthquakes);
}





function createMap(earthquakes) {

  // Define grayscale and darkmap layers
  var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "GrayScale Map": graymap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -115.71],
    zoom: 5,
    layers: [graymap,earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps,overlayMaps, {
    collapsed: false
  }).addTo(myMap);

 legend.addTo(myMap);
}