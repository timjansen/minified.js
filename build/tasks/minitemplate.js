/**
 * Minified-based HTML Template-based Grunt task.
 */

var fs = require('fs');
var mtpl = require('../helper/minitemplate.js');
var hanson = require('hanson');
var _ = require('minified-headless');

function getOutputFileName(file) {
	return file.replace(/\.[^.]$/, '') + '.html';
}


module.exports = function(grunt) {
	grunt.registerMultiTask('minitemplate', 'Processes HTML templates', function() {
		
		var options = this.options({
			template : null
		});
	
		if (!options.template)  {
			grunt.log.error('Required option "template" missing.');
			return;
		}
		
		if (!grunt.file.exists(options.template)) {
			grunt.log.error('Template file "' + options.template + '" not found.');
			return;
		}
		var templateMtime = fs.statSync(options.template).mtime.getTime();
		var fatal = false;
		this.files.forEach(function(f) {
			if (fatal)
				return;
			
			var srcs = f.src;
			var dest = f.dest ? f.dest : src.length && getOutputFileName(src[0]);
			var src = {};
			var srcMtime = 0;

			if (!srcs.length) {
				grunt.log.error('No input files given.');
				return;
			}

			_.each(srcs, function(path) {
				if (fatal)
					return;
				if (!grunt.file.exists(path)) {
					grunt.log.error('Input file "' + path + '" not found.');
					fatal = true;
				}
				else {
					var pSrc;
					try {
						pSrc = hanson.parse(grunt.file.read(path));
					}
					catch (e) {
						fatal = true;
						grunt.log.error("Failed to parse " + path + ": " + e);
						return;
					}
					_.copyObj(pSrc, src);
					var mtime = fs.statSync(path).mtime.getTime();
					if (mtime > srcMtime)
						srcMtime = mtime;
				}
			});
			if (fatal)
				return;
			
			
			var destMtime = grunt.file.exists(dest) ? fs.statSync(dest).mtime.getTime() : 0;
			if (destMtime < srcMtime || destMtime < templateMtime) {
				grunt.file.write(dest, mtpl.process(options.template, src));
				grunt.log.writeln('JSON file "' + dest + '" written.');
			}
		});
	});
};




