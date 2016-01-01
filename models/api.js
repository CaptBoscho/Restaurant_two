var app = require('./express.js');
var Client = require('./Clientdb.js');
var Reservation = require('./Reservationdb.js');

// setup body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
}));

//
// API
//

// register a user
app.post('/api/users/register', function (req, res) {
    // find or create the user with the given username
    Client.findOrCreate({phone: req.body.phone}, function(err, client, created) {
        if (created) {
            // if this username is not taken, then create a user record
            client.name = req.body.name;
            client.phone = req.body.phone;
            client.save(function(err) {
        		if (err) {
        		    res.sendStatus("403");
        		    return;
        		}
                // create a token
        		var token = Client.generateToken(client.phone);
                // return value is JSON containing the user's name and token
                res.json({name: client.name, token: token}); //change name to phone??
            });
        } 
        else {
            // return an error if the username is taken
            res.sendStatus("403");
        }
    });
});

// login a user
app.post('/api/users/login', function (req, res) {
    // find the user with the given username
    User.findOne({username: req.body.username}, function(err,user) {
    	if (err) {
    	    res.sendStatus(403);
    	    return;
    	}
        // validate the user exists and the password is correct
        if (user && user.checkPassword(req.body.password)) {
            // create a token
            var token = User.generateToken(user.username);
            // return value is JSON containing user's name and token
            res.json({name: user.name, token: token});
        } 
        else {
            res.sendStatus(403);
        }
    });
});

// get all items for the user
app.get('/api/items', function (req,res) {
    // validate the supplied token
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, find all the user's items and return them
    	    Item.find({user:user.id}, function(err, items) {
        		if (err) {
        		    res.sendStatus(403);
        		    return;
        		}
        		// return value is the list of items as JSON
        		res.json({items: items});
    	    });
        } 
        else {
            res.sendStatus(403);
        }
    });
});

// get all items for the user
app.get('/api/entries', function (req,res) {
    // validate the supplied token
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, find all the user's items and return them
            Entry.find({user:user.id}, function(err, entries) {
                if (err) {
                    res.sendStatus(403);
                    return;
                }
                // return value is the list of items as JSON
                res.json({entries: entries});
            });
        } 
        else {
            res.sendStatus(403);
        }
    });
});

// add an item
app.post('/api/items', function (req,res) {
    // validate the supplied token
    // get indexes
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, create the item for the user
    	    Item.create({title:req.body.item.title,completed:false,user:user.id}, function(err,item) {
        		if (err) {
        		    res.sendStatus(403);
        		    return;
        		}
        		res.json({item:item});
    	    });
        } 
        else {
            res.sendStatus(403);
        }
    });
});

// add an item
app.post('/api/entries', function (req,res) {
    // validate the supplied token
    // get indexes
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, create the item for the user
            Entry.create({title:req.body.entry.title, user:user.id, text:req.body.entry.text, keywords:req.body.entry.keywords}, function(err,entry) {
                if (err) {
                    res.sendStatus(403);
                    return;
                }
                res.json({entry:entry});
            });
        } 
        else {
            res.sendStatus(403);
        }
    });
});

// get an item
app.get('/api/items/:item_id', function (req,res) {
    // validate the supplied token
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, then find the requested item
            Item.findById(req.params.item_id, function(err, item) {
        		if (err) {
        		    res.sendStatus(403);
        		    return;
        		}
                // get the item if it belongs to the user, otherwise return an error
                if (item.user != user) {
                    res.sendStatus(403);
                    return;
                }
                // return value is the item as JSON
                res.json({item:item});
            });
        } 
        else {
            res.sendStatus(403);
        }
    });
});

// get an item
app.get('/api/entries/:entry_id', function (req,res) {
    // validate the supplied token
    console.log("entryId");
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, then find the requested item
            Entry.findById(req.params.entry_id, function(err, entry) {
                if (err) {
                    res.sendStatus(403);
                    return;
                }
                // get the item if it belongs to the user, otherwise return an error
                if (String(entry.user) != String(user._id)) {
                    res.sendStatus(403);
                    return;
                }
                // return value is the item as JSON
                res.json({entry:entry});
            });
        } 
        else {
            res.sendStatus(403);
        }
    });
});

// get an entry by keyword
app.get('/api/entriessearch/:keyword', function (req,res) {
    // validate the supplied token
    console.log("hit me baby one more time");
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, then find the requested item
            console.log("get by keyword");
            console.log(req.params.keyword);
            Entry.find({user:user, keywords: {$in: [req.params.keyword]}}, function(err, entries) {
                if (err) {
                    console.log(err);
                    res.sendStatus(403);
                    return;
                }
                // get the item if it belongs to the user, otherwise return an error
                /*if (String(entry.user) != String(user._id)) {
                    console.log("dumb user");
                    res.sendStatus(403);
                    return;
                }*/
                // return value is the item as JSON
                res.json({entries:entries});
            });
        } 
        else {
            res.sendStatus(403);
        }
    });
});

// update an item
app.put('/api/items/:item_id', function (req,res) {
    // validate the supplied token
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, then find the requested item
            Item.findById(req.params.item_id, function(err,item) {
        		if (err) {
        		    res.sendStatus(403);
        		    return;
        		}
                // update the item if it belongs to the user, otherwise return an error
                if (item.user != user.id) {
                    res.sendStatus(403);
                    return;
                }
                item.title = req.body.item.title;
                item.completed = req.body.item.completed;
                item.save(function(err) {
        		    if (err) {
            			res.sendStatus(403);
            			return;
        		    }
                    // return value is the item as JSON
                    res.json({item:item});
                });
            });
        } 
        else {
            res.sendStatus(403);
        }
    });
});

// delete an item
app.delete('/api/items/:item_id', function (req,res) {
    // validate the supplied token
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, then find the requested item
            Item.findByIdAndRemove(req.params.item_id, function(err,item) {
        		if (err) {
        		    res.sendStatus(403);
        		    return;
        		}
                res.sendStatus(200);
            });
        } 
        else {
            res.sendStatus(403);
        }
    });
});

