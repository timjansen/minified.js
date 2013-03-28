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
		
		describe('formatValue()', function() {
			it('formats numbers', function() {
				assert.equal(_.formatValue("#", 1), "1");
				assert.equal(_.formatValue("0", -1), "-1");
				assert.equal(_.formatValue("#####", 1), "1");
				assert.equal(_.formatValue("00000", 1), "00001");
				assert.equal(_.formatValue("00000", -1), "-00001");
				assert.equal(_.formatValue("?#", 1), "1");
				assert.equal(_.formatValue("?00000", -1), "-00001");
				
				assert.equal(_.formatValue("#.9", 1), "1.0");
				assert.equal(_.formatValue("0.99", 1), "1.00");
				assert.equal(_.formatValue("0.9999", 1), "1.0000");
				assert.equal(_.formatValue("#._", 1), "1");
				assert.equal(_.formatValue("#.____", 1), "1");
				assert.equal(_.formatValue("#.9999", -1), "-1.0000");
				assert.equal(_.formatValue("0._", -1), "-1");
				
				assert.equal(_.formatValue("#", 1.5), "2");
				assert.equal(_.formatValue("#.9", 1.5), "1.5");
				assert.equal(_.formatValue("#.99", 1.5), "1.50");
				assert.equal(_.formatValue("#.999", 1.5), "1.500");
				assert.equal(_.formatValue("#.___", 1.5), "1.5");
				
				assert.equal(_.formatValue("#.9", 1.667), "1.7");
				assert.equal(_.formatValue("#.99", 1.667), "1.67");
				assert.equal(_.formatValue("#.999", 1.667), "1.667");
				assert.equal(_.formatValue("#.9999", 1.667), "1.6670");
				assert.equal(_.formatValue("#._", 1.667), "1.7");
				assert.equal(_.formatValue("#.__", 1.667), "1.67");
				assert.equal(_.formatValue("#.___", 1.667), "1.667");
				assert.equal(_.formatValue("#.____", 1.667), "1.667");
				
				assert.equal(_.formatValue("#,_", 1.667), "1,7");
				assert.equal(_.formatValue("#,9", 1.667), "1,7");
				
				assert.equal(_.formatValue("00.9999", 1.667), "01.6670");
				assert.equal(_.formatValue("0._", 10.667), "10.7");
				assert.equal(_.formatValue("000000000,99", 1.667), "000000001,67");
				assert.equal(_.formatValue("000000000.__", 777.667), "000000777.67");
				
				assert.equal(_.formatValue("#.###.###.###", 9999999999), "9.999.999.999");
				assert.equal(_.formatValue("#.###.###.###",  999999999),   "999.999.999");
				assert.equal(_.formatValue("0.000.000.000",  999999999), "0.999.999.999");
				assert.equal(_.formatValue("0,000,000,000.__", 9999999999), "9,999,999,999");
				assert.equal(_.formatValue("0,000,000,000.99", 9999999999), "9,999,999,999.00");
				assert.equal(_.formatValue("000,000,000.99", 123456.256), "000,123,456.26");
				assert.equal(_.formatValue("000,000,000.__", 123456.256), "000,123,456.26");
				assert.equal(_.formatValue("###,###,###.99", 123456.256), "123,456.26");
				
				assert.equal(_.formatValue("ABC#####DEF", 1), "ABC1DEF");
				assert.equal(_.formatValue("?ABC#####DEF", 1), "ABC1DEF");
				assert.equal(_.formatValue("$0.99", 1), "$1.00");
				assert.equal(_.formatValue("bla=0.999 bla", 1.5), "bla=1.500 bla");
				assert.equal(_.formatValue("#.__ EUR", 1.667), "1.67 EUR");
				assert.equal(_.formatValue("c 0,000,000,000.99 e", 9999999999), "c 9,999,999,999.00 e");
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

				assert.equal(_.formatValue("<10: small #.99 | >100: big 0000.9999 | medium #.#", 1.1), "small 1.10");
				assert.equal(_.formatValue("<10: small #.99 | >100: big 0000.9999 | medium #.#", 54), "medium 54");
				assert.equal(_.formatValue("<10: small #.99 | >100: big 0000.9999 | medium #.#", 217), "big 0217.0000");
				assert.equal(_.formatValue("<10: small #.99 | >100: big 0000.9999 | medium", 50), "medium");
			});
			
			it('formats dates', function() {
				var d = new Date(2011, 11, 6,  13, 30, 10, 501);
				var d2 = new Date(2013, 0, 5,  02, 00, 00, 00);
				assert.equal(_.formatValue("yMd", d), "2011126");
				assert.equal(_.formatValue("yyyyMMdd", d), "20111206");
				assert.equal(_.formatValue("yyyyyyMMMMMddd", d), "00201100012006");
				assert.equal(_.formatValue("?yyyyyyMMMMMddd", d), "00201100012006");

				assert.equal(_.formatValue("yyyyMMdd,n,N,m,H,h,K,k,s,S,a,w,W", d), "20111206,Dec,December,30,13,1,14,2,10,501,pm,Tue,Tuesday");
				assert.equal(_.formatValue("yyyyMMdd,n,N,m,H,h,K,k,s,SSS,a,w,W", d2), "20130105,Jan,January,0,2,2,3,3,0,000,am,Sat,Saturday");
				assert.equal(_.formatValue("n[a,b,c,d,e,f,g,h,i,j,k,l],N[01,02,03,04,05,06,07,08,09,10,11,12]", d), "l,12");
				assert.equal(_.formatValue("w[a,b,c,d,e,f,g],W[01,02,03,04,05,06,07]", d), "c,03");

				var zzzz = (d.getTimezoneOffset() > 0 ? '-' : '+') + _.pad(2, Math.abs(Math.floor(d.getTimezoneOffset()/60))) + _.pad(2, Math.floor(Math.abs(d.getTimezoneOffset()%60)));
				assert.equal(_.formatValue("HHmmss z", d), "133010 " + zzzz);
				assert.equal(_.formatValue("HHmmss zzzzz", d), "133010 " + zzzz);

				var d3 = new Date(1362956403000); // Sun, 10 Mar 2013 23:00:03 GMT
				assert.equal(_.formatValue("[+0000] yyyy-MM-dd HH:mm:ss zzzzz", d3), "2013-03-10 23:00:03 +0000");
				assert.equal(_.formatValue("[+0001] yyyy-MM-dd HH:mm:ss zzzzz", d3), "2013-03-10 23:01:03 +0001");
				assert.equal(_.formatValue("[+0100] yyyy-MM-dd HH:mm:ss zzzzz", d3), "2013-03-11 00:00:03 +0100");
				assert.equal(_.formatValue("[-1100] yyyy-MM-dd HH:mm:ss zzzzz", d3), "2013-03-10 12:00:03 -1100");
				assert.equal(_.formatValue("?[-1100] yyyy-MM-dd HH:mm:ss zzzzz", d3), "2013-03-10 12:00:03 -1100");
			});
		});
		
		describe('parseDate()', function() {
			it('parses dates', function() {
				var d0 = new Date(2011, 11, 6);
				var d = new Date(2011, 11, 6,  13, 30, 10, 501);
				var d2 = new Date(2013, 0, 5,  02, 00, 00, 00);
				
				assert(_.equals(_.parseDate("yyyyMMdd", "20111206"), d0));
				assert(_.equals(_.parseDate("yyyy,MM,dd", "2011,12,06"), d0));
				assert(_.equals(_.parseDate("y,M,d", "2011,12,06"), d0));
				assert(_.equals(_.parseDate("y,M,d", "2011,12,6"), d0));
				assert(_.equals(_.parseDate("yyyyMMddhhmmssaa", "20130105020000am"), d2));
				assert(_.equals(_.parseDate("y,M,d,h,m,s,a", "2013,1,5,2,0,0,am"), d2));
				assert(_.equals(_.parseDate("y,M,d,h,m,s,a", "2013,1,5,2,0,0,AM"), d2));

				assert(_.equals(_.parseDate("yyyy,d,n,m,H,s,S,w,W", "2011,6,Dec,30,13,10,501,Tue,Tuesday"), d));
				assert(_.equals(_.parseDate("yyyy,d,n,m,h,s,S,a,w,W", "2011,6,Decem,30,1,10,501,pm,Tue,Tuesday"), d));
				assert(_.equals(_.parseDate("yyyy,d,n,m,K,s,S,w,W", "2011,06,Dec,30,14,10,501,Wed,Wednesday"), d)); // ignored w/W
				assert(_.equals(_.parseDate("?yyyy,d,N,m,k,s,S,a,w,W", "2011,06,December,30,2,10,501,pm,Tue,Tuesday"), d));

				assert(_.equals(_.parseDate("yyyy-N[M1M,M2M,M3M,M4M,M5M,M6M,M7M,M8M,M9M,M10M,M11M,M12M]-dd", "2011-M12M-06"), d0));
				assert(_.equals(_.parseDate("?y,M,d,h,m,s,S,a[AMM,PAM]", "2011,12,6,1,30,10,501,PAM"), d));
				assert(_.equals(_.parseDate("y,M,d,h,m,s,a[AMM,PAM]", "2013,1,5,2,0,0,AMM"), d2));
				
				var f1 = "[+0000] yyyy-MM-dd hh:mm:ss.SSS aa";
				var f2 = "[-0500] y,M,d,H,m,s,S";
				assert(_.equals(_.parseDate(f1, _.formatValue(f1, d)), d));
				assert(_.equals(_.parseDate(f2, _.formatValue(f2, d)), d));
				assert(_.equals(_.parseDate(f1, _.formatValue(f1, d2)), d2));
				assert(_.equals(_.parseDate(f2, _.formatValue(f2, d2)), d2));

				var f3 = "yyyy-MM-dd HH:mm:ss.SSS zz";
				assert(_.equals(_.parseDate(f3, _.formatValue(f3, d)), d));
				assert(_.equals(_.parseDate(f3, _.formatValue(f3, d2)), d2));
			});
			it('does not parse broken strings', function() {
				assert.equal(_.parseDate("yyyy-MM-dd", "2010-a2-02"), undefined);
				assert.equal(_.parseDate("yyyy-MM-dd", "2010.02.02"), undefined);
				assert.equal(_.parseDate("yyyy-MM-dd", "2010-02-"), undefined);
				assert.equal(_.parseDate("yyyy-NN-dd", "2010-Snowctober-07"), undefined);
				assert.equal(_.parseDate("yyyy-NN[Jan,Feb]-dd", "2010-October-07"), undefined);
			});
			it('parses empty strings', function() {
				assert.equal(_.parseDate("?yyyy-MM-dd", ""), null);
				assert.equal(_.parseDate("?__yyyy-MM-dd ()()(", "    "), null);
			});
		});

		describe('parseNumber()', function() {
			it('parse numbers, no format', function() {
				assert.equal(_.parseNumber("0"), 0);
				assert.equal(_.parseNumber("1"), 1);
				assert.equal(_.parseNumber("02020"), 2020);
				assert.equal(_.parseNumber("-15"), -15);
				assert.equal(_.parseNumber("-3e3"), -3000);
				assert.equal(_.parseNumber("2,222,333"), 2222333);
				assert.equal(_.parseNumber("0.1"), 0.1);
				assert.equal(_.parseNumber("012.135"), 12.135);
				assert.equal(_.parseNumber("-43,3,3,3,0.12"), -433330.12);
				assert.equal(_.parseNumber("sderes,.df282020dsfewe"), 282020);
				assert.equal(_.parseNumber("sderes,.df-282020e3dsfewe"), -282020000);
				assert.equal(_.parseNumber("sderes,.df-282020.3dsfewe"), -282020.3);
			});
			
			it('parse numbers, with format', function() {
				assert.equal(_.parseNumber("000", "0"), 0);
				assert.equal(_.parseNumber("#", "1"), 1);
				assert.equal(_.parseNumber("####,___", "02020"), 2020);
				assert.equal(_.parseNumber(".", "-1.5"), -1.5);
				assert.equal(_.parseNumber(",", "-1.5"), -15);
				assert.equal(_.parseNumber("###,___", "-1.5"), -15);
				assert.equal(_.parseNumber(",", "2.222.333"), 2222333);
				assert.equal(_.parseNumber(".", "0.1"), 0.1);
				assert.equal(_.parseNumber("###,999", "012,135"), 12.135);
				assert.equal(_.parseNumber("###.999", "012.135"), 12.135);
				assert.equal(_.parseNumber("#,#,#.9", "-43,3,3,3,0.12"), -433330.12);
				assert.equal(_.parseNumber("#.#.#,9", "-43.3.3.3.0,12"), -433330.12);
			});
			it('does not parse broken strings', function() {
				assert.equal(_.parseNumber("0", "a"), undefined);
			});
		});
		
		describe('format()', function() {
			it('replaces the main object', function() {
				assert.equal(_.format("abc{}def", 5), "abc5def");
			});
			it('supports string properties', function() {
				assert.equal(_.format("{ABC}{XXX}def{DOESNOTEXIST}={_ODD+NAME}", {XXX:5, ABC:'abc', '_ODD+NAME':'0202'}), "abc5def=0202");
			});
			it('supports numberic properties', function() {
				assert.equal(_.format("{0} - {1} - {2} - {3} - {4} - ", [4, 5, 6, null]), "4 - 5 - 6 -  -  - ");
			});
			it('supports complex properties', function() {
				assert.equal(_.format("a.b={a.b}, e.e._32.42={e.e._32.42.1}", {a:{b:2}, e:{e:{_32:{'42':[1, 5]}}}}), "a.b=2, e.e._32.42=5");
			});
			it('supports sub formats', function() {
				assert.equal(_.format("{0,000.99} | {choice,a:x|b:y|c:z} | {date,yyyyMMdd}", {0: 15.8, choice: 'b', date: new Date(2011, 3, 2)}), "015.80 | y | 20110402");
			});
		});
	});
}

testCommon.run(runTests);



