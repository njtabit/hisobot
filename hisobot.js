/*
 * Created:				  02 Jan 2018
 * Last updated:		01 Feb 2018
 * Developer(s):		CodedLotus
 * Description:			Core details and functions of Hisobot
 * Version #:			  2.0.0
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
    2.0.0: Changed core API to Discord.JS-Commando
    2.1.0: Added JS String templating (included with the TBxRoll add, tb1dq add, Interval bug fix as  2.1.0)
 * fork sourcecode:		https://github.com/danielmilian90/Nazuna
 * loaned code:       https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

//import the token and CommandoClientOptions
const SETUP = require('./auth/token');
//const token = require('./constants/token').token;
//const customErrors = require('./constants/errors');

//TB data imports
//const SKILLS = require('./constants/skills_data').Skills;

const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const path = require('path');
/*const oneLine = require('common-tags').oneLine;
const sqlite = require('sqlite');*/

/* Metal Zone Tracker */
const MZSchedule = require("./constants/MZTable");

/* Daily Quest Tracker */
const DQSchedule = require("./constants/DQTable");

/* Metal Zone and Daily Quest Alert system */
const IntervalAlerts = require("./constants/interval.js");




/* 
 * https://www.sitepoint.com/making-http-requests-in-node-js/
 * Used for HTTP requests for JSON data
 */
var request = require("request");

/*var python = require("./python.js");
var mongo = require("./database.js");
var commands = require("./commands.js");*/
//var mongoClient = require('mongodb').MongoClient;

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


/*** Start of the Easter Egg messages ***/
const thankYou     = [ "thank you", "thanks"],
        sorry        = [ "sorry", "im sorry", "i'm sorry"],
        praiseYamcha = [ "praiseyamcha", "praise yamcha"],
        hisoNames    = ["hisobot", "hisoguchi"];

//Praise LordYamcha
function PraiseYamcha(message, msgContentLower) {
  if( praiseYamcha.includes( msgContentLower ) ){
    //Because why not
    message.channel.send("Good, I don't need the Dragon Balls pulled out of storage.");
  }
}

function ThanksHisobot(message, msgContentLower) {
  if( thankYou.some( x => msgContentLower.startsWith(x)) ){
    msgContentLower = ( msgContentLower.startsWith("thank you") 
      ? msgContentLower.slice("thank you".length).trim()
      : msgContentLower.slice("thanks".length).trim() );
    
    if( hisoNames.includes( msgContentLower ) ){
      const goodjob = client.emojis.find("name", "goodjob"), love = client.emojis.find("name", "love");
      message.react(goodjob); message.react(love);
    }
  }
}

function SorryHisobot(message, msgContentLower){
  if( sorry.some( x => msgContentLower.startsWith(x) ) ){
    msgContentLower = ( msgContentLower.startsWith("sorry") 
      ? msgContentLower.slice("sorry".length).trim()
      : ( msgContentLower.startsWith("im sorry") 
          ? msgContentLower.slice("im sorry".length).trim()
          : msgContentLower.slice("i'm sorry".length).trim() ) );
    
    if( hisoNames.includes( msgContentLower ) ){
      const love = client.emojis.find("name", "love");
      message.react(love);
    }
  }
}

/*** End of the Easter Egg messages ***/

//Establishes the alert system for HisoBot
//14 Sept 2017: I don't know how to nest Discord Client functions within one another to make it work yet
function alerts(client, MZSchedule, DQSchedule){
  IntervalAlerts(client, MZSchedule, DQSchedule); //call at the start of the first minute
  try {
    client.setInterval(IntervalAlerts, 1000*60, client, MZSchedule, DQSchedule);
  } catch (err){
    console.log(client);
  }
}


/*** Commando Client: Combined Discord.js-commando + Discord.js client (by extension) ***/
const client = new Commando.CommandoClient(SETUP.options);
  client.MZSchedule = MZSchedule;
  client.DQSchedule = DQSchedule;


