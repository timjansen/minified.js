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

	function cloneWithTimezone(d, tz) {
		var d2 = _.dateClone(d);
		d2.getTimezoneOffset = function() { return tz; };
		return d2;
	}
	
	function assertDateEqual(d1, d2) {
        if ((!!d1 != !!d2) || (d1 && (d1.getTime() != d2.getTime())))
            throw new Error("Failed date assertion: " + (d1&&d1.toUTCString())+ " == "+(d2&&d2.toUTCString()));
	}


	describe('escapeRegExp()', function() {
		it('escapes all special chars', function() {
			var test = "w2 dsb ^ & \\ * . e+ e3 []4{3}$ 3";
			var re = new RegExp(_.escapeRegExp("w2 dsb ^ & \\ * . e+ e3 []4{3}$ 3"));
			assert(re.test(test));
			assert.equal(("1"+test+"c").replace(test, ""), "1c");
		});
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

	describe('trim()', function() {
		it('just works', function() {
			assert.equal(_.trim(''), "");
			assert.equal(_.trim('a'), "a");
			assert.equal(_.trim(' a'), "a");
			assert.equal(_.trim('a s '), "a s");
			assert.equal(_.trim(' a s '), "a s");
		});
	});

	describe('isEmpty()', function() {
		it('supports strings', function() {
			assert(!_.isEmpty('a'));
			assert(_.isEmpty(null));
			assert(_.isEmpty(''));
			assert(!_.isEmpty(' '));
			assert(!_.isEmpty(' \t \t   \t'));
		});
		it('supports strings with whitespace', function() {
			assert(!_.isEmpty('ff', true));
			assert(_.isEmpty(null, true));
			assert(_.isEmpty('', true));
			assert(_.isEmpty(' ', true));
			assert(_.isEmpty(' \t \t   \t', true));
		});
		it('supports lists', function() {
			assert(!_.isEmpty(['a']));
			assert(_.isEmpty([]));
		});
	});

	
	describe('formatValue()', function() {
		it('formats numbers', function() {
			assert.equal(_.formatValue("#", 1), "1");
			assert.equal(_.formatValue("0", -1), "-1");
			assert.equal(_.formatValue("#####", 1), "1");
			assert.equal(_.formatValue("00000", 1), "00001");
			assert.equal(_.formatValue("00000", -1), "-00001");
			assert.equal(_.formatValue("?#", 1), "1");
			assert.equal(_.formatValue("?00000", -1), "-00001");
			
			assert.equal(_.formatValue("#.0", 1), "1.0");
			assert.equal(_.formatValue("0.00", 1), "1.00");
			assert.equal(_.formatValue("0.0000", 1), "1.0000");
			assert.equal(_.formatValue("#.#", 1), "1");
			assert.equal(_.formatValue("#.####", 1), "1");
			assert.equal(_.formatValue("#.0000", -1), "-1.0000");
			assert.equal(_.formatValue("0.#", -1), "-1");
			
			assert.equal(_.formatValue("#.0", 287591/1024), "280.9");
			assert.equal(_.formatValue("##.0", 287591/1024), "280.9");
			assert.equal(_.formatValue("###.0", 287591/1024), "280.9");
			assert.equal(_.formatValue("####.0", 287591/1024), "280.9");

			assert.equal(_.formatValue("0.0", 287591/1024), "280.9");
			assert.equal(_.formatValue("00.0", 287591/1024), "280.9");
			assert.equal(_.formatValue("000.0", 287591/1024), "280.9");
			assert.equal(_.formatValue("0000.0", 287591/1024), "0280.9");

			assert.equal(_.formatValue("##.0", -287591/1024), "-280.9");
			assert.equal(_.formatValue("00.0", -287591/1024), "-280.9");
			assert.equal(_.formatValue("####.0", -287591/1024), "-280.9");
			assert.equal(_.formatValue("0000.0", -287591/1024), "-0280.9");
			
			assert.equal(_.formatValue("#0", 2), "2");
			assert.equal(_.formatValue("##00", 4), "04");
			assert.equal(_.formatValue("##00", 40), "40");
			assert.equal(_.formatValue("##00", 402), "402");
			assert.equal(_.formatValue("###0", 1), "1");
			assert.equal(_.formatValue("###0", 12), "12");
			
			assert.equal(_.formatValue("#", 1.5), "2");
			assert.equal(_.formatValue("#.0", 1.5), "1.5");
			assert.equal(_.formatValue("#.00", 1.5), "1.50");
			assert.equal(_.formatValue("#.000", 1.5), "1.500");
			assert.equal(_.formatValue("#.###", 1.5), "1.5");
			
			assert.equal(_.formatValue("#.0", 1.667), "1.7");
			assert.equal(_.formatValue("#.00", 1.667), "1.67");
			assert.equal(_.formatValue("#.000", 1.667), "1.667");
			assert.equal(_.formatValue("#.0000", 1.667), "1.6670");
			assert.equal(_.formatValue("#.#", 1.667), "1.7");
			assert.equal(_.formatValue("#.##", 1.667), "1.67");
			assert.equal(_.formatValue("#.###", 1.667), "1.667");
			assert.equal(_.formatValue("#.####", 1.667), "1.667");
			
			assert.equal(_.formatValue("#,0", 1), "1,0");
			assert.equal(_.formatValue("#,#", 1.667), "1,7");
			assert.equal(_.formatValue("#,0", 1.667), "1,7");
			
			assert.equal(_.formatValue("00.0000", 1.667), "01.6670");
			assert.equal(_.formatValue("0.#", 10.667), "10.7");
			assert.equal(_.formatValue("000000000,00", 1.667), "000000001,67");
			assert.equal(_.formatValue("000000000.##", 777.667), "000000777.67");
			
			assert.equal(_.formatValue("#.###.###.###", 9999999999), "9.999.999.999");
			assert.equal(_.formatValue("#.###.###.###",  999999999),   "999.999.999");
			assert.equal(_.formatValue("0.000.000.000",  999999999), "0.999.999.999");
			assert.equal(_.formatValue("#########,###.##", 9999999999), "9999999,999");
			assert.equal(_.formatValue("####### ## ###.##", 9999999999.129), "99999 99 999.13");
			assert.equal(_.formatValue("#########,###.00", 9999999999), "9999999,999.00");
			assert.equal(_.formatValue("0,000,000,000.##", 9999999999), "9,999,999,999");
			assert.equal(_.formatValue("0,000,000,000.00", 9999999999), "9,999,999,999.00");
			assert.equal(_.formatValue("000,000,000.##", 123456.256), "000,123,456.26");
			assert.equal(_.formatValue("000 000 000.00", 123456.256), "000 123 456.26");
			assert.equal(_.formatValue("000-000-000.00", 123456.256), "000-123-456.26");
			assert.equal(_.formatValue("###,###,###.00", 123456.256), "123,456.26");
			assert.equal(_.formatValue("###, xud ##x5#, #f5##.00", 1234.256), "1, 2f534.26");

			assert.equal(_.formatValue("#.###.###.###",          9), "9");
			assert.equal(_.formatValue("#.###.###.###",         99), "99");
			assert.equal(_.formatValue("#.###.###.###",        999), "999");
			assert.equal(_.formatValue("#.###.###.###",       9999), "9.999");
			assert.equal(_.formatValue("#.###.###.###",      99999), "99.999");
			assert.equal(_.formatValue("#.###.###.###",     999999), "999.999");
			assert.equal(_.formatValue("#.###.###.###",    9999999), "9.999.999");

			assert.equal(_.formatValue("#.###.#00.000",          9), "00.009");
			assert.equal(_.formatValue("#.###.#00.000",         99), "00.099");
			assert.equal(_.formatValue("#.###.#00.000",        999), "00.999");
			assert.equal(_.formatValue("#.###.#00.000",       9999), "09.999");
			assert.equal(_.formatValue("#.###.#00.000",      99999), "99.999");
			assert.equal(_.formatValue("#.###.#00.000",     999999), "999.999");
			assert.equal(_.formatValue("#.###.#00.000",    9999999), "9.999.999");

			assert.equal(_.formatValue("#,###.###,###",  1234.567890), "1,234.567,89");
						
			assert.equal(_.formatValue("ABC#####DEF", 1), "ABC1DEF");
			assert.equal(_.formatValue("?ABC#####DEF", 1), "ABC1DEF");
			assert.equal(_.formatValue("$#.00", 1), "$1.00");
			assert.equal(_.formatValue("$#.00", -1), "$-1.00");
			assert.equal(_.formatValue("$0.00", -1), "$-1.00");
			assert.equal(_.formatValue("$#.00", -10), "$-10.00");
			assert.equal(_.formatValue("$0.00", -10), "$-10.00");
			assert.equal(_.formatValue("bla=0.000 bla", 1.5), "bla=1.500 bla");
			assert.equal(_.formatValue("#.## EUR", 1.667), "1.67 EUR");
			assert.equal(_.formatValue("c 0,000,000,000.00 e", 9999999999), "c 9,999,999,999.00 e");
		});
		
		it('supports string choices', function() {
			assert.equal(_.formatValue("a:0|b:1|c:2|d:3|4", "c"), "2");
			assert.equal(_.formatValue("a:0|b:1|c:2|d:3|4", "a"), "0");
			assert.equal(_.formatValue("a:0|b:1|c:2|d:3|4", "e"), "4");
			assert.equal(_.formatValue("?a:0|b:1|c:2|d:3|4", "e"), "4");

			assert.equal(_.formatValue("a: 0 | b: 1 | c: 2| d: 3| 4", "c"), "2");
			assert.equal(_.formatValue("a: 0 | b: 1 | c: 2| d: 3| 4", "a"), "0");
			assert.equal(_.formatValue("a: 0 | b: 1 | c: 2| d: 3| 4", "e"), "4");

			assert.equal(_.formatValue("true:xx| false:yyy", true), "xx");
			assert.equal(_.formatValue("true:xx| false:yyy", false), "yyy");
			assert.equal(_.formatValue("true:xx| yyy", false), "yyy");

			assert.equal(_.formatValue("abc:cba|def:fed|ghi", "abc"), "cba");
			assert.equal(_.formatValue("abc:cba|def:fed|ghi", null), "ghi");
			assert.equal(_.formatValue("abc:cba|def:fed|null:n0ll|ghi", null), "n0ll");
		});
		
		it('supports number choices', function() {
			assert.equal(_.formatValue("<0:neg|0:zero|>0:pos|funny", -0.1), "neg");
			assert.equal(_.formatValue("<0:neg|=0:zero|>0:pos|funny", 0), "zero");
			assert.equal(_.formatValue("<0:neg|0:zero|>0:pos|funny", 0), "zero");
			assert.equal(_.formatValue("<0:neg|0:zero|>0:pos|funny", 0.1), "pos");
			assert.equal(_.formatValue("?<0:neg|0:zero|>0:pos|funny", 0.1), "pos");

			assert.equal(_.formatValue(">0:a|>=0:b|<10:c|<=10:d|e", 1), "a");

			assert.equal(_.formatValue("<13:kid | <=19:teen | >=65:senior | adult", 12), "kid");
			assert.equal(_.formatValue("<13:kid | <=19:teen | >=65:senior | adult", 13), "teen");
			assert.equal(_.formatValue("<13:kid | <=19:teen | >=65:senior | adult", 19), "teen");
			assert.equal(_.formatValue("<13:kid | <=19:teen | >=65:senior | adult", 20), "adult");
			assert.equal(_.formatValue("<13:kid | <=19:teen | >=65:senior | adult", 64), "adult");
			assert.equal(_.formatValue("<13:kid | <=19:teen | >=65:senior | adult", 65), "senior");
			assert.equal(_.formatValue("<13:kid | <=19:teen | >=65:senior | adult", 66), "senior");

			assert.equal(_.formatValue("<10: small #.00 | >100: big 0000.0000 | medium #.#", 1.1), "small 1.10");
			assert.equal(_.formatValue("<10: small #.00 | >100: big 0000.0000 | medium #.#", 54), "medium 54");
			assert.equal(_.formatValue("<10: small #.00 | >100: big 0000.0000 | medium #.#", 217), "big 0217.0000");
			assert.equal(_.formatValue("<10: small #.00 | >100: big 0000.0000 | medium", 50), "medium");
		});
		
		it('formats dates', function() {
			var d = new Date(2011, 11, 6,  13, 30, 10, 501);
			var d2 = new Date(2013, 0, 5,  02,  0,  0,  0);
			assert.equal(_.formatValue("yMd", d), "2011126");
			assert.equal(_.formatValue("yyyyMMdd", d), "20111206");
			assert.equal(_.formatValue("yyyyyyMMMMMddd", d), "00201100012006");
			assert.equal(_.formatValue("?yyyyyyMMMMMddd", d), "00201100012006");

			assert.equal(_.formatValue("yyyyYYMMdd,n,N,m,H,h,k,K,s,S,a,w,W", d), "2011111206,Dec,December,30,13,1,14,1,10,501,pm,Tue,Tuesday");
			assert.equal(_.formatValue("yyyyYYMMdd,n,N,m,H,h,k,K,s,SSS,a,w,W", d2), "2013130105,Jan,January,0,2,2,3,2,0,000,am,Sat,Saturday");
			assert.equal(_.formatValue("n[a,b,c,d,e,f,g,h,i,j,k,l],N[01,02,03,04,05,06,07,08,09,10,11,12]", d), "l,12");
			assert.equal(_.formatValue("w[a,b,c,d,e,f,g],W[01,02,03,04,05,06,07]", d), "c,03");

			var d3 = new Date(2011, 11, 6,  12, 37, 10, 501);
			assert.equal(_.formatValue("hhmmss aa", d3), "123710 pm");
		});
		
		it('formats timezone', function() {
			var d = new Date(2011, 11, 6,  13, 30, 10, 501);

			var zzzz = (d.getTimezoneOffset() > 0 ? '-' : '+') + _.pad(2, Math.abs(Math.floor(d.getTimezoneOffset()/60))) + _.pad(2, Math.floor(Math.abs(d.getTimezoneOffset()%60)));
			assert.equal(_.formatValue("HHmmss z", d), "133010 " + zzzz);
			assert.equal(_.formatValue("HHmmss zzzzz", d), "133010 " + zzzz);

			var d2 = new Date(1362956403000); // Sun, 10 Mar 2013 23:00:03 GMT  NO DAYLIGHT SAVING
			assert.equal(_.formatValue("[+0000] yyyy-MM-dd HH:mm:ss zzzzz", d2), "2013-03-10 23:00:03 +0000");
			assert.equal(_.formatValue("[+0001] yyyy-MM-dd HH:mm:ss zzzzz", d2), "2013-03-10 23:01:03 +0001");
			assert.equal(_.formatValue("[+0100] yyyy-MM-dd HH:mm:ss zzzzz", d2), "2013-03-11 00:00:03 +0100");
			assert.equal(_.formatValue("[-1100] yyyy-MM-dd HH:mm:ss zzzzz", d2), "2013-03-10 12:00:03 -1100");
			assert.equal(_.formatValue("?[-1100] yyyy-MM-dd HH:mm:ss zzzzz", d2), "2013-03-10 12:00:03 -1100");
			
			var d3 = new Date(1530973632000); // Sat, 07 Jul 2018 14:27:12 GMT  DAYLIGHT SAVING
			assert.equal(_.formatValue("[+0000] yyyy-MM-dd HH:mm:ss zzzzz", d3), "2018-07-07 14:27:12 +0000");
			assert.equal(_.formatValue("[+0001] yyyy-MM-dd HH:mm:ss zzzzz", d3), "2018-07-07 14:28:12 +0001");
			assert.equal(_.formatValue("[+0100] yyyy-MM-dd HH:mm:ss zzzzz", d3), "2018-07-07 15:27:12 +0100");
			assert.equal(_.formatValue("[-1100] yyyy-MM-dd HH:mm:ss zzzzz", d3), "2018-07-07 03:27:12 -1100");
			assert.equal(_.formatValue("?[-1100] yyyy-MM-dd HH:mm:ss zzzzz", d3), "2018-07-07 03:27:12 -1100");

			assert.equal(_.formatValue("yyyy-MM-dd HH:mm:ss zzzzz", cloneWithTimezone(d, 0)), "2011-12-06 13:30:10 +0000");
			assert.equal(_.formatValue("yyyy-MM-dd HH:mm:ss zzzzz", cloneWithTimezone(d, -1)), "2011-12-06 13:30:10 +0001");
			assert.equal(_.formatValue("yyyy-MM-dd HH:mm:ss zzzzz", cloneWithTimezone(d, 1)), "2011-12-06 13:30:10 -0001");
			assert.equal(_.formatValue("yyyy-MM-dd HH:mm:ss zzzzz", cloneWithTimezone(d, -60)), "2011-12-06 13:30:10 +0100");
			assert.equal(_.formatValue("yyyy-MM-dd HH:mm:ss zzzzz", cloneWithTimezone(d, 660)), "2011-12-06 13:30:10 -1100");
			assert.equal(_.formatValue("?yyyy-MM-dd HH:mm:ss zzzzz", cloneWithTimezone(d, 660)), "2011-12-06 13:30:10 -1100");
		});
	});
	
	describe('parseDate()', function() {
		it('parses dates', function() {
			var d0 = new Date(2011, 11, 6);
			var d = new Date(2011, 11, 6,  13, 30, 10, 501);
			var d2 = new Date(2013, 0, 5,  02,  0,  0, 0);
			
			assertDateEqual(_.parseDate("yyyyMMdd", "20111206"), d0);
			assertDateEqual(_.parseDate("yyyy,MM,dd", "2011,12,06"), d0);
			assertDateEqual(_.parseDate("y,M,d", "2011,12,06"), d0);
			assertDateEqual(_.parseDate("y,M,d", "2011,12,6"), d0);
			assertDateEqual(_.parseDate("Y,M,d", "11,12,6"), d0);
			assertDateEqual(_.parseDate("yyyyMMddhhmmssaa", "20130105020000am"), d2);
			assertDateEqual(_.parseDate("y,M,d,h,m,s,a", "2013,1,5,2,0,0,am"), d2);
			assertDateEqual(_.parseDate("Y,M,d,h,m,s,a", "13,1,5,2,0,0,AM"), d2);

			assertDateEqual(_.parseDate("yyyy,d,n,m,H,s,S,w,W", "2011,6,Dec,30,13,10,501,Tue,Tuesday"), d);
			assertDateEqual(_.parseDate("yyyy,d,n,m,h,s,S,a,w,W", "2011,6,Decem,30,1,10,501,pm,Tue,Tuesday"), d);
			assertDateEqual(_.parseDate("yyyy,d,n,m,K,s,S,w,W", "2011,06,Dec,30,14,10,501,Wed,Wednesday"), d); // ignored w/W
			assertDateEqual(_.parseDate("?yyyy,d,N,m,k,s,S,a,w,W", "2011,06,December,30,2,10,501,pm,Tue,Tuesday"), d);
			assertDateEqual(_.parseDate("yyyy+d-N(m)k,s,S,a\\w,W", "2011+06-December(30)2,10,501,pm\\Tue,Tuesday"), d);

			assertDateEqual(_.parseDate("yyyy-N[MoneM,Mtwo,Mthree,Mfour,Mfive,Msix,Mseven,Meight,Mnine,Mten,Meleven,Mtwelve]-dd", "2011-Mtwelve-06"), d0);
			assertDateEqual(_.parseDate("?y,M,d,h,m,s,S,a[AMM,PAM]", "2011,12,6,1,30,10,501,PAM"), d);
			assertDateEqual(_.parseDate("y,M,d,h,m,s,a[AMM,PAM]", "2013,1,5,2,0,0,AMM"), d2);

            assertDateEqual(_.parseDate("yyyy-N[J1M,M2M,M3M,M4M,M5M,M6M,M7M,M8M,M9M,M10M,M11M,D\u00d6c]-dd", "2011-D\u00d6c-06"), d0); // non-ASCII
			assertDateEqual(_.parseDate("yyyynddhhmmssa", "2013Jan05020000AM"), d2); 
		});
		it('handles timezones', function() {
			var dUtc = new Date(1323178210501); //new Date(2011, 11, 6,  13, 30, 10, 501); in UTC
			var d2Utc = new Date(1357351200000); // new Date(2013, 0, 5,  02,  0,  0,   0); in UTC
			var f1 = "[+0000] yyyy-MM-dd HH:mm:ss.SSS";

			assertDateEqual(_.parseDate("[+0000] yyyy-MM-dd HH:mm:ss.SSS", "2011-12-06 13:30:10.501"), dUtc);
			assertDateEqual(_.parseDate("[+0200] yyyy-MM-dd HH:mm:ss.SSS", "2011-12-06 15:30:10.501"), dUtc);
			assertDateEqual(_.parseDate("[+0201] yyyy-MM-dd HH:mm:ss.SSS", "2011-12-06 15:31:10.501"), dUtc);
			assertDateEqual(_.parseDate("[+1200] yyyy-MM-dd HH:mm:ss.SSS", "2011-12-07 01:30:10.501"), dUtc);
			assertDateEqual(_.parseDate("[-0005] yyyy-MM-dd HH:mm:ss.SSS", "2011-12-06 13:25:10.501"), dUtc);
			assertDateEqual(_.parseDate("[-1200] yyyy-MM-dd HH:mm:ss.SSS", "2011-12-06 01:30:10.501"), dUtc);
			assertDateEqual(_.parseDate("[-1400] yyyy-MM-dd HH:mm:ss.SSS", "2011-12-05 23:30:10.501"), dUtc);

			assertDateEqual(_.parseDate(f1, "2013-01-05 02:00:00.000"), d2Utc);
			assertDateEqual(_.parseDate("[-0500] y,M,d,H,m,s,S", "2013,1,5,2,0,0,0"), _.dateAdd(d2Utc, 'minutes', 300));
			assertDateEqual(_.parseDate("[+0501] y,M,d,H,m,s,S", "2013,1,5,2,0,0,0"), _.dateAdd(d2Utc, 'minutes', -301));

			var f2 = "yyyy-MM-dd HH:mm:ss.SSS zz";
			assertDateEqual(_.parseDate(f2, "2011-12-06 13:30:10.501 +0000"), dUtc);
			assertDateEqual(_.parseDate(f2, "2011-12-06 13:30:10.501 +0030"),  _.dateAdd(dUtc, 'minutes', -30));
			assertDateEqual(_.parseDate(f2, "2011-12-06 13:30:10.501 +0200"),  _.dateAdd(dUtc, 'minutes', -120));
			assertDateEqual(_.parseDate(f2, "2011-12-06 13:30:10.501 +0230"),  _.dateAdd(dUtc, 'minutes', -150));
			assertDateEqual(_.parseDate(f2, "2011-12-06 13:30:10.501 +1200"),  _.dateAdd(dUtc, 'minutes', -720));
			assertDateEqual(_.parseDate(f2, "2011-12-06 13:30:10.501 -0030"), _.dateAdd(dUtc, 'minutes', 30));
			assertDateEqual(_.parseDate(f2, "2011-12-06 13:30:10.501 -0100"), _.dateAdd(dUtc, 'minutes', 60));
			assertDateEqual(_.parseDate(f2, "2011-12-06 13:30:10.501 -0125"), _.dateAdd(dUtc, 'minutes', 85));

			assert.equal(_.formatValue(f2, _.parseDate(f2, _.formatValue(f2, dUtc))), _.formatValue(f2, dUtc));
		});
		it('does not parse broken strings', function() {
			assert.strictEqual(_.parseDate("yyyy-MM-dd", "2010-a2-02"), undefined);
			assert.strictEqual(_.parseDate("yyyy-MM-dd", "2010.02.02"), undefined);
			assert.strictEqual(_.parseDate("yyyy-MM-dd", "2010-02-"), undefined);
			assert.strictEqual(_.parseDate("yyyy-NN-dd", "2010-Snowctober-07"), undefined);
			assert.strictEqual(_.parseDate("yyyy-NN[Jan,Feb]-dd", "2010-October-07"), undefined);
		});
		it('parses empty strings', function() {
			assert.strictEqual(_.parseDate("?yyyy-MM-dd", ""), null);
			assert.strictEqual(_.parseDate("?__yyyy-MM-dd ()()(", "    "), null);
		});
	});

	describe('parseNumber()', function() {
		it('parse numbers', function() {
			assert.equal(_.parseNumber("000", "0"), 0);
			assert.equal(_.parseNumber("#", "1"), 1);
			assert.equal(_.parseNumber("####,###", "02020"), 2020);
			assert.equal(_.parseNumber(".", "-1.5"), -1.5);
			assert.equal(_.parseNumber(",", "-1.5"), -15);
			assert.equal(_.parseNumber("###,###", "-1.5"), -15);
			assert.equal(_.parseNumber(",", "2.222.333"), 2222333);
			assert.equal(_.parseNumber(".", "0.1"), 0.1);
			assert.equal(_.parseNumber("###,000", "012,135"), 12.135);
			assert.equal(_.parseNumber("###.000", "012.135"), 12.135);
			assert.equal(_.parseNumber("#,#,#.0", "-43,3,3,3,0.12"), -433330.12);
			assert.equal(_.parseNumber("#.#.#,0", "-43.3.3.3.0,12"), -433330.12);
		});
		it('does not parse broken strings', function() {
			assert.equal(_.parseNumber("0", "a"), undefined);
		});
	});
	
	describe('format()', function() {
		it('replaces the main object', function() {
			assert.equal(_.format("abc{{}}def", 5), "abc5def");
		});
		it('supports string properties', function() {
			assert.equal(_.format("{{ABC}}{{XXX}}def{{null}}={{obj['_ODD+NAME']}}", {XXX:5, ABC:'abc', '_ODD+NAME':'0202'}), "abc5def=0202");
		});
		it('supports complex properties', function() {
			assert.equal(_.format("a.b={{a.b}}, e.e._32.42={{e.e._32[42][1]}}", {a:{b:2}, e:{e:{_32:{'42':[1, 5]}}}}), "a.b=2, e.e._32.42=5");
		});
		it('supports sub formats', function() {
			assert.equal(_.format("{{ a ::000.00}} | {{choice::a:x|b:y|c:z}} | {{date::yyyyMMdd}}", {a: 15.8, choice: 'b', date: new Date(2011, 3, 2)}), "015.80 | y | 20110402");
		});
	});
	
	describe('template()', function() {
		it('returns a function', function() {
			assert(_.isFunction(_.template("abc")));
		});
		it('caches template functions', function() {
			assert(_.template("abc") === _.template("abc"));
		});
		it('() returns a simple string', function() {
			assert.equal(_.template("abc")(), "abc");
			assert.equal(_.template("1\n2\t3\r4\n5")(), "1\n2\t3\r4\n5");
			assert.equal(_.template("'''")(), "'''");
			assert.equal(_.template('"""')(), '"""');
		});
		it('() supports {{expression}}', function() {
			assert.equal(_.template("abc{{1}}xyz")(), "abc1xyz");
			assert.equal(_.template("abc{{1+2}}xyz")(), "abc3xyz");
			assert.equal(_.template("abc{{'123'}}xyz")(), "abc123xyz");
			assert.equal(_.template("{{1}}xyz")(), "1xyz");
			assert.equal(_.template("abc{{1}}")(), "abc1");
			assert.equal(_.template("abc{{a}}")({a:1}), "abc1");
			assert.equal(_.template("abc{{}}")(1), "abc1");
			assert.equal(_.template("{{a}}+{{b}}={{a+b}}")({a:1,b:3}), '1+3=4');
		});
		it('() supports {{expression::format}}>', function() {
			var d3 = new Date(1362956403000); // Sun, 10 Mar 2013 23:00:03 GMT  NO DAYLIGHT SAVING
			assert.equal(_.template("abc{{obj :: [+0000] yyyy-MM-dd HH:mm:ss zzzzz}}xyz")(d3), "abc2013-03-10 23:00:03 +0000xyz");
			assert.equal(_.template("abc{{::[+0000] yyyy-MM-dd HH:mm:ss zzzzz}}xyz")(d3), "abc2013-03-10 23:00:03 +0000xyz");
			assert.equal(_.template("{{s}} {{s :: #.0}} {{u :: #.0}}")({s: 287591, u: 287591/1024}), "287591 287591.0 280.9");
		});
		
		it('() supports {{if expression}}', function() {
			assert.equal(_.template("{{if 1>2 }}sn{{0}}w{{else}}ra{{1}}n{{/if}}")(), "ra1n");
			assert.equal(_.template("no{{if 1>2}}sn{{0}}w{{else}}ra{{1}}n{{/if}}!>><< %{}")(), "nora1n!>><< %{}");
			assert.equal(_.template("{{if this>3}}x{{{/if}}")(4), "x");
			assert.equal(_.template("{{if this<3}}x{{{/if}}")(4),  "");
			assert.equal(_.template("{{if this<3}}x{{else if this<30}}y{{else   if this<300}}z{{/if}}")(10), "y");
		});
		it('() supports {{var declaration}}', function() {
			assert.equal(_.template("{{var a=obj, b = a;}}{{b}}")('xx'), "xx");
		});
		
		it('() supports {{each expression}}', function() {
			assert.equal(_.template("{{each}}{{this}}{{/each}}")([1, 2, 3]), "123");
			assert.equal(_.template("{{each value , index:}}{{value}}-{{index}};{{/each}}")([1, 2, 3]), "1-0;2-1;3-2;");
			assert.equal(_.template("{{each value : }}{{value}}-{{/each}}")([1, 2, 3]), "1-2-3-");
			assert.equal(_.template("{{each value , index:obj}}{{value}}-{{index}};{{/each}}")([1, 2, 3]), "1-0;2-1;3-2;");
			assert.equal(_.template("{{each value : obj}}{{value}}-{{/each}}")([1, 2, 3]), "1-2-3-");
			assert.equal(_.template("{{each obj}}{{this}}{{/each}}")([1, 2, 3]), "123");
			assert.equal(_.template("{{each obj}}{{if this%2==0}}{{this}}{{/if}}{{/each}}")([1, 2, 3, 4, 5, 6]), "246");

			var eachResult =_.template("{{each key, value:}}{{this}}-{{value}}-{{key}};{{/each}}")({a:1, b:7});
			assert(eachResult == "1-1-a;7-7-b;" || eachResult == "7-7-b;1-1-a;");
			eachResult =_.template("{{each key, value: obj}}{{this}}-{{value}}-{{key}};{{/each}}")({a:1, b:7});
			assert(eachResult == "1-1-a;7-7-b;" || eachResult == "7-7-b;1-1-a;");
		});
		
		it('() supports {{{ }}} and esc', function() {
			assert.equal(_.template("{{esc(2)}} {{{esc(2)}}} {{5}}", function(a) { return a*2; })(), "8 4 10");
			assert.equal(_.template("{{5::#.000}}", function(a) { return 'x'+a+'x'; })(), "x5.000x");
		});
		it('() supports _', function() {
			assert.equal(_.template("{{_(1, 2).join('_')}}")(), "1_2");
		});
		it('() supports obj', function() {
			assert.equal(_.template("{{obj==null}}")(), "true");
			assert.equal(_.template("{{obj}}")(5), "5");
			assert.equal(_.template("{{obj.b}}")({a:6, b:7}), "7");
		});
		it('() supports with(obj)', function() {
			assert.equal(_.template("{{b}}{{{a}}}")({a:6, b:7}), "76");
		});
		it('() supports this', function() {
			assert.equal(_.template("{{this}}}")('lalala'), "lalala");
		});
		it('() supports {{# code }}', function() {
			assert.equal(_.template("{{#var a = 2, b = 4;}}{{a}}*{{b}}={{a*b}}")(), "2*4=8");
			assert.equal(_.template("{{# if (a > b) { }}x{{#} }}")({a:3, b:1}), "x");
		});
		it('() supports print()', function() {
			assert.equal(_.template("a{{#print('b', 'c');}}de")(), "abcde");
		});
	});

}

testCommon.run(runTests);



