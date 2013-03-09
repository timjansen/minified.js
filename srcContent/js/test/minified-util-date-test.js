// tests for minified-util-src.js
//
// Instructions:
// - requires node.js installation
// - install mocha (npm mocha -g)
// - run (mocha minified-util-date-test.js)
//

var testCommon = require("./minified-util-common.js");
var assert = require("assert");

var AMD_NAME = testCommon.AMD_NAME;
var loadInContextSrc = testCommon.loadInContextSrc;


function runTests(loadInContext) {
	function req() {
		return loadInContext().require(AMD_NAME)._;
	}
	
	describe('dateClone()', function() {
		it('creates an identical clone', function() {
			var _ = req();
			
			var d = new Date(2011, 4, 23, 11, 23, 22, 492);
			var d2 = _.dateClone(d);
			assert.equal(d.getTime(), d2.getTime());
			assert(_.equals(d, d2));
		});

	});}

testCommon.run(runTests);



