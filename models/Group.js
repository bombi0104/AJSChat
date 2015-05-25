var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var User = require('../models/User.js');

var GroupSchema = new Schema({
  name: String,
  users: [{
  	type: Schema.ObjectId,
  	ref:'User'}],
  created_at: { 
  	type: Date, 
  	default: Date.now 
  },
  updated_at: { 
  	type: Date, 
  	default: Date.now 
  },
});

GroupSchema.methods.addUser = function(userid) {
	User.findById(userid, function (err, user) {
    	if (err) 
    		return next(err);
    	else {
    		this.users.push(user);
    		this.save(function(err){
        		if (err) {
          			console.log('error 2');
        			return next(err);
        		}
        		return this;
        	});
    	}
  	});
}

module.exports = mongoose.model('Group', GroupSchema);
