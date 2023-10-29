const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  groupId: String,
  message: String,
  userId: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;