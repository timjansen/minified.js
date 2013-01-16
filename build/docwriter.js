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

var sections = parseSourceSections(src).filter(function(a) {return (a.name && a.desc && a.doc != 'no');});
hh.each(sections, function(sec) {
	createDocs(sec);
	createPreview(sec);
	if (sec.htmldoc)
		print(sec.htmldoc);
});


// Generate ref overview
writeFile('srcContent/reference/index.xml', createOverviewPage(sections));
