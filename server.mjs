import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500' // Allow requests from this origin
}));

app.get('/api/kontrol-kelas/:id', (req, res) => {
    const apiUrl = `https://8a3a-182-253-50-137.ngrok-free.app/api/kontrol-kelas/${req.params.id}`;

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
