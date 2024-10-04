const express = require('express');
const app = express();
const port = 80; // Default HTTP port

// Simple route for homepage
app.get('/', (req, res) => {
  res.send('<h1>Hello from Node.js on AWS EC2!</h1>');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
