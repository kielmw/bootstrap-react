import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// Define the base URL for the external API
const API_BASE_URL = 'http://localhost:9090/api';

app.use(cors({
    origin: 'http://127.0.0.1:5500' // Allow requests from this origin
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Function to construct the API URL
const constructApiUrl = (endpoint, id, subid) => {
    let apiUrl = `${API_BASE_URL}/${endpoint}`;
    if (id) {
        apiUrl += `/${id}`;
    }
    if (subid) {
        apiUrl += `/${subid}`;
    }
    return apiUrl;
};

// Route to handle GET requests
app.get('/api/:endpoint/:id?', (req, res) => {
    const { endpoint, id } = req.params;
    const apiUrl = constructApiUrl(endpoint, id);

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

// Route to handle PUT requests
app.put('/api/:endpoint/:id', (req, res) => {
    const { endpoint, id } = req.params;
    const apiUrl = constructApiUrl(endpoint, id);

    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update data');
        }
        return response.json();
    })
    .then(data => {
        res.json(data);
    })
    .catch(error => {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'An error occurred while updating data' });
    });
});

// Route to handle POST requests
app.post('/api/:endpoint', (req, res) => {
    const { endpoint } = req.params;
    const apiUrl = constructApiUrl(endpoint);

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add data');
        }
        return response.json();
    })
    .then(data => {
        res.status(201).json(data);
    })
    .catch(error => {
        console.error('Error adding data:', error);
        res.status(500).json({ error: 'An error occurred while adding data' });
    });
});

// Route to handle DELETE requests
app.delete('/api/:endpoint/:id/:subid?', (req, res) => {
    const { endpoint, id, subid } = req.params;
    const apiUrl = constructApiUrl(endpoint, id, subid);

    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete data');
        }
        res.status(204).send();
    })
    .catch(error => {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'An error occurred while deleting data' });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
