/**
 * Task for Grunt that generates Javadoc-like documentation.
 */

// Helper

var _ = require('minified-headless');
var parser = require('../../srcContent/js/parser-src.js');
var docBuilder = require('../helper/docbuilder.js');
var fs = require('fs');

module.exports = function(grunt) {
	grunt.registerMultiTask('writedocs', 'Generates documentation', function() {
		var options = this.options({
			destDir : null
		});
		
		if (!options.destDir)  {
			grunt.log.error('Required option "destDir" missing.');
			return;
		}
		var destDir = _.endsWith(options.destDir, '/') ? options.destDir : (options.destDir+'/');
				
		this.filesSrc.forEach(function(f) {
			var src = grunt.file.read(f);
			var srcTime = fs.statSync(f).mtime.getTime();
			
			function writeFile(file, creatorFunc) {
				var destTime = grunt.file.exists(file) ? fs.statSync(file).mtime.getTime() : 0;
				if (destTime < srcTime)
					grunt.file.write(file, creatorFunc());
			}
			
			var docSections = parser.parseSourceSections(src).filter(function(a) {return (a.name && a.desc && a.doc != 'no');});
			docBuilder.documentSections(docSections);
			
			writeFile(destDir+'index.hson', function() { return docBuilder.createOverviewPage(docSections);});
			var tocHtml = docBuilder.createToc(docSections);

			// Generate single doc pages
			_.each(docSections, function(sec) {
				writeFile(destDir+sec.id+'.hson', function() { return docBuilder.createReferencePage(sec, tocHtml);});
			});
		});
	});
};


