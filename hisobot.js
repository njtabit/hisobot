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

//r/TB Discord role names and alterations
var roleNames = require('./commands/role_maps');
//TODO: make this into a DB system that allows for better name association management

/* Metal Zone Tracker */
const MZSchedule = require("./constants/MZTable");

/* Daily Quest Tracker */
const DQSchedule = require("./constants/DQTable");

/* Metal Zone and Daily Quest Alert system */
const IntervalAlerts = require("./commands/interval.js");

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
function sendMessage(command, messageText){
	(command.pmUser ? command.message.author.send(messageText) : command.message.channel.send(messageText) );
  //if(command.pmUser){ command.message.author.send(messageText); }
	//else { command.message.channel.send(messageText); }
}



function commandIs(str, msg){
    //return msg.content.toLowerCase().startsWith("!" + str);
}

//Return JSO that contains the command, and relevant details following
function commandJSO(msg){
	//check if message actually is a command. If not, return a "no_task" JSO.
  //In the case of not having anything but a trigger, return an "annoyed" JSO
	var msgContent = msg.content, msgContentLower = msg.content.toLowerCase();
  
  const msgPrefixes  = [ "!", "hisobot,", "hisoguchi,"],
        thankYou     = [ "thank you", "thanks"],
        sorry        = [ "sorry", "im sorry", "i'm sorry"],
        praiseYamcha = [ "praiseyamcha", "praise yamcha"],
        hisoNames    = ["hisobot", "hisoguchi"];
	
	/*Checking for cases
	 * A: Command messages with no further details or tasks
	 * B: Messages that aren't commands
	 * C: Commands that start with the bot's nickname
	 * D: Commands that start with the bot's trigger character
	 */
	
  if( praiseYamcha.some( x => msgContentLower == x ) )
  { //Because why not
    msg.channel.send("Good, I don't need the Dragon Balls pulled out of storage.");
    return new Object(); //Escape safely
  }
  
  if( thankYou.some( x => msgContentLower.startsWith(x)) )
  {
    msgContentLower = ( msgContentLower.startsWith("thank you") 
      ? msgContentLower.slice("thank you".length).trim()
      : msgContentLower.slice("thanks".length).trim() );
    
    if( hisoNames.some( x => msgContentLower == x ) ){
      const goodjob = client.emojis.find("name", "goodjob"), love = client.emojis.find("name", "love");
      msg.react(goodjob); msg.react(love);
    }
    return new Object(); //Escape safely
    
  }
  
  if( sorry.some( x => msgContentLower.startsWith(x) ) )
  {
    msgContentLower = ( msgContentLower.startsWith("sorry") 
      ? msgContentLower.slice("sorry".length).trim()
      : ( msgContentLower.startsWith("im sorry") 
          ? msgContentLower.slice("im sorry".length).trim()
          : msgContentLower.slice("i'm sorry".length).trim() ) );
    
    if( hisoNames.some( x => msgContentLower == x ) ){
      const love = client.emojis.find("name", "love");
      msg.react(love);
    }
    return new Object(); //Escape safely 
  }
  
	//Manage case A with an object with task "annoyed" to trigger bot's annoyed message
	//TODO: Manage case A part b (bot_nickname resolution) for all cases
	if( msgPrefixes.some( x => x === msgContentLower) ) { return {task: "annoyed"}; }
  //if( msgContentLower === "!" || msgContentLower === "hisobot," || msgContentLower === "hisoguchi," ) { return {task: "annoyed"}; }
	//Manage case B with an object with no task to trigger bot's ignore response (or prevent a botception)
	//TODO: Manage case B part b (bot_nickname resolution) for all cases
	//Earlier existing bug: || over && prevented all commands from being read...
  else if ( msg.author.bot || !(msgPrefixes.some(x => msgContentLower.startsWith(x))) ) { return new Object(); }
  //else if ( message.author.bot || (!msgContentLower.startsWith('!') && !msgContentLower.startsWith("hisobot,") && !msgContentLower.startsWith("hisoguchi,") ) ) { return new Object(); }
	
	
	//Manage case C or D with a JSObject to trigger and fulfil the requirements of said task
	//Remove the command notification trigger, and clean unnecessary whiteSpace
	//sets msgContent to be the substring without header "!"
	else if ( msgContent.startsWith(msgPrefixes[0]) ) { msgContent = msgContent.slice(1).trim(); }
	
	//sets msgContent to be the substring without header "Hisobot"
	else if ( msgContentLower.startsWith(msgPrefixes[1]) ) { msgContent = msgContent.slice(msgPrefixes[1].length).trim(); }
	
	//sets msgContent to be the substring without header "[bot nickname]" ATM managed as Hisoguchi
	//TODO: Manage case D part b (bot_nickname resolution) for all cases
	else { msgContent = msgContent.slice(msgPrefixes[2].length).trim(); }
	
	delete msgContentLower;
	
	console.log("current command content: " + msgContent + " by: " + msg.author.username + " in: " + msg.channel );
  //if(msg.guild !== null){console.log("Guild is: " + msg.guild);}
	
	//set pmFlag on command if (-)pm command flag has been set in command details
	var pmFlag = (hasSubstr(msgContent, "-pm") || hasSubstr(msgContent, "pm"));
	if (pmFlag) {msgContent = msgContent.replace(/-?pm/gi, "").trim();}
  
  //Get the index of the first space. -1 means that it is a no-detail command
	//26 July 2017: Issue where -1 -> 0, causing a (0,0)-exclusive substring fails is resolved
	var indexOfSpace = msgContent.indexOf(' ');
	indexOfSpace = ( ( indexOfSpace == -1 ) ? msgContent.length : indexOfSpace );
	
	//create command to return JSObject to resolve in response to command messages
	var command = new Object();
	command.task = msgContent.substring(0, indexOfSpace).trim().toLowerCase();
	command.details = msgContent.substring(indexOfSpace).trim();
	command.message = msg; //Necessary to manage some content management
	command.pmUser = pmFlag;
	//console.log(command.pmUser + " : " + command.task);
	return command;
}



