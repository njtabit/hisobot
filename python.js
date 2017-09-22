var zerorpc = require("zerorpc");
var spawn = require("child_process").spawn;
var py = spawn('python3', ['server.py'])
var zerorpcClient = new zerorpc.Client();
zerorpcClient.connect("tcp://127.0.0.1:4242");

module.exports = {
    hello: function (message){
	zerorpcClient.invoke("hello", message.content, message.author.username, message.createdTimestamp, function(error, reply, streaming) {
	    if(error){
		console.log("ERROR: ", error);
	    }
	    console.log(reply);
	});
    },

    mongo: function(){
	zerorpcClient.invoke("mongo", function(error, reply, streaming) {
	    if(error){
		console.log("ERROR: ", error);
	    }
	    console.log(reply);
	});
    }
}
