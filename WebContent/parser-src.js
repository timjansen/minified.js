
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
	v.each(lines, function(line) {
		if (inComment && /^.*\*\/\s*$/.test(line)) // end of comment ("*/")
			inComment = false;
		else if (inComment) {
			var l = line.replace(/^\s*(\*\s?)?/, '').replace(/\s*$/, '');
			var tagmatch = l.match(/^\s*@([a-z]+)/);
			if (tagmatch) { // comment tag found
				var tag = tagmatch[1];
				var content = v.trim(l.replace(/^@[a-z]+\s*/, ''));
				if (tag == 'syntax' || tag == 'example')
					currentSection[tag].push(content);
				else if (tag == 'requires') {
					if (content.length)
						v.each(content.split(/\s+/), function(c) {
							currentSection.requires[c] = 1; 
						});
				}
				else if (tag == 'params')
					currentSection.params.push({name: content.replace(/\s.*$/, ''), desc: content.replace(/^\S+\s+/, '')});
				else if (tag == 'return')
					currentSection.params.push({name: '@return', desc: content});
				else if (tag == 'function')
					currentSection.params[currentSection.params.length-1].funcs.push(content);
				else
					currentSection[tag] = (content != '') ? content : 1;
			}
			else if (currentSection.params.length) // parameters reached?
				currentSection.params[currentSection.params.length-1].desc += '\n' + v.trim(l);
			else if (currentSection.example.length) // in examples?
				currentSection.example[currentSection.example.length-1] += '\n' + l;
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
	v.each(sections, function(section) {
		m[section.id] = section;
	});
	return m;
}

// completes dependencies in the sections by adding depencies of dependencies in the sections
function completeRequirements(sections, sectionMap) {
	var addedReqs = 0;
	v.each(sections, function(s) {
		v.each(s.requires, function(reqId) {
			var s2 = sectionMap[reqId];
			if (!s2)
				throw Error("Unknown id in requirement: \"" + reqId + "\"");
			v.each(s2.requires, function(reqId2) {
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
		v.each(sections, function(s) {
			v.each(s.requires, function(t) { 
				sectionMap[t].requiredBy[s.id] = 1;
			});
		});
}

// creates a map (id->1) of all enabled sections plus their dependencies
function calculateDependencies(sectionMap, enabledSections) {
	var r = {};
	v.each(enabledSections, function(s) {
		if (enabledSections[s]) {
			r[s] = 1;
			v.each(sectionMap[s].requires, function(req) {
				r[req] = 1;
			});
		}
	});
	return r;
}

//creates a map of all configurable sections by id
function createDefaultConfigurationMap(sections) {
	var m = {};
	v.each(sections, function(section) {
		if (section.configurable && section.configurable != 'disabled')
			m[section.id] = 1;
	});
	return m;
}

// compiles the list of sections into a single string, given the map of enabled sections
function compile(sections, sectionMap, enabledSections) {
	var src = '';
	var enabledSectionsWithDeps = calculateDependencies(sectionMap, enabledSections);
	var condBlock = null;
	var lastLineEmpty = true; // =true: don't allow empty lines at the beginning
	v.each(v.filter(sections, function(s) {
		return enabledSectionsWithDeps[s.id] || !(s.configurable || s.dependency); 
	}), function(s){
		v.each(s.src, function(line) {
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
					condBlock = (!!enabledSectionsWithDeps[m[4]] != (m[3] == '!'));
				else if (condBlock != null && /^\s*\/\/\s*@condend(\s|$)/.test(line))
					condBlock = null;
				else if (condBlock == null || condBlock)
					src += line + '\n';
				lastLineEmpty = false;
			}
		});
	});
	return src;
}

// Serializes the configuration into a string
function serializeEnabledSections(sections, enabledSections) {
	var configurableSections = v.filter(sections, function(s) { return s.configurable; });
	var enabledSectionList = v.keys(enabledSections).filter(function(s) { return enabledSections[s];});

	var head, listedIds = [];
	if (enabledSectionList.length == configurableSections.length) {
		head = '// All sections';
		listedIds = [];
	}
	else if (enabledSectionList.length > configurableSections.length/2) {
		head = '// All sections except ';
		listedIds = v.filter(configurableSections, function(s) { return !enabledSections[s.id]; }).map(function(s) { return s.id; });
	}
	else {
		head = '// Only sections ';
		listedIds = enabledSectionList;
	}
	
	var txt = "// minified.js config start -- use this comment to re-create your build configuration\n" + head;
	var charsToBreak = 50;
	v.each(listedIds.sort(), function(id) {
		if (charsToBreak < id.length) {
			charsToBreak = 70;
			txt += '\n// ' + id;
		}
		else {
			txt += id + ', ';
			charsToBreak -= id.length + 2;
		}
	});
	txt = txt.replace(/,\s*$/, '.'); // remove last comma with period
	txt += "\n// minified.js config end\n";
	return txt;
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
			}, 
		function(txt) {
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
