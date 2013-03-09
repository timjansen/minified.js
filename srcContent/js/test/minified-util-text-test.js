// tests for minified-util-src.js
//
// Instructions:
// - requires node.js installation
// - install mocha (npm mocha -g)
// - run (mocha minified-util-text-test.js)
//

var testCommon = require("./minified-util-common.js");
var assert = require("assert");

var AMD_NAME = testCommon.AMD_NAME;
var loadInContextSrc = testCommon.loadInContextSrc;


function runTests(loadInContext) {
	function req() {
		return loadInContext().require(AMD_NAME)._;
	}
	
	describe('escapeRegExp()', function() {
		it('escapes all special chars', function() {
			var _ = req();
			
			var test = "w2 dsb ^ & \\ * . e+ e3 []4{3}$ 3";
			var re = new RegExp(_.escapeRegExp("w2 dsb ^ & \\ * . e+ e3 []4{3}$ 3"));
			assert(re.test(test));
			assert.equal(("1"+test+"c").replace(test, ""), "1c");
		});

	});}

testCommon.run(runTests);



