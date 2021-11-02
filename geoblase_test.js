// Get graph element
const plot = document.getElementById('plotly');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// initalize leaflet map
let map = new L.map('map');

const url_to_geotiff_file =
  'https://felipesbarros.github.io/geoblaze_test/mean_pm25_2020.tif'; //pm25_Jul.tif';
const url_to_geotiff_ts_file =
  'https://felipesbarros.github.io/geoblaze_test/pm25_2020.tif'; //pm25_timeseries.tif';
const url_to_acre_geojson =
  'https://nominatim.openstreetmap.org/search.php?state=acre&country=brazil&polygon_geojson=1&format=json';

// Acre layer
let acreData;
const acreLayer = L.geoJSON().addTo(map);

// geotif_ts layer
let geotiffTsData;
let geotiffTsLayer;

// geotif layer
let geotiffData;
let geotiffLayer;

let activeLayer;

// add OpenStreetMap basemap
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Timeseries raster
fetch(url_to_geotiff_ts_file)
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => {
    parseGeoraster(arrayBuffer).then((ts_georaster) => {
      // console.log("ts_georaster:", ts_georaster);
      // console.log(geoblaze.identify(ts_georaster, [-1.7575368113083125, -59.15039062500001]));
      geotiffTsData = ts_georaster;
      geotiffTsLayer = new GeoRasterLayer({
        georaster: ts_georaster,
        opacity: 0,
      }).addTo(map);
      activeLayer = geotiffTsData;
    });
  });

//single band raster
fetch(url_to_geotiff_file)
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => {
    parseGeoraster(arrayBuffer).then((georaster) => {
      const min = georaster.mins[0];
      const max = georaster.maxs[0];
      const range = georaster.ranges[0];

      // available color scales can be found by running console.log(chroma.brewer);
      const scale = chroma.scale('Viridis');
      geotiffData = georaster;
      geotiffLayer = new GeoRasterLayer({
        georaster: geotiffData,
        opacity: 0.7,
        pixelValuesToColorFn: function (pixelValues) {
          const pixelValue = pixelValues[0]; // there's just one band in this raster

          // if there's zero wind, don't return a color
          if (pixelValue === 0) return null;

          // scale to 0 - 1 used by chroma
          const scaledPixelValue = (pixelValue - min) / range;

          const color = scale(scaledPixelValue).hex();

          return color;
        },
      }).addTo(map);
    });
  });
//   map.invalidateSize();

map.on('click', function (evt) {
  const latlng = map.mouseEventToLatLng(evt.originalEvent);
  values = geoblaze.identify(activeLayer, [latlng.lng, latlng.lat]);
  console.log('Valor de PM<2.5 :', values);
  plotData();
});

// Graph
function plotData() { // função que gera um gráfico quando os dados são passados
  const traceWHO = {
    type: 'scatter',
    mode: 'lines',
    name: 'WHO',
    x: MONTHS,
    y: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    line: { color: '#000000',
            dash: 'dot'},
  }
  const trace = {
    type: 'scatter',
    mode: 'lines',
    name: 'pm<2.5',
    x: MONTHS,
    y: values,
    line: { color: '#FF0000' },
  };
  
  const data = [trace, traceWHO];
  
  const layout = {
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
  // getting Acre polygon and use its bounds as map bounds
  fetch(url_to_acre_geojson)
    .then((response) => response.json())
    .then((data) => {
      acreData = data[0].geojson;
      acreLayer.addData(acreData);
      map.fitBounds(acreLayer.getBounds());
    });
  plotData();
};
