/**
 * JavaScript file for Rhino that generates new compiled version from minified-src.js.
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
eval(readFile('build/rebuilder.js'));

var src = readFile(project.getProperty('src'));

var noIeConfig = "// minified.js config start -- use this comment to re-create your build configuration\n"+
				 "// - All sections except debug, ie6compatibility, ie7compatibility, ie8compatibility.\n";

var noIeSrc = rebuild(src, noIeConfig);

// Generate new source
writeFile('WebContent/minified-web-src.noie.js', noIeSrc);
