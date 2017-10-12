/*
 * Created:				  26 June 2017
 * Last updated:		14 Sept 2017
 * Developer(s):		CodedLotus
 * Description:			Core details and functions of Hisobot
 * Version #:			  1.1.1
 * Version Details:
		0.0.0: Core code came from Nazuna Bot
		0.0.1: variable string storing bot token changed to constant
		0.0.2: constant string storing bot token changed to object, and then exportable with function getToken() to return token string.
		0.0.3: Able to pull JSON data and use data to put out information as messages.
		0.0.4: Changed String-based command resolution from if-else to Switch statement-based
		0.0.5: Created commandJSO function to manage command decomposition easier
		0.0.8: Role functionality ~90% done. Bot token turned to external exported string.
		0.0.9: Changed from Chocobot to Hisobot for /r/TB usage. Early Wikia search in development.
		0.1.0: Full-Schedule Metal Zone look-ahead functionality added to the bot.
		1.0.0: Multi-functional bot released for Discord use via GCE (21 Aug 2017)
		1.0.1: "Hisoguchi" trigger terms added to commandJSO
		1.0.2: Partial-Schedule Metal Zone look-ahead functionality extended Full-Schedule look-ahead
		1.0.4: Better Metal Zone return string management and stamina-until functionality added; VH chart added; repo link added
		1.0.5: Role edits made based on role name changes and server changes
    1.1.0: Added interval-based alerts for Hisobot to send out.
    1.1.1: Changed some requires in accord with their module export changes.
 * fork sourcecode:		https://github.com/danielmilian90/Nazuna
 */


//import the function getToken() as a part of botCodes to allow access to bot token
const token = require('./constants/token').token;
//const token = require('./constants/token').token;
const customErrors = require('./constants/errors');

//TB data imports
//const SKILLS = require('./constants/skills_data').Skills;

const Discord = require('discord.js');
//const commando = require('discord.js-commando');
const client = new Discord.Client();
//const client = new commando.Client();

/* 
 * https://www.sitepoint.com/making-http-requests-in-node-js/
 * Used for HTTP requests for JSON data
 */
var request = require("request");

var python = require("./python.js");
var mongo = require("./database.js");
var commands = require("./commands.js");
var mongoClient = require('mongodb').MongoClient;

/*
 * Helper Functions that I will use frequently
 *
 */

//Created by CMS from https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function
String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};

//Check if string has substring
function hasSubstr(str, searchStr){
	return str.includes(searchStr);
}

//Check what role the user has that elevates their permissions
function checkHoistRole(command){
	return command.message.member.hoistRole;
}

//send the output message depending on how the command was structured

function commandIs(str, msg){
    //return msg.content.toLowerCase().startsWith("!" + str);
}

//Establishes the alert system for HisoBot
//14 Sept 2017: I don't know how to nest Discord Client functions within one another to make it work yet

/*function onRest(){
	console.log("Kweh~ (nap time~)");
	message.channel.send("Kweh~ (nap time~)");
}*/

client.on('ready', () => {
  commands.onStart(client);
});


// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
	// Send the message to a designated channel on a server:
	//const channel = member.guild.channels.find('name', 'member-log');
	// Do nothing if the channel wasn't found on this server
	//if (!channel) return;
	// Send the message, mentioning the member
	member.send(
		"Hi there, it seems like you are a new member. Welcome to the Discord!\n" +
		"My name is Hisobot, but you can call me Hisoguchi if you like.\n" +
		"If you are playing Terra Battle, please type `!role Terra Battle`. "+
		"If you are playing Terra Battle 2, please type `!role Terra Battle 2`. "+
		"If you are playing both, please type `!role Terra Battle, Terra Battle 2`."
	);
});

client.on('message', message => {
	/*
	 * Command = {
	 *   task:    [task_name_string],
	 *   details: [task_details_string],
	 *   message: [message object issuing command],
	 *   pmFlag:  [pm_task_results]
	 * }
	 */
    
    if (message.author.username != "hisobot"){
//	python.hello(message);	

	  if (!message.author.bot){
	    var url = "mongodb://localhost:27017/terradb";

	    mongoClient.connect(url, function(error, db) {
		if (error) {
		    console.log(error);
		    throw error;
		}
		/*db.collection("users").insert({id: message.author.username,
		  time: message.createdTimestamp,
		  message: message.content
		  }
		  ).catch(function(error){
		  console.log(error);
		  });/
		  python.mongo() */
	    });
	  }
	commands.parse(client, message);
    }
});

client.login( token );
