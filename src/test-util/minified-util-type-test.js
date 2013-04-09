// tests for minified-util-src.js
//
// Instructions:
// - requires node.js installation
// - install mocha (npm mocha -g)
// - run (mocha minified-util-type-test.js)
//

var testCommon = require("./minified-util-common.js");
var assert = require("assert");

var AMD_NAME = testCommon.AMD_NAME;
var loadInContextSrc = testCommon.loadInContextSrc;


function runTests(loadInContext) {
	function req() {
		return loadInContext().require(AMD_NAME)._;
	}
	

	describe('_.isString()', function() {
		it('checks strings', function() {
			var _ = req();
			assert(_.isString("abc"));
			assert(_.isString(""));
			assert(!_.isString(null));
			assert(!_.isString(2));
			assert(!_.isString({f:3, a:4}));
			assert(!_.isString(["r"]));
		});
	});
	
	describe('_.isNumber()', function() {
		it('checks numbers', function() {
			var _ = req();
			assert(!_.isNumber("abc"));
			assert(!_.isNumber(null));
			assert(_.isNumber(2));
			assert(!_.isNumber({f:3, a:4}));
			assert(!_.isNumber(["r"]));
		});
	});
	
	describe('_.isFunction()', function() {
		it('checks functions', function() {
			var _ = req();
			assert(_.isFunction(function() {}));
			assert(!_.isFunction(null));
			assert(!_.isFunction("abc"));
		});
	});
	
	describe('_.isObject()', function() {
		it('checks objects', function() {
			var _ = req();
			assert(_.isObject({}));
			assert(_.isObject(new Date()));
			assert(!_.isObject(null));
			assert(!_.isObject("abc"));
			assert(!_.isObject(function() {}));
		});
	});
	
	describe('_.isDate()', function() {
		it('checks dates', function() {
			var _ = req();
			assert(!_.isDate({}));
			assert(_.isDate(new Date()));
			assert(!_.isDate(null));
			assert(!_.isDate("abc"));
			assert(!_.isDate(function() {}));
		});
	});
	describe('_.isBool()', function() {
		it('checks booleans', function() {
			var _ = req();
			assert(_.isBool(false));
			assert(_.isBool(true));
			assert(!_.isBool({}));
			assert(!_.isBool(new Date()));
			assert(!_.isBool(null));
			assert(!_.isBool("abc"));
			assert(!_.isBool(function() {}));
		});
	});	
	describe('_.isValue()', function() {
		it('checks values', function() {
			var _ = req();
			assert(_.isValue(false));
			assert(_.isValue(5));
			assert(!_.isValue({}));
			assert(_.isValue(new Date()));
			assert(!_.isValue(null));
			assert(_.isValue("abc"));
			assert(!_.isValue(function() {}));
		});
	});

	describe('_.isList()', function() {
		it('checks lists', function() {
			var _ = req();
			assert(_.isList([]));
			assert(_.isList([1, 2]));
			assert(_.isList(_(1, 2)));
			assert(_.isList(_()));
			assert(!_.isList(null));
			assert(!_.isList({}));
			assert(!_.isList(new Date()));
			assert(!_.isList("abc"));
			assert(!_.isList(function() {}));
		});
	});
	
	describe('_.toString()', function() {
		it('converts to strings', function() {
			var _ = req(), undef={};
			assert.equal(_.toString("abc"), "abc");
			assert.equal(_.toString(6), "6");
			assert.equal(_.toString(null), "");
			assert.equal(_.toString(undef.u), "");
		});
	});
	
}

testCommon.run(runTests);




