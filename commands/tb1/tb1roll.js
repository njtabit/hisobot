/*
 * Created:				  23 Jan 2018
 * Last updated:		02 Feb 2018
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
const pacts = JSON.parse(fs.readFileSync("./data/TB1_Pact.json", "utf8"));


module.exports = class TB1PactSimCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tb1roll',
            aliases: ['roll1'],
            group: 'tb1',
            memberName: 'tb1roll',
            description: 'Simulates TB1 Pact rolls.',
            examples: ['tb1roll 1', 'roll1 100', 'roll1 100 true z at,vh,dosa', 'roll1 100 true b none'],
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
                  key: 'PoF',
                  prompt: 'Have you finished the Pact of Fellowship? (AKA the coin pact) (true/false)',
                  type: 'boolean'
                },
                {
                  key: 'base',
                  prompt: 'What is the lowest rarity left in your pool? (B, A, S, SS, Z)',
                  type: 'string',
                  min: 1,
                  max: 2,
                  validate: base => {
                    base = base.toUpperCase();
                    if( ["B","A","S","SS","Z"].includes(base) ) { return true;}
                    return "You didn't enter a rarity I can manage.";
                  },
                  parse: base => {
                    return base.toUpperCase();
                  }
                },
                {
                  key: 'specials',
                  prompt: `Which special pact(s) did you want to add?
Options: Arachnobot's Tale(AT), Vengeful Heart(VH), Death of Shay and Arionne(DoSA), none (for none of these)
AT, VH, DoSA (<- for easiest, fastest, probably most accurate results)`,
                  type: 'string',
                  parse: specials => {
                    return specials.split(",");
                  },
                  wait: 120
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
    
    __pullOnce(pool, baseRarity){
      //returns new JSO{rarity: rarityPulled, unit:unitName}
  
      //Get the roll rates (B -> A -> S -> SS -> Z)
      const RollRates = pacts.rates[baseRarity];
      
      //Roll a number between 0 and 99, which guarantees the IF statement later
      let rollNum = Math.floor(Math.random()*100);
      for(const [rarity, rate] of Object.entries(RollRates)){
        if(rate > rollNum){ //Always guaranteed to trigger by the RollRate "Z"
          let unitName = pool[rarity][Math.floor(Math.random()*Math.floor(pool[rarity].length))];
          //always returns a value
          return {rarity: rarity, unit:unitName }; 
        }
        rollNum -= rate;
      }
    }

    __preparePact(pool, POF = false, specials = []){
      /** 3 steps: 
        * 1) possibly remove the POF units from the pool
        * 2) possibly add any special event units to the pool
        * 3) return pool
        */
      //POF removal
      if (POF) { for(const [rarity, pofTier] of Object.entries(pool["Pact of Fellowship"])){ pool[rarity] = pool[rarity].filter( function(unit){return !pofTier.includes(unit)} ); } }
      
      //Manage special event pool adds
      //TODO: make into a function that is easily modular
      if(specials.includes("none")){ return pool; }
      specials.forEach(function(element, index, array){array[index] = element.trim().toLowerCase()});
      /*
      var b_VH = false, b_AT = false, b_DoSA = false;
      for (let special in specials){
        if((specials.includes("vh") || specials.includes("vengeful heart")) && !b_VH) {
          b_VH = true; 
          for(const rarity in pool["Vengeful Heart"]) { pool[rarity] = pool[rarity].concat(pool["Vengeful Heart"][rarity]); }
        }
        if((specials.includes("at") || specials.includes("arachnobot's tale")) && ! b_AT) {
          b_AT = true;
          for(const rarity in pool["Arachnobot's Tale"]){pool[rarity] = pool[rarity].concat(pool["Arachnobot's Tale"][rarity]);}
        }
        if((specials.includes("dosa") || specials.includes("death of shay and arionne")) && !b_DoSA) {
          b_DoSA = true;
          for(const rarity in pool["Death of Shay and Arionne"]){pool[rarity] = pool[rarity].concat(pool["Death of Shay and Arionne"][rarity])}
        }
      }*/
      if((specials.includes("vh") || specials.includes("vengeful heart")) ) {
        for(const [rarity, units] of Object.entries(pool["Vengeful Heart"])) { pool[rarity] = pool[rarity].concat(units); }
      }
      if((specials.includes("at") || specials.includes("arachnobot's tale")) ) {
        for(const [rarity, units] of Object.entries(pool["Arachnobot's Tale"])){pool[rarity] = pool[rarity].concat(units);}
      }
      if((specials.includes("dosa") || specials.includes("death of shay and arionne")) ) {
        for(const [rarity, units] of Object.entries(pool["Death of Shay and Arionne"])){pool[rarity] = pool[rarity].concat(units)}
      }
      
      return pool;
    }
    
    _rollSim(args){
      //pool setup: obtain rates for pulling, POF removal, add special units to pacts
      const RollRates = pacts.rates[args.base], RARITIES = pacts.rarities;
      const pool = this.__preparePact(pacts.units, args.PoF, args.specials);
      
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
            .setTitle("Terra Battle Pact Simulation")
            .setDescription(`Here's a good guess on your next pull${(args.pulls>1)?'s':''}${(args.pulls==100)?' '+this.client.emojis.find("name", "moneywhale"):''}`)
            .setColor([212, 238, 232])
            .setFooter("NOTE: These pulls are not binding or guaranteed!", "https://cdn.discordapp.com/attachments/360906433438547978/399164651264409602/Terra_Battle_FFVIII.jpg")
            .setThumbnail("https://vignette.wikia.nocookie.net/terrabattle/images/a/a9/Energy.png/revision/latest?cb=20150430085812")
            .setTimestamp();
      
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