//Establishes the alert system for HisoBot
//14 Sept 2017: I don't know how to nest Discord Client functions within one another to make it work yet
function alerts(client, MZSchedule, DQSchedule){
  IntervalAlerts(client, MZSchedule, DQSchedule); //call at the start of the first minute
  client.setInterval(IntervalAlerts, 1000*60, client, MZSchedule, DQSchedule);
}



function pluck(array){
    return array.map(function(item) {return item["name"];});
}

function hasRole(mem, role){
    return (pluck(mem.roles).includes(role))
}

function onStart(){
	console.log("Hisobot online!");
  console.log(new Date());
  
  let now = new Date(), nextMinute = new Date();
    nextMinute.setMilliseconds(0); nextMinute.setSeconds(0); nextMinute.setMinutes(nextMinute.getMinutes() +1);
  client.setTimeout(alerts, nextMinute-now, client, MZSchedule, DQSchedule );
}

/*function onRest(){
	console.log("Kweh~ (nap time~)");
	message.channel.send("Kweh~ (nap time~)");
}*/

//Shut down server (on emergency or for updates)
function onShutDown(message){
	try{
    const permissions = message.member.permissions;
    if ( permissions.has("KICK_MEMBERS") ){
    
      //console.log("Kweh! (chocobot out!)");
      message.channel.send("Hisobot out!");
      
      const author = message.author;
      const server = message.guild;
      /*client.destroy((err) => {
        console.log(err);
      });*/
      console.log(customErrors.getShutDownError().message);
      console.log("user: " + author.username + " id: " + author.id);
      console.log("server: " + server.name + " id: " + server.id);
      
      delete author, server;
      
      //Discord Client Logout
      client.destroy();
      //Node.js process exit
      setTimeout(process.exit, 10*1000);
    }
    else { message.channel.send("Heh lol nope"); }
  } catch (err) { 
    //Could not get permissions
    console.log(err.message);
  }
}

