
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
			params: [] // contains {name, desc} each; @return has '@return' as name
		};
	}
	var currentSection = createSection();
	var inComment = false;
	hhEach(lines, function(line) {
		if (inComment && /^.*\*\/\s*$/.test(line)) // end of comment ("*/")
			inComment = false;
		else if (inComment) {
			var l = line.replace(/^\s*(\*\s?)?/, '').replace(/\s*$/, ''); // line without leading space, asterisk and trailing space
			var tagmatch = l.match(/^\s*@([a-z]+)/);
			if (tagmatch) { // comment tag found
				var tag = tagmatch[1];
				var content = hhTrim(l.replace(/^\s*@[a-z]+\s*/, '')); // remove tag from line
				if (tag == 'syntax' || tag == 'example')
					currentSection[tag].push(content);
				else if (tag == 'requires') {
					if (content.length)
						hhEach(content.split(/\s+/), function(c) {
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
				currentSection.params[currentSection.params.length-1].desc += '\n' + hhTrim(l); // append to last parameter
			else if (currentSection.example.length) // in examples?
				currentSection.example[currentSection.example.length-1] += '\n' + l; // append to last example
			else // still in main description
				currentSection.desc += l + '\n';
		}
		else if (/^\s*\/\*\*/.test(line) && !/\*\/\s*$/.test(line)){ // start of comment ("/**" at start of line)
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
	hhEach(sections, function(section) {
		m[section.id] = section;
	});
	return m;
}

// completes dependencies in the sections by adding depencies of dependencies in the sections
function completeRequirements(sections, sectionMap) {
	var addedReqs = 0;
	hhEach(sections, function(s) {
		hhEach(s.requires, function(reqId) {
			var s2 = sectionMap[reqId];
			if (!s2)
				throw Error("Unknown id in requirement: \"" + reqId + "\"");
			hhEach(s2.requires, function(reqId2) {
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
		hhEach(sections, function(s) {
			hhEach(s.requires, function(t) { 
				sectionMap[t].requiredBy[s.id] = 1;
			});
		});
}

// creates a map (id->1) of all enabled sections plus their dependencies
function calculateDependencies(sectionMap, enabledSections) {
	var r = {};
	hhEach(enabledSections, function(s) {
		if (enabledSections[s]) {
			r[s] = 1;
			hhEach(sectionMap[s].requires, function(req) {
				r[req] = 1;
			});
		}
	});
	return r;
}

//creates a map of all configurable sections by id
function createDefaultConfigurationMap(sections, includeDisabled) {
	var m = {};
	hhEach(sections, function(section) {
		if (section.configurable && (section.configurable == 'default' || includeDisabled))
			m[section.id] = 1;
	});
	return m;
}


// compiles the list of sections into a single string, given the map of enabled sections
function compile(sections, sectionMap, enabledSections) {
	var src = '';
	var enabledSectionsWithDeps = calculateDependencies(sectionMap, enabledSections);
	var condBlock = [];
	var lastLineEmpty = true; // =true: don't allow empty lines at the beginning
	hhEach(hhFilter(sections, function(s) {
		return enabledSectionsWithDeps[s.id] || !(s.configurable || s.dependency); 
	}), function(s){
		hhEach(s.src, function(line) {
			if (/^\s*$/.test(line)) { // empty line?
				if (!lastLineEmpty)
					src += '\n';
				lastLineEmpty = true;
			}
			else {
				var m = line.match(/^(\s*)\/\/\s*@(cond|condblock)\s+(\!?)(\w*)\s*(.*)$/);
				if (m && m[2] == 'cond' && (!!enabledSectionsWithDeps[m[4]] != (m[3] == '!')))
					src += m[1] + m[5] + '\n';
				else if (m && m[2] == 'condblock')
					condBlock.unshift(!!enabledSectionsWithDeps[m[4]] != (m[3] == '!'));
				else if (condBlock.length && /^\s*\/\/\s*@condend(\s|$)/.test(line))
					condBlock.shift();
				else if (condBlock.length == 0 || condBlock[0])
					src += line + '\n';
				lastLineEmpty = false;
			}
		});
	});
	return src;
}


// submits the given source code (src) to the Closure online compiler. When finished, will invoke given callback cb with JSON result. 
// On error, it passes null to the callback.
function closureCompile(src, cb) {
	function onError(e, e2, e3) {
		if(window.console)console.log('error', e, e2, e3);
		cb&&cb(null);
	}
	var URL = 'http://closure-compiler.appspot.com/compile';
	MINI.request('post', URL, 
			{
				js_code: src,
				output_format: 'json',
				output_info: ['compiled_code', 'statistics'],
				output_file_name: 'minified-custom.js',
				compilation_level: 'ADVANCED_OPTIMIZATIONS'
			}).then(function(txt) {
				cb&&cb(MINI.parseJSON(txt));
		}, onError);
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
var CONFIG_ALL = 'All sections';
var CONFIG_ALL_EXCEPT = 'All sections except ';
var CONFIG_ONLY = 'Only sections ';

//Serializes the configuration into a string
function serializeEnabledSections(sections, enabledSections) {
	var configurableSections = hhFilter(sections, function(s) { return s.configurable; });
	var enabledSectionList = hhFilter(hhKeys(enabledSections), function(s) { return enabledSections[s];});

	var head, listedIds = [];
	if (enabledSectionList.length == configurableSections.length) {
		head = CONFIG_COMMENT + CONFIG_ALL;
		listedIds = [];
	}
	else if (enabledSectionList.length > configurableSections.length/2) {
		head = CONFIG_COMMENT + CONFIG_ALL_EXCEPT;
		listedIds = hhCollect(hhFilter(configurableSections, function(s) { return !enabledSections[s.id]; }), function(s) { return s.id; });
	}
	else {
		head = CONFIG_COMMENT + CONFIG_ONLY;
		listedIds = enabledSectionList;
	}
	
	var txt = "// " + CONFIG_START + " use this comment to re-create your build configuration\n" + head;
	var charsToBreak = 50;
	hhEach(listedIds.sort(), function(id) {
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
	return txt;
}

// finds a serialized configuration in the given source, returns a map id->1 of all enabled sections. Null if no config found.
function deserializeEnabledSections(sections, src) {
	function makeRegExp(s) {
		return new RegExp('^'+s.replace(' ', '\\s+'));
	}
	var startRegexp = makeRegexp(CONFIG_START);
	var allRegexp = makeRegexp(CONFIG_ALL + '\\s*\\.');
	var allExceptRegexp = makeRegexp(CONFIG_ALL_EXCEPT + '\\s*');
	var onlyRegexp = makeRegexp(CONFIG_ONLY  + '\\s*');
	var configCmtRegexp = makeRegexp(CONFIG_COMMENT);
	
	var lines = src.split('\n');
	for (var i = 0; i < lines.length; i++) { 
		var line = lines[i];
		if (/^\s*\/\/s*/.test(line)) {
			var cmt = line.replace(/^\s*\/\/s*/, '');
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
					hhEach(s.replace(allExceptRegexp, '').split(/\s*,\s*/), function(section) {
						delete r[section];
					});
					return r;
				}
				if (onlyRegexp.test(s)) {
					var r = {};
					hhEach(s.replace(onlyRegexp, '').split(/\s*,\s*/), function(section) {
						r[section] = 1;
					});
					return r;
				}
			}
		}
		
	}
	
	return null;
}