/*
 * Created:				  02 Jan 2018
 * Last updated:		11 Jan 2018
 * Developer(s):		CodedLotus
 * Description:			Metal Zone data command
 * Version #:			  1.0.1
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Recreated the original MZ command (with minor modern tweaks) using RichEmbeds over text/paragraphs
    1.0.1: Added an additional RichEmbed field to the "MZ All" command: Open Now
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

/* Metal Zone Tracker */
//const MZSchedule = require("./../../constants/MZTable");

/*,
  validate: zone => {
    if (zone == '' || (zone > 0 && zone < 8) ) return true;
    return "That doesn't seem like a valid zone to me";
  }*/

module.exports = class MetalAlertCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'metal',
            aliases: ['mz'],
            group: 'tb1',
            memberName: 'metal',
            description: 'Replies with the current MZ schedule.',
            examples: ['metal', 'mz'],
            throttling: {
              usages: 2,
              duration: 10
            },
            args: [
                {
                    key: 'zone',
                    prompt: 'Which zone do you want to know about?',
                    type: 'integer',
                    default: '',
                    min: 1,
                    max: 7
                }
            ]
        });
    }

    run(msg, args) {
      var MZ_EMBED = this.metalZone(args.zone);
      return msg.embed(MZ_EMBED);
    }
    
    //reduce content somehow
    metalZone(zone){
      const MZSchedule = this.client.MZSchedule;
      var MZ_EMBED = new RichEmbed()
            .setTitle("Metal Zone Schedule")
            .setDescription("Times are in D:HH:MM (Stamina recovery) format")
            .setURL("http://crape.org/tools/terra-battle/mz.html")
            .setColor([0, 0, 255])
            .setFooter("This is a lot beefier than before...", "https://cdn.discordapp.com/attachments/360906433438547978/399164651264409602/Terra_Battle_FFVIII.jpg")
            .setThumbnail("https://vignette.wikia.nocookie.net/terrabattle/images/1/16/Golden_Runner.png/revision/latest?cb=20150701095945")
            .setTimestamp();
      
      if (!zone) {
        futureMZSchedule = MZSchedule.getNextZoneSchedule();
        var currentMZSchedule = MZSchedule.getOpenZones(new Date()), openNow = "";
        for (var zoneNum = 0; zoneNum < MZSchedule._MAX_ZONE; ++zoneNum){
          if(currentMZSchedule[zoneNum] > 0){
            openNow += (openNow.length ? ", " : "") + (zoneNum+1) + (currentMZSchedule[zoneNum] == MZSchedule._STAT_KING ? "K" : "");
          }
        }
        if(openNow.length){ MZ_EMBED = MZ_EMBED.addField("Open Now!", openNow); }
        for (var zoneNum = 0; zoneNum < MZSchedule._MAX_ZONE; ++zoneNum){
          var title = "Metal Zone ", value = "";
          //Normal
          title += (zoneNum+1);
          value += futureMZSchedule.openZoneSchedule[zoneNum].MZString + " (" + futureMZSchedule.openZoneSchedule[zoneNum].stamina + ")";
          MZ_EMBED = MZ_EMBED.addField(title, value, true);
          //AHTK
          title += " AHTK";
          value = futureMZSchedule.openAHTKSchedule[zoneNum].MZString + " (" + futureMZSchedule.openAHTKSchedule[zoneNum].stamina + ")";
          MZ_EMBED = MZ_EMBED.addField(title, value, true);
          //schedule += metalZoneString("MZ",   (zone+1), futureMZSchedule.openZoneSchedule[zone], showStamina);
          //schedule += metalZoneString("AHTK", (zone+1), futureMZSchedule.openAHTKSchedule[zone], showStamina) + "\n";
        }
        //schedule += "```";
        //command.message.channel.send(schedule);
      }
      
      else{
        var title = "Metal Zone ", value = "";
        var futureMZSchedule = MZSchedule.getSpecificZoneSchedule(zone);
        //Normal
        title += zone;
        value += futureMZSchedule.openZoneSchedule.MZString + " (" + futureMZSchedule.openZoneSchedule.stamina + ")";
        MZ_EMBED = MZ_EMBED.addField(title, value, true);
        //AHTK
        title += " AHTK";
        value = futureMZSchedule.openAHTKSchedule.MZString + " (" + futureMZSchedule.openAHTKSchedule.stamina + ")";
        MZ_EMBED = MZ_EMBED.addField(title, value, true);
      }
      
      return MZ_EMBED;
    }
};