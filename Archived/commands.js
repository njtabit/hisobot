const utils = require("./utils.js");
const python = require("./python.js");
const Discord = require("discord.js");
//r/TB Discord role names and alterations
const roleNames = require('./commands/role_maps');
const request = require('request');
//TODO: make this into a DB system that allows for better name association management

/* Metal Zone Tracker */
const MZSchedule = require("./constants/MZTable");

/* Daily Quest Tracker */
const DQSchedule = require("./constants/DQTable");

/* Metal Zone and Daily Quest Alert system */
const IntervalAlerts = require("./commands/interval.js");

var commands = {};
exports.commands = commands;
module.exports = {
  parse: function(client, message){
    var command = commandJSO(client, message);
    var complete = false;
    var task = command.task;
    if (task != undefined){
      value = commands[task];
      if (value != undefined){
        value(client, message);
      } else {
      utils.sendMessage(command, "What?\nRun that by me again.");
      }
    }
  },

  onStart: function(client){
    //Clear client's timeouts and intervals to prevent repeat spamming of alerts
    console.log("Time is: " + new Date());
    console.log("Clearing out timeouts and intervals");
    for (const t of client._timeouts) clearTimeout(t);
    for (const i of client._intervals) clearInterval(i);
    client._timeouts.clear();
    client._intervals.clear();
    //alert that the bot is online
    console.log("Hisobot online!");
    console.log(new Date());
    
    let now = new Date(), nextMinute = new Date();
    nextMinute.setMilliseconds(0); nextMinute.setSeconds(0); nextMinute.setMinutes(nextMinute.getMinutes() +1);
    client.setTimeout(alerts, nextMinute-now, client, MZSchedule, DQSchedule );
  }
    
    
};

//Shut down server (on emergency or for updates)
function onShutDown(client, message){
    try{
      const shutdown = {name: "ShutDownError", message: "Bot shutdown on user request"};
	const permissions = message.member.permissions;
	if ( permissions.has("KICK_MEMBERS") ){
	    
	    //console.log("Kweh! (chocobot out!)");
	    message.channel.send("Hisobot out!");
	    
	    const author = message.author;
	    const server = message.guild;
	    /*client.destroy((err) => {
              console.log(err);
	      });*/
	    //console.log(customErrors.getShutDownError().message);
      console.log(shutdown.message);
	    console.log("user: " + author.username + " id: " + author.id);
	    console.log("server: " + server.name + " id: " + server.id);
	    
	    delete author, server;
	    
	    //Discord Client Logout
	    client.destroy();
	    //Node.js process exit
	    setTimeout(process.exit, 1*1000);
	}
	else { message.channel.send("Heh lol nope"); }
    } catch (err) { 
	//Could not get permissions
	console.log(err.message);
    }
}

var commands = {};
commands.shutdown = function(client, message){
    onShutDown(client, message);
};

commands.role = function(client, message){
    var command = commandJSO(client, message);
    //response = manageRoles(command);
    //manageRoles(command);
    client.setTimeout(manageRoles, 1*1000, command, client);
    /*if (Response.response == "failure"){
      message.channel.send("This command only works in guild chats");
      } else { message.channel.send( Response.response ); }*/
    
};
commands.roles = commands.role;

commands.repo = function(client, message){
    var command = commandJSO(client, message);    
    message.author.send("https://github.com/bokochaos/hisobot");
};

commands.command = function(client, message){
    var command = commandJSO(client, message);
    commandmap = {}

    // Get all unique commands
    for (key in commands){
	if (commandmap.size == 0){
	    commandmap[key] = commands[key];
	} else {
	    add = true;
	    for (mapkey in commandmap){
		if (commands[key] == commandmap[mapkey]){
		    add = false;
		} 
	    }
	    if(add){
		commandmap[key] = commands[key];
	    }
	}
    }

    // Sort unique commands
    commandlist = "";
    Object.keys(commandmap)
	.sort()
	.forEach(function(key){
	    commandlist += key + ", ";
	});
    commandlist = commandlist.slice(0, -2);
    
    sendMessage(command, "I hide the manual here <https://goo.gl/LYwrAF>");
    sendMessage(command, "List of commands: ");
    sendMessage(command, commandlist);
};

