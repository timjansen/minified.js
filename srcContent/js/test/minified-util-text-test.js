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
	var _ = loadInContext().require(AMD_NAME)._;

	describe('escapeRegExp()', function() {
		it('escapes all special chars', function() {
			var test = "w2 dsb ^ & \\ * . e+ e3 []4{3}$ 3";
			var re = new RegExp(_.escapeRegExp("w2 dsb ^ & \\ * . e+ e3 []4{3}$ 3"));
			assert(re.test(test));
			assert.equal(("1"+test+"c").replace(test, ""), "1c");
		});

	});

	describe('formatNumber()', function() {
		it('formats numbers', function() {
			// _.formatNumber(1, afterDecimalPoint, omitZerosAfter, decimalPoint, beforeDecimalPoint, groupingSeparator, groupingSize)
			assert.equal(_.formatNumber(1), "1");
			assert.equal(_.formatNumber(-1), "-1");
			assert.equal(_.formatNumber(1, 0, false, null, 5), "00001");
			assert.equal(_.formatNumber(-1, 0, false, null, 5), "-00001");
			
			assert.equal(_.formatNumber(1, 1), "1.0");
			assert.equal(_.formatNumber(1, 2), "1.00");
			assert.equal(_.formatNumber(1, 4), "1.0000");
			assert.equal(_.formatNumber(1, 1, true), "1");
			assert.equal(_.formatNumber(1, 4, true), "1");
			assert.equal(_.formatNumber(-1, 4), "-1.0000");
			assert.equal(_.formatNumber(-1, 1, true), "-1");
			
			assert.equal(_.formatNumber(1.5, 0), "2");
			assert.equal(_.formatNumber(1.5, 1), "1.5");
			assert.equal(_.formatNumber(1.5, 2), "1.50");
			assert.equal(_.formatNumber(1.5, 3), "1.500");
			assert.equal(_.formatNumber(1.5, 3, true), "1.5");
			
			assert.equal(_.formatNumber(1.667, 1), "1.7");
			assert.equal(_.formatNumber(1.667, 2), "1.67");
			assert.equal(_.formatNumber(1.667, 3), "1.667");
			assert.equal(_.formatNumber(1.667, 4), "1.6670");
			assert.equal(_.formatNumber(1.667, 1, true), "1.7");
			assert.equal(_.formatNumber(1.667, 2, true), "1.67");
			assert.equal(_.formatNumber(1.667, 3, true), "1.667");
			assert.equal(_.formatNumber(1.667, 4, true), "1.667");

			assert.equal(_.formatNumber(1.5, 3, false, 'X'),   "1X500");
			assert.equal(_.formatNumber(1.667, 1, false, ','), "1,7");
			assert.equal(_.formatNumber(1.667, 2, true, '#'),  "1#67");

			assert.equal(_.formatNumber(1.667, 4, false, null, 2), "01.6670");
			assert.equal(_.formatNumber(10.667, 1, true, null, 1), "10.7");
			assert.equal(_.formatNumber(1.667, 2, true, ',', 9), "000000001,67");
			assert.equal(_.formatNumber(777.667, 2, true, null, 9), "000000777.67");
			
			assert.equal(_.formatNumber(9999999999, 0, true, ',', 9, '.', 3), "9.999.999.999");
			assert.equal(_.formatNumber(9999999999, 2, true, null, 9, null, 3), "9,999,999,999");
			assert.equal(_.formatNumber(9999999999, 2, false, null, 9, null, 3), "9,999,999,999.00");
			assert.equal(_.formatNumber(123456.256, 2, false, null, 9, null, 3), "000,123,456.26");
			assert.equal(_.formatNumber(123456.256, 2, false, null, 2, null, 3), "123,456.26");
		});
		
		describe('pad()', function() {
			it('pads numbers', function() {
				assert.equal(_.pad(1, 0), "0");
				assert.equal(_.pad(5, 0), "00000");
				assert.equal(_.pad(1,1), "1");
				assert.equal(_.pad(5, 1), "00001");
				assert.equal(_.pad(1, 512), "512");
				assert.equal(_.pad(5, 512), "00512");
				assert.equal(_.pad(5, 123512), "123512");
				assert.equal(_.pad(1,-1), "-1");
				assert.equal(_.pad(5,-1), "-00001");
			});
		});
	});
}

testCommon.run(runTests);



