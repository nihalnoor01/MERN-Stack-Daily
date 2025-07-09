// server/models/Url.js
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortId: String,
});

module.exports = mongoose.model('Url', urlSchema);
