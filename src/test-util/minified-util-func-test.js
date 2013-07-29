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

		it('allow non-lists', function() {
			var _ = req();
			var o = {addMe: 2};
			var f = _.bind(wrapMe, o, 13, 17);
			assert.equal(f(5, 3), 16);
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

		it('allow non-lists', function() {
			var _ = req();
			var f = _.partial(wrapMe, 13, 17);
			assert.equal(f(5, 3), 14);
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

	describe('_.unite()', function() {
		it('unite', function() {
			var _ = req();
			var i = 0;
			function a(x9) { assert.equal(x9, 9); i++; return "a";}
			function b(x9) { assert.equal(x9, 9); i++; return "b";}
			
			var r1 = _().unite()([3]);
			assert(_.equals(r1, []));

			var r2 = _(a, b, null).unite()([9]);
			assert.equal(i, 2);
			assert(_.equals(r2, ["a", "b", null]));

			var r3 = _(a, null, b, null).unite()([9]);
			assert.equal(i, 4);
			assert(_.equals(r3, ["a", null, "b", null]));

			var r4 = _.unite([a, b, null])([9]);
			assert.equal(i, 6);
			assert(_.equals(r4, r2));
		});
	});
}

testCommon.run(runTests);



