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
hhEach(docSections, function(sec) {
	createDocs(sec);
	createPreview(sec);
	if (sec.params && sec.id=='el') {
		print("sec=" + sec.id + " params=" + sec.params.length);
		hhEach(sec.params, function (param){
			print("  name=" + param.name + " desc=" + param.desc.replace('\n', '\n  '));
			//print(sec.htmldoc);
		});
	}
});


// Generate ref overview
writeFile('srcContent/reference/index.xml', createOverviewPage(docSections));

// Generate single doc pages
hhEach(docSections, function(sec) {
	writeFile('srcContent/reference/'+sec.id+'.xml', createReferencePage(sec));
});