//Feed the bot food (for fun)
//TODO: Figure what to feed hisos
function manageFeeding(details) {
	var response;
	switch(details.toLowerCase()){
		case "greens":
			response = "Food?\n*eats " + details + "*";
			break;
		default:
			response = "HEY, BURBABY! THAT'S NOT FOOD!";
	}
	return response;
}

//Add server roles to user based on command details
function manageRoles(command){
  try{
    const channel = command.message.channel, guild = client.guilds.find("name", "Terra Battle");

    if( channel instanceof Discord.GuildChannel && channel.name !== "bot-use" ){
      //console.log("Wrong channel reception");
      sendMessage(command, "Sorry, " + command.message.author.username + " let's take this to #bot-use");
      return;
    }
    const openRoles = roleNames.openRoles, voidRoles = roleNames.voidRoles;
    const guildRoles = guild.roles; //command.message.guild.roles;
    var roles = command.details.split(","),  guildMember = guild.members.get(command.message.author.id);
    
    var feedback = "";
    
    //Check to make sure the requested role isn't forbidden
    //Find role in guild's role collection
    //Assign role (or remove role if already in ownership of)
    //Append response of what was done to "feedback"
    roles.forEach(function(entry){
      entry = entry.trim();
      lowCaseEntry = entry.toLowerCase();
      
      //Ignore any attempts to try to get a moderator, admin, companion, bot, or specialty role.
      //Ignore: metal minion, wiki editor, content creator, pvp extraordinare
      /*voidRoles.forEach(
        function(currentValue){
          
        }
       );*/ //TODO: Manage Void Role rejection more elegantly
      if (!(voidRoles.some( x => lowCaseEntry.includes(x) )) ){
        
        //run requested role name through the roleName DB
        var roleCheck = openRoles.get(lowCaseEntry); //TODO: Make a DB that allows for server-specific role name checks
        var role;
        
        try{ role = guildRoles.find("name", roleCheck); }
        catch (err) { 
          //Role didn't exist
          console.log(err.message);
          console.log("User: " + command.message.author.name);
        }
        
        if( typeof role === 'undefined' || role == null ){ feedback += "So... role '" + entry + "' does not exist\n"; }
        else if( guildMember.roles.has(role.id) ) {
          guildMember.removeRole(role);
          feedback += "I removed the role: " + role.name + "\n"; }
        else {
          guildMember.addRole(role);
          feedback += "I assigned the role: " + role.name + "\n"; }
      } else { feedback += "FYI, I cannot assign '" + entry + "' roles"; }
      //guildMember = command.message.member;
    });
    //return feedback responses
    ( feedback.length > 0 ? command.message.channel.send(feedback) : "" );
  } catch (err) {
    console.log(err.message);
    console.log("User: " + command.message.author.username);
  }
}



function hasLambda(str){
	return str.search("lambda") || str.search("^") || str.search("Λ") ;
}

function wikiSearch(command){
	var bForCharacter = hasSubstr(command.details, "character");
	var bForLambda = hasLambda(command.details);
	
	var x = "";
	request("http://terrabattle.wikia.com/wiki/Special:Search?search=Nazuna&fulltext=Search&format=json", function(error, response, body) {
		//console.log(body);
		message.channel.send("Lemme check the library...");
		x = JSON.parse(body); //x becomes an array of JSOs
		var count = 0, response = "";
		do{
			var link_x = x[count];
			response = response.concat("\t" + link_x.title + ": " + link_x.url + "\n");
			++count;
		} while (count < 1);
		//console.log(x[0]); // print out the 0th JSO
		message.channel.send(response);
		
		//message.channel.send(body); //Voids 2k character limit of Discord messsages
		//x = body;
	});
}

