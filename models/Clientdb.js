console.dir("0");

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var findOrCreate = require('mongoose-findorcreate');

console.dir("begin");

var db = mongoose.connect('mongodb://localhost/restaurant');

console.dir("after connect");

var ClientSchema = new Schema({
	name: String,
	phone: Number
});

console.dir("after schema");

var Client = mongoose.model('Client', ClientSchema);

function addClient(uname, p)
{
	
	var person = new Client({
	name: uname,
	phone: p
	});

	person.save(function(err, person){
		if (err) return console.error(err);
		console.dir(person);
	});
}

console.dir("Starting");
uname = "Dad";
p = 8012263076;
addClient(uname, p);

