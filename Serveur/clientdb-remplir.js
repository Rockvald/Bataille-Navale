var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var duels = db.db("bndb").collection("duels");
  duels.insertOne({ nom:"TOTO1", age : 1}).catch(err=>console.log("erreur : ", err.message));

  var records = [
    { nom:"TOTO2", age : 2},
    { nom:"TOTO3", age : 3},
    { nom:"TOTO4", age : 4},
  ];

  duels.insertMany(records)
  .then(d=> db.close() )
  .catch(err=>console.log("erreur : ", err.message));

})
