/**
 * JavaScript file for Grunt that generates new compiled version from minified-*-src.js.
 */

var _ = require('minified-headless');
var rebuild = require('../helper/rebuilder.js');
var fs = require('fs');


module.exports = function(grunt) {
	grunt.registerMultiTask('rebuildsrc', 'Creates new builds of Minified', function() {
		var options = this.options({
			config : null,
			extraOptions : []
		});
		
		if (!options.config)  {
			grunt.log.error('Required option "config" missing.');
			return;
		}
		
		this.files.forEach(function(f) {
			var srcPath = f.src[0];
			var destPath = f.dest;

			if (!srcPath) {
				grunt.log.error('No input file given.');
				return;
			}

			if (!grunt.file.exists(srcPath)) {
				grunt.log.error('Input file "' + srcPath + '" not found.');
				return;
			}

			var destTime = grunt.file.exists(destPath) ? fs.statSync(destPath).mtime.getTime() : 0; 
			if (fs.statSync(srcPath).mtime.getTime() <= destTime)
				return;
			
			grunt.file.write(destPath, rebuild(grunt.file.read(srcPath), options.config, options.extraOptions));
		});
	});
};

