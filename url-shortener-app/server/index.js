const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Url = require('./models/Url');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Debug log for environment
console.log("🔍 dotenv result:", dotenv.config());
console.log("✅ Loaded MONGO_URI:", process.env.MONGO_URI || 'Not defined');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortener';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected!"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// POST: create short URL
app.post('/api/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const shortId = Math.random().toString(36).substring(2, 8);
  const newUrl = new Url({ longUrl, shortId });
  await newUrl.save();
  res.json({ shortUrl: `http://localhost:5000/${shortId}` });

});

// GET: redirect to original URL
app.get('/:shortId', async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId });
  if (url) {
    res.redirect(url.longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
