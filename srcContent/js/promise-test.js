// Tests helper.js with the Promises / A+ Test Suite (https://github.com/promises-aplus/promises-tests)

var promisesAplusTests = require("promises-aplus-tests");

var fs = require('fs');
var vm = require('vm');
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
includeInThisContext(__dirname+"/helper.js");

var adapter = {
		fulfilled: function(value) { var p = hhPromise(); p.set(true, [value]); return p; },
		rejected: function(reason) { var p = hhPromise(); p.set(false, [reason]); return p;},
		pending: function() { 
			var p = hhPromise();
			return {
				promise: p, 
				fulfill: function(value) {
					p.set(true, [value]);
				},
				reject: function(reason) {
					p.set(false, [reason]);
				}
			};
		}
	
};

promisesAplusTests(adapter, function (err) {
    console.log("Error: ", err);
});