// Button and video elements
const scanButton = document.getElementById('scan-button');
const video = document.getElementById('video');
const barcodeResult = document.getElementById('barcode-result');

// Function to start the camera and scan
function startScanner() {
    // Request camera permission
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function(stream) {
            video.srcObject = stream;

            // Initialize QuaggaJS for barcode scanning
            Quagga.init({
                inputStream: {
                    type: "LiveStream",
                    target: video, // Set the video element as target
                    constraints: {
                        facingMode: "environment" // Use back camera
                    },
                },
                decoder: {
                    readers: ["code_128_reader", "ean_reader", "ean_8_reader", "upc_reader"]
                }
            }, function(err) {
                if (err) {
                    console.error(err);
                    return;
                }
                Quagga.start();
            });

            // Event listener for detected barcode
            Quagga.onDetected(function(result) {
                const code = result.codeResult.code;
                barcodeResult.textContent = `Barcode: ${code}`;

                // Stop scanning once a barcode is detected
                Quagga.stop();
                stream.getTracks().forEach(track => track.stop()); // Close the camera

                // You can use `code` for further processing here
                console.log('Detected barcode:', code);
            });
        })
        .catch(function(err) {
            console.error('Camera permission denied or other error:', err);
        });
}

// Event listener for the button
scanButton.addEventListener('click', function() {
    startScanner();
});
