// test helpers for minified-util-src.js


var vm = require("vm");
var fs = require("fs");

exports.AMD_NAME = 'minifiedUtil';

exports.files = ['minified-util-src.js'];

function loadInContextSrc(src) {
	var ctx = {console:console};
	var code = fs.readFileSync(src);
	vm.runInNewContext(code, ctx);
	return ctx;
};

exports.run = function(testRunner) {
	for (var i = 0; i < exports.files.length; i++) {
		var idx = i;
		describe(exports.files[idx], function() {
			testRunner(function() { return loadInContextSrc('../'+exports.files[idx]); });
		});
	}
};


