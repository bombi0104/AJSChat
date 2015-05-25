var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var MessageSchema = new Schema({
  group_id: {
  	type: Schema.ObjectId,
  	ref: 'Group'
  },
  from_user_id: {
  	type: Schema.ObjectId,
  	ref: 'User'
  },
  to_users_id: [{
  	type: Schema.ObjectId,
  	ref:'User'
  }],
  content: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
