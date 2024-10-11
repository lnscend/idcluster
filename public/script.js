const videoContainer = document.getElementById('video-container');
const preview = document.getElementById('preview');
const barcodeForm = document.getElementById('barcode-form');
const barcodeDataInput = document.getElementById('barcodeData');
const userLocationInput = document.getElementById('userLocation');
const errorMessage = document.getElementById('error-message');

// Initialize location and camera permissions
async function requestPermissions() {
  try {
    // Request location permissions
    const position = await getLocation();
    const { latitude, longitude } = position.coords;
    userLocationInput.value = JSON.stringify({ lat: latitude, lng: longitude });
    
    // Check if location is within the desired range
    if (!isWithinDesiredRange(latitude, longitude)) {
      errorMessage.textContent = "Location not within the required range.";
      return;
    }

    // Request camera permissions and start barcode scanning
    await startCamera();

  } catch (err) {
    errorMessage.textContent = err.message;
  }
}

// Get user location
function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, () => {
        reject(new Error("Location access denied. Please enable it in settings."));
      });
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

// Check if the location is within the desired range (dummy function, adapt as needed)
function isWithinDesiredRange(lat, lng) {
  const desiredLat = 40.730610; // Replace with your desired lat
  const desiredLng = -73.935242; // Replace with your desired lng
  const distance = getDistanceFromLatLonInMeters(desiredLat, desiredLng, lat, lng);
  return distance <= 100; // Replace 100 with your radius in meters
}

// Calculate distance between two lat/lng points
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

// Start the camera and initiate barcode scanning
async function startCamera() {
  videoContainer.style.display = 'block';

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    preview.srcObject = stream;
    preview.play();

    // Barcode scanning using Quagga.js
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: preview,
      },
      decoder: {
        readers: ["code_128_reader"] // You can add more readers if needed
      }
    }, (err) => {
      if (err) {
        errorMessage.textContent = `Error initializing barcode scanner: ${err}`;
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((data) => {
      barcodeDataInput.value = data.codeResult.code;
      barcodeForm.style.display = 'block'; // Show form when barcode is detected
      Quagga.stop();
    });

  } catch (err) {
    errorMessage.textContent = `Camera access denied. Please enable it in settings.`;
  }
}

// Call the function to request permissions on page load
requestPermissions();
