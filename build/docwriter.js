/**
 * JavaScript file for Rhino that generates Javadoc-like documentation from minified-src.js.
 */

// Helper

// read file from path into string
function readFile(file) {
	return ''+new String(org.apache.tools.ant.util.FileUtils.readFully(new java.io.FileReader(file)));
}

// write string into file
function writeFile(file, content) {
	var writer = new java.io.FileWriter(file);
	writer.write(content);
	writer.close();
}

// GO!

eval(readFile('srcContent/js/minified-util-src.js'));
eval(readFile('srcContent/js/parser-src.js'));
eval(readFile('build/docbuilder.js'));

var _ = require('minifiedUtil')._;

var src = readFile(project.getProperty('src'));

var docSections = parseSourceSections(src).filter(function(a) {return (a.name && a.desc && a.doc != 'no');});
documentSections(docSections);

// Generate ref overview
writeFile('srcContent/reference/index.xml', createOverviewPage(docSections));

var tocHtml = createToc(docSections);

// Generate single doc pages
_.each(docSections, function(sec) {
	writeFile('srcContent/reference/'+sec.id+'.xml', createReferencePage(sec, tocHtml));
});
