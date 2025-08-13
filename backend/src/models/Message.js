// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  msg_id: String,
  wa_id: String,         // contact number (other party)
  contact_name: String,  // denormalized contact name
  from: String,
  to: String,
  body: String,
  type: String,
  timestamp: Date,
  from_me: Boolean,
  raw: mongoose.Schema.Types.Mixed,
  status: String,
  raw_status: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Message', messageSchema);
