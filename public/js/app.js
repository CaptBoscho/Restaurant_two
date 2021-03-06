// React Router
// http://rackt.github.io/react-router/
var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;

// Map of components
// App
//   Home
//   Login
//   Register
//   Login
//     ListHeader
//     ListItems
//       Item
// List page, shows the todo list of items

var CreateJournal = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },
    // handles submit event for adding a new item
    addItem: function(event) {
        // prevent default browser submit
        event.preventDefault();
        // get data from form
        var title = this.refs.title.getDOMNode().value;
        var body = this.refs.entry.getDOMNode().value;
        var tags = this.refs.keywords.getDOMNode().value;
        if (!title || !body) {
            return;
        }
        /*return;
        // call API to add item, and reload once added
        api.addItem(title, this.props.reload);
        this.refs.title.getDOMNode().value = '';*/
        api.addEntry(title, body, tags, this.props.reload);
        this.context.router.transitionTo('/journal');
    },

    // render the item entry area
    render: function() {
        return (
            <form onSubmit={this.addItem}>
                <div className="form-group">
                    <label>Entry Title</label>
                    <input type="text" className="form-control" ref="title" id="entryTitle" placeholder="Title" autoFocus={true} />
                </div>
                <div className="form-group">
                    <label>Entry</label>
                    <textarea className="form-control" ref="entry" id="entrybody"></textarea>
                </div>
                <div className="form-group">
                    <label>Keyword Tags (Comma seperated, like this 'cars, christmas, etc')</label>
                    <input type="text" className="form-control" ref="keywords" id="keywords" placeholder="keywords"/>
                </div>
                <input className="btn btn-success" type="submit" value="Create" />
            </form>
            );

    }
});

// Login page, shows the login form and redirects to the list if login is successful
var Login = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
        return {
            // there was an error on logging in
            error: false
        };
    },

    // handle login button submit
    login: function(event) {
        // prevent default browser submit
        event.preventDefault();
        // get data from form
        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;
        if (!username || !password) {
            return;
        }
        // login via API
        auth.login(username, password, function(loggedIn) {
            // login callback
            if (!loggedIn)
                return this.setState({
                    error: true
                });
            this.context.router.transitionTo('/journal');
        }.bind(this));
    },

    // show the login form
    render: function() {
        return (
            <div className="row">
                <div className="col-md-8">
                    <form onSubmit={this.login}>
                        {this.state.error ? (
                            <div className="alert alert-danger" role="alert"><strong>Invalid Credentials</strong></div>
                        ) : null}
                        <h2>Login</h2>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" className="form-control" placeholder="Username" ref="username" autoFocus={true} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" placeholder="Password" ref="password"/>
                        </div>
                        <input className="btn btn-success" type="submit" value="Login" />
                    </form>
                </div>
            </div>
            );
    }
});


// Top-level component for the app
var App = React.createClass({
    // context so the componevnt can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
        return {
	        // the user is logged in
            loggedIn: auth.loggedIn()
        };
    },

    // callback when user is logged in
    setStateOnAuth: function(loggedIn) {
        this.state.loggedIn = loggedIn;
    },

    // when the component loads, setup the callback
    componentWillMount: function() {
        auth.onChange = this.setStateOnAuth;
    },

    // logout the user and redirect to home page
    logout: function(event) {
        auth.logout();
        this.context.router.replaceWith('/');
    },

    // show the navigation bar
    // the route handler replaces the RouteHandler element with the current page
    render: function() {
        return (
            <div>
            <nav className="navbar navbar-default" role="navigation">
            <div className="container">
            <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/"><span className="glyphicon glyphicon-book" aria-hidden="true"></span> Journal App</a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            {this.state.loggedIn ? (
                <ul className="nav navbar-nav">
                <li><a href="#/journal">Journals</a></li>
                <li><a href="#/journal/create">Create Journal</a></li>
                <li><a href="#" onClick={this.logout}>Logout</a></li>
                </ul>
                ) : (<div></div>)}
            </div>
            </div>
            </nav>
            <div className="container">
            <RouteHandler/>
            </div>
            </div>
            );

}
});

// Home page, which shows Login and Register buttons
var Home = React.createClass({
    render: function() {
        return (
            <p>
                <Link className="btn btn-success" to="login">Login</Link> or <Link className="btn btn-primary" to="register">Register</Link>
            </p>
            );
    }
});


