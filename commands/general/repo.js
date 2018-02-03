/*
 * Created:				  20 Jan 2018
 * Last updated:		20 Jan 2018
 * Developer(s):		CodedLotus
 * Description:			Repo link command
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Have a fully functional Repo sender prepared for use
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

module.exports = class RepoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'repo',
            group: 'general',
            memberName: 'repo',
            description: 'Check out the code',
            throttling: {
              usages: 2,
              duration: 30
            },
        });
    }

    run(msg) {
      
      return msg.direct("We keep 2 versions:\n" +
                        "Master: <https://github.com/bokochaos/hisobot>\n" +
                        "Developer: <https://github.com/bokochaos/hisobot/tree/teamdev>\n" + 
                        "Provide a couple good expansions/updates and we'll get you a new role!");
    }
};