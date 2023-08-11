const url = "https://data.cityofnewyork.us/resource/vfnx-vebw.json";
const polygonApiUrl = "https://data.cityofnewyork.us/resource/qad5-y26n.json?$query=SELECT%20%60the_geom%60%2C%20%60id%60%2C%20%60xmin%60%2C%20%60xmax%60%2C%20%60ymin%60%2C%20%60ymax%60";
const apiUrl = "https://data.cityofnewyork.us/resource/vfnx-vebw.json?$query=SELECT%0A%20%20%60x%60%2C%0A%20%20%60y%60%2C%0A%20%20%60unique_squirrel_id%60%2C%0A%20%20%60hectare%60%2C%0A%20%20%60shift%60%2C%0A%20%20%60date%60%2C%0A%20%20%60hectare_squirrel_number%60%2C%0A%20%20%60age%60%2C%0A%20%20%60primary_fur_color%60%2C%0A%20%20%60highlight_fur_color%60%2C%0A%20%20%60combination_of_primary_and%60%2C%0A%20%20%60color_notes%60%2C%0A%20%20%60location%60%2C%0A%20%20%60above_ground_sighter%60%2C%0A%20%20%60specific_location%60%2C%0A%20%20%60running%60%2C%0A%20%20%60chasing%60%2C%0A%20%20%60climbing%60%2C%0A%20%20%60eating%60%2C%0A%20%20%60foraging%60%2C%0A%20%20%60other_activities%60%2C%0A%20%20%60kuks%60%2C%0A%20%20%60quaas%60%2C%0A%20%20%60moans%60%2C%0A%20%20%60tail_flags%60%2C%0A%20%20%60tail_twitches%60%2C%0A%20%20%60approaches%60%2C%0A%20%20%60indifferent%60%2C%0A%20%20%60runs_from%60%2C%0A%20%20%60other_interactions%60%2C%0A%20%20%60geocoded_column%60%2C%0A%20%20%60%3A%40computed_region_efsh_h5xi%60%2C%0A%20%20%60%3A%40computed_region_f5dn_yrer%60%2C%0A%20%20%60%3A%40computed_region_yeji_bk3q%60%2C%0A%20%20%60%3A%40computed_region_92fq_4b7q%60%2C%0A%20%20%60%3A%40computed_region_sbqj_enih%60";
const dataPromise = d3.json(url);


