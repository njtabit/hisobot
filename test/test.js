var assert = require('assert');
describe('Array', function() {
    describe('#indexOf()', function() {
	it('should return -1 when the value is not present', function() {
	    assert.equal(-1, [1,2,3].indexOf(4));
	});
    });
});

var hisobot = require('hisobot');
describe('Command', function() {
    describe('#tb2wiki()', function() {
	it('should return the wiki of samatha', function(){
	    assert.equal("https://terrabattle2.gamepedia.com/index.php?search=samatha", tb2wikilink('!tb2 samatha'))
	});
    });
});


