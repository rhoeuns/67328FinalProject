var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var express = require('express');
var app = express();

// Set the views directory
app.set('views', __dirname + '/views');

// Define the view (templating) engine
app.set('view engine', 'ejs');

// Define how to log events
app.use(morgan('tiny'));	

// parse application/x-www-form-urlencoded, with extended qs library
app.use(bodyParser.urlencoded({ extended: true }));

/*** PASSPORT ***
 * This is the only line in app.js that is added with regards to using
 * Passport (http://passportjs.org).
 * Initialization and configuration for using Passport is done in the
 * authentication.js model.  The use of Passport is woven into the
 * routes defined in memberRoutes.js.
 * This "set" simply sets the app attribute 'passport' to the object returned
 * by the init(app).  This is done so that we can "get" the passport object
 * in routes/memberRoutes.js.  
 */
app.set('passport', require('./models/authentication.js').init(app));

// Load all routes in the routes directory
fs.readdirSync('./routes').forEach(function (file){
  // There might be non-js files in the directory that should not be loaded
  if (path.extname(file) == '.js') {
    console.log("Adding routes in "+file);
  	require('./routes/'+ file).init(app);
  	}
});

// Handle static files
app.use(express.static(__dirname + '/public'));
  
// Catch any routes not already handed with an error message
app.use(function(req, res) {
	var message = 'Error, did not understand path '+req.path;
	// Set the status to 404 not found, and render a message to the user.
  res.status(404).render('error', { 'message': message });
});

var httpServer = require('http').createServer(app);


httpServer.listen(50000, function() {
  console.log('Listening on port:'+this.address().port);
});
