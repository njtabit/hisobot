/*
 * Created:				  05 Jan 2018
 * Last updated:		06 Sept 2018
 * Developer(s):		CodedLotus
 * Description:			TB2 Elements Graph command
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Returns a list of PM's calculators and comparators.
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

module.exports = class TB2PM_Command extends Command {
    constructor(client) {
        super(client, {
            name: 'tb2pm',
            aliases: ['tb2calculators','tb2calculator'],
            group: 'tb2',
            memberName: 'tb2pm',
            description: 'Replies with PM\'s TB2 various calculators.',
            examples: ['tb2pm','tb2calculator','tb2calculators'],
        });
    }

    run(msg) {
      const TB2PM_Embed = new RichEmbed()
        .setTitle("Terra Battle 2 Calculators")
        .setDescription("Created by Player Hurp#2610")
        .setColor([134, 206, 203])
        .addField("Primary Calculator", "[Link here](https://goo.gl/z5HSha)")
        .addField("Advanced User Calculator", "[Link here](https://goo.gl/9T4sZ6)")
        .addField("Equipment Compared (Edited)", "[Link here](https://goo.gl/Reu2FE)")
        .setFooter("Player Hurp#2610","https://cdn.discordapp.com/attachments/360906433438547978/399453584858677258/Jodie.jpg")
        .setTimestamp();
      /*
      sendMessage(command, "Terra Battle 2 elements graph");
      sendMessage(command, new Discord.Attachment("./assets/tb2_elements_graph.png"));
      */
      return msg.embed(TB2PM_Embed);
    }
};