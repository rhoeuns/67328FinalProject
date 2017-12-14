var mongoModel = require("../models/gameScores.js");

var collection = 'gameScores';

exports.init = function(app) {
  // app.get("/retrieve", doRetrieve);
  app.put("/correct", doUpdateCorrect);
  app.put("/wrong", doUpdateWrong);
  app.get("/score", doRetrieve)
  app.all('/', index);
  app.get('/showGame',
          checkAuthentication,
          showGame);

  // app.delete("/delete", doDelete);
}
  // app.js put the Passport object on the Express object so we could get it 
  // handily here.  Note that this form of app.get is NOT a route, rather it is
  // a getter to go along with a prior setter.
  // Welcome page route
  
  // No path:  display the welcome page
index = function(req, res) {
  res.render('index');
};

  /*
   * A route to display information only for members who are logged in
   * The first argument is the route pattern
   * The second argument is a middleware function to check if the user making
   *    the request has been authenticated.  If so, it will call the next
   *    middleware argument.  If not authenticated, it will res.render an eror.
   * The third argument is the middleware function to handle the membersOnly
   *    route.
   */

doRetrieve = function(req, res){
  mongoModel.retrieve(
    collection,
    {username: req.user.username}, function(modelData){
      if (modelData.length){
        res.send(modelData[0]);
      } else {
        var message = "No documents with " +JSON.stringify(req.query)+
        " in collection " + req.params.collection+ " found.";
        res.render("message", {title: 'Mongo Demo', obj: message})
      }
    });
};



// Members Only path handler
function showGame(req, res) {
  console.log("show game");
  // console.log(req.user);
  // We only should get here if the user has logged in (authenticated) and
  // in this case req.user should be defined, but be careful anyway.
  if (req.user && req.user.firstname) {
    // Render the membership information view
    res.render('showGame', {member: req.user.firstname});
  } else {
    // Render an error if, for some reason, req.user.displayName was undefined 
    res.render('error', { 'message': 'Application error...' });
  }
};




doUpdateCorrect = function(req, res){
  console.log(req.body);
  var filter = {username: req.user.username}
  var update = {"$inc": {correct:1}}
  mongoModel.update(collection, filter, update, function(status){
    res.render('message', {title: "Mongo Demo", obj: status });
  })
};


doUpdateWrong = function(req, res){
  console.log(req.body);
  var filter = {username: req.user.username}
  var update = {"$inc": {wrong:1}}
  mongoModel.update(collection, filter, update, function(status){
    res.render('message', {title: "Mongo Demo", obj: status });
  })
};
/*
 * Check if the user has authenticated
 * @param req, res - as always...
 * @param {function} next - The next middleware to call.  This is a standard
 *    pattern for middleware; it should call the next() middleware component
 *    once it has completed its work.  Typically, the middleware you have
 *    been defining has made a response and has not needed any additional 
 *    middleware.
 */
function checkAuthentication(req, res, next){
    // Passport will set req.isAuthenticated
    console.log("authentication checking");
    if(req.isAuthenticated()){
      console.log("authentication checked");
        // call the next bit of middleware
        //    (as defined above this means doMembersOnly)
        next();
    }else{
        console.log("authentication denied");
        // The user is not logged in. Redirect to the login page.
        res.redirect("/index");
    }
};

