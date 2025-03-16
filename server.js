const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const winSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

const Win = mongoose.model('Win', winSchema);

app.get('/api/wins', async (req, res) => {
  try {
    const wins = await Win.find().sort({ createdAt: -1 });
    res.json(wins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wins', async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const newWin = new Win({ title, description, category });
    await newWin.save();
    res.status(201).json(newWin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('MicroWins Backend is up and running 🚀');
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
