/*
 * Created:				  05 Jan 2018
 * Last updated:		06 Sept 2018
 * Developer(s):		Paddington, CodedLotus
 * Description:			Vengeful Hearts Event Flow Chart command
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Have a fully functional version prepared for use
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

module.exports = class SamathaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'samatha',
            aliases: ['sam','samantha'],
            group: 'general',
            memberName: 'samatha',
            description: 'You know. ( ͡° ͜ʖ ͡°)',
            examples: ['Samatha', 'Samantha','sam'],
            throttling: {
              usages: 2,
              duration: 30
            },
        });
    }

    run(msg) {
      
      const SamEmbed = new RichEmbed()
        .setTitle("SamaNtha?")
        .setDescription("Author: __Rexlent__")
        .setURL("https://www.pixiv.net/member_illust.php?mode=medium&illust_id=48388120")
        .setColor([250, 217, 90])
        .setImage("https://cdn.discordapp.com/attachments/360906433438547978/399155381298790411/samatha.png")
        .setFooter("You know. ( ͡° ͜ʖ ͡°)")
        .setTimestamp();

      /*{ 
        "embed": {
          "title": "SamaNtha?",
          "description": "Author: __Rexlent__",
          "url": "https://www.pixiv.net/member_illust.php?mode=medium&illust_id=48388120",
          "color": 16439642,
          "footer": {
            "text": "You know. ( ͡° ͜ʖ ͡°)"
          },
          "image": {
            "url": "https://cdn.discordapp.com/attachments/360906433438547978/399155381298790411/samatha.png"
          }
        }
      };*/
      
      /*
      sendMessage(command, "Uploaded by Alpha12 of the Terra Battle Wiki");
      sendMessage(command, new Discord.Attachment("./assets/vengeful_heart.png"));
      */
      return msg.embed(SamEmbed);
    }
};