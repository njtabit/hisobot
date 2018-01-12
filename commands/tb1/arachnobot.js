/*
 * Created:				  05 Jan 2018
 * Last updated:		06 Sept 2018
 * Developer(s):		Paddington, CodedLotus
 * Description:			Vengeful Hearts Event Flow Chart command
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Returns Rydia's event chart + link to TBF event thread.
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

module.exports = class ArachnobotCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'arachnobot',
            aliases: ['at'],
            group: 'tb1',
            memberName: 'arachnobot',
            description: 'Replies with the Arachnobot\'s Tale event flow chart.',
            examples: ['arachnobot', 'at'],
        });
    }

    run(msg) {
      const Arachnobot_Embed = new RichEmbed()
        .setTitle("Arachnobot's Tale Event (+ Chart)")
        .setDescription("[Chart below made by Rydia](https://terrabattleforum.com/threads/fujisakas-quest-arachnobots-tale.13111/page-5#post-163517) of [TBF](TerraBattleForum.com)")
        .setURL("http://terrabattle.wikia.com/wiki/Arachnobot%27s_Tale")
        .setColor([255, 65, 129])
        .setImage("https://cdn.discordapp.com/attachments/360906433438547978/399159863864983562/arachnobot_tale.png")
        .setFooter("Limited time event", "https://cdn.discordapp.com/attachments/360906433438547978/399164651264409602/Terra_Battle_FFVIII.jpg")
        .setTimestamp();
      /*
      sendMessage(command, "Made by Rydia of TBF (TerraBattleForum)");
      sendMessage(command, new Discord.Attachment("./assets/arachnobot_tale.png"));
      */
      return msg.embed(Arachnobot_Embed);
    }
};