dataPromise.then(function(data) {
  console.log("Metadata: ", data);
  
  const dropdown = $("#selDataset");
  data.forEach((row) => {
    dropdown.append($('<option>').text(row.unique_squirrel_id).val(row.unique_squirrel_id));
  });

  console.log("First Squirrel data: ", data[0]);
  updateDemographicInfo(data[0]);

  // Add an event listener to the dropdown element
    dropdown.on("change", function() {
    // Get the selected value from the dropdown
    let selectedID = (dropdown.val()); // Convert to integer
    console.log("Selected ID: ", selectedID);
  
    // Find the corresponding row based on the selected ID
    let selectedSample = data.find((Sample_row) => (Sample_row.unique_squirrel_id) === selectedID);
    console.log("Selected Squirrel: ", selectedSample);

    updateDemographicInfo(selectedSample);
    
  });

  function updateDemographicInfo(row) {
    // Select the table body
    let tbody = d3.select("tbody");
    tbody.html(""); // Clear any existing rows in the table body
  
    // Append new rows for each demographic information
    let idRow = tbody.append("tr");
    idRow.append("td").text(`ID: ${row.unique_squirrel_id}`);
  
    let colorRow = tbody.append("tr");
    colorRow.append("td").text(`Fur Color: ${row.primary_fur_color}`);
  
    let ageRow = tbody.append("tr");
    ageRow.append("td").text(`Age: ${row.age}`);
  
    let locationRow = tbody.append("tr");
    locationRow.append("td").text(`Location: ${row.location}`);
  
    let hectareRow = tbody.append("tr");
    hectareRow.append("td").text(`Hectare: ${row.hectare}`);
  
    let timeRow = tbody.append("tr");
    timeRow.append("td").text(`Time: ${row.shift}`);
  }
  

  let myMap = L.map("map", {
    center: [40.7826, -73.9656],
    zoom: 14,
  });
  
  apiUrl
  function updateHistographChart(Sample_row) {
    const trace = {
      x: Sample_row.otu_ids,
      y: Sample_row.sample_values,
      text: Sample_row.otu_labels,
      mode: 'markers',
      marker: {
        size: Sample_row.sample_values,
        color: Sample_row.otu_ids,
        colorscale: 'Viridis'
      }
    };
  
    const dataChart = [trace];
  
    const layout = {
      title: 'Bubble Chart of OTUs',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values' },
      showlegend: false,
      hovermode: 'closest'
    };
  
    Plotly.newPlot('histogram', dataChart, layout);
  }

  // Add the tile layer to the map (using OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(myMap);
  
  
  const markerClusterGroup = L.markerClusterGroup();
  const gridLayerGroup = L.layerGroup().addTo(myMap);
  
  function formatDate(dateString) {
    const day = dateString.substring(2, 4);
    const month = dateString.substring(0, 2);
    const year = dateString.substring(4, 8);
    return `${month}/${day}/${year}`;
  }
  

  
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(myMap);

    data.forEach(item => {
      const marker = L.marker([item.y, item.x]); // Create individual marker
      const formattedDate = formatDate(item.date);

      let popupContent = `Unique ID: ${item.unique_squirrel_id} <br>
        Date: ${formattedDate} <br>
        Observation period: ${item.shift} <br>
        Fur Colors: ${item.combination_of_primary_and} <br>
        Location: ${item.location} <br>
        Age: ${item.age} <br>
        `;

      if (item.specific_location) popupContent += `Specific location: ${item.specific_location} <br>`;
      if (item.chasing) popupContent += `Chasing Another Squirrel <br>`;
      if (item.running) popupContent += `Squirrel is running<br>`;
      if (item.climbing) popupContent += `Squirrel is climbing<br>`;
      if (item.eating) popupContent += `Squirrel is eating <br>`;
      if (item.foraging) popupContent += `Squirrel is foraging <br>`;
      if (item.kuks) popupContent += `Squirrel made a Kuks sound <br>`;
      if (item.quaas) popupContent += `Squirrel made a Quaas sound (ground predator nearby)<br>`;
      if (item.moans) popupContent += `Squirrel made a Moans sound (aerial predator nearby)<br>`;
      if (item.tail_flags) popupContent += `Tail Flagging <br>`;
      if (item.tail_twitches) popupContent += `Tail Twitching in curiosity <br>`;
      if (item.approaches) popupContent += `Approaching humans for food`;
      if (item.indifferent) popupContent += `Indifferent to humans<br>`;
      if (item.runs_from) popupContent += `Running from humans <br>`;
      if (item.other_activities || item.other_interactions) {
        popupContent += `Other Activity: ${item.other_activities || 'None'}, 
        ${item.other_interactions || 'None'} <br>`;
      }
      myMap.addLayer(markerClusterGroup)
      marker.bindPopup(popupContent);
      markerClusterGroup.addLayer(marker); // Add marker to the marker cluster group
    });

  });


  
  
  function generateGridNames() {
  const gridNames = [];
  const letters = "ABCDEFGHI";
  const maxNumber = 42;
  
  for (let i = maxNumber; i >= 1; i--) {
    for (let j = 0; j < letters.length; j++) {
      const gridName = letters[j] + i;
      gridNames.push(gridName);
    }
  }
  
  
    return gridNames;
  }
  
  // Call the function to generate grid names from A1 to I100
  const gridNames = generateGridNames();
  
  
    d3.json(polygonApiUrl).then((data) => {
      // Loop through each feature (in this case, a neighborhood)
      const labels = [];
      data.forEach((item, index) => {
        const coordinates = item.the_geom.coordinates[0][0];
        // Convert coordinates to LatLng format
        const latLngCoordinates = coordinates.map(coord => [coord[1], coord[0]]);
        // Create the Leaflet MultiPolygon layer
        const multiPolygonLayer = L.polygon(latLngCoordinates).addTo(myMap);
        
        const label = gridNames[index];
        multiPolygonLayer.bindPopup(`Hectare ID: ${label}`);
  
  
        multiPolygonLayer.on("mouseover", function (event) {
          const layer = event.target;
          // Update the style of the layer when mouseover event occurs
          layer.setStyle({
            fillOpacity: 0.9,
            // You can also add other styling changes here for mouseover
          });
          // const label = gridNames[index];
          // layer.bindPopup(`Hectare ID: ${label}`).openPopup();
          layer.openPopup();
  
        });
  
  
        multiPolygonLayer.on("mouseout", function (event) {
          const layer = event.target;
          // Reset the style of the layer when mouseout event occurs
          layer.setStyle({
            fillOpacity: 0.5,
            // You can reset other styling changes here for mouseout
          });
          layer.closePopup();
  
        });
  
        multiPolygonLayer.on("click", function (event) {
          const layer = event.target;
          // Zoom to the bounds of the clicked layer when click event occurs
          myMap.fitBounds(layer.getBounds());
          
        });
        gridLayerGroup.addLayer(multiPolygonLayer);
  
        // // Add a popup with information that's relevant to each feature
      });
      let link = "https://data.cityofnewyork.us/resource/8kvz-b7tv.json?$query=SELECT%0A%20%20%60the_geom%60%2C%0A%20%20%60gispropnum%60%2C%0A%20%20%60objectid%60%2C%0A%20%20%60department%60%2C%0A%20%20%60parentid%60%2C%0A%20%20%60communityb%60%2C%0A%20%20%60councildis%60%2C%0A%20%20%60precinct%60%2C%0A%20%20%60zipcode%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60name%60%2C%0A%20%20%60featuresta%60%0A%20%20%20WHERE%20%60department%60%20%3D%20'M-13'";
      const redPolygonLayerGroup = L.layerGroup().addTo(myMap);

      fetch(link)
      .then(response => response.json())
      .then(data => {
        data.forEach(item => {
          const coordinates = item.the_geom.coordinates[0][0];
          // Convert coordinates to LatLng format
          const latLngCoordinates = coordinates.map(coord => [coord[1], coord[0]]);
          // Create the Leaflet MultiPolygon layer for red polygons
          const multiPolygonLayer = L.polygon(latLngCoordinates, {
            color: "red",
            fillOpacity: 0.5,
            weight: 1.5
          });
          redPolygonLayerGroup.addLayer(multiPolygonLayer); // Add red polygon to the layer group
        });
      });
      const blackPolygonLayerGroup = L.layerGroup().addTo(myMap);
      
      const urlLink = "https://data.cityofnewyork.us/resource/qnem-b8re.json?$query=SELECT%0A%20%20%60accessible%60%2C%0A%20%20%60adult_baseball%60%2C%0A%20%20%60adult_football%60%2C%0A%20%20%60adult_softball%60%2C%0A%20%20%60basketball%60%2C%0A%20%20%60bocce%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60communityboard%60%2C%0A%20%20%60councildistrict%60%2C%0A%20%20%60cricket%60%2C%0A%20%20%60department%60%2C%0A%20%20%60dimensions%60%2C%0A%20%20%60featurestatus%60%2C%0A%20%20%60field_lighted%60%2C%0A%20%20%60field_number%60%2C%0A%20%20%60flagfootball%60%2C%0A%20%20%60frisbee%60%2C%0A%20%20%60gispropnum%60%2C%0A%20%20%60handball%60%2C%0A%20%20%60hockey%60%2C%0A%20%20%60kickball%60%2C%0A%20%20%60lacrosse%60%2C%0A%20%20%60ll_baseb_12andunder%60%2C%0A%20%20%60ll_baseb_13andolder%60%2C%0A%20%20%60ll_softball%60%2C%0A%20%20%60maintenanceagreement%60%2C%0A%20%20%60netball%60%2C%0A%20%20%60nonregulation_soccer%60%2C%0A%20%20%60precinct%60%2C%0A%20%20%60primary_sport%60%2C%0A%20%20%60pickleball%60%2C%0A%20%20%60regulation_soccer%60%2C%0A%20%20%60rugby%60%2C%0A%20%20%60starea%60%2C%0A%20%20%60stlength%60%2C%0A%20%20%60surface_type%60%2C%0A%20%20%60system%60%2C%0A%20%20%60tennis%60%2C%0A%20%20%60track_and_field%60%2C%0A%20%20%60t_ball%60%2C%0A%20%20%60volleyball%60%2C%0A%20%20%60wheelchairfootball%60%2C%0A%20%20%60youth_football%60%2C%0A%20%20%60zipcode%60%2C%0A%20%20%60multipolygon%60%0AWHERE%20caseless_eq(%60department%60%2C%20%22M-13%22)";
      fetch(urlLink)
      .then(response => response.json())
      .then(data => {

        data.forEach(item => {
          const multipolygonCoordinates = item.multipolygon.coordinates;
    
          // Convert coordinates to Leaflet LatLng format
          const latLngCoordinates = multipolygonCoordinates.map(layerCoords =>
            layerCoords[0].map(coord => [coord[1], coord[0]])
          );
    
          // Create the Leaflet MultiPolygon layer
          const multiPolygonLayer = L.polygon(latLngCoordinates, {
            color: "black", // Set the color of the multipolygon outline
            fillOpacity: 0.2, // Set the fill opacity of the multipolygon
            weight: 2 // Set the weight of the multipolygon outline
          });
          blackPolygonLayerGroup.addLayer(multiPolygonLayer); // Add multipolygon to the original layer group

        });
        
      });
     

d3.json(url).then(function(response) {
        
        
        let heatArray = [];
      
        for (let i = 0; i < response.length; i++) { // Use 'response.length' instead of 'features.length'
          let location = response[i].geocoded_column; // Fixed the variable name
          if (location) {
            heatArray.push([location.coordinates[1], location.coordinates[0]]);
          }
        }
      
        let heatLayer = L.heatLayer(heatArray, {
          radius: 20,
          blur: 35
        })
        let heatmapGroup = L.layerGroup([heatLayer]);
        const overlays = {
          "Heatmap": heatmapGroup,
          "Grids": gridLayerGroup,
          "Marker Clusters": markerClusterGroup,
          "Bodies of Water": redPolygonLayerGroup,
          "Facilities": blackPolygonLayerGroup,
        };
        L.control.layers(null, overlays).addTo(myMap);
      });
      
    });
   
    // Fetch data from the apiUrl
