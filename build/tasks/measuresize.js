/**
 * JavaScript file for Node.js that generates Javadoc-like documentation.
 */

// Helper

var _ = require('minified-headless');
var parser = require('../../srcContent/js/parser-src.js');
var docBuilder = require('../helper/docbuilder.js');
var zlib = require('zlib');
var fs = require('fs');

module.exports = function(grunt) {
	grunt.registerMultiTask('measuresize', 'Measures size of files (gzipped and not)', function() {
		var done = this.async();
		var options = this.options({
			destFile: null
		});

		var resultsToDo = this.filesSrc.length;
		var results = {};
		
		this.filesSrc.forEach(function(f) {
			if (!grunt.file.exists(f)) {
				grunt.log.error('Input file "' + srcPath + '" not found.');
				return;
			}
			var gzip = zlib.createDeflate({level: 9});
			var src = fs.createReadStream(f);
			var gzipStream = src.pipe(gzip);
			var size = 0;
			gzipStream.on('data', function(data) {
		        size += data.length;
		    });
		    
			gzipStream.on('end', function() {
		    	results[f] = size;
		        if (!--resultsToDo) {
		        	grunt.log.writeln('GZip Results:');
		        	_.keys(results).sort().each(function(file) {
			        	grunt.log.writeln(_.format('  {{file}}: {{size}} bytes', {file:file, size:results[file]}));
		        	});
		        	if (options.destFile)
		        		grunt.file.write(options.destFile, JSON.stringify(results));
		        	done();
		        }
		    });			
		});
		
	});
};


