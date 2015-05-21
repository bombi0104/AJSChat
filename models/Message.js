var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var MessageSchema = new mongoose.Schema({
  group_id: {type:ObjectId, ref:'Group'},
  from_user_id: {type:ObjectId, ref:'User'},
  to_users_id: [{type:ObjectId, ref:'User'}],
  content: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
