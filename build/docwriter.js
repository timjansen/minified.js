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

eval(readFile('src/minified-util-src.js'));
eval(readFile('srcContent/js/parser-src.js'));
eval(readFile('build/docbuilder.js'));

var _ = (require('minifiedUtil') || require('minified'))._;

var src = readFile(project.getProperty('srcPath') + project.getProperty('srcWebName'));

var docSections = parseSourceSections(src).filter(function(a) {return (a.name && a.desc && a.doc != 'no');});
documentSections(docSections);

// Generate ref overview
writeFile('srcContent/api/index.xml', createOverviewPage(docSections));

var tocHtml = createToc(docSections);

// Generate single doc pages
_.each(docSections, function(sec) {
	writeFile('srcContent/api/'+sec.id+'.xml', createReferencePage(sec, tocHtml));
});