function wikitest(command){
	var x = "", output = "Lemme check...\n";
	request("http://terrabattle.wikia.com/wiki/Special:Search?search=Nazuna&fulltext=Search&format=json", function(error, response, body) {
		//console.log(body);
		//message.channel.send("Lemme check...");
		x = JSON.parse(body); //x becomes an array of JSOs
		var count = 0;
		do{
			var link_x = x[count];
			output += "\t" + link_x.title + ": <" + link_x.url + ">\n";
			++count;
			delete link_x;
		} while (count < 1);
		//console.log(x[0]); // print out the 0th JSO
		//message.channel.send(response);
		
		//message.channel.send(body); //Voids 2k character limit of Discord messages
		//x = body;
		sendMessage(command, output);
	});
}

function metalZoneString(zoneType, zoneNum, zoneTime, showStamina){
	var outStr = (zoneType == "AHTK" ? "\t" : "") + zoneType + (zoneType == "AHTK" ? "" : zoneNum) + ": " + zoneTime;
	if (showStamina) {
		var times = zoneTime.split(":"), stamina = 0;
		times.forEach(function myFunction(item, index, arr) { arr[index] = parseInt(item); }); //conversion function
		if (times.length > 2) { times[0] = 24*times[0] + times[1]; times[1] = times[2];  }
		stamina += (times[0]*30 + Math.floor(times[1]/2));
		outStr += " (" + (stamina < 100 ? "0" : "" ) + (stamina < 10 ? "0" : "" ) + stamina + ")";
	}
	return outStr;
}

function metalZone(command){
	var showStamina = (hasSubstr(command.details, "-s") || hasSubstr(command.details, "s"));
	if (showStamina) {command.details = command.details.replace(/-?s/gi, "").trim();}
	var futureMZSchedule = "";
	var schedule = "Time remaining until: (D:HH:MM)\n```";
	if (command.details == "" || command.details == "all") {
		futureMZSchedule = MZSchedule.getNextZoneSchedule();
		for (var zone = 0; zone < MZSchedule._MAX_ZONE; ++zone){
			schedule += metalZoneString("MZ",   (zone+1), futureMZSchedule.openZoneSchedule[zone], showStamina);
			schedule += metalZoneString("AHTK", (zone+1), futureMZSchedule.openAHTKSchedule[zone], showStamina) + "\n";
		}
		//schedule += "```";
		//command.message.channel.send(schedule);
	}
	else{
		futureMZSchedule = "";
		switch ( parseInt(command.details) ){
			case 1: futureMZSchedule = MZSchedule.getSpecificZoneSchedule(1); break;
			case 2: futureMZSchedule = MZSchedule.getSpecificZoneSchedule(2); break;
			case 3: futureMZSchedule = MZSchedule.getSpecificZoneSchedule(3); break;
			case 4: futureMZSchedule = MZSchedule.getSpecificZoneSchedule(4); break;
			case 5: futureMZSchedule = MZSchedule.getSpecificZoneSchedule(5); break;
			case 6: futureMZSchedule = MZSchedule.getSpecificZoneSchedule(6); break;
			case 7: futureMZSchedule = MZSchedule.getSpecificZoneSchedule(7); break;
			default: command.message.channel.send( "I don't know that zone. You doing okay?" );
		}
		schedule += metalZoneString("MZ",   command.details, futureMZSchedule.openZoneSchedule, showStamina);
		schedule += metalZoneString("AHTK", command.details, futureMZSchedule.openAHTKSchedule, showStamina) + "\n";
		///command.message.channel.send(schedule);
	}
	schedule += "```";
	//(command.pmUser ? command.message.author.send(schedule) : command.message.channel.send(schedule) );
	//command.message.channel.send(schedule);
	sendMessage(command, schedule);
}




