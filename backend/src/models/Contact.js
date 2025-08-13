// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  wa_id: { type: String, unique: true },
  name: String,
  // add more fields if needed
});

module.exports = mongoose.model('Contact', contactSchema);
