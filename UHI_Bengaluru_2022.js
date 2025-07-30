// Paste in code editor in GEE. Run it and go to task and run it again


// 1️⃣ Load MODIS Daily LST (Daytime) for 2022
var dataset = ee.ImageCollection("MODIS/006/MOD11A1")
                .filterDate('2022-01-01', '2022-12-31')
                .filterBounds(ee.Geometry.Point(77.5946, 12.9716));

print("Images available:", dataset.size());

// 2️⃣ Compute average LST (convert to °C)
var lstDay = dataset.select('LST_Day_1km')
                    .mean()
                    .multiply(0.02)
                    .subtract(273.15);

// 3️⃣ Define region of interest (Bengaluru area)
var region = ee.Geometry.Point(77.5946, 12.9716)
                .buffer(30000)
                .bounds();

// 4️⃣ Visualization parameters
var visParams = {
  min: 20,
  max: 45,
  palette: [
    '313695','4575b4','74add1','abd9e9',
    'ffffbf','fdae61','f46d43','d73027','a50026'
  ]
};

// 5️⃣ Display map
Map.centerObject(region, 9);
Map.addLayer(lstDay.clip(region), visParams, 'Bengaluru LST 2022');

// 6️⃣ Export to GeoTIFF
Export.image.toDrive({
  image: lstDay.clip(region),
  description: 'Bengaluru_LST_2022',
  fileNamePrefix: 'Bengaluru_LST_2022',
  region: region,
  scale: 1000,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});