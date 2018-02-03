/*
 * Created:				  23 Jan 2018
 * Last updated:		27 Jan 2018
 * Developer(s):		CodedLotus
 * Description:			Daily Quest data command
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Created an original DQ forecast using RichEmbeds as the forecast deliverable
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

module.exports = class TB1DailyQuestCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tb1dq',
            group: 'tb1',
            memberName: 'tb1dq',
            description: 'Replies with the current DQ forecast. Defaults to a 3-day (today + 2) forecast.',
            examples: ['tb1dq', 'tb1dq 7'],
            throttling: {
              usages: 2,
              duration: 10
            },
            args: [
                {
                    key: 'days',
                    prompt: 'How many days of a forecast did you want?',
                    type: 'integer',
                    default: '',
                    min: 1,
                    max: 7
                }
            ]
        });
    }

    run(msg, args) {
      var DQ_EMBED = this._dqForecast(args.days);
      return msg.embed(DQ_EMBED);
    }
    
    //reduce content somehow
    _dqForecast(days){
      //shorten the DQSchedule access, and create the initial DQ_EMBED return
      const DQSchedule = this.client.DQSchedule;
      var DQ_EMBED = new RichEmbed()
            .setTitle("Daily Quest Forecast")
            .setURL("http://terrabattle.wikia.com/wiki/Daily_Quests")
            .setColor([0, 0, 255])
            .setFooter("Dates are based on UTC.", "https://cdn.discordapp.com/attachments/360906433438547978/399164651264409602/Terra_Battle_FFVIII.jpg")
            .setThumbnail("https://vignette.wikia.nocookie.net/terrabattle/images/e/ea/Time_Extension.png/revision/latest?cb=20150129215255")
            .setTimestamp();
      
      //Establish a root date (date/time that the command was called) and set the embed's description accordingly
      var dateToday = new Date();
      DQ_EMBED = DQ_EMBED.setDescription(`(UTC) Today is: ${dateToday.toDateString()}`);
      
      //set the default forecast to be today + 2 more days forward
      if (!days) { days = 3; }
      
      for (var dayCount = 0; dayCount < days; ++dayCount){
        //get the forecasting day (by taking today and adding forward days)
        var dayForecasted = new Date(dateToday); dayForecasted.setDate(dayForecasted.getDate()+dayCount);
        //get the forecasting day's Daily Quest
        var daysQuest = DQSchedule.getDailyQuest(dayForecasted);
        //Flavor titles (today == 0, tomorrow == 1) or the actual date and day
        if ( dayCount == 0 )      { DQ_EMBED = DQ_EMBED.addField("Today", daysQuest); }
        else if ( dayCount == 1 ) { DQ_EMBED = DQ_EMBED.addField("Tomorrow", daysQuest); }
        else { DQ_EMBED = DQ_EMBED.addField(dayForecasted.toDateString(), daysQuest); }
      }
      
      
      
      return DQ_EMBED;
    }
};