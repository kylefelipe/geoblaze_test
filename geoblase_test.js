// Get graph element
const plot = document.getElementById('plotly');
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
let values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// Peguei os valores quando gerei o mapa pela primeira vez
const MAPBOUNDS = {
  southWest: {
    lat: -18.0415597,
    lng: -73.9830625,
  },
  northEast: {
    lat: 5.2693306,
    lng: -45.6969781,
  },
};
// initalize leaflet map
let map = new L.map('map');
map.fitBounds(L.latLngBounds(MAPBOUNDS.southWest, MAPBOUNDS.northEast));

const LEGALAMAZON = [
  'Rondônia',
  'Acre',
  'Amazonas',
  'Roraima',
  'Pará',
  'Amapá',
  'Tocantins',
  'Mato Grosso',
];

const url_to_geotiff_file =
  'https://felipesbarros.github.io/geoblaze_test/mean_pm25_2020.tif'; //pm25_Jul.tif';
const url_to_geotiff_ts_file =
  'https://felipesbarros.github.io/geoblaze_test/pm25_2020.tif'; //pm25_timeseries.tif';

let selectedState;
let lastClickedLayer;

//functions
function onEachFeature(featureData, featureLayer) {
  // Function to be set at each GeoJSON
  // https://embed.plnkr.co/plunk/TcyDGH
  featureLayer.on('click', () => {
    if(lastClickedLayer) {
      // reset layer to default style
      statesLayer.resetStyle(lastClickedLayer);
    }
    lastClickedLayer = featureLayer;
    values = geoblaze.mean(activeLayer, featureData.geometry);
    selectedState = featureData.properties.name;
    // set polygon line to red
    featureLayer.setStyle({ color: '#88292F' });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      featureLayer.bringToFront();
    }

    plotData();
  });
}

function style() {
  // Default layer style
  return {
    fillOpacity: 0,
  };
}
// States Data
let statesData;
const statesLayer = L.geoJSON(statesData, {
  style,
  onEachFeature: onEachFeature,
}).addTo(map);

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

// Graph
function plotData() {
  // função que gera um gráfico quando os dados são passados
  const traceWHO = {
    type: 'scatter',
    mode: 'lines',
    name: 'WHO',
    x: MONTHS,
    y: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    line: { color: '#000000', dash: 'dot' },
  };
  const trace = {
    type: 'scatter',
    mode: 'lines',
    name: 'pm<2.5',
    x: MONTHS,
    y: values,
    line: { color: '#FF0000' },
  };

  const data = [trace, traceWHO];
  const title = selectedState
    ? `Mean Monthly Air Polution (pm<2.5) for ${selectedState} state`
    : 'Click on a state';
  const layout = {
    title,
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
  // getting all states polygons
  const allStates = []; // all states promisses
  for (stIdx = 0; stIdx < LEGALAMAZON.length; stIdx += 1) {
    const state = LEGALAMAZON[stIdx];
    const url_satate_geojson = `https://nominatim.openstreetmap.org/search.php?state=${state}&country=brazil&polygon_geojson=1&format=json`;
    allStates.push(
      fetch(url_satate_geojson).then((response) => response.json()),
    );
  }
  // fetch all data
  Promise.all(allStates)
    .then((values) => {
      // Parsing all values fetched as a geojson
      // https://geojson.org/
      const data = values.map((value) => {
        const [val, ..._] = value;
        const { geojson, boundingbox, lat, lon, ...others } = val;
        const feature = {
          // creates a geojson feature with it's geometry
          type: 'Feature',
          geometry: geojson,
        };
        feature.properties = {
          // creates feature properties
          ...others,
          boundingBox: { type: 'Polygon', coordinates: boundingbox },
          centroid: { type: 'Point', lat, lon },
          name: others.display_name.split(',')[0],
        };
        return feature;
      });
      statesData = L.layerGroup(data);
      statesLayer.addData(data);
      statesLayer.setStyle({ fillOpacity: 0 });
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
  plotData();
};
