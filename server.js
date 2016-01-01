// setup Express
var app = require('./models/express.js');

// setup mongoose
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/list'); //might need to change localhost??

// models
var api = require('./models/api.js');
var User = require('./models/user.js');
var Item = require('./models/item.js');
var Journal = require('./models/journal.js');

// start the server
var server = app.listen(3000, function () {
    var host = server.address().address;
    console.log("started on host " + host);
    var port = server.address().port;
    console.log("Started on port " + port);

});