// Register page, shows the registration form and redirects to the list if login is successful
var Register = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
        return {
            // there was an error registering
            error: false
        };
    },

    // handle regiser button submit
    register: function(event) {
        // prevent default browser submit
        event.preventDefault();
        // get data from form
        var name = this.refs.name.getDOMNode().value;
        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;
        if (!name || !username || !password) {
            return;
        }
        // register via the API
        auth.register(name, username, password, function(loggedIn) {
            // register callback
            if (!loggedIn)
                return this.setState({
                    error: true
                });
            this.context.router.replaceWith('/list');
        }.bind(this));
    },

    // show the registration form
    render: function() {
        return (
            <div>
                <form onSubmit={this.register}>
                    {this.state.error ? (
                            <div className="alert alert-danger" role="alert"><strong>Invalid Username or Password</strong></div>
                        ) : null}
                    <h2>Register</h2>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Name" className="form-control" ref="name" autoFocus={true} />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" placeholder="Username" className="form-control" ref="username"/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Password" ref="password"/>
                    </div>
                    <input className="btn btn-primary" type="submit" value="Register" />
                </form>
            </div>
            );
    }
});

var Journal = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
        return {
            // list of items in the todo list
            //items: [],
            entries: [],
        };
    },

    // when the component loads, get the list items
    componentDidMount: function() {
        //api.getItems(this.listSet);
        api.getEntries(this.entrySet);
    },

    // reload the list of items
    reload: function() {
        //api.getItems(this.listSet);
        api.getEntries(this.entrySet);
    },

    // callback for getting the list of items, sets the list state
    // listSet: function(status, data) {
    //     if (status) {
    //         // set the state for the list of items
    //         this.setState({
    //             entries: data.items
    //         });
    //     } else {
    //         // if the API call fails, redirect to the login page
    //         this.context.router.transitionTo('/login');
    //     }
    // },
    entrySet: function(status, data) {
        console.log("in here");
        console.log(data);
        if (status) {
            this.setState({
                entries: data.entries
            });
        }
        else {
            this.context.router.transitionTo("/login");
        }
    },

    keywordSearch: function(event){
        event.preventDefault();
        var key = this.refs.keyword.getDOMNode().value;
        console.log(key);
        if(!key)
        {
            return;
        }

        api.keySearch(key, this.entrySet);

    },

    // Show the list of items. This component has the following children: ListHeader, ListEntry and ListItems
    render: function() {
        var name = auth.getName();
        return (
            <section id="todoapp">
                <form className="form-inline" onSubmit={this.keywordSearch}>
                  <div className="form-group">
                    <input type="text" ref="keyword" className="form-control" id="exampleInputName2" placeholder="Keyword Search"/>
                  </div>
                  <button type="submit" className="btn btn-success">Search</button>
                </form>
                        
                <ListHeader name={name} items={this.state.entries} reload={this.reload} />
                <section id="main">
                    <ListItems items={this.state.entries} reload={this.reload}/>
                </section>
            </section>
            );
    }
});

// List page, shows the todo list of items
var List = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
        return {
            // list of items in the todo list
            items: [],
        };
    },

    // when the component loads, get the list items
    componentDidMount: function() {
        api.getItems(this.listSet);
    },

    // reload the list of items
    reload: function() {
        api.getItems(this.listSet);
    },

    // callback for getting the list of items, sets the list state
    listSet: function(status, data) {
        if (status) {
            // set the state for the list of items
            this.setState({
                items: data.items
            });
        } else {
            // if the API call fails, redirect to the login page
            this.context.router.transitionTo('/login');
        }
    },

    // Show the list of items. This component has the following children: ListHeader, ListEntry and ListItems
    render: function() {
        var name = auth.getName();
        return (
            <section id="todoapp">
                <ListHeader name={name} items={this.state.items} reload={this.reload} />
                <section id="main">
                    <ListItems items={this.state.items} reload={this.reload}/>
                </section>
            </section>
            );
    }
});

// List header, which shows who the list is for, the number of items in the list, and a button to clear completed items
var ListHeader = React.createClass({
    // handle the clear completed button submit    
    // clearCompleted: function (event) {
    //     // loop through the items, and delete any that are complete
    //     this.props.items.forEach(function(item) {
    //         if (item.completed) {
    //             api.deleteItem(item, null);
    //         }
    //     });
    //     // XXX race condition because the API call to delete is async
    //     // reload the list
    //     this.props.reload();
    // },

   



    // render the list header
    render: function() {
        // true if there are any completed items
        // var completed = this.props.items.filter(function(item) {
        //     return item.completed;
        // });
        return (
            <header id="header">
                <div className="row">
                    <div className="col-md-6">
                        <p><i>{this.props.name} Journal Entries</i></p>
                        <p>
                        <span id="list-count" className="label label-default">
                        <strong>{this.props.items.length}</strong> entrie(s)
                        </span>
                        </p>
                    </div>
                </div>
            </header>
            );
    }
});


