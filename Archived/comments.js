	// }

	//send feedback depending on if pmFlag is raised.
	//if(command.pmUser){ message.author.send(response); } else { message.channel.send(response); }
	
	//if(message.content == 'greens?'){ message.channel.send('Kweh (Please)'); }
	
	//if(message.content == '!feed greens'){ message.channel.send('Kweh? (food?)\n*eats greens*'); /*message.channel.send('*eats greens*');*/  }
    
	/*if(message.content == '!servers'){ 
		message.channel.send("Kweh (lemme check)");
		var servers = client.guilds; //returns a Collection of <Snowflake, Guild>
		
		//returns the number of guilds the bot is associated with
		//message.channel.send(servers.size);
		console.log("# of servers: " + servers.size);
		
		//log into the console the guild object (name) and its id
		//JS maps return value before key
		var iter = servers.forEach(
			(v,k) => {console.log("name:",v.name,"id:", k);}
		);
		
		
		//for (s in servers.values()) {
			//message.channel.send("Server id: " + s.id + " Server Name: " + s.name);
			//console.log(s.name);
		//}
	}*/
	
	/*if(message.content == "!wikitest"){
		var x = "";
		request("http://terrabattle.wikia.com/wiki/Special:Search?search=Nazuna&fulltext=Search&format=json", function(error, response, body) {
			//console.log(body);
			message.channel.send("Kweh (Lemme check)");
			x = JSON.parse(body); //x becomes an array of JSOs
			var count = 0, response = "";
			do{
				var link_x = x[count];
				response = response.concat("\t" + link_x.title + ": " + link_x.url + "\n");
				++count;
			} while (count < 5);
			//console.log(x[0]); // print out the 0th JSO
			message.channel.send(response);
			
			//message.channel.send(body); //Voids 2k character limit of Discord messages
			//x = body;
		});
		//console.log(x);
	}*/
	
	/*if(message.content == "!shutdown"){
		onShutDown(message);
	}*/
	/*var args = message.content.split(/[ ]+/);
    var i;
    var longName = "";

    if (commandIs("wiki", message)){
        if (args.length === 1){
            message.channel.send('What do you want to look for? ^^. Usage: `!wiki [search term]`');
        } else if (args.length === 2){
                if (args[1] === 'Mizell' || args[1 === 'mizell']){
                    message.channel.send('Oh, it looks like you made a typo. Don\'t worry I got you! ^^ http://terrabattle.wikia.com/wiki/Nazuna');
                } else {
                    if (args[1].charAt(args[1].length-1) === '^') {
                        
                        args[1].slice(0,-1);
                        message.channel.send('http://terrabattle.wikia.com/wiki/'+ args[1].charAt(0).toUpperCase()+args[1].slice(1,-1).toLowerCase()+'_Λ');
                        
                    } else {
                    message.channel.send('http://terrabattle.wikia.com/wiki/'+ args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase());
                }    
            }
        } else {
                longName = args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()
            for (i=2; i<args.length; i++){
                longName += "_"+args[i].charAt(0).toUpperCase()+args[i].slice(1).toLowerCase();     
                }
              message.channel.send('http://terrabattle.wikia.com/wiki/'+ longName); 
        }        
    }
    if (commandIs("recode", message)){
        message.channel.send('http://terrabattle.wikia.com/wiki/'+ args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()+'_Λ');
    }
    if (commandIs("tbcompendium", message)){
        message.channel.send('http://tbc.silverdb.it');
    }
    if (commandIs("tbstats", message)){
        message.channel.send('http://tbs.desile.fr/#/quick-start');
    }
    if (commandIs("chapter", message)){
        var chop ="";
        chop = args[0].substring(1);    
        message.channel.send('http://terrabattle.wikia.com/wiki/'+chop.charAt(0).toUpperCase()+chop.slice(1).toLowerCase()+'_'+args[1]+'#'+args[1]+'.'+args[2]);
    }


    if(commandIs("role", message)){
        let role = message.guild.roles.find("name",'Owner');
        let member = message.guild.member(message.author);
        member.addRole (role).catch(console.error);
    }
        // client.on('guildRole', guild =>{
        // if (args.length === 2){
        //     message.channel.send('You got the role '+args[1]);
        //     guild.member(message.author).addRole(args[1]).catch(Error => console.log(Error));    
        //     } else {
        //         message.channel.send('Error');
        //     }
        // })*/



// client.on('guildRole', guild =>{
//     var args = message.content.split(/[ ]+/);
//         if (args.length === 2){
//             message.channel.send('You got the role '+args[1]);
//             guild.member(message.author).addRole(args[1]).catch(Error => console.log(Error));    
              
//         } else {
//             message.channel.send('Error');
//         }
//     });

