// tests for minified-util-src.js
//
// Instructions:
// - requires node.js installation
// - install mocha (npm mocha -g)
// - run (mocha minified-util-list-test.js)
//

var testCommon = require("./minified-util-common.js");
var assert = require("assert");

var AMD_NAME = testCommon.AMD_NAME;
var loadInContextSrc = testCommon.loadInContextSrc;


function runTests(loadInContext) {
	function req() {
		return loadInContext().require(AMD_NAME)._;
	}
	
	describe('require()', function() {
		it('should provide _', function() {
			var g = loadInContext();
			assert(!!g.require);
			assert(!!g.require(AMD_NAME));
			assert(!!g.require(AMD_NAME)._);
			assert(!!req());
		});
	});
	
	describe('_()', function() {
		it('supports varargs', function() {
			var _ = req();
			assert.equal(_().length, 0);

			assert.equal(_(1).length, 1);
			assert.equal(_(1)[0], 1);
			
			assert.equal(_(null).length, 1);
			assert.equal(_(null)[0], null);

			assert.equal(_(1, 2).length, 2);
			assert.equal(_(1, 2)[0], 1);
			assert.equal(_(1, 2)[1], 2);

			assert.equal(_(1, 2, 3).length, 3);
			assert.equal(_(1, 2, 3)[0], 1);
			assert.equal(_(1, 2, 3)[1], 2);
			assert.equal(_(1, 2, 3)[2], 3);
		});

		it('supports arrays', function() {
			var _ = req();
			assert.equal(_([]).length, 0);

			assert.equal(_([1]).length, 1);
			assert.equal(_([1])[0], 1);

			assert.equal(_([1, 2]).length, 2);
			assert.equal(_([1, 2])[0], 1);
			assert.equal(_([1, 2])[1], 2);

			assert.equal(_([1, 2, 3]).length, 3);
			assert.equal(_([1, 2, 3])[0], 1);
			assert.equal(_([1, 2, 3])[1], 2);
			assert.equal(_([1, 2, 3])[2], 3);
		});
		
		it('supports array merges', function() {
			var _ = req();
			var l = _([1, 2], [], null, [null], [3, 4], [5], 6);
			assert.equal(l.length, 8);
			assert.equal(l[0], 1);
			assert.equal(l[1], 2);
			assert.equal(l[2], null);
			assert.equal(l[3], null);
			assert.equal(l[4], 3);
			assert.equal(l[5], 4);
			assert.equal(l[6], 5);
			assert.equal(l[7], 6);
			assert.equal(l[8], null);
		});
		
		it('does not touch nested arrays', function() {
			var _ = req();
			var l = _([[1], []], [1], [1, [2], [3, 4]]);
			assert.equal(l.length, 6);
			assert.equal(l[0][0], 1);
			assert.equal(l[1].length, 0);
			assert.equal(l[2], 1);
			assert.equal(l[3], 1);
			assert.equal(l[4][0], 2);
			assert.equal(l[5][0], 3);
			assert.equal(l[5][1], 4);
		});
	});

	describe('_.equals()', function() {
		it('compares arrays', function() {
			var _ = req();
			assert(_.equals([1, 2, 3], [1, 2, 3]));
			assert(_.equals([1, null, 2, 3], [1, null, 2, 3]));
			assert(_.equals([], []));
			assert(!_.equals([], [1, 2, 3]));
			assert(!_.equals([1, 2, 3], []));
			assert(!_.equals([1, 5, 3], [1, 2, 3]));
		});
		it('compares lists', function() {
			var _ = req();
			assert(_(1, 2, 3).equals([1, 2, 3]));
			assert(_(1, 2, 3).equals(_(1, 2, 3)));
			assert(_().equals([]));
			assert(!_().equals([1, 2, 3]));
			assert(!_(1, 2).equals(_(2, 1)));
		});
		it('compares objects', function() {
			var _ = req();
			assert(_.equals({a:1, b:2, c:3}, {a:1, c:3, b:2}));
			assert(_.equals({}, {}));
			assert(!_.equals({a:1, b:2}, {a:1, c:3, b:2}));
			assert(!_.equals({a:1, b:2, c:3}, {a:1, b:2}));
		});
		it('uses compare functions', function() {
			var _ = req();
			function cmp(a, b) { return a!=b || (a > 100 && b > 100); }
			
			assert(_(3, 2, 1).equals([0, 1, 9], cmp));
			assert(_.equals([1, 2, 3], [0, 1, 9], cmp));
			assert(_.equals([102, 102, 103], [120, 101, 109], cmp));
			assert(!_.equals([102, 102, 103], [120, 101, 109, 110], cmp));
			assert(!_.equals([102, 102, 103, 999, 221], [120, 101, 109, 110], cmp));
			assert(!_.equals([1, 2, 3], [1, 2, 3], cmp));
			
			assert(_.equals({a:3, b:1, c:9}, {a:1, c:3, b:2}, cmp));
			assert(_.equals({a:101, b:102, c:999}, {a:101, c:103, b:102}, cmp));
			assert(!_.equals({a:101, b:102}, {a:101, c:103, b:102}, cmp));
		});
		it('handles nulls', function() {
			var _ = req();
			assert(_.equals(null, null));
			assert(!_.equals(null, {}));
			assert(!_.equals(null, {a:1, c:3, b:2}));
			assert(!_.equals({}, null));
			assert(!_.equals({a:1, c:3, b:2}, null));
			assert(!_.equals(null, []));
			assert(!_.equals(null, [1, 2]));
			assert(!_.equals(_(), null));
			assert(!_.equals(_(2, 1), null));
		});
	});

	describe('_.each()', function() {
		it('iterates arrays', function() {
			var _ = req();
			var as = [[], [1, 3, 5, 2], [1], _(), _(3, true, false, null), _("23", "s", 2)];
			for (var i = 0; i < as.length; i++) {
				var c = 0;
				_.each(as[i], function(value, index) {
					assert.equal(index, c, "Index check i="+i);
					c++;
					assert.equal(value, as[i][index], "Value check i="+i+" index="+index);
				});
				assert.equal(c, as[i].length);
			}
		});
		it('iterates lists', function() {
			var _ = req();
			var as = [_(1, 3, 5, 2), _(1), _(), _(3, true, false, null), _("23", "s", 2)];
			for (var i = 0; i < as.length; i++) {
				var c = 0;
				as[i].each(function(value, index) {
					assert.equal(index, c, "Index check i="+i);
					c++;
					assert.equal(value, as[i][index], "Value check i="+i+" index="+index);
				});
				assert.equal(c, as[i].length);
			}
		});
		it('iterates objects', function() {
			var _ = req();
			var as = [{}, {a:1, b:2, e:null, f: false, g: true}, {x:2}];
			for (var i = 0; i < as.length; i++) {
				var c = 0;
				_.each(as[i], function(key, value) {
					c++;
					assert.equal(value, as[i][key]);
				});
				assert.equal(c, _.keys(as[i]).length);
			}
		});
		it('ignores nulls', function() {
			var _ = req();
			var c = 0, x={};
			_.each(null, function() { c++; });
			assert.equal(c, 0);
			_.each(x.x, function() { c++; });
			assert.equal(c, 0);
		});
	});
	
	describe('_.eachObj()', function() {
		it('iterates objects', function() {
			var _ = req();
			var as = [{}, {a:1, b:2, e:null, f: false, g: true}, {x:2}];
			for (var i = 0; i < as.length; i++) {
				var c = 0;
				_.eachObj(as[i], function(key, value) {
					c++;
					assert.equal(value, as[i][key]);
				});
				assert.equal(c, _.keys(as[i]).length);
			}
		});
		it('ignores nulls', function() {
			var _ = req();
			var c = 0, x={};
			_.eachObj(null, function() { c++; });
			assert.equal(c, 0);
			_.eachObj(x.x, function() { c++; });
			assert.equal(c, 0);
		});
	});
	
	describe('_.filter()', function() {
		it('filters lists', function() {
			var _ = req();
			var a = _(200, null, 1, 34, 2, 3, 200);
			var r = [null, 1, 2, 3];
			var c = 0;
			var flt = a.filter(function(v, index) { assert.equal(index, c++); return v < 10 || !v; });
			assert(flt.equals(r));
		});
		it('filters objects', function() {
			var _ = req();
			var a = {a: 200, b: null, c: 1, d: 34, e: 2, f: 3, g: 200};
			var r = {b: null, c: 1, e: 2, f: 3};
			var c = 0;
			var flt = _.filter(a, function(name, v) { c++; assert.equal(v, a[name]); return v < 10 || !v; });
			assert.equal(c, 7);
			assert(_.equals(flt, r));
		});
		it('filters null', function() {
			var _ = req();
			var c = 0;
			var flt = _.filter(null, function(v, index) { assert.equal(index, c++); return v < 10 || !v; });
			assert(_.equals(flt, {}));
			assert.equal(c, 0);
		});
	});
	
	describe('_.filterObj()', function() {
		it('filters objects', function() {
			var _ = req();
			var a = {a: 200, b: null, c: 1, d: 34, e: 2, f: 3, g: 200};
			var r = {b: null, c: 1, e: 2, f: 3};
			var c = 0;
			var flt = _.filterObj(a, function(name, v) { c++; assert.equal(v, a[name]); return v < 10 || !v; });
			assert.equal(c, 7);
			assert(_.equals(flt, r));
		});
		it('filters null', function() {
			var _ = req();
			var c = 0;
			var flt = _.filterObj(null, function(v, index) { assert.equal(index, c++); return v < 10 || !v; });
			assert(_.equals(flt, {}));
			assert.equal(c, 0);
		});
	});

	describe('_.collect()', function() {
		it('collects lists', function() {
			var _ = req();
			var a = _(200, null, 1, 0, 34, [2], [3, 200]);
			var c = 0;
			var flt = a.collect(function(v, index) { assert.equal(index, c++); return v; });
			assert(flt.equals(_(200, 1, 0, 34, 2, 3, 200)));
			assert(c, 7);
		});
		it('collects null', function() {
			var _ = req();
			var c = 0;
			var flt = _.collect(null, function(v, index) { assert.equal(index, c++); });
			assert(_.equals(flt, []));
			assert.equal(c, 0);
		});
	});
	
	describe('_.map()', function() {
		it('maps lists', function() {
			var _ = req();
			var a = _(200, null, 1, 0, 34, [2], [3, 200]);
			var c = 0;
			var flt = a.collect(function(v, index) { assert.equal(index, c++); return v; });
			assert(flt.length, 7);
			assert(c, 7);
		});
		it('maps null', function() {
			var _ = req();
			var c = 0;
			var flt = _.map(null, function(v, index) { assert.equal(index, c++); });
			assert(_.equals(flt, []));
			assert.equal(c, 0);
		});
	});

	describe('_.reduce()', function() {
		it('reduce lists', function() {
			var _ = req();
			var a = _(5, 6, 7, 8, 9);
			var c = 0;
			var flt = a.reduce(17, function(memo, v, index) { assert.equal(index, c++); assert.equal(a[index], index+5); return v+memo; });
			assert.equal(flt, 52);
		});
		it('reduce objects', function() {
			var _ = req();
			var a = {a:5, b:6, c:7, d:8, e:9};
			var flt = _.reduce(a, 17, function(memo, key, value) { assert.equal(a[key], value); return value+memo; });
			assert.equal(flt, 52);
		});
	});

	describe('_.reduceObj()', function() {
		it('reduce objects', function() {
			var _ = req();
			var a = {a:1, b:2, c:3, d:4};
			var flt = _.reduceObj(a, 2, function(memo, key, value) { assert.equal(a[key], value); return value*memo; });
			assert.equal(flt, 48);
		});
	});

	
	describe('_.sub()', function() {
		it('slices lists', function() {
			var _ = req();
			var a = _(200, null, 1, 0, 34, 2, 3, 200), b= _();
			
			assert(_.equals(_.sub(a, 0, 0), []));
			assert(_.equals(a.sub(500, 500), []));
			assert(_.equals(_.sub(a, -1, 5), []));
			assert(_.equals(a.sub(-1, 2), []));
			assert(_.equals(_.sub(a, 2, 1), []));
			
			assert(_.equals(_.sub(a, 0, 2), [200, null]));
			assert(_.equals(a.sub(2, -3), [1, 0, 34]));
			assert(_.equals(a.sub(-1, 20), [200]));
			assert(_.equals(_.sub(a, -1), [200]));
			assert(_.equals(a.sub(4), [34, 2, 3, 200]));
			
			assert(_.equals(_.sub(b, -1, 2), []));
			assert(_.equals(b.sub(0, 2), []));
			assert(_.equals(_.sub(b, 1, 0), []));
		});
		it('slices null', function() {
			var _ = req();
			assert(_.equals(_.sub(null, -1, 2), []));
		});
	});
	
	describe('_.toObject()', function() {
		it('single value', function() {
			var _ = req();
			var a = _(), b= _("a", '3', "c");
			
			assert(_.equals(_.toObject(a, 5), {}));
			assert(_.equals(_.toObject(b, 5), {a: 5, '3': 5, c: 5}));
			assert(_.equals(a.toObject(true), {}));
			assert(_.equals(b.toObject(true), {a: true, '3': true, c: true}));
		});
		it('multi value', function() {
			var _ = req();
			var a = _(), b= _("a", '3', "c"), c=[4, 9], undef={};
			
			assert(_.equals(_.toObject(a, b), {}));
			assert(_.equals(_.toObject(b, c), {a: 4, '3': 9, c: undef.undef}));
			assert(_.equals(a.toObject(b), {}));
			assert(_.equals(b.toObject(c), {a: 4, '3': 9, c: undef.undef}));
		});
	});
	
	describe('_.find()', function() {
		it('single value', function() {
			var _ = req();
			var a = _(), b= _("a", 3, "c");
			
			assert.equal(_.find(a, 'a'), null);
			assert.equal(_.find(b, 'a'), 0);
			assert.equal(a.find(3), null);
			assert.equal(b.find(3), 1);
			assert.equal(a.find('c'), null);
			assert.equal(b.find('c'), 2);
		});
		it('function', function() {
			var _ = req();
			var a = _(), b= _("a", 3, "c");
			
			assert.equal(_.find(a, function(value) { return value == 'a'? 1 : null; }), null);
			assert.equal(_.find(b, function(value) { return value == 'a'? 1 : null; }), 1);
			assert.equal(a.find(function(value) { return value == 3? 17 : null; }), null);
			assert.equal(b.find(function(value) { return value == 3? 17 : null; }), 17);
			assert.equal(a.find(function(value) { return value == 'c'? '3' : null; }), null);
			assert.equal(b.find(function(value) { return value == 'c'? '3' : null; }), '3');
		});
	});
	
	describe('_.contains()', function() {
		it('finds value', function() {
			var _ = req();
			var a = _(), b= _("a", 3, "c");
			
			assert(!_.contains(a, 'a'));
			assert(_.contains(b, 'a'));
			assert(!_.contains(a, 3));
			assert(_.contains(b, 3));
			assert(!_.contains(a, 'a'));
			assert(!_.contains(b, 'x'));
			assert(b.contains(3));
			assert(!a.contains('a'));
			assert(!b.contains('x'));
		});
	});
	
	describe('_.array()', function() {
		it('converts to array', function() {
			var _ = req();
			var a = _(), b= _("a", 3, "c");
			var a2 = a.array(), b2 = b.array();
			
			assert(!a2._);
			assert(!b2._);
			assert(_.equals(a, a2));
			assert(_.equals(b, b2));
		});
	});
	
	describe('_.join()', function() {
		it('joins', function() {
			var _ = req();
			var b = _("a", 3, "c");
			
			assert.equal(b.join(), 'a,3,c');
			assert.equal(b.join('x'), 'ax3xc');
		});
	});
	
	describe('_.sort()', function() {
		it('sorts', function() {
			var _ = req();
			var b = _(3, 111, -1);
			var b2 = b.sort();
			var b3 = b.sort(function(a, b) { return a - b;});

			assert(_.equals(b, [3, 111, -1]));  // check sort not in-place
			assert(_.equals(b2, [-1, 111, 3]));
			assert(_.equals(b3, [-1, 3, 111]));
		});
	});
	
	describe('_.uniq()', function() {
		it('removes non-uniqs', function() {
			var _ = req();
			var b = _(3, 111, 111, -1, 5, 7, 2, 5, 3);
			var b2 = b.uniq();
			assert(_.equals(b2, [3, 111, -1, 5, 7, 2]));
		});
	});
	
	describe('_.intersection()', function() {
		it('finds intersection', function() {
			var _ = req();
			var a = _(3, 111, 111, -1, 5, 7, 2, 5, 3, 9);
			var b = [111, 1, 111, 12, 3, 9];
			assert(_.equals(a.intersection(b), [3, 111, 9]));
		});
		it('finds no intersection', function() {
			var _ = req();
			var a = _(1, 2, 3);
			var b = _(45, 6);
			assert(_.equals(a.intersection(b), []));
		});
	});
	
	describe('_.onlyLeft()', function() {
		it('finds only left', function() {
			var _ = req();
			var a = _(3, 111, 111, -1, 5, 7, 2, 5, 3, 9);
			var b = [111, 1, 111, 12, 3, 9];
			assert(_.equals(a.onlyLeft(b), [-1, 5, 7, 2, 5]));
		});
		it('finds no intersection', function() {
			var _ = req();
			var a = _(1, 2, 3);
			var b = _(0, 1, 2, 3, 4);
			assert(_.equals(a.onlyLeft(b), []));
		});
	});
	
	describe('_.tap()', function() {
		it('finds only left', function() {
			var _ = req();
			var a = _(3, 111, 111, -1, 5, 7, 2, 5, 3, 9);
			var c = 0;
			function f(v) { assert(a === v); c++; }
			
			a.tap(f).tap(f).tap(f);
			assert.equal(c, 3);
		});
	});
}

testCommon.run(runTests);



