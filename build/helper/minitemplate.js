/**
 * Minified-based HTML Template-based processor.
 */

var fs = require('fs');
var hanson = require('hanson');
var _ = require('minified-headless');

var templateFuncs = {}; // path -> template func

function loadTemplate(path) {
	if (templateFuncs[path])
		return;
	
	templateFuncs[path] = _.template(_.toString(fs.readFileSync(path)), _.escapeHtml);
}

function runTemplate(templatePath, obj) {
	loadTemplate(templatePath);
	return templateFuncs[templatePath](obj); 
};

exports.process = runTemplate;
exports.processFile = function(templatePath, path) {
	return runTemplate(hanson.parse(_.toString(fs.readFileSync(path))));
};



