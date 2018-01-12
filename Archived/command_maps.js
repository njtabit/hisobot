/*
 * Created:				  05 Sep 2017
 * Last updated:		05 Sep 2017
 * Developer(s):		CodedLotus
 * Description:			Return a Discord.JS Collection object with pairs for command names
 * Version #:			1.0.0
 * Version Details:
		1.0.0: "Constant" list of names used until live database is built
		
 */

//const Collection = require('../discord.js/util/Collection');

/**
 *  A collection of command names and their alternate names that pertain to commands within the /r/TerraBattle subreddit
 * @type {Collection<string,string>}
 */
var cmdNames = new Map();
const cmdStrings = ["metal.js", "role.js", "wikitest.js", "hungry.js", "help.js", "annoyed.js", "arachnobot.js", "vh.js", "repo.js", "name.js", "shutdown.js"];

cmdNames.set("metal", "metal.js");
cmdNames.set("mz", "metal.js");

cmdNames.set("role", "role.js");
cmdNames.set("roles", "role.js");

cmdNames.set("wikitest", "wikitest.js");

cmdNames.set("hungry?", "hungry.js");

cmdNames.set("help", "help.js");
cmdNames.set("h", "help.js");
cmdNames.set("-h", "help.js");
cmdNames.set("command", "help.js");
cmdNames.set("commands", "help.js");

cmdNames.set("annoyed", "annoyed.js");

cmdNames.set("arachnobot", "arachnobot.js");

cmdNames.set("vh", "vh.js");
cmdNames.set("vengeful", "vh.js");

cmdNames.set("repo", "repo.js");

cmdNames.set("name", "name.js");

cmdNames.set("shutdown", "shutdown.js");

cmdNames.set("reload", "reload.js");


exports.cmdNames = cmdNames;