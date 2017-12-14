var mongoModel = require("../models/users.js");
var gameModel = require("../models/gameScores.js");

exports.init = function(app) {
  app.post("/createUser", doCreate);

}

const collection = "users";

index = function(req, res){
  res.render('help', {title: "MondoDB Test"})
};


doCreate = function(req, res){
  console.log("starting doCreate in Route");
  if (Object.keys(req.body).length == 0){
    res.render('message', {title: 'Mongo Demo', obj: "No create message body found"});
    return;
  }
  //Call create model from Users
  mongoModel.create(collection, req.body, function(result){
    var success = (result ? "create successful" : "create unsuccessful");
    res.render('membersInfo', {member: req.body.username});
    console.log("done with callback in dbRoutes create");
  })
  //Call create model from gameScores
  gameModel.create('gameScores', {'correct': 0, 'wrong': 0, 'username': req.body.username}, function(result){
    var success = (result ? "create successful" : "create unsuccessful");
    console.log("created game collection data");
  })
  console.log("Done with doCreate");
};
