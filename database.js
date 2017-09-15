var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/terradb";

mongoClient.connect(url, function(error, db) {
    if (error) {
	console.log(error);
	throw error;
    }
    console.log("created");
    db.close();

});
