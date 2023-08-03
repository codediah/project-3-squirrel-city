let myMap = L.map("map", {
  center: [40.7826, -73.9656],
  zoom: 14,
});

// Add the tile layer to the map (using OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(myMap);

const polygonApiUrl = "https://data.cityofnewyork.us/resource/qad5-y26n.json?$query=SELECT%20%60the_geom%60%2C%20%60id%60%2C%20%60xmin%60%2C%20%60xmax%60%2C%20%60ymin%60%2C%20%60ymax%60";

const apiUrl = "https://data.cityofnewyork.us/resource/vfnx-vebw.json?$query=SELECT%0A%20%20%60x%60%2C%0A%20%20%60y%60%2C%0A%20%20%60unique_squirrel_id%60%2C%0A%20%20%60hectare%60%2C%0A%20%20%60shift%60%2C%0A%20%20%60date%60%2C%0A%20%20%60hectare_squirrel_number%60%2C%0A%20%20%60age%60%2C%0A%20%20%60primary_fur_color%60%2C%0A%20%20%60highlight_fur_color%60%2C%0A%20%20%60combination_of_primary_and%60%2C%0A%20%20%60color_notes%60%2C%0A%20%20%60location%60%2C%0A%20%20%60above_ground_sighter%60%2C%0A%20%20%60specific_location%60%2C%0A%20%20%60running%60%2C%0A%20%20%60chasing%60%2C%0A%20%20%60climbing%60%2C%0A%20%20%60eating%60%2C%0A%20%20%60foraging%60%2C%0A%20%20%60other_activities%60%2C%0A%20%20%60kuks%60%2C%0A%20%20%60quaas%60%2C%0A%20%20%60moans%60%2C%0A%20%20%60tail_flags%60%2C%0A%20%20%60tail_twitches%60%2C%0A%20%20%60approaches%60%2C%0A%20%20%60indifferent%60%2C%0A%20%20%60runs_from%60%2C%0A%20%20%60other_interactions%60%2C%0A%20%20%60geocoded_column%60%2C%0A%20%20%60%3A%40computed_region_efsh_h5xi%60%2C%0A%20%20%60%3A%40computed_region_f5dn_yrer%60%2C%0A%20%20%60%3A%40computed_region_yeji_bk3q%60%2C%0A%20%20%60%3A%40computed_region_92fq_4b7q%60%2C%0A%20%20%60%3A%40computed_region_sbqj_enih%60";

 fetch(apiUrl)
   .then(response => response.json())
   .then(data => {
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(myMap);

     data.forEach(item => {
       const marker = L.marker([item.y, item.x]).addTo(myMap);
       marker.bindPopup(`Unique ID: ${item.unique_squirrel_id}`);
     });
   })

  fetch(polygonApiUrl)
  .then(response => response.json())
  .then(data => {
    // Assuming data is an array of objects, each containing "the_geom" property with coordinates
    data.forEach(item => {
      const coordinates = item.the_geom.coordinates[0][0];
      // Convert coordinates to LatLng format
      const latLngCoordinates = coordinates.map(coord => [coord[1], coord[0]]);
      // Create the Leaflet MultiPolygon layer
      const multiPolygonLayer = L.polygon(latLngCoordinates).addTo(myMap);
    });
  })

  // d3.json(polygonApiUrl).then(function(data) {
  //   // Loop through each feature (in this case, a neighborhood)
  //   data.features.forEach(feature => {
  //     const coordinates = item.the_geom.coordinates[0][0];
  //     // Convert coordinates to LatLng format
  //     const latLngCoordinates = coordinates.map(coord => [coord[1], coord[0]]);
  //     // Create the Leaflet MultiPolygon layer
  //     const multiPolygonLayer = L.polygon(latLngCoordinates, {
  //       color: "white",
  //       fillColor: chooseColor(green),
  //       fillOpacity: 0.5,
  //       weight: 1.5
  //     }).addTo(myMap);
  
  //     // Add mouseover event to the layer
  //     multiPolygonLayer.on({
  //       mouseover: function(event) {
  //         const layer = event.target;
  //         layer.setStyle({
  //           fillOpacity: 0.9
  //         });
  //       },
  //       mouseout: function(event) {
  //         const layer = event.target;
  //         layer.setStyle({
  //           fillOpacity: 0.5
  //         });
  //       },
  //       click: function(event) {
  //         myMap.fitBounds(event.target.getBounds());
  //       }
  //     });
  
  //     // Add a popup with information that's relevant to each feature
  //     multiPolygonLayer.bindPopup("<h1>" + test + "</h1> <hr> <h2>" + test + "</h2>");
  //   });
  // });