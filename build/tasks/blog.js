/**
 * JavaScript file for Grunt that proceses the blog templates.
 */

var _ = require('minified-headless');
var blog = require('../helper/blog-engine.js');
var fs = require('fs');

function createPath() {
	return _(arguments).join('/').replace(/\/\/+/g, '/');
}


module.exports = function(grunt) {
	grunt.registerMultiTask('blog', 'Processes blog templates', function() {
		var options = this.options({
			htmlTemplate: null,
			destDir: null,
			extraOptions : {}
		});
		
		if (!options.htmlTemplate || !grunt.file.exists(options.htmlTemplate)) {
			grunt.log.error('Required option "htmlTemplate" missing or file not found:'+options.htmlTemplate);
			return;
		}

		if (!options.destDir) {
			grunt.log.error('Required option "destDir" missing');
			return;
		}
		
		if (!options.tmpDir) {
			grunt.log.error('Required option "tmpDir" missing');
			return;
		}

		if (!this.filesSrc.length) {
			grunt.log.error('No src files given.');
			return;
		}

		grunt.file.mkdir(options.destDir);
		
		var timestampFile = createPath(options.destDir + '/timestamp.txt');
		var destTime =  grunt.file.exists(timestampFile) ? fs.statSync(timestampFile).mtime.getTime() : 0; 
		var srcTime = 1;

		this.filesSrc.forEach(function(src) {
			srcTime = Math.max(srcTime, fs.statSync(src).mtime.getTime());
		});
		
		if (srcTime <= destTime) {
			grunt.log.write('blog unmodified / skip.');
			return;
		}
			
		blog.process(this.filesSrc, options.htmlTemplate, 
				function(name, data) { grunt.file.write(createPath(options.destDir, name), data); },
				function(name, data) { grunt.file.write(createPath(options.tmpDir, name), data); },
		options.extraOptions);
		
		grunt.file.write(timestampFile, "" + new Date() + "\n");
	});
};

