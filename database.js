var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/terradb";


mongoClient.connect(url, function(error, db) {
    var users = "users"
    db.listCollections({name: users}).toArray(function(error, collections){
	if (error) {
	    console.log(error);
	    throw error;
	}
	if(collections.length == 0){
	    db.createCollection(users, function(error, res){
		if (error){
		    console.log(error);	    
		    throw error;
		}
	    });
	}
    });
});

