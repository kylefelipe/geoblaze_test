// Get graph element
const plot = document.getElementById('plotly');

let values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// initalize leaflet map
const map = L.map('map');

// add OpenStreetMap basemap
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const url_to_geotiff_file =
  'https://felipesbarros.github.io/geoblaze_test/mean_pm25_2020.tif';//pm25_Jul.tif';
const url_to_geotiff_ts_file =
  'https://felipesbarros.github.io/geoblaze_test/pm25_2020.tif';//pm25_timeseries.tif';
const url_to_acre_geojson =
  'https://nominatim.openstreetmap.org/search.php?state=amazon+acre&country=brazil&polygon_geojson=1&format=json';

// Timeseries raster
fetch(url_to_geotiff_ts_file)
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => {
    parseGeoraster(arrayBuffer).then((ts_georaster) => {
      // console.log("ts_georaster:", ts_georaster);
      // console.log(geoblaze.identify(ts_georaster, [-1.7575368113083125, -59.15039062500001]));
      const layer = new GeoRasterLayer({
        georaster: ts_georaster,
        opacity: 0,
      }).addTo(map);
      map.fitBounds(layer.getBounds());

      map.on('click', function (evt) {
        const latlng = map.mouseEventToLatLng(evt.originalEvent);
        // alert(
        //   'Valor de PM<2.5 = ' +
        //     geoblaze.identify(ts_georaster, [latlng.lng, latlng.lat]),
        // );
        console.log(
          'Valor de PM<2.5 :',
          geoblaze.identify(ts_georaster, [latlng.lng, latlng.lat]),
        );
        values = geoblaze.identify(ts_georaster, [latlng.lng, latlng.lat]);
        plotData();
      });
    });
  });

 //single band raster
       fetch(url_to_geotiff_file)
         .then(response => response.arrayBuffer())
         .then(arrayBuffer => {
           parseGeoraster(arrayBuffer).then(
             georaster => {
             const min = georaster.mins[0];
             const max = georaster.maxs[0];
             const range = georaster.ranges[0];

             // available color scales can be found by running console.log(chroma.brewer);
             var scale = chroma.scale("Viridis");
             var layer = new GeoRasterLayer({
                 georaster: georaster,
                 opacity: 0.7,
                 pixelValuesToColorFn: function(pixelValues) {
                   var pixelValue = pixelValues[0]; // there's just one band in this raster

                   // if there's zero wind, don't return a color
                   if (pixelValue === 0) return null;

                   // scale to 0 - 1 used by chroma
                   var scaledPixelValue = (pixelValue - min) / range;

                   var color = scale(scaledPixelValue).hex();

                   return color;
                 }
                 }).addTo(map)
             map.fitBounds(layer.getBounds());

//       fetch(url_to_acre_geojson)
//         .then(response => response.json())
//         .then(data => {
//             console.log("Acre:", data[0].geojson);
//             var acreLayer = new L.geoJSON(
//               data[0].geojson).addTo(map);
//             });
         });
       });
//   map.invalidateSize();
//
// Graph
function plotData() { // função que gera um gráfico quando os dados são passados
  var traceWHO = {
    type: 'scatter',
    mode: 'lines',
    name: 'WHO',
    x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dic'],
    y: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    line: { color: '#000000',
            dash: 'dot'},
  }
  var trace = {
    type: 'scatter',
    mode: 'lines',
    name: 'pm<2.5',
    x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dic'],
    y: values,
    line: { color: '#FF0000' },
  };
  
  const data = [trace, traceWHO];
  
  var layout = {
    title: 'Mean Monthly Air Polution (pm<2.5) for Acre state',
    height: 525,
    width: 800,
  };
  
  Plotly.newPlot(plot, data, layout);
  function adjustValue1(values) {
    data[0]['y'] = values;
    Plotly.restyle('plotly');
  }
  
}
window.onload = () => {
 plotData();
}
