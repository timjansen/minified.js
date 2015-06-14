// tests for minified-extras-src.js
//
// Instructions:
// - requires node.js installation
// - install mocha (npm mocha -g)
// - run (mocha promise-stop-test.js)
//

var testCommon = require("../test-util/minified-util-common.js");
var assert = require("assert");
var fs = require("fs");
var vm = require('vm');

var AMD_NAME = testCommon.AMD_NAME;
var loadInContextSrc = testCommon.loadInContextSrc;

var defs = {};
var ctx = {
	define: function(name, obj) { defs[name] = obj(); },
	require: function(name) { return defs[name]; },
	document: { addEventListener: function() {} },
	window: {},
	setTimeout: function(f, d) { setTimeout(f, d); },
	console: console,
	TypeError: TypeError
};

var src = fs.readFileSync("dist/minified-src.js");
vm.runInNewContext(src, ctx, "minified-src.js");
	
var MINI = ctx.require(AMD_NAME), _ = MINI._;


function runTests(loadInContext) {

	describe('stop()', function() {
		it('ignores missing stop0', function() {
			var p = _.promise();
			p.stop();
		});

		it('calls stop0', function(stop0) {
			var p = _.promise();
			p.stop0 = stop0;
			p.stop();
		});
		
		it('then() forwards stops', function(stop0) {
			var p = _.promise();
			p.stop0 = stop0;
			var p2 = p.then(function() {});
			p2.stop();
		});

		it('then() picks up last stop', function(stop0) {
			var p = _.promise();
			p.stop0 = function() {};
			var p2 = p.then(function() {});
			p.stop0 = stop0;
			p2.stop();
		});

		it('then() forwards stop to returned promise', function(stop0) {
			var p = _.promise();
			p.stop0 = function() { console.log('boo1');};
			var p2 = p.then(function() { var pn = _.promise(); pn.stop0 = stop0; return pn; });
			p.stop0 = function() { console.log('boo2');};
			p.fire(true);
			setTimeout(p2.stop, 50); // must be delayed, as the then() handler is called via defer()
		});

		it('then() forwards stop to returned promise; even if it changes stop0 later.', function(stop0) {
			var pn;
			var p = _.promise();
			p.stop0 = function() { console.log('boo1');};
			var p2 = p.then(function() { pn = _.promise(); return pn; });
			p.stop0 = function() { console.log('boo2');};
			p.fire(true);
			setTimeout(function() {
				pn.stop0 = stop0; 
				p2.stop(); 
			}, 50); // must be delayed, as the then() handler is called via defer()
			
		});

		
	});
}

if (_.promise)
	testCommon.run(runTests);