client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['tb1', 'Terra Battle 1 Command Group'],
        ['tb2', 'Terra Battle 2 Command Group'],
        ['tw', 'Terra Wars Command Group'],
        ['tb3', 'Terra Wars Command Group'],
        ['general', 'General Command Group'],
        ['etc', 'Extra Command Group']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

    

client.on('ready', () => {
  //commands.onStart(client);
  console.log("Hisobot2 online!");
  //Clear client's timeouts and intervals to prevent repeat spamming of alerts
  console.log("Time is: " + new Date());
  console.log("Clearing out timeouts and intervals");
  for (const t of client._timeouts) clearTimeout(t);
  for (const i of client._intervals) clearInterval(i);
  client._timeouts.clear();
  client._intervals.clear();
  //alert that the bot is online
  
  let now = new Date(), nextMinute = new Date();
  nextMinute.setMilliseconds(0); nextMinute.setSeconds(0); nextMinute.setMinutes(nextMinute.getMinutes() +1);
  client.setTimeout(alerts, nextMinute-now, client, MZSchedule, DQSchedule );
  //alerts(client, MZSchedule, DQSchedule);
});


// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
	// Send the message to a designated channel on a server:
	//const channel = member.guild.channels.find('name', 'member-log');
	// Do nothing if the channel wasn't found on this server
	//if (!channel) return;
	// Send the message, mentioning the member
	member.send(
		`Hi there, it seems like you are a new member. Welcome to the Discord!
My name is Hisoguchi, but you can call me Hisobot if you like.
If you are playing Terra Battle, please type \`!role Terra Battle\`.
If you are playing Terra Battle 2, please type \`!role Terra Battle 2\`.
If you are playing both, please type \`!role Terra Battle, Terra Battle 2\`.
For more resources and commands, I suggest \`!help\`, and \`!help <specific command name here>\` for more specific details.
See you around! Don't hesitate to ask questions. We have tons of answers~!`
	);
});

client.on('message', message => {
	
  var msgContentLower = message.content.toLowerCase();
  
	
	/*Checking for cases
	 * A: Command messages with no further details or tasks
	 * B: Messages that aren't commands
	 * C: Commands that start with the bot's nickname
	 * D: Commands that start with the bot's trigger character
	 */
	
  PraiseYamcha(message, msgContentLower);
  ThanksHisobot(message, msgContentLower);
  SorryHisobot(message,msgContentLower);
  
  
  /*
	 * Command = {
	 *   task:    [task_name_string],
	 *   details: [task_details_string],
	 *   message: [message object issuing command],
	 *   pmFlag:  [pm_task_results]
	 * }
	 */
    
    /*if (message.author.username != "hisobot"){
//	python.hello(message);	

	  if (!message.author.bot){
	    var url = "mongodb://localhost:27017/terradb";

	    mongoClient.connect(url, function(error, db) {
		if (error) {
		    console.log(error);
		    throw error;
		}
		db.collection("users").insert({id: message.author.username,
		  time: message.createdTimestamp,
		  message: message.content
		  }
		  ).catch(function(error){
		  console.log(error);
		  });/
		  python.mongo() 
	    });
	  }
	commands.parse(client, message);*/
    
});

client.on('error', error => {
  console.log('WebSocket error @ ' + new Date());
  console.log(error);
  client.destroy().then(() => client.login( SETUP.token ));
});

client.on('disconnect', event => {
  console.log('Disconnect code: ' + event.code);
  console.log('reason: ' + event.reason);
  client.destroy().then(() => client.login( SETUP.token ));
});

client.login( SETUP.token );


/*const commando = require('../src');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const sqlite = require('sqlite');
const token = require('./auth').token;

const client = new commando.Client({
	owner: '90997305578106880',
	commandPrefix: 'cdev'
});

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => {
		console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});

client.setProvider(
	sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);


client.login(token);*/