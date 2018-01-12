/*
 * Created:				  05 Jan 2018
 * Last updated:		06 Sept 2018
 * Developer(s):		Axiom, CodedLotus
 * Description:			TB2 Elements Graph command
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Returns the TB2 Element graph by coketrump#2875.
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

module.exports = class TB2EG_Command extends Command {
    constructor(client) {
        super(client, {
            name: 'tb2elementsgraph',
            aliases: ['tb2eg'],
            group: 'tb2',
            memberName: 'tb2elementsgraph',
            description: 'Replies with the TB2 Element graph.',
            examples: ['tb2elementsgraph','tb2eg'],
        });
    }

    run(msg) {
      const TB2EG_Embed = new RichEmbed()
        .setTitle("Terra Battle 2 elements graph")
        .setDescription("Created by Wes#1239")
        .setColor([241, 236, 217])
        .setImage("https://media.discordapp.net/attachments/360906433438547978/399159872744062977/tb2_elements_graph.png")
        .setFooter("<= Tiny art by coketrump#2875","https://cdn.discordapp.com/attachments/360906433438547978/399453584858677258/Jodie.jpg")
        .setTimestamp();
      /*
      sendMessage(command, "Terra Battle 2 elements graph");
      sendMessage(command, new Discord.Attachment("./assets/tb2_elements_graph.png"));
      */
      return msg.embed(TB2EG_Embed);
    }
};