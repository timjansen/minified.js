// Rebuilds new versions of minified.

var _ = require('minified-headless');
var parser = require('../../srcContent/js/parser-src.js');

//Returns a new source code, given the original and the configuration in serialized form.
module.exports = function(src, configSrc, extraSections) {
	var sectionData = parser.prepareSections(src); // .sections is section list, .sectionMap is name->section, enabledSections is name->1
	var enabledSections = parser.deserializeEnabledSections(sectionData.sections, sectionData.sectionMap, configSrc);
	if (extraSections)
		for (var i = 0; i < extraSections.length; i++)
			enabledSections[extraSections[i]] = 1;
	return parser.compile(sectionData.sections, sectionData.sectionMap, enabledSections);
};
