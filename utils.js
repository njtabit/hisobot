module.exports = {
    //Check if string has substring    
    hasSubstr: function (str, searchStr){
	return str.includes(searchStr);
    },

    //Check what role the user has that elevates their permissions
    checkHoistRule: function (command){
	return command.message.member.hoistRole;
    },

    //send the output message depending on how the command was structured
    sendMessage: function (command, messageText){
	command.pmUser ? command.message.author.send(messageText) : command.message.channel.send(messageText);
    },

    pluck: function(array){
    return array.map(function(item) {return item["name"];});
    },

    hasRole: function(mem, role){
	return pluck(mem.roles).includes(role)
    }
}
