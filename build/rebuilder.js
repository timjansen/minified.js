// Rebuilds new versions of minified.


// Returns a new source code, given the original and the configuration in serialized form.
function rebuild(src, configSrc) {
	var sectionData = prepareSections(src); // .sections is section list, .sectionMap is name->section, enabledSections is name->1
	var enabledSections = deserializeEnabledSections(sectionData.sections, configSrc);
	return compile(sectionData.sections, sectionData.sectionMap, enabledSections);
}
