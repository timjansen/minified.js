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
	});

	describe('dateMidnight()', function() {
		it('removes hours, minutes and seconds', function() {
			var _ = req();
			var d = new Date(2011, 4, 23, 11, 23, 22, 492);
			assert(_.equals(_.dateMidnight(d), new Date(2011, 4, 23, 0, 0, 0, 0)));
		});
		it('returns midnight', function() {
			var _ = req();
			var d = _.dateMidnight();
			var now = new Date();
			assert.equal(d.getFullYear(), now.getFullYear());
			assert.equal(d.getMonth(), now.getMonth());
			assert.equal(d.getDate(), now.getDate());
			assert.equal(d.getHours(), 0);
			assert.equal(d.getMinutes(), 0);
			assert.equal(d.getSeconds(), 0);
		});
	});
	
	describe('dateAdd()', function() {
		it('adds and subtracts values', function() {
			var _ = req();
			var d = new Date(2011, 4, 23, 11, 23, 22, 492);
			assert(_.equals(_.dateAdd(d, 'fullYear', 2), new Date(2013, 4, 23, 11, 23, 22, 492)));
			assert(_.equals(_.dateAdd(d, 'fullYear', -10), new Date(2001, 4, 23, 11, 23, 22, 492)));
			assert(_.equals(_.dateAdd(d, 'month', 2), new Date(2011, 6, 23, 11, 23, 22, 492)));
			assert(_.equals(_.dateAdd(d, 'month', -10), new Date(2010, 6, 23, 11, 23, 22, 492)));
			assert(_.equals(_.dateAdd(d, 'date', 12), new Date(2011, 5, 4, 11, 23, 22, 492)));
			assert(_.equals(_.dateAdd(d, 'date', -10), new Date(2011, 4, 13, 11, 23, 22, 492)));
 			assert(_.equals(_.dateAdd(d, 'hours', 24), new Date(2011, 4, 24, 11, 23, 22, 492)));
			assert(_.equals(_.dateAdd(d, 'hours', -11), new Date(2011, 4, 23, 0, 23, 22, 492)));
 			assert(_.equals(_.dateAdd(d, 'minutes', 60), new Date(2011, 4, 23, 12, 23, 22, 492)));
			assert(_.equals(_.dateAdd(d, 'minutes', -1), new Date(2011, 4, 23, 11, 22, 22, 492)));
 			assert(_.equals(_.dateAdd(d, 'seconds', 3660), new Date(2011, 4, 23, 12, 24, 22, 492)));
			assert(_.equals(_.dateAdd(d, 'seconds', -75), new Date(2011, 4, 23,  11, 22,  7, 492)));
 			assert(_.equals(_.dateAdd(d, 'milliseconds', 108), new Date(2011, 4, 23, 11, 23, 22, 600)));
			assert(_.equals(_.dateAdd(d, 'milliseconds', -75000), new Date(2011, 4, 23,  11, 22,  7, 492)));	
		});
	});

	describe('dateDiff()', function() {
		it('find calender differences', function() {
			var _ = req();
			var d =  new Date(2004, 1, 23, 11, 23, 22, 492);

			var y1 =  new Date(2013, 7, 23, 11, 23, 22, 492);
			var y2 = new Date(2005, 1, 23, 11, 23, 24, 492);
			var y3 = new Date(2005, 1, 23, 11, 23, 21, 492);
			var y4 = new Date(1972, 1, 23);
			
			var m1 = new Date(2004, 2, 23, 11, 23, 22, 493);
			var m2 = new Date(2004, 2, 23, 11, 23, 22, 491);
			var m3 = new Date(2005, 1, 25, 11, 23, 22);
			var m4 = new Date(2005, 0, 30, 11, 23, 22);
			var m5 = new Date(1974, 1, 01);
			
			var d1 = new Date(2004, 2, 23, 11, 23, 22, 492);
			var d2 = new Date(2005, 1, 23, 12, 12, 22);
			
			var d3 = new Date(1999, 7, 31);
			var d4 = new Date(1982, 1, 12);
			var d5 = new Date(1975, 0, 1);
			var d6 = new Date(2020, 11, 24);

			assert.equal(_.dateDiff('fullYear', d, y1), 9);
			assert.equal(_.dateDiff('fullYear', d, y2), 1);
			assert.equal(_.dateDiff('fullYear', d, y3), 0);
			assert.equal(_.dateDiff('fullYear', y1, d), -9);
			assert.equal(_.dateDiff('fullYear', y2, d), -1);
			assert.equal(_.dateDiff('fullYear', y3, d), 0);
			assert.equal(_.dateDiff('fullYear', y4, d), 32);
			
			assert.equal(_.dateDiff('month', d, m1), 1);
			assert.equal(_.dateDiff('month', d, m2), 0);
			assert.equal(_.dateDiff('month', d, m3), 12);
			assert.equal(_.dateDiff('month', d, m4), 11);
			assert.equal(_.dateDiff('month', m1, d), -1);
			assert.equal(_.dateDiff('month', m2, d), 0);
			assert.equal(_.dateDiff('month', m3, d), -12);
			assert.equal(_.dateDiff('month', m4, d), -11);
			assert.equal(_.dateDiff('month', m5, d), 360);

			assert.equal(_.dateDiff('date', d, d1), 29);
			assert.equal(_.dateDiff('date', d, d2), 366);
			assert.equal(_.dateDiff('date', d3, d), 1637);
			assert.equal(_.dateDiff('date', d4, d), 8046); 
			assert.equal(_.dateDiff('date', d5, d), 10645);
			assert.equal(_.dateDiff('date', d6, d), -6148); 
		});
		
		it('find time differences', function() {
			var _ = req();
			var d =  new Date(2004, 1, 23, 11, 23, 22, 492);

			var h1 =  new Date(2004, 1, 24, 11, 23, 22, 492);
			var h2 = new Date(2004, 1, 23, 13, 23, 22, 492);
			var h3 = new Date(2004, 1, 23, 12, 38, 22, 492);

			var m1 =  new Date(2004, 1, 23, 11, 24, 22, 492);
			var m2 = new Date(2004, 1, 23, 11, 22, 22, 492);
			var m3 = new Date(2004, 1, 23, 11, 23, 52, 492);

			var s1 =  new Date(2004, 1, 23, 11, 23, 51, 492);
			var s2 = new Date(2004, 1, 23, 11, 25, 22, 492);

			var ms1 =  new Date(2004, 1, 23, 11, 23, 22, 509);

			assert.equal(_.dateDiff('hours', d, h1), 24);
			assert.equal(_.dateDiff('hours', d, h2), 2);
			assert.equal(_.dateDiff('hours', d, h3), 1.25);
			assert.equal(_.dateDiff('hours', h3, d), -1.25);
			
			assert.equal(_.dateDiff('minutes', d, m1), 1);
			assert.equal(_.dateDiff('minutes', d, m2), -1);
			assert.equal(_.dateDiff('minutes', d, m3), 0.5);

			assert.equal(_.dateDiff('seconds', d, s1), 29);
			assert.equal(_.dateDiff('seconds', d, s2), 120);

			assert.equal(_.dateDiff('milliseconds', d, ms1), 17);
		});
	});

	
}

testCommon.run(runTests);



