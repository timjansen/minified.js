// Tests Minified's promises implementation with the Promises / A+ Test Suite (https://github.com/promises-aplus/promises-tests)
// Requires node.js installation.

var promisesAplusTests = require("promises-aplus-tests");
var vm = require('vm');
var fs = require("fs");


function getAdapter(pinkySwear) {
	return adapter = {
			resolved: function(value) { var p = pinkySwear(); p.fire(true, [value]); return p; },
			rejected: function(reason) { var p = pinkySwear(); p.fire(false, [reason]); return p;},
			deferred: function() { 
				var p = pinkySwear();
				return {
					promise: p, 
					resolve: function(value) {
						p.fire(true, [value]);
					},
					reject: function(reason) {
						p.fire(false, [reason]);
					}
				};
			}
		
	};
}

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
	
var MINI = ctx.require('minified'), _ = MINI._;

promisesAplusTests.mocha(getAdapter(_.promise), function (err) {
});

