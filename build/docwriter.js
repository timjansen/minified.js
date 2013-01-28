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

eval(readFile('WebContent/libs/helper.js'));
eval(readFile('WebContent/parser-src.js'));
eval(readFile('build/docbuilder.js'));

var src = readFile(project.getProperty('src'));

var docSections = parseSourceSections(src).filter(function(a) {return (a.name && a.desc && a.doc != 'no');});
documentSections(docSections);

// Generate ref overview
writeFile('srcContent/reference/index.xml', createOverviewPage(docSections));

var tocHtml = createToc(docSections);

// Generate single doc pages
hhEach(docSections, function(sec) {
	writeFile('srcContent/reference/'+sec.id+'.xml', createReferencePage(sec, tocHtml));
});
