var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var GroupSchema = new mongoose.Schema({
  name: String,
  users: [{type:ObjectId, ref:'User'}],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', GroupSchema);
