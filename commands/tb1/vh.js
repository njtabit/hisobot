/*
 * Created:				  05 Jan 2018
 * Last updated:		06 Sept 2018
 * Developer(s):		Paddington, CodedLotus
 * Description:			Vengeful Hearts Event Flow Chart command
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Returns the TB Wikia chart + link to event page.
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

module.exports = class VHCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'vh',
            aliases: ['vengeful','vengefulheart'],
            group: 'tb1',
            memberName: 'vh',
            description: 'Replies with the Vengeful Heart event flow chart.',
            examples: ['vh', 'vengeful', 'vengefulheart'],
        });
    }

    run(msg) {
      const VH_Embed = new RichEmbed()
        .setTitle("Vengeful Heart Event Chart")
        .setDescription("Uploaded by Alpha12 of the Terra Battle Wiki")
        .setURL("http://terrabattle.wikia.com/wiki/Vengeful_Heart")
        .setColor([241, 236, 217])
        .setImage("https://vignette.wikia.nocookie.net/terrabattle/images/8/82/Capture_d%E2%80%99%C3%A9cran_2016-12-03_%C3%A0_17.34.25.png/revision/latest?cb=20161204121839")
        .setFooter("Limited time event", "https://cdn.discordapp.com/attachments/360906433438547978/399164651264409602/Terra_Battle_FFVIII.jpg")
        .setTimestamp();
      /*
      sendMessage(command, "Uploaded by Alpha12 of the Terra Battle Wiki");
      sendMessage(command, new Discord.Attachment("./assets/vengeful_heart.png"));
      */
      return msg.embed(VH_Embed);
    }
};