var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var duels = db.db("bndb").collection("duels");
  //console.log(duels)
  duels.find({}).toArray().then(
    data => {
       //console.log(data)
       for(let d of data) console.log(d)
       db.close();
    });
  })
