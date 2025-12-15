const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validationEngine = require('./validationEngine');
const rules = require('./rules');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const CLIENT_BUILD_PATH = path.join(__dirname, '../client/dist');
console.log('Server started');
console.log('__dirname:', __dirname);
console.log('CLIENT_BUILD_PATH:', CLIENT_BUILD_PATH);
try {
    const clientPath = path.join(__dirname, '../client');
    console.log('Listing CLIENT_PATH contents:', fs.readdirSync(clientPath));
    if (fs.existsSync(CLIENT_BUILD_PATH)) {
        console.log('Listing CLIENT_BUILD_PATH contents:', fs.readdirSync(CLIENT_BUILD_PATH));
    } else {
        console.log('CLIENT_BUILD_PATH does not exist.');
    }
} catch (e) {
    console.error('Debug: Failed to list paths:', e.message);
}

// Serve static files from the client app
if (fs.existsSync(CLIENT_BUILD_PATH)) {
    app.use(express.static(CLIENT_BUILD_PATH));
}

app.post('/api/validate', (req, res) => {
    const { tag, mode } = req.body;
    const result = validationEngine.validate(tag, rules, mode);
    res.json(result);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/(.*)/, (req, res) => {
    const indexPath = path.join(__dirname, '../client/dist/index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Client build not found. Please check build logs.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
