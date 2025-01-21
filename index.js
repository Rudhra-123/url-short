const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// In-memory storage for URLs
const urlDatabase = {};
const baseUrl = `http://localhost:${port}/`;

// Utility function to generate a random short key
function generateShortKey(length = 6) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let key = '';
    for (let i = 0; i < length; i++) {
        key += characters[Math.floor(Math.random() * characters.length)];
    }
    return key;
}

// Middleware to parse JSON
app.use(bodyParser.json());

// Route to shorten a URL
app.post('/shorten', (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    // Check if the URL is already in the database
    let shortKey = Object.keys(urlDatabase).find(
        (key) => urlDatabase[key] === originalUrl
    );

    if (!shortKey) {
        // Generate a new short key
        shortKey = generateShortKey();
        urlDatabase[shortKey] = originalUrl;
    }

    res.json({ shortUrl: baseUrl + shortKey });
});

// Route to handle redirection
app.get('/:shortKey', (req, res) => {
    const { shortKey } = req.params;
    const originalUrl = urlDatabase[shortKey];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).json({ error: 'URL not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`URL shortener running at ${baseUrl}`);
});