// List items component, shows the list of items
var ListItems = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // render the list of items
    render: function() {
        // get list of items to show, using the path to the current page
        var shown = this.props.items.filter(function(item) {
            return true;
        }, this);

        // using the list of items, generate an Item element for each one
        var list = shown.map(function(item) {
            return (
                <Item key={item.id} item={item} reload={this.props.reload}/>
                );
        }.bind(this));

        // render the list
        return (
            <table id="entry-table" className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {list}
                </tbody>
            </table>
            );
    }
});

var Viewentry = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            entry: {},
        };
    },

    componentDidMount: function() {
        console.log("you there?");
        api.getEntrybyID(this.context.router.getCurrentParams().entryID, this.setEntry);
    },

    reload: function()
    {
        api.getEntrybyID(this.context.router.getCurrentParams().entryID, this.setEntry);
    },

    setEntry: function(status, data)
    {
        console.log("bro");
        console.log(data);
        if(status){
            this.setState({
                entry: data.entry
            });
        }
        else {
            this.context.router.transitionTo("/login");
        }
    },


    render: function() {
        var date = new Date(this.state.entry.day);
        var keywords = ""
        if (this.state.entry.keywords) {
            for (var i = 0; i < this.state.entry.keywords.length; i++) {
                keywords += this.state.entry.keywords[i] + " ";
            }
        }
        return(
            <div>
                <div class="page-header">
                  <h1>{this.state.entry.title} <small>{(date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()}</small></h1>
                </div>      
                <p>{this.state.entry.text}</p>
                <p>Keywords: {keywords} </p>
            </div>
        );
    },

});

// Item shown in the todo list
var Item = React.createClass({
    // initial state
    getInitialState: function () {
        return {
            // editing this item
            editing: false,
            // text saved before editing started
            editText: this.props.item.title
        };
    },
    // set the focus and selection range when this item is updated
    componentDidUpdate: function (prevProps, prevState) {
        if (!prevState.editing && this.state.editing) {
            var node = this.refs.editField.getDOMNode();
            node.focus();
            node.setSelectionRange(0, node.value.length);
        }
    },
    // when the item is completed, toggle its state and update it
    toggleCompleted: function() {
        this.props.item.completed = !this.props.item.completed;
        api.updateItem(this.props.item, this.props.reload);
    },
    // called when the delete button is clicked for this item
    deleteItem: function() {
        api.deleteItem(this.props.item, this.props.reload);
    },
    // called when the item is double-clicked
    editItem: function() {
        this.setState({editing: true, editText: this.props.item.title});
    },
    // called when the item is changed
    changeItem: function (event) {
        this.setState({editText: event.target.value});
    },
    // called when the enter key is entered after the item is edited
    saveItem: function(event) {
        if (!this.state.editing) {
            return;
        }
        var val = this.state.editText.trim();
        if (val) {
            this.setState({editing: false, editText: val});
            this.props.item.title = this.state.editText;
            // save the item
            api.updateItem(this.props.item, this.props.reload);
        } else {
            // delete the item if there is no text left any more
            api.deleteItem(this.props.item,this.props.reload);
        }
    },
    // called when a key is pressed
    handleKeyDown: function (event) {
        var ESCAPE_KEY = 27;
        var ENTER_KEY = 13;
        // if the ESC key is pressed, then cancel editing
        // if the ENTER key is pressed, then save edited text
        if (event.which === ESCAPE_KEY) {
            this.setState({editing: false, editText: this.props.item.title});
        } else if (event.which === ENTER_KEY) {
            this.saveItem(event);
        }
    },
    // render the Item
    render: function() {
        // construct a list of classes for the item CSS
        var date = new Date(this.props.item.day);
        return (
            <tr>
                <td>
                    <a href = {"#/journal/" + this.props.item._id}>
                    {this.props.item.title}</a>
                </td>
                <td>
                    {(date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()}
                </td>
            </tr>
            );
    }
});

// API object
var api = {
    // get the list of items, call the callback when complete
    getItems: function(cb) {
        var url = "/api/items";
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            headers: {'Authorization': localStorage.token},
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                // if there is an error, remove the login token
                delete localStorage.token;
                if (cb)
                    cb(false, status);
            }
        });
    },

    keySearch: function(key, cb) {
        var url = "/api/entriessearch/" + key;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            headers: {'Authorization': localStorage.token},
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                // if there is an error, remove the login token
                delete localStorage.token;
                if (cb)
                    cb(false, status);
            }
        });
    },

    getEntrybyID: function(id, cb) {
        var url = "/api/entries/" + id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            headers: {'Authorization': localStorage.token},
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                // if there is an error, remove the login token
                delete localStorage.token;
                if (cb)
                    cb(false, status);
            }
        });
    },

    getEntries: function(cb) {
        var url = "/api/entries";
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            headers: {'Authorization': localStorage.token},
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                // if there is an error, remove the login token
                delete localStorage.token;
                if (cb)
                    cb(false, status);
            }
        });
    },
    // add an item, call the callback when complete
    addItem: function(title, cb) {
        var url = "/api/items";
        $.ajax({
            url: url,
            contentType: 'application/json',
            data: JSON.stringify({
                item: {
                    'title': title
                }
            }),
            type: 'POST',
            headers: {'Authorization': localStorage.token},
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                // if there is an error, remove the login token
                delete localStorage.token;
                if (cb)
                    cb(false, status);
            }
        });

    },
    addEntry: function(title, text, keywords, cb) {
        var url = "/api/entries";
        var cleanedUp = keywords.split(",");
        for (var i = 0; i < cleanedUp.length; i++) {
            cleanedUp[i] = cleanedUp[i].trim();
        }
        $.ajax({
            url: url,
            contentType: 'application/json',
            data: JSON.stringify({
                entry: {
                    'title': title,
                    'text': text,
                    'keywords': cleanedUp,
                }
            }),
            type: 'POST',
            headers: {'Authorization': localStorage.token},
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                // if there is an error, remove the login token
                delete localStorage.token;
                if (cb)
                    cb(false, status);
            }
        });
    },
    // update an item, call the callback when complete
    updateItem: function(item, cb) {
        var url = "/api/items/" + item.id;
        $.ajax({
            url: url,
            contentType: 'application/json',
            data: JSON.stringify({
                item: {
                    title: item.title,
                    completed: item.completed
                }
            }),
            type: 'PUT',
            headers: {'Authorization': localStorage.token},
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                // if there is any error, remove any login token
                delete localStorage.token;
                if (cb)
                    cb(false, status);
            }
        });
    },
    // delete an item, call the callback when complete
    deleteItem: function(item, cb) {
        var url = "/api/items/" + item.id;
        $.ajax({
            url: url,
            type: 'DELETE',
            headers: {'Authorization': localStorage.token},
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                // if there is an error, remove any login token
                delete localStorage.token;
                if (cb)
                    cb(false, status);
            }
        });
    }

};

