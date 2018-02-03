/*
 * Created:				  05 Jan 2018
 * Last updated:		06 Sept 2018
 * Developer(s):		Axiom, CodedLotus 
 * Description:			TB2 Elements Chart command
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Returns the TB2 Element chart.
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

module.exports = class TB2EC_Command extends Command {
    constructor(client) {
        super(client, {
            name: 'tb2elements',
            aliases: ['tb2ec'],
            group: 'tb2',
            memberName: 'tb2elements',
            description: 'Replies with the TB2 Element chart.',
            examples: ['tb2elements', 'tb2ec'],
        });
    }

    run(msg) {
      const TB2EC_Embed = new RichEmbed()
        .setTitle("Terra Battle 2 elements chart")
        .setDescription("Sourced from the TB2 App")
        .setColor([241, 236, 217])
        .setImage("https://media.discordapp.net/attachments/360906433438547978/399159880461713408/tb2_elements.png")
        .setFooter("<= Tiny art by coketrump#2875","https://cdn.discordapp.com/attachments/360906433438547978/399453584858677258/Jodie.jpg")
        .setTimestamp();
      /*
      sendMessage(command, "Terra Battle 2 elements chart");
      sendMessage(command, new Discord.Attachment("./assets/tb2_elements.png"));
      */
      return msg.embed(TB2EC_Embed);
    }
};