var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  group_id: mongoose.Schema.Types.ObjectId,
  from_user_id: mongoose.Schema.Types.ObjectId,
  to_users_id: [mongoose.Types.ObjectId],
  content: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
