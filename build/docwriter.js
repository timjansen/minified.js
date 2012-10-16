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

eval(readFile('WebContent/libs/valentine.min.js'));
eval(readFile('WebContent/parser-src.js'));
eval(readFile('build/docbuilder.js'));

var src = readFile(project.getProperty('src'));

var sections = parseSourceSections(src);
v.each(sections, function(sec) {
	createDocs(sec);
	if (sec.doc)
		print(sec.doc);
});

