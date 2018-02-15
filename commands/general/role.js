/*
 * Created:				  05 Jan 2018
 * Last updated:		12 Jan 2018
 * Developer(s):		CodedLotus
 * Description:			/r/TB Discord role assignment command
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Operational command based on original functionality has been recreated in commando fashion
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const Discord = require('discord.js');

//r/TB Discord role names and alterations
const tbRoles = require('./../../constants/role_maps');

module.exports = class RoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'role',
            aliases: ['roles'],
            group: 'general',
            memberName: 'role',
            description: 'Add/remove /r/TerraBattle roles for channel access.',
            examples: ['role tb1', 'roles tb2, tw', 'roles tbf,coop,tb2'],
            args: [
                {
                  key: 'roleNames',
                  prompt: 'Which role(s) did you want?',
                  type: 'string',
                  min: 2,
                  parse: roleNames => {
                    return roleNames.split(",");
                  }
                }
            ]
        });
    }

    run(msg, args) {
      /*
       * TODO: https://discordjs.guide/#/creating-your-bot/common-questions?id=how-do-i-prompt-the-user-for-additional-input 
       *   Implement validation for mentioned user role assignment (aka "gifting/gifted roles")
       */
      
      //Reject improper channel usage
      if( msg.channel instanceof Discord.GuildChannel && msg.channel.name !== "bot-use" ){
        return msg.say("Sorry, " + msg.author.username + " let's take this to #bot-use");
      }
      return msg.say( this.manageRoles(msg, args.roleNames) );
      //return msg.say("Testing: " + args.roleNames + " " + typeof args.roleNames + " " + args.roleNames.length);
    }
    
    //Former role management code
    manageRoles(msg, roleNames) {
      try {
        const guild = this.client.guilds.find("name", "Terra Battle"); //231689935910993920

        const openRoles = tbRoles.openRoles, voidRoles = tbRoles.voidRoles;
        const guildRoles = guild.roles;
        var guildMember = guild.member(msg.author);
        
        var feedback = "";
        
        //Check to make sure the requested role isn't forbidden
        //Find role in guild's role collection
        //Assign role (or remove role if already in ownership of)
        //Append response of what was done to "feedback"
        roleNames.forEach(function(entry){
          var entry = entry.trim(), lowCaseEntry = entry.toLowerCase();
          console.log(entry);
          
          //Ignore any attempts to try to get a moderator, admin, companion, bot, or specialty role.
          //Ignore: metal minion, wiki editor, content creator, pvp extraordinare
          //TODO: Manage Void Role rejection more elegantly
          if ( voidRoles.some( x => lowCaseEntry.includes(x) || x.includes(lowCaseEntry) ) )
            { feedback += "FYI, I cannot assign '" + entry + "' roles. Reasons.\n"; }
          
          else {
            //run requested role name through the roleName DB
            var roleCheck = openRoles.get(lowCaseEntry); //TODO: Make a DB that allows for server-specific role name checks
            var role;
            
            try{ role = guildRoles.find("name", roleCheck); }
            catch (err) { 
              //Role didn't exist
              console.log(err.message);
              console.log("User: " + msg.author.name + " role: " + entry);
            }
            
            if ( typeof role === 'undefined' || role == null ){ feedback += "So... role '" + entry + "' does not exist.\n"; }
            else if ( guildMember.roles.has(role.id) ) {
              guildMember.removeRole(role);
              feedback += "I removed the role: " + role.name + "\n"; }
            else {
              guildMember.addRole(role);
              feedback += "I assigned the role: " + role.name + "\n"; }
          }
        });
        //return feedback responses
        //( feedback.length > 0 ? command.message.channel.send(feedback) : "" );
        return feedback;
        
      } catch (err) {
        console.log(err);
        console.log("User: " + msg.author.username);
        return "There was an error. Paging @Boko#3246. Please check logs ASAP.";
      }
    }
};