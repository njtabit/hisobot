/*
 * Created:				  06 April 2018
 * Last updated:		08 April 2018
 * Developer(s):		Gendreavus
 * Description:			Terra Battle 2 Wiki Search
 * Version #:			  0.0.0
 * Version Details:
		0.0.0: Core code came from dragonfire535's guide
    0.1.0: Union rewards command available
 * loaned code:     https://dragonfire535.gitbooks.io/discord-js-commando-beginners-guide/content/making-your-first-command.html
 */

const Command = require('discord.js-commando').Command;

const RichEmbed = require('discord.js').RichEmbed;

const { get } = require('https');
const { JSDOM } = require('jsdom');

module.exports = class TB2WIKI_Command extends Command {
  constructor(client) {
    super(client, {
      name: 'tb2wiki',
      aliases: ['tb2search', 'tb2wk'],
      group: 'tb2',
      memberName: 'tb2wiki',
      description: 'Searches the Terra Battle 2 wiki for the requested information.',
      examples: ['tb2wiki union samatha','tb2wiki dnaskills xena','tb2wiki rewards dark reign'],
      details: `
      Information available for request depends on the type of page requested. Below are all accepted information values.
      During development, an asterisk will be placed in front of implemented values.
\`\`\`
GUARDIANS
  *availability
  *union
  baseskills
  baseprofile
  dnaskills
  dnaprofile
  rnaskills
  rnaprofile

EQUIPMENT
  availability
  range
  stats

COMPANIONS
  availability
  skill

QUESTS
  stamina
  rewards
  enemies
  scenario
\`\`\``,
      args: [
        {
          key: 'info',
          prompt: 'What info are you looking for?',
          type: 'string',
          parse: info => {
            return info.toLowerCase().trim();
          }
        },
        {
          key: 'page',
          prompt: 'What page are you looking for?',
          type: 'string',
          parse: page => {
            return page.trim().replace(' ', '_');
          }
        }
      ]
    });
  }

  run(msg, args) {
    //console.log(args);
    const TB2WIKI_Embed = new RichEmbed();
    TB2WIKI_Embed.setTitle('Terra Battle 2 Wiki Search')
      .setDescription('Here\'s what I was able to find:')
      .setColor([134, 206, 203])
      .setFooter('Gendreavus#8363', 'https://cdn.discordapp.com/avatars/178385474824437760/b2f95c567ab31fa00f688040b2315dcf.png')
      .setTimestamp();
    //console.log('Embed data set');

    // Get the wiki page data, then add the results to the embed object
    this.__fetchPage(args.page, args.info, (result) => {

      //console.log('Reached for-loop');
      for (let name in result) {
        //console.log('loop entered');
        TB2WIKI_Embed.addField(name, result[name]);
      }

      return msg.embed(TB2WIKI_Embed);
    });
  }

  /**
   * Fetches the page requested, then finds the desired information on it.
   * @param {string} title - The page title. Should already be in URL format.
   * @param {string} info - The section of the page we're getting info from.
   * @param {function} cb - A callback function to be performed at the end of any fetchPage run.
   */
  __fetchPage(title, info, cb) {
    let result = {};

    get('https://terrabattle2.gamepedia.com/api.php?action=parse&page=' + title + '&utf8=&format=json', (res) => {

      //console.log('Get begun');
      const status = res.statusCode;
      if (status === 200) {

        //console.log('Get successful');
        // As the data is received stream it into the rawData variable, then work with it in the 'end' callback.
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk });
        res.on('end', () => {

          //console.log('Get Complete');
          // There's always a chance that we'll get back junk json, so we'll wrap it in a try/catch loop that drops the process on an error.
          let json = '';
          try {
            json = JSON.parse(rawData).parse;
            //console.log(json);
          } catch (e) {
            result['Error'] = 'Something broke. If it doesn\'t fix itself, let @Gendreavus#8363 know.';
            cb(result);
            return;
          }

          if (json != null) {
            // Turn the text portion of the JSON into a traversable DOM object
            let page = new JSDOM(json.text["*"]);
            page = page.window.document;

            result = this.__findInfo(page, json.categories, title, info);
            //console.log(result);

            cb(result);
            return;

          } else {
            // 404 errors redirect to HTML pages that return a 200 (okay) status instead of failing, so we have to deal with them here.
            result['Article for ' + title + ' does not exist'] = 'Please double-check the page name\'s spelling.';
            cb(result);
            return;
          }
        });

      } else if (status === 301) {

        // 301 means we got a redirect, so find where we're redirected to and fetch that page instead.
        let newURL = res.headers.location;
        const wikiStart = newURL.indexOf('com/');
        newURL = newURL.substring(wikiStart + 4);
        this.__fetchPage(newURL, info, cb);

      } else {

        // Any other status probably means we were fed bad data.
        result['Error'] = status + ' status';
        cb(result);
        return;
      }

    });
  }

  /**
   * Traverses the wiki page to get the information requested.
   * @param {object} page - The DOM object of the page to be sifted through.
   * @param {<string>array} cats - The categories of the wiki page as an array, used to decide which commands are allowed.
   * @param {string} title - The title of the page.
   * @param {string} info - The info to be found on the page.
   * @returns {object} The results of the search, ready to be parsed into the embed. The object's keys should be a field title, while the value of that key is the data to be displayed.
   */
  __findInfo(page, cats, title, info) {
    let result = {};

    // The actual category names are a layer deep, so let's pull them out.
    for (let i = 0; i < cats.length; i++) {
      cats[i] = cats[i]['*'];
    }

    if (cats.includes('Guardians')) {
      switch (info) {

        case 'availability':
          result['Availability for ' + title] = '';
          let avail = page.getElementById('Availability');
          avail = avail.parentNode.nextElementSibling.getElementsByTagName('li');

          // By grabbing each list item's child nodes, we can represent the text exactly as the wiki does at the cost of using a nested loop. If this gets too expensive down the line we can make it plain text only.
          for (let i = 0; i < avail.length; i++) {

            if (i !== 0) {
              result['Availability for ' + title] += '\n';
            }

            for (let j = 0; j < avail[i].childNodes.length; j++) {

              let option = avail[i].childNodes[j];
              //console.log(option);
              if (option.href) {
                let href = option.href.replace(')', '%29');
                result['Availability for ' + title] += '[' + option.textContent + ']( https://terrabattle2.gamepedia.com' + href + ' )';
              } else {
                result['Availability for ' + title] += option.textContent;
              }
            }
          }
          break;

        case 'union':
          //console.log('union reached');
          let rewards = page.getElementById('Union_Rewards');
          rewards = rewards.parentNode.nextElementSibling.getElementsByTagName('tr');
          rewards = [
            rewards[1].lastElementChild.lastElementChild,
            rewards[2].lastElementChild.lastElementChild
          ];

          const href = [
            rewards[0].href.replace(')', '%29'),
            rewards[1].href.replace(')', '%29')
          ];

          result['50% reward:'] = '[' + rewards[0].textContent + '](https://terrabattle2.gamepedia.com' + rewards[0].href + ')';
          result['100% reward:'] = '[' + rewards[1].textContent + '](https://terrabattle2.gamepedia.com' + rewards[1].href + ')';

          break;

        default:
          result['Sorry, can\'t find that.'] = 'Click [here](https://terrabattle2.gamepedia.com/' + title + ') to browse the page yourself, or try searching again.';
          break;
        // TODO: Implement commented-out cases
        /*
        case 'baseskills':
        // Skill sections should probably pull from both the #Base_Form (or dna/rna form) AND #Skill_Details

        case 'baseprofile':

        case 'dnaskills':

        case 'dnaprofile':

        case 'rnaskills':

        case 'rnaprofile'
        */
      }
    } /* else if (cats.includes('Equipment')) {
      switch (info) {

        case 'availability':

        case 'range':

        case 'stats':

      } else if (cats.includes('Companions')) {
        switch (info) {

          case 'availability':

          case 'skill':

        }

      }  else if (cats.includes('Quests')) {
        switch (info) {

          case 'stamina':

          case 'rewards':

          case 'enemies':

          case 'scenario':
        }
      }
    } */
    return result;
  }
};
