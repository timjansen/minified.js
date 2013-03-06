// tests for minified-util-src.js
//
// Instructions:
// - requires node.js installation
// - install mocha (npm mocha -g)
// - run (mocha minified-util-test.js)
//

var vm = require("vm");
var fs = require("fs");
var assert = require("assert");

var AMD_NAME = 'minifiedUtil';


function loadInContextSrc(src) {
	var ctx = {};
	var code = fs.readFileSync(src);
	vm.runInNewContext(code, ctx);
	return ctx;
}


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

}

describe('minified-util-src.js', function() {
	runTests(function() { return loadInContextSrc('../minified-util-src.js'); });
});