// authentication object
var auth = {
    register: function(name, username, password, cb) {
        // submit request to server, call the callback when complete
        var url = "/api/users/register";
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: {
                name: name,
                username: username,
                password: password
            },
            // on success, store a login token
            success: function(res) {
                localStorage.token = res.token;
                localStorage.name = res.name;
                if (cb)
                    cb(true);
                this.onChange(true);
            }.bind(this),
            error: function(xhr, status, err) {
                // if there is an error, remove any login token
                delete localStorage.token;
                if (cb)
                    cb(false);
                this.onChange(false);
            }.bind(this)
        });
    },
    // login the user
    login: function(username, password, cb) {
        // submit login request to server, call callback when complete
        cb = arguments[arguments.length - 1];
        // check if token in local storage
        if (localStorage.token) {
            if (cb)
                cb(true);
            this.onChange(true);
            return;
        }

        // submit request to server
        var url = "/api/users/login";
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function(res) {
                // on success, store a login token
                localStorage.token = res.token;
                localStorage.name = res.name;
                if (cb)
                    cb(true);
                this.onChange(true);
            }.bind(this),
            error: function(xhr, status, err) {
                // if there is an error, remove any login token
                delete localStorage.token;
                if (cb)
                    cb(false);
                this.onChange(false);
            }.bind(this)
        });
    },
    // get the token from local storage
    getToken: function() {
        return localStorage.token;
    },
    // get the name from local storage
    getName: function() {
        return localStorage.name;
    },
    // logout the user, call the callback when complete
    logout: function(cb) {
        delete localStorage.token;
        if (cb) cb();
        this.onChange(false);
    },
    // check if user is logged in
    loggedIn: function() {
        return !!localStorage.token;
    },
    // default onChange function
    onChange: function() {},
};

// routes for the app
var routes = (
    <Route name="app" path="/" handler={App}>
	    <Route name="list" path ="/list" handler={List}/>
	    <Route name="active" path = "/list/active" handler={List}/>
	    <Route name="completed" path = "/list/completed" handler={List}/>
        <Route name="createjournal" path = "/journal/create" handler={CreateJournal}/>
        <Route name="listjournal" path = "/journal" handler={Journal}/>
	    <Route name="login" handler={Login}/>
	    <Route name="register" handler={Register}/>
        <Route name="viewentry" path = "/journal/:entryID" handler = {Viewentry}/>
    <DefaultRoute handler={Home}/>
    </Route>
    );

// Run the routes
Router.run(routes, function(Handler) {
    React.render(<Handler/>, document.body);
});
