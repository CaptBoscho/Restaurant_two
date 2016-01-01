var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var findOrCreate = require('mongoose-findorcreate');



var User = require('./Clientdb.js');

var Reservation = new Schema ({
	client: {type: ObjectId, ref: 'client'},
	date: Date,
	restaurant: String,
	reliability: Number,
	location: String
});


