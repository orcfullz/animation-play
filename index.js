const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the directory where your HTML, CSS, JS files are located
// Assuming they are in a directory named 'public'
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`Server is running on port ${port}`);
});
