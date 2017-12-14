var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId; 
var connection_string = 'mongodb://localhost:13746/67328pet';

// var connection_string = "mongodb://admin:admin" + "@ds113746.mlab.com:13746/67328pet"
if(process.env.MLAB_NAMEOFMYDB_PASSWD){
  connection_string = "mongodb://admin:"+ process.env.MLAB_NAMEOFMYDB_PASSWD + "@ds113746.mlab.com:13746/67328pet"
  // connection_string = "mongodb://admin:"+ process.env.admin + "@ds113746.mlab.com:13746/67328pet"
}

var mongoDB;

var collection = 'users';

mongoClient.connect(connection_string, function(err, db){
  if (err) doError(err);
  console.log("Connected to MongoDB server at: "+ connection_string)
  mongoDB = db;
})


exports.findByUsername = function(username, callback) {
  var foundUser = null;
  /*
   * Err would be used if there was an error communicating with the database
   * This is different than not finding a User, which is a normal possibility
   * Since my example is just using an array, an error won't happen.
   * Your user information should be saved in a database.
   */
  var err = null;
  // search for the user with a given username
  mongoDB.collection(collection).find({'username' : username}).toArray(function(err,docs){
    if (err) {
      console.log(err);
      doError(err);
    }
    console.log(docs[0])
    foundUser = docs[0];
    callback(err,foundUser);
  })
  /*
   * Call the given callback function with err and the foundUser
   * err may be null (no error connecting to database)
   * and foundUser also null if no user by this name is found
   */
}

exports.findById = function(id, callback) {
  console.log("finding id: "+ id);
  var foundUser = null;
  /*
   * Err would be used if there was an error communicating with the database
   * This is different than not finding a User, which is a normal possibility
   * Since my example is just using an array, an error won't happen.
   * Your user information should be saved in a database.
   */
  var err = null;
  // search for the user with a given id
  mongoDB.collection(collection).find({'_id' : ObjectId(id)}).toArray(function(err,docs){
    if (err) {
      console.log(err);
      doError(err);
    }
    foundUser = docs[0];
    callback(err, foundUser);
  })
  /*
   * Call the given callback function with err and the foundUser
   * err may be null (no error connecting to database)
   * and foundUser also null if no user by this name is found
   */
}

exports.create = function(collection, data, callback){
  console.log("start insert function in the mongoModel");
  mongoDB.collection(collection).insertOne(
    data,
    function(err, status){
      if (err) doError(err);
      console.log("done with mongo insert");
      var success = (status.result.n == 1 ? true : false);
      callback(success);
      console.log("done with insert operation callback")
    });
  console.log("done with insert function")
};




// exports.retrieve = function(collection, query, callback){
//   console.log("start insert function in the mongoModel");
//   mongoDB.collection(collection).find(query).toArray(function(err, docs){
//     if (err) doError(err);
//     callback(docs);
//   });
// };

// exports.update = function(collection, filter, update, callback){
//   mongoDB.collection(collection).updateMany(
//     filter, update,{upsert:true}, function(err, status){
//       if (err) doError(err);
//       callback('Modifeid' + status.modifiedCount + ' and added '+ status.upsertedCount+" documents");
//     });
// };

// exports.delete = function(collection, body, callback){
//   mongoDB.collection(collection).deleteMany(body, function(err, docs){
//       if (err) doError(err);
//       callback(docs);
//   });
// };



var doError = function(e){
  throw new Error(e);
  console.error("ERROR: "+ e);
}; 

