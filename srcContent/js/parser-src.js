//
// Parser for the /*$ @tag */ syntax and //@cond statements in the Minified source code, which is used for
// API documentation and also for custom-builds.
//
// Used by builder-src.js, docbuilder.js and rebuilder.js.
//
//

var isCommonJs = typeof module != 'undefined' && !!module.exports;
var _ = isCommonJs ? require('minified-headless') : (require('minifiedUtil') || require('minified'))._;


// parses the source, returns an array of objects describing sections that can be enabled/disabled
function parseSourceSections(src) {
	var lines = src.split('\n');
	var nextAnonId = 100;
	var sections = [];
	function createSection() {
		return { id: 'anon' + (nextAnonId++),
			src: [], // source as lines
			desc: '',
			requires: {}, // contains ids->1
			requiredBy: {}, // contains ids->1
			syntax: [],
			example: [],
			see: [],
			params: [] // contains {name, desc} each; @return has '@return' as name
		};
	}
	var currentSection = createSection();
	var inComment = false;
	_.each(lines, function(line) {
		if (inComment && /^.*\*\/\s*$/.test(line)) // end of comment ("*/")
			inComment = false;
		else if (inComment) {
			var l = line.replace(/^\s*(\*\s?)?/, '').replace(/\s*$/, ''); // line without leading space, asterisk and trailing space
			var tagmatch = l.match(/^\s*@([a-z]+)/);
			if (tagmatch) { // comment tag found
				var tag = tagmatch[1];
				var content = _.trim(l.replace(/^\s*@[a-z]+\s*/, '')); // remove tag from line
				if (tag == 'syntax' || tag == 'example' || tag == 'see')
					currentSection[tag].push(content);
				else if (tag == 'requires') {
					if (content.length)
						_.each(content.split(/\s+/), function(c) {
							currentSection.requires[c] = 1; 
						});
				}
				else if (tag == 'param')
					currentSection.params.push({name: content.replace(/\s.*$/, ''),  // param name is the first word
						                       desc: content.replace(/^\S+\s+/, '')}); // for the description, remove the first word and following space
				else if (tag == 'return')
					currentSection.params.push({name: '@return', desc: content});
				else if (tag == 'function')
					currentSection.params[currentSection.params.length-1].funcs.push(content);
				else
					currentSection[tag] = (content != '') ? content : 1;
			}
			else if (currentSection.params.length) // parameters reached?
				currentSection.params[currentSection.params.length-1].desc += '\n' + _.trim(l); // append to last parameter
			else if (currentSection.example.length) // in examples?
				currentSection.example[currentSection.example.length-1] += '\n' + l; // append to last example
			else // still in main description
				currentSection.desc += l + '\n';
		}
		else if (/^\s*\/\*\$/.test(line) && !/\*\/\s*$/.test(line)){ // start of multi-line comment ("/*$" at start of line)
			inComment = true;
			sections.push(currentSection);
			currentSection = createSection();
		}
		currentSection.src.push(line);
	});
	sections.push(currentSection);
	return sections;
}

// creates a map of all sections by id
function createSectionMap(sections) {
	var m = {};
	_.each(sections, function(section) {
		m[section.id] = section;
	});
	return m;
}

// completes dependencies in the sections by adding dependencies of dependencies in the sections
function completeRequirements(sections, sectionMap) {
	var addedReqs = 0;
	_.each(sections, function(s) {
		_.eachObj(s.requires, function(reqId) {
			var s2 = sectionMap[reqId];
			if (!s2)
				throw Error("Unknown id in requirement: \"" + reqId + "\"");
			_.eachObj(s2.requires, function(reqId2) {
				if (!s.requires[reqId2]) {
					addedReqs++;
					s.requires[reqId2] = 1;
				}
			});
		});
	});
	if (addedReqs > 0)
		completeRequirements(sections, sectionMap); // repeat until all requirements complete
	else // completed: now start reverse search
		_.each(sections, function(s) {
			_.eachObj(s.requires, function(t) { 
				sectionMap[t].requiredBy[s.id] = 1;
			});
		});
}

// creates a map (id->1) of all enabled sections plus their dependencies
function calculateDependencies(sectionMap, enabledSections) {
	var r = {};
	_.eachObj(enabledSections, function(s) {
		if (enabledSections[s]) {
			r[s] = 1;
			_.eachObj(sectionMap[s].requires, function(req) {
				r[req] = 1;
			});
		}
	});
	return r;
}

//creates a map of all configurable sections by id
function createDefaultConfigurationMap(sections, includeDisabled) {
	var m = {};
	_.each(sections, function(section) {
		if (section.configurable && (section.configurable == 'default' || includeDisabled))
			m[section.id] = 1;
	});
	return m;
}


// compiles the list of sections into a single string, given the map of enabled sections. Dependencies
// will be automatically calculated.
// Returns new source code.
function compile(sections, sectionMap, enabledSections) {
	var src = '';
	var enabledSectionsWithDeps = calculateDependencies(sectionMap, enabledSections);
	var condBlock = [];
	var lastLineEmpty = true; // =true: don't allow empty lines at the beginning
	_.filter(sections, function(s) {
		return enabledSectionsWithDeps[s.id] || !(s.configurable || s.dependency); 
	}).each(function(s){
		_.each(s.src, function(line) {
			if (/^\s*$/.test(line)) { // empty line?
				if (!lastLineEmpty)
					src += '\n';
				lastLineEmpty = true;
			}
			else {
				var m = line.match(/^(\s*)\/\/\s*@(cond|condblock)\s+(\!?)(\w*)\s*(.*)$/);
				if (m && m[2] == 'cond' && (!!enabledSectionsWithDeps[m[4]] != (m[3] == '!')))
					src += m[1] + m[5] + '\n';
				else { 
					var condEnds = false, incLine = true;
					if (m && m[2] == 'condblock')
						condBlock.push((!!enabledSectionsWithDeps[m[4]]) != (m[3] == '!'));
					else if (/^\s*\/\/\s*@condend\b/.test(line))
						condEnds = true;
					for (var i = 0; i < condBlock.length; i++) 
						if (!condBlock[i]) {
							incLine = false;
							break;
						}

					if (incLine)
						src += line + '\n';
					
					if (condEnds)
						condBlock.pop();
				}
				lastLineEmpty = false;
			}
		});
	});
	return src;
}


