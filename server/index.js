const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const validationEngine = require('./validationEngine');
const rules = require('./rules');
const path = require('path');

// Serve static files from the client app
app.use(express.static(path.join(__dirname, '../client/dist')));

app.post('/api/validate', (req, res) => {
    const { tag, mode } = req.body;
    const result = validationEngine.validate(tag, rules, mode);
    res.json(result);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
