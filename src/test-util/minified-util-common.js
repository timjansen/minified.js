// test helpers for minified-util-src.js


var vm = require("vm");
var fs = require("fs");

exports.AMD_NAME = 'minified';

exports.files = ['minified-util-full-src.js'];
exports.dirs = ['../', 'src/'];

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
			testRunner(function() { 
				for (var j = 0; j < exports.dirs.length; j++)
					if (fs.existsSync(exports.dirs[j] + exports.files[idx]))
						return loadInContextSrc(exports.dirs[j] + exports.files[idx]); 
				throw "No source file found with name " + exports.files[idx];
			});
		});
	}
};


