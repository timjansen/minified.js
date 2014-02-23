/**
 * Minified-based HTML Template-based processor.
 */

var fs = require('fs');
var hanson = require('hanson');
var _ = require('minified-headless');

var templateFuncs = {}; // path -> template func

// special formatter. Value types will be just put out, but it supports also nested templates as value in this format:
// { template: 'sub-template',
//   inputPath: 'path to json as Hanson input - can also be a list of paths to merge' } 
function formatter(input) {
	if (_.isValue(input) || !input || !input.template)
		return input;

	var obj = {};
	_(input.inputPath).each(function(path) { _.copyObj(hanson.parse(_.toString(fs.readFileSync(path))), obj); });
	return _.format(input.template, obj);
}

function loadTemplate(path) {
	if (templateFuncs[path])
		return;
	
	templateFuncs[path] = _.template(_.toString(fs.readFileSync(path)), _.escapeHtml);
}

function runTemplate(templatePath, obj) {
	loadTemplate(templatePath);
	return templateFuncs[templatePath](_.copyObj(obj, {__formatter: formatter})); 
};

exports.process = runTemplate;
exports.processFile = function(templatePath, path) {
	return runTemplate(hanson.parse(_.toString(fs.readFileSync(path))));
};



