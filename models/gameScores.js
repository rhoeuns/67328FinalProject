var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId; 
var users = require('./users');

var connection_string = 'mongodb://localhost:13746/67328pet';

// var connection_string = "mongodb://admin:admin" + "@ds113746.mlab.com:13746/67328pet"
if(process.env.MLAB_NAMEOFMYDB_PASSWD){
  connection_string = "mongodb://admin:"+ process.env.MLAB_NAMEOFMYDB_PASSWD + "@ds113746.mlab.com:13746/67328pet"
  // connection_string = "mongodb://admin:"+ process.env.admin + "@ds113746.mlab.com:13746/67328pet"
}

var mongoDB;

var collection = 'gameScores';

mongoClient.connect(connection_string, function(err, db){
  if (err) doError(err);
  console.log("Connected to MongoDB server at: "+ connection_string)
  mongoDB = db;
})

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

exports.update = function(collection, filter, update, callback){
  mongoDB.collection(collection).updateMany(
    filter, update,{upsert:true}, function(err, status){
      if (err) doError(err);
      callback('Modifeid' + status.modifiedCount + ' and added '+ status.upsertedCount+" documents");
    });
};


exports.retrieve = function(collection, query, callback){
  console.log("start insert function in the mongoModel");
  mongoDB.collection(collection).find(query).toArray(function(err, docs){
    if (err) doError(err);
    callback(docs);
  });
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