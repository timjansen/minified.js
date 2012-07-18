var src = '';


// parses the source, returns an array of objects describing sections that can be enabled/disabled
function parseSourceSections(src) {
	var lines = src.split('\n');
	
	var nextAnonId = 100;
	var sections = [];
	function createSection() {
		return { id: 'anon' + (nextAnonId++),
			     src: '',
			     desc: '',
			     requires: {}, // contains ids->1
			     syntax: [],
			     params: [] // contains {name, desc, funcs} each; @return has '@return' as name
			   };
	}
	
	var currentSection = createSection();
	var inComment = false;
			
	v.each(lines, function(line) {
		if (inComment && /^.*\*\/\s*$/.test(line)) // end of comment ("*/")
			inComment = false;
		else if (inComment) {
			var l = line.replace(/^\s*\*?\s*/, '').replace(/\s*$/, '');
			var tagmatch = l.match(/^@[a-z]+/);
			if (tagmatch) { // comment tag found
				var tag = tagmatch[0].substring(1);
				var content = l.replace(/^@[a-z]+\s*/, '');
				if (tag == 'syntax')
					currentSection.syntax.push(content);
				else if (tag == 'requires' && content)
					v.each(content.split(/\s+/), function(c) {	currentSection.requires[c] = 1; });
				else if (tag == 'params')
					currentSection.params.push({name: content.replace(/\s.*$/, ''), desc: content.replace(/^\S+\s+/, ''), funcs: []});
				else if (tag == 'return')
					currentSection.params.push({name: '@return', desc: content, funcs: []});
				else if (tag == 'function')
					currentSection.params[currentSection.params.length-1].funcs.push(content);
				else
					currentSection[tag] = (content != '') ? content : 1;
			}
			else if (currentSection.params.length) // in parameter
				currentSection.params[currentSection.params.length-1][1] += '\n' + l;
			else // main description
				currentSection.desc += '\n' + l;
		}
		else if (/^\s*\/\*\*/.test(line) && !/\*\/\s*$/.test(line)){ // start of comment ("/**" at start of line)
			inComment = true;
			sections.push(currentSection);
			currentSection = createSection();
		}
		else
			currentSection.src += line + '\n';
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
		v.each(s.requires, function(req) {
			var s2 = sectionMap[req];
			if (!s2)
				throw Error("Unknown id in requirement: \"" + req + "\"");
			v.each(s2.requires, function(req2) {
				if (!s.requires[req2]) {
					addedReqs++;
					s.requires[req2] = 1;
				}
			});
		});
	});
	if (addedReqs > 0)
		completeRequirements(sections, sectionMap); // repeat until all requirements complete
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
	var enabledSectionsWithDeps = calculateDependencies(sectionMap, enabledSections);
	return v.filter(sections, function(s) {
		return enabledSectionsWithDeps[s.id] || !(s.configurable || s.dependency); 
	}).map(function(s){
		return s.src;
	}).join('\n');
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

function closureCompile(src, cb) {
	function onError(e, e2, e3) {
		console.log('error', e, e2, e3);
		cb&&cb(null);
	}
	var URL = 'http://closure-compiler.appspot.com/compile';
	MINI.request('post', URL, 
			{
				js_code: src,
				output_format: 'json',
				output_info: ['compiled_code', 'statistics'],
				output_file_name: 'minified.js'
			}, 
		function(txt) {
				var j = MINI.parseJSON(txt);
console.log(j);
				cb&&cb(j);
		}, onError);
}

function prepareSections(src) {
	var sections = parseSourceSections(src);
	var sectionMap = createSectionMap(sections);
	completeRequirements(sections, sectionMap);
	var enabledSections = createDefaultConfigurationMap(sections);

	return {sections: sections, sectionMap: sectionMap, enabledSections: enabledSections};
}

/// HTML / builder.html specific code ///////////////////

var MODULES = ['INTERNAL', 'SELECTORS', 'ELEMENT', 'HTTP REQUEST', 'JSON', 'EVENTS', 'COOKIE', 'ANIMATION', 'SHORTCUTS'];

function setUpConfigurationUI(s) {
	for (var i = 1; i < MODULES.length; i++) {
		var moduleCheckBox, div = MINI.element('div', {id: 'divMod-'+i}, MINI.element('div', {'class': 'moduleDescriptor'}, [
                moduleCheckBox = MINI.element('input', {id: 'mod-'+i, 'class': 'modCheck', type:'checkbox', checked: 'checked'}),
                MINI.element('label', {'for': 'mod-'+i}, MODULES[i])     
		]), '#sectionCheckboxes');
		
		$(moduleCheckBox).addEvent('change', function() {
			$('.secCheck', this.parentNode.parentNode).set('checked', this.checked);
		});
		
		var sectionCheckBox;
		v.each(v.filter(s.sections, function(sec) { return sec.module == i && s.enabledSections[sec.id];}).sort(function(a,b) {
			var ha = a.name || a.id, hb = b.name || b.id;
			if (ha == hb)
				return 0;
			return ha > hb ? 1 : -1;
		}), function(sec) {
			MINI.element('div', {'class': 'sectionDescriptor'}, [
				sectionCheckBox = MINI.element('input', {'class': 'secCheck', type:'checkbox', id: 'sec-'+sec.id, checked: sec.configurable=='yes' ? 'checked' : null}),
				MINI.element('label', {'for': 'sec-'+sec.id}, sec.name || sec.id),
				MINI.element('br')
			], div);
			
			$(sectionCheckBox).addEvent('change', function() {
				var checkedSectionNum = 0;
				$('.secCheck', this.parentNode.parentNode).each(function(node) {
					if (node.checked)
						checkedSectionNum++;
				});
				$('.modCheck', this.parentNode.parentNode).set('checked', checkedSectionNum > 0);
			});
		});
	}
}

var srcData;

MINI.ready(function() {
	MINI.request('get', 'minified-src.js', null, function(src) {
		srcData = prepareSections(src);
		setUpConfigurationUI(srcData);
	});
});


