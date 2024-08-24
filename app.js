// Load the model and run object detection
async function loadModelAndDetect() {
    // Load the COCO-SSD model
    const model = await cocoSsd.load();
    
    // Get access to the webcam
    const webcam = document.getElementById('webcam');
    const outputCanvas = document.getElementById('output');
    const ctx = outputCanvas.getContext('2d');

    // Function to detect objects
    async function detectObjects() {
        const predictions = await model.detect(webcam);

        // Clear the canvas
        ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

        // Draw the video frame
        ctx.drawImage(webcam, 0, 0, outputCanvas.width, outputCanvas.height);

        // Draw the detection boxes
        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = "#00FFFF";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle = "#00FFFF";
            ctx.font = "18px Arial";
            ctx.fillText(`${prediction.class} (${(prediction.score * 100).toFixed(2)}%)`, x, y > 10 ? y - 5 : 10);
        });

        // Call this function again to keep detecting
        requestAnimationFrame(detectObjects);
    }

    detectObjects();
}

// Set up the webcam video stream
async function setupWebcam() {
    const webcamElement = document.getElementById('webcam');
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    webcamElement.srcObject = stream;

    return new Promise((resolve) => {
        webcamElement.onloadedmetadata = () => {
            resolve(webcamElement);
        };
    });
}

// Start the application
async function main() {
    await setupWebcam();
    loadModelAndDetect();
}

main();
