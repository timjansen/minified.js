// tests for minified-util-src.js
//
// Instructions:
// - requires node.js installation
// - install mocha (npm mocha -g)
// - run (mocha minified-util-func-test.js)
//

var testCommon = require("./minified-util-common.js");
var assert = require("assert");

var AMD_NAME = testCommon.AMD_NAME;
var loadInContextSrc = testCommon.loadInContextSrc;


function runTests(loadInContext) {
	function req() {
		return loadInContext().require(AMD_NAME)._;
	}
	
	describe('once()', function() {
		it('should be called once', function() {
			var _ = req();
			var c = 0;
			function wrapMe(a, b) {
				c++;
				return a*b + (this&&this.addMe);
			}
			var o = {addMe: 2};
			var f = _.once(wrapMe);
						
			assert.equal(f.call(o, 6, 7), 44);
			f.call(o, 5, 5);
			assert.equal(c, 1);
		});
	});
	
	describe('bind()', function() {
		function wrapMe(a, b, c, d) {
			return a * b + this.addMe - c * d;
		}
		
		it('should surround common args', function() {
			var _ = req();
			var o = {addMe: 2};
			var f = _.bind(wrapMe, o, [13, 5], [17]);
			assert.equal(f(3), 16);
		});
		
		it('should make post-args optional', function() {
			var _ = req();
			var o = {addMe: 2};
			var f = _.bind(wrapMe, o, [13, 5]);
			assert.equal(f(3, 9), 40);
		});

		it('should make all args optional', function() {
			var _ = req();
			var o = {addMe: 2};
			var f = _.bind(wrapMe, o);
			assert.equal(f(13, 5, 3, 9), 40);
		});
	});

	describe('partial()', function() {
		function wrapMe(a, b, c, d) {
			return a * b - c * d;
		}
		it('should surround common args', function() {
			var _ = req();
			var f = _.partial(wrapMe, [13, 5], [17]);
			assert.equal(f(3), 14);
		});
		
		it('should make post-args optional', function() {
			var _ = req();
			var f = _.partial(wrapMe, [13, 5]);
			assert.equal(f(3, 9), 38);
		});

		it('should make all args optional', function() {
			var _ = req();
			var f = _.partial(wrapMe);
			assert.equal(f(13, 5, 3, 9), 38);
		});
	});
	
	describe('selfFunc()', function() {
		it('should return its first arg', function() {
			var _ = req();
			assert.equal(_.selfFunc(14), 14);
		});
	});
}

testCommon.run(runTests);