fetch(apiUrl)
.then(response => response.json())
.then(data => {
  // Prepare the Data
  const hectareCounts = {}; // Object to store hectare value counts

  data.forEach(item => {
    const hectare = item.hectare; // Extract hectare value
    if (hectare) {
      if (!hectareCounts[hectare]) {
        hectareCounts[hectare] = 1;
      } else {
        hectareCounts[hectare]++;
      }
    }
  });

  // Convert hectareCounts to an array of objects
  const histogramData = Object.entries(hectareCounts).map(([hectare, count]) => ({ hectare, count }));
  histogramData.sort((a, b) => b.count - a.count);
  const topHectares = histogramData.slice(0,10);
  // Create the Histogram using D3.js
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 1000 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  const svg = d3.select("#histogram")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
const x = d3.scaleBand()
  .domain(topHectares.map(d => d.hectare))
  .range([0, width])
  .padding(0.1);
const y = d3.scaleLinear()
  .domain([0, d3.max(topHectares, d => d.count)])
  .nice()
  .range([height, 0]);
// Add x-axis label
svg.append("text")
  .attr("class", "axis-label")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom - 5)
  .style("text-anchor", "left")
  .text("Hectare #");
// Add y-axis label
svg.append("text")
  .attr("class", "axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -margin.left + 10)
  .style("text-anchor", "middle")
  .text("Number of Squirrels");
svg.selectAll(".bar")
  .data(topHectares)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", d => x(d.hectare))
  .attr("y", d => y(d.count))
  .attr("width", x.bandwidth())
  .attr("height", d => height - y(d.count))
  .attr("fill", "lightblue")
  .on("mouseover", function(event, d) {
    // Display count on mouseover
    const xPos = x(d.hectare) + x.bandwidth() / 2;
    const yPos = y(d.count) - 5;
    svg.append("text")
      .attr("class", "count-label")
      .attr("x", xPos)
      .attr("y", yPos)
      .style("text-anchor", "middle")
      .text(d.count);
  })
  .on("mouseout", function(event, d) {
    // Remove count label on mouseout
    svg.select(".count-label").remove();
  });

svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x));

