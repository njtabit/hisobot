/*
 * Created:				  05 Jan 2018
 * Last updated:		05 Sept 2018
 * Developer(s):		CodedLotus
 * Description:			Shut down Hisobot client (on emergency or for updates)
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: 
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const Discord = require('discord.js');

module.exports = class ShutdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shutdown',
            aliases: ['logoff', 'logout'],
            group: 'etc',
            memberName: 'shutdown',
            description: 'Mods only: Shuts down Hisobot on command.',
            userPermissions: ['BAN_MEMBERS'],
            examples: ['shutdown', 'logout', 'logoff']
        });
    }

    run(msg) {
      //console.log("Kweh! (chocobot out!)");
	    //msg.message.channel.send("Hisobot out!");
	    
	    const author = msg.message.author;
	    const server = msg.message.guild;
      console.log(`Time is: ${new Date()}`);
	    console.log("Bot shutdown on user request");
	    console.log("user: " + author.username + " id: " + author.id);
	    console.log("server: " + server.name + " id: " + server.id);
	    
	   
	    //Discord Client Logout
	    this.client.destroy();
	    //Node.js process exit
	    setTimeout( () => { console.log("Exiting. Is it update time?"); process.exit(0); }, 1*1000);
      /*
      sendMessage(command, "Uploaded by Alpha12 of the Terra Battle Wiki");
      sendMessage(command, new Discord.Attachment("./assets/vengeful_heart.png"));
      */
      return msg.say("Hisobot out!");
    }
};