commands.commands = commands.command;
commands['-h'] = commands.command;
commands.help = commands.command;
commands['h'] = commands.command;


commands.wiki = function(client, message){
    var command = commandJSO(client, message);    
    wikitest(command);
};

commands.wikia = commands.wiki;

commands.wikitest = function(client, message){
    wikitest(command);
};

commands.hungry = function(client, message){
    var command = commandJSO(client, message);    
    sendMessage(command, "Always");
}

commands.name = function(client, message){
    message.channel.send("Boko asked for names.\nPeople sent in names.\n" +
			 "pausetheequipment sent in HisoBot.\nPeople voted on those names.\n" + 
    			 "HisoBot got the most votes.\nMy name is HisoBot.\n" + 
			 "But feel free to call me Hisoguchi.");
};

commands.annoyed = function(client, message){
    message.channel.send( "Heh, I'm ignoring you" );
};

// TB General
commands.samatha = function(client, message){
    var command = commandJSO(client, message);    
    sendMessage(command, "Author: __Rexlent__\nSource: <https://www.pixiv.net/member_illust.php?mode=medium&illust_id=48388120>");
    sendMessage(command, new Discord.Attachment("./assets/samatha.png"));
};
commands.samantha = commands.samatha;


// TB1
commands.tb1 = function(client, message){
    var command = commandJSO(client, message);
    wikitest(command);
};

commands.tb1wiki = commands.tb1;
commands.wiki1 = commands.tb1;

commands.mz = function(client, message){
    var command = commandJSO(client, message);
    metalZone(command);
};

commands.metal = commands.mz

commands.arachnobot = function(client, message){
    var command = commandJSO(client, message);        
    sendMessage(command, "Made by Rydia of TBF (TerraBattleForum)");
    sendMessage(command, new Discord.Attachment("./assets/arachnobot_tale.png"));
};

commands.vh = function(client, message){
    var command = commandJSO(client, message);    
    sendMessage(command, "Uploaded by Alpha12 of the Terra Battle Wiki");
    sendMessage(command, new Discord.Attachment("./assets/vengeful_heart.png"));
};

commands.vengeful = commands.vh;
commands.vengefulhearts = commands.vh;


// TB2
commands.tb2 = function(client, message){
    var command = commandJSO(client, message);
    tb2wiki(command);
};

commands.tb2wiki = commands.tb2;
commands.wiki2 = commands.tb2;

commands.tb2elements = function(client, message){
    var command = commandJSO(client, message);
    sendMessage(command, "Terra Battle 2 elements chart");
    sendMessage(command, new Discord.Attachment("./assets/tb2_elements.png"));
};

commands.tb2elementsgraph = function(client, message){
    var command = commandJSO(client, message);
    sendMessage(command, "Terra Battle 2 elements graph");
    sendMessage(command, new Discord.Attachment("./assets/tb2_elements_graph.png"));    
};


function commandJSO(client, msg){
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
	var pmFlag = (msgContent.includes("-pm") || msgContent.includes("pm"));
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

function tb2wiki(command){

    var wiki = "https://terrabattle2.gamepedia.com/index.php?search="
    python.match_string(command.details).then(
	function(best_match) {
	    var join = best_match.split(" ").join("_");	    
	    sendMessage(command, wiki+join);
	},
	function(error) {
	    console.error("Failed!", error);
	}
    );
};

function hasLambda(str){
	return str.search("lambda") || str.search("^") || str.search("Λ") ;
}

function wikiSearch(command){
	var bForCharacter = command.details.includes("character");
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

function alerts(client, MZSchedule, DQSchedule){
    IntervalAlerts(client, MZSchedule, DQSchedule); //call at the start of the first minute
    try {
	client.setInterval(IntervalAlerts, 1000*60, client, MZSchedule, DQSchedule);
    } catch (err){
	console.log(client);
    }
}

function pluck(array){
    return array.map(function(item) {return item["name"];});
}

function hasRole(mem, role){
    return pluck(mem.roles).includes(role)
}

function sendMessage(command, messageText){
    command.pmUser ? command.message.author.send(messageText) : command.message.channel.send(messageText);
}

function metalZone(command){
	var showStamina = (command.details.includes("-s") || command.details.includes("s"));
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
function manageRoles(command, client){
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

