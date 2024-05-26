import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// Define the base URL for the external API
const API_BASE_URL = 'https://8a3a-182-253-50-137.ngrok-free.app/api';

app.use(cors({
    origin: 'http://127.0.0.1:5500' // Allow requests from this origin
}));

// Generic route to handle all API calls to the external service
app.get('/api/:endpoint/:id?', (req, res) => {
    const { endpoint, id } = req.params;
    let apiUrl = `${API_BASE_URL}/${endpoint}`;

    if (id) {
        apiUrl += `/${id}`;
    }

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        res.json(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
