var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
  name: String,
  users: [mongoose.Types.ObjectId],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', GroupSchema);
