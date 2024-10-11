const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { barcodeData, userLocation } = req.body;

  // Logic to check if location is within the desired radius
  const desiredRadius = 100; // Example: 100 meters
  const userLat = parseFloat(userLocation.lat);
  const userLng = parseFloat(userLocation.lng);
  const targetLat = 40.730610; // Example target location latitude
  const targetLng = -73.935242; // Example target location longitude

  const distance = getDistanceFromLatLonInMeters(targetLat, targetLng, userLat, userLng);

  if (distance <= desiredRadius) {
    res.send(`Barcode submitted: ${barcodeData}. Location is within the radius.`);
  } else {
    res.send(`Location not within the radius. Barcode not submitted.`);
  }
});

// Function to calculate distance between two lat/lng points in meters
function getDistanceFromLatLonInMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
