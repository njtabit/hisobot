/*
 * Created:				  01 Feb 2018
 * Last updated:		14 Mar 2018
 * Developer(s):		CodedLotus
 * Description:			TB1 Pact Simulation command
 * Version #:			  1.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
		1.0.0: Created a TB1 Pact Simulator using estimated community rates
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

const fs = require("fs");
const pacts = JSON.parse(fs.readFileSync("./data/TB2_Pact.json", "utf8"));

const precision3 = Math.pow(10,3);
const precision2 = Math.pow(10,2);

module.exports = class TB2PactSimCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tb2roll',
            aliases: ['roll2'],
            group: 'tb2',
            memberName: 'tb2roll',
            description: 'Simulates TB2 Pact rolls.',
            examples: ['tb1roll 2', 'roll2 100', 'roll2 5 PoGZ'],
            throttling: {
              usages: 5,
              duration: 10
            },
            args: [
                {
                  key: 'pulls',
                  prompt: 'How many rolls? (1-100)',
                  type: 'integer',
                  min: 1,
                  max: 100
                },
                {
                  key: 'pact',
                  prompt: `Which pact did you want to pull?
\`\`\`
Available Pacts:
Pact of Luscious Genes (PoLG)
Pact of Elements (PoE)
Pact of Genes (PoG)
Pact of Elements (Ticket/Z) (PoEZ)
Pact of Genes (Ticket/Z) (PoGZ)
Pact of Resolve (Ticket) (PoR, PoResolve)
\`\`\``,
                  type: 'string',
                  parse: pact => {
                    return pact.toLowerCase();
                  },
                  validate: pact => {
                    if(!this.__livePacts().has(pact.toLowerCase())){return "I can't find a pact with that name";}
                    return true;
                  }
                }
            ]
        });
    }

    run(msg, args) {
      var ROLL_EMBED = this._rollSim(args);
      //msg.author.send(ROLL_EMBED);
      //return msg.reply("I have sent your roll results");
      return msg.direct(ROLL_EMBED);
    }
    
    //Creates the alias table for the currently live TB2 pact lineup
    __livePacts(){
      var pactNamesMap = new Map();
      for(let pactName of pacts.live){
        pactNamesMap.set(pactName.toLowerCase(), pactName);
        const pactAlias = pacts[pactName].alias;
        pactAlias.forEach(function(element){pactNamesMap.set(element.toLowerCase(), pactName)});
      }
      return pactNamesMap;
    }
    
    //Fisher-Yates-Knuth Shuffle (https://bost.ocks.org/mike/shuffle/)
    __shuffle(array) {
      var m = array.length, t, i;
      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    }

    //Returns the unit name "pulled" from the sub-pool
    __calculateRarityPull(rarityPool, rollNum){
      let {rates, items} = rarityPool;
      items = this.__shuffle(items); //Just for extra fun
      for (const {name,rate} of items[Symbol.iterator]()){
        if(rollNum < rates[rate]){ return name; }
        rollNum -= rates[rate]; //keep looking
      }
    }
    
    //returns new JSO{rarity: rarityPulled, unit:unitName} of a simulated pact pull
    __pullOnce(pool){
      //Get the roll rates (B -> A -> S -> SS -> Z)
      const RollRates = pool.rates;
      
      //Roll a number between 0 and 99, which guarantees the IF statement later
      let rollNum = Math.round(Math.random()*precision2*precision3)/precision3;
      for(const [rarity, rate] of Object.entries(RollRates)){
        if(rate > rollNum){ //Always guaranteed to trigger by the RollRate "Z"
          //always returns a value
          return {rarity: rarity, unit: this.__calculateRarityPull(pool[rarity], rollNum)};
          //return {rarity: rarity, unit:unitName }; 
        }
        rollNum -= rate;
      }
    }

    
    
    _rollSim(args){
      //pool setup: Set up the alias map, and get the pool used from the pacts (TB2_Pact.json)
      const pactNamesMap = this.__livePacts(), RARITIES = pacts.rarities;
      const pool = pacts[pactNamesMap.get(args.pact)];
      
      //create pull storage and actually pull
      let pulls = new Map();
      for(var i = 0; i < args.pulls; ++i){
        let {rarity, unit} = this.__pullOnce(pool, args.base);
        if(!pulls.has(rarity)){pulls.set(rarity, new Map()); pulls.get(rarity).set(unit, 1);}
        else if(!pulls.get(rarity).has(unit)){pulls.get(rarity).set(unit, 1);}
        else {pulls.get(rarity).set(unit, pulls.get(rarity).get(unit)+1);}
      }
      
      
      //Set up the return embed
      var ROLL_EMBED = new RichEmbed()
            .setTitle("Terra Battle 2 Pact Simulation")
            .setDescription(`Here's a good guess on your next pull${(args.pulls>1)?'s':''}${(args.pulls==100)?' '+this.client.emojis.find("name", "moneywhale"):''}`)
            .setColor([231, 231, 231])
            .setFooter("NOTE: These pulls are not binding or guaranteed!", "https://cdn.discordapp.com/attachments/360906433438547978/399453584858677258/Jodie.jpg")
            .setThumbnail("https://d1u5p3l4wpay3k.cloudfront.net/terrabattle2_gamepedia_en/b/b7/Item_Normal_Energy.png")
            .setTimestamp();
      //energypeek: .setThumbnail("https://cdn.discordapp.com/attachments/307074187040784384/409146159467331606/emoji.png")
      
      //Iterate through each pulled rarity
      for (let rare of RARITIES){
        if(pulls.has(rare)){
          //set up data string and pull count for rarity level rare
          var output = "", count = 0;
          for(let [unit, pullCount] of pulls.get(rare)){ 
            output += `${(output.length > 0)?', ':''}${unit} (${pullCount})`;
            count += pullCount;
          }
          ROLL_EMBED = ROLL_EMBED.addField(`${rare} (${count})`,output);
        }
      }
      
      return ROLL_EMBED;
    }
};