const express = require('express');
const port = process.env.PORT || 8080;
const app = express();

// Add public folder only folder to access
app.use(express.static('public'));

app.listen(port);