client.on('ready', () => {
  onStart();
	
  //console.log('Nazuna is online!');
	//message.channel.send('I'm back!');
  
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


// Search on wiki

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
	//calls the method on the python object
	python.hello(message);
    }

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
					  }*/
					 ).catch(function(error){
					     console.log(error);
					 });
	    python.mongo()
	});
    }
    
	var command = commandJSO(message);
	
	//var response = "What?\nRun that by me again."; //Done to manage promise issues
	switch(command.task){
		case "shutdown":
			onShutDown(message);
			
			//20 July 2017: Not sure if this message is reached.
			//01 Aug 2017: Message is reached if the user does not have authorization. Thanks @Paddington for being the first person to test that.
			//console.log("Shutdown test message");
			
			//20 July 2017: Is break ever reached if the process kills itself?
			break;
		
		case "role":
		case "roles":
			//response = manageRoles(command);
			//manageRoles(command);
      client.setTimeout(manageRoles, 1*1000, command);
			/*if (Response.response == "failure"){
				message.channel.send("This command only works in guild chats");
			} else { message.channel.send( Response.response ); }*/
			break;
		
		case "wikitest":
			wikitest(command);
			break;
		
		case "hungry?":
			//response = "Always";
			//if(command.pmUser){ message.author.send("Always"); } else { message.channel.send("Always"); }
			sendMessage(command, "Always")
			break;
		
		/*case "feed":
			message.channel.send( manageFeeding(command.details) );
			break;*/
		
		case "command":
		case "commands":
		case "help":
		case "-h":
		case "h":
			//message.channel.send("I hide the manual here <https://goo.gl/LYwrAF>");
			sendMessage(command, "I hide the manual here <https://goo.gl/LYwrAF>");
			break;
			
		case "wiki":
		case "wikia":
			message.channel.send("Coming soon!");
			break;
		
		case "mz":
		case "metal":
			metalZone(command);
			//message.channel.send("Coming soon!");
			break;
		
		case "name":
			message.channel.send("Boko asked for names.\nPeople sent in names.\n" +
				"pausetheequipment sent in HisoBot.\nPeople voted on those names.\n" + 
				"HisoBot got the most votes.\nMy name is HisoBot.\n" + 
				"But feel free to call me Hisoguchi.");
			break;
		
		case "annoyed":
			message.channel.send( "Heh, I'm ignoring you" );
	                break;

		case "arachnobot":
			//message.channel.send("https://i.imgur.com/mzBdnXf.png");
      sendMessage(command, "Made by Rydia of TBF (TerraBattleForum)");
      sendMessage(command, new Discord.Attachment("./assets/arachnobot_tale.png"));
			break;

		case "samatha":
			sendMessage(command, "from <http://i.imgur.com/SLTB7vW.png>");
			sendMessage(command, new Discord.Attachment("./assets/samatha.png"));
			break;
	    
		case "vh":
		case "vengeful":
      sendMessage(command, "Uploaded by Alpha12 of the Terra Battle Wiki");
      sendMessage(command, new Discord.Attachment("./assets/vengeful_heart.png"));
			//message.channel.send("https://vignette3.wikia.nocookie.net/terrabattle/images/8/82/Capture_d%E2%80%99%C3%A9cran_2016-12-03_%C3%A0_17.34.25.png/revision/latest?cb=20161204121839");
			break;
			
		case "repo":
			message.author.send("https://github.com/bokochaos/hisobot");
			break;
		
		case undefined:
			//Cases where it isn't a command message
			//Ignore as if it wasn't a relevant message
			break;

    default:
			//Cases where it isn't a recognized command
			//message.channel.send("What?\nRun that by me again.");
			//response = "What?\nRun that by me again.";
			sendMessage(command, "What?\nRun that by me again.");
	}
	
	//send feedback depending on if pmFlag is raised.
	//if(command.pmUser){ message.author.send(response); } else { message.channel.send(response); }
	
	//if(message.content == 'greens?'){ message.channel.send('Kweh (Please)'); }
	
	//if(message.content == '!feed greens'){ message.channel.send('Kweh? (food?)\n*eats greens*'); /*message.channel.send('*eats greens*');*/  }
    
	/*if(message.content == '!servers'){ 
		message.channel.send("Kweh (lemme check)");
		var servers = client.guilds; //returns a Collection of <Snowflake, Guild>
		
		//returns the number of guilds the bot is associated with
		//message.channel.send(servers.size);
		console.log("# of servers: " + servers.size);
		
		//log into the console the guild object (name) and its id
		//JS maps return value before key
		var iter = servers.forEach(
			(v,k) => {console.log("name:",v.name,"id:", k);}
		);
		
		
		//for (s in servers.values()) {
			//message.channel.send("Server id: " + s.id + " Server Name: " + s.name);
			//console.log(s.name);
		//}
	}*/
	
	/*if(message.content == "!wikitest"){
		var x = "";
		request("http://terrabattle.wikia.com/wiki/Special:Search?search=Nazuna&fulltext=Search&format=json", function(error, response, body) {
			//console.log(body);
			message.channel.send("Kweh (Lemme check)");
			x = JSON.parse(body); //x becomes an array of JSOs
			var count = 0, response = "";
			do{
				var link_x = x[count];
				response = response.concat("\t" + link_x.title + ": " + link_x.url + "\n");
				++count;
			} while (count < 5);
			//console.log(x[0]); // print out the 0th JSO
			message.channel.send(response);
			
			//message.channel.send(body); //Voids 2k character limit of Discord messages
			//x = body;
		});
		//console.log(x);
	}*/
	
	/*if(message.content == "!shutdown"){
		onShutDown(message);
	}*/
	/*var args = message.content.split(/[ ]+/);
    var i;
    var longName = "";

    if (commandIs("wiki", message)){
        if (args.length === 1){
            message.channel.send('What do you want to look for? ^^. Usage: `!wiki [search term]`');
        } else if (args.length === 2){
                if (args[1] === 'Mizell' || args[1 === 'mizell']){
                    message.channel.send('Oh, it looks like you made a typo. Don\'t worry I got you! ^^ http://terrabattle.wikia.com/wiki/Nazuna');
                } else {
                    if (args[1].charAt(args[1].length-1) === '^') {
                        
                        args[1].slice(0,-1);
                        message.channel.send('http://terrabattle.wikia.com/wiki/'+ args[1].charAt(0).toUpperCase()+args[1].slice(1,-1).toLowerCase()+'_Λ');
                        
                    } else {
                    message.channel.send('http://terrabattle.wikia.com/wiki/'+ args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase());
                }    
            }
        } else {
                longName = args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()
            for (i=2; i<args.length; i++){
                longName += "_"+args[i].charAt(0).toUpperCase()+args[i].slice(1).toLowerCase();     
                }
              message.channel.send('http://terrabattle.wikia.com/wiki/'+ longName); 
        }        
    }
    if (commandIs("recode", message)){
        message.channel.send('http://terrabattle.wikia.com/wiki/'+ args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()+'_Λ');
    }
    if (commandIs("tbcompendium", message)){
        message.channel.send('http://tbc.silverdb.it');
    }
    if (commandIs("tbstats", message)){
        message.channel.send('http://tbs.desile.fr/#/quick-start');
    }
    if (commandIs("chapter", message)){
        var chop ="";
        chop = args[0].substring(1);    
        message.channel.send('http://terrabattle.wikia.com/wiki/'+chop.charAt(0).toUpperCase()+chop.slice(1).toLowerCase()+'_'+args[1]+'#'+args[1]+'.'+args[2]);
    }


    if(commandIs("role", message)){
        let role = message.guild.roles.find("name",'Owner');
        let member = message.guild.member(message.author);
        member.addRole (role).catch(console.error);
    }
        // client.on('guildRole', guild =>{
        // if (args.length === 2){
        //     message.channel.send('You got the role '+args[1]);
        //     guild.member(message.author).addRole(args[1]).catch(Error => console.log(Error));    
        //     } else {
        //         message.channel.send('Error');
        //     }
        // })*/

});

// client.on('guildRole', guild =>{
//     var args = message.content.split(/[ ]+/);
//         if (args.length === 2){
//             message.channel.send('You got the role '+args[1]);
//             guild.member(message.author).addRole(args[1]).catch(Error => console.log(Error));    
              
//         } else {
//             message.channel.send('Error');
//         }
//     });


client.login( token );