// takes the source code src and parses it. 
// Returns an object {sections: <list of sections>, sectionMap: <map id->section>, enabledSections: <default configuration map id->1>}
function prepareSections(src) {
	var sections = parseSourceSections(src);
	var sectionMap = createSectionMap(sections);
	completeRequirements(sections, sectionMap);
	var enabledSections = createDefaultConfigurationMap(sections);

	return {sections: sections, sectionMap: sectionMap, enabledSections: enabledSections};
}

// -- config serialization / deserialization --------------

var CONFIG_START = 'minified.js config start --';
var CONFIG_COMMENT = '// - ';
var CONFIG_ALL = 'All sections.';
var CONFIG_ALL_EXCEPT = 'All sections except ';
var CONFIG_ONLY = 'Only sections ';

//Serializes the configuration into a string
function serializeEnabledSections(sections, enabledSections) {
	var configurableSections = _.filter(sections, function(s) { return s.configurable; });
	var enabledSectionList = _.filter(_.keys(enabledSections), function(s) { return enabledSections[s];});

	var head, listedIds = [];
	if (enabledSectionList.length == configurableSections.length) {
		head = CONFIG_COMMENT + CONFIG_ALL;
		listedIds = [];
	}
	else if (enabledSectionList.length/3 > configurableSections.length/2) {
		head = CONFIG_COMMENT + CONFIG_ALL_EXCEPT;
		listedIds = _.filter(configurableSections, function(s) { return !enabledSections[s.id]; }).collect(function(s) { return s.id; });
	}
	else {
		head = CONFIG_COMMENT + CONFIG_ONLY;
		listedIds = enabledSectionList;
	}
	
	var txt = "// " + CONFIG_START + " use this comment to re-create configuration in the Builder\n" + head;
	var charsToBreak = 50;
	_(listedIds).sort().each(function(id) {
		if (charsToBreak < id.length) {
			charsToBreak = 70;
			txt += '\n// - ' + id + ', ';
		}
		else {
			txt += id + ', ';
			charsToBreak -= id.length + 2;
		}
	});
	txt = txt.replace(/,\s*$/, '.\n'); // remove last comma with period
	return txt + "\n\n";
}

//adds possibly missing sections to configuration
function fixConfig(sectionMap, conf) {
	_.eachObj(conf, function(sectionName) {
		if (sectionMap[sectionName])
			_.copyObj(sectionMap[sectionName].requires, conf);
		else
			delete conf[sectionName];
	});
	return conf;
}

// finds a serialized configuration in the given source, returns a map id->1 of all enabled sections.
// The resulting config is ready to use, with all dependencies resolved. Null if no config found.
function deserializeEnabledSections(sections, sectionMap, src) {
	function makeRegexp(s) {
		return new RegExp('^'+s.replace(/ /g, '\\s+'));
	}
	var startRegexp = makeRegexp(CONFIG_START + '.*');
	var allRegexp = makeRegexp(CONFIG_ALL.replace(/\./, '\\.'));
	var allExceptRegexp = makeRegexp(CONFIG_ALL_EXCEPT + '\\s*');
	var onlyRegexp = makeRegexp(CONFIG_ONLY  + '\\s*');
	var configCmtRegexp = makeRegexp(CONFIG_COMMENT);
	
	var lines = src.split('\n');
	for (var i = 0; i < lines.length; i++) { 
		var line = lines[i];
		if (/^\s*\/\/s*/.test(line)) {
			var cmt = line.replace(/^\s*\/\/\s*/, '');
			if (startRegexp.test(cmt) && i+1 < lines.length) {
				var s = '';
				for (var j = i+1; j < lines.length; j++)
					if (configCmtRegexp.test(lines[j])) {
						s += lines[j].replace(configCmtRegexp, '');
						if (/\s*\.\s*$/.test(lines[j]))
							break;
					}
					else
						break;
				
				if (allRegexp.test(s))
					return createDefaultConfigurationMap(sections, true);
				s = s.replace(/\s*\.\s*$/,'');
				if (allExceptRegexp.test(s)) {
					var r = createDefaultConfigurationMap(sections, true);
					_.each(s.replace(allExceptRegexp, '').split(/\s*,\s*/), function(sectionName) {
						delete r[sectionName];
					});
					return fixConfig(sectionMap, r);
				}
				if (onlyRegexp.test(s)) {
					var r = {};
					_.each(s.replace(onlyRegexp, '').split(/\s*,\s*/), function(sectionName) {
						if (sectionMap[sectionName])
							r[sectionName] = 1;
					});
					return fixConfig(sectionMap, r);
				}
			}
		}
		
	}
	
	return null;
}

if (isCommonJs) {
	module.exports = { 
			parseSourceSections: parseSourceSections,
			prepareSections: prepareSections,
			deserializeEnabledSections: deserializeEnabledSections,
			compile: compile
	};
}