svg.append("g")
  .attr("class", "y-axis")
  .call(d3.axisLeft(y));

});
const metMuseumMarker = L.marker([40.7794, -73.9632]).addTo(myMap);
const naturalHistoryMarker = L.marker([40.7813, -73.9733]).addTo(myMap);
metMuseumMarker.bindPopup("Metropolitan Museum of Art");
naturalHistoryMarker.bindPopup("American Museum of Natural History");
const locations = [
  { name: "Arsenal Snack Bar", lat: 40.767774, lon: -73.971400 },
  { name: "CAFÉ PRODUCTS CORP.", lat: 40.768478, lon: -73.980790 },
  { name: "Central Park Food Cart 1", lat: 40.765641, lon: -73.973153},
  { name: "Central Park Food Cart 2", lat: 40.772864, lon: -73.976479},
  { name: "Central Park Food Cart 3", lat: 40.770977, lon: -73.977618},
  { name: "Central Park Food Cart 4", lat: 40.780823, lon: -73.969623},
  { name: "Central Park Food Cart 5", lat: 40.777341, lon: -73.974187},
  { name: "Central Park Food Cart 6", lat: 40.773835, lon: -73.971360},
  { name: "Central Park Specialty Food Cart", lat: 40.772518, lon: -73.967333 },
  { name: "Conservatory Water Snack Bar", lat: 40.774061, lon: -73.966722},
  { name: "Delacorte Theatre Snack Bar", lat: 40.774061, lon: -73.966722},
  { name: "JANANI FOOD SERVICE, INC.", lat: 40.774061, lon: -73.966722},
  { name: "JANANI FOOD SERVICES, INC.", lat: 40.774061, lon: -73.966722},
  { name: "JANANI FOOD SERVICES, INC.", lat: 40.774061, lon: -73.966722},
  { name: "Loeb Boathouse Restaurant", lat: 40.774061, lon: -73.966722},
  { name: "Mineral Springs Cafe", lat: 40.774061, lon: -73.966722},
  { name: "PQR Pizza Food Cart", lat: 40.774061, lon: -73.966722},

];

// Create markers for each location
locations.forEach(location => {
  const marker = L.marker([location.lat, location.lon]).addTo(myMap);
  marker.bindPopup(location.name);
});
});
