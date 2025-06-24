import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Url from './models/Url.js';
import { nanoid } from 'nanoid';
import { PORT, DB_URI, NODE_ENV } from './config/env.js'; // Ensure these are loaded properly

const app = express();

app.use(cors());


app.use(express.json());

// API route to shorten URL
app.post('/api/shorten', async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'Missing originalUrl' });
    }

    const shortCode = nanoid(7);
    const baseUrl = `http://localhost:${PORT}`;


    const url = new Url({
        originalUrl,
        shortCode,
        createdAt: new Date(),
        clicks: 0
    });

    await url.save();

    res.json({ shortUrl: `${baseUrl}/${shortCode}` });
});

app.get('/', () => console.log("Api is working"))

// Redirect route
app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (url) {
        url.clicks++;
        await url.save();
        return res.redirect(url.originalUrl);
    }

    res.status(404).json({ error: 'URL not found' });
});

// ✅ FIXED: Typo in `async`
const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1); // Exit process on failure
    }
};

// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT} in ${NODE_ENV}`);
    await connectToDatabase();
});
