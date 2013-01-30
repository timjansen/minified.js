var SRC='minified-src.js';

var MODULES = ['INTERNAL', 'SELECTORS', 'ELEMENT', 'REQUEST', 'JSON', 'EVENTS', 'COOKIE', 'ANIMATION', 'SHORTCUTS', 'OPTIONS'];

function setUpConfigurationUI(s) {
	
	function compileClicked() {
		var enabledSections = {};
		$('.secCheck').each(function(cb) {
			if (cb.checked)
				enabledSections[cb.id.substr(4)] = 1;
		});
		
		var src = compile(s.sections, s.sectionMap, enabledSections);
		var header = serializeEnabledSections(s.sections, enabledSections);
		if ($$('#compressionClosure').checked) {
			$$('#compile').disabled = true;
			closureCompile(src, function(closureResult) {
				if (closureResult) {
					$$('#compile').disabled = false;
					$('#gzipRow, #downloadRow').set({$display: 'table-row'});
					$$('#resultSrc').value = header + closureResult.compiledCode;
					$$('#resultPlain').innerHTML = (closureResult.statistics.compressedSize/1024).toFixed(2) + 'kb (' + closureResult.statistics.compressedSize + ' bytes)' ;
					$$('#resultGzipped').innerHTML = (closureResult.statistics.compressedGzipSize/1024).toFixed(2) + 'kb (' + closureResult.statistics.compressedGzipSize + ' bytes)' ;
					$$('#resultLink').setAttribute('href', 'http://closure-compiler.appspot.com' +closureResult.outputFilePath);
				}
			});
		}
		else  {
			$$('#resultSrc').value = header + src;
			$$('#resultPlain').innerHTML = (src.length/1024).toFixed(2) + 'kb';
			$('#gzipRow, #downloadRow').set({$display: 'none'});
		}
		return false;
	}
	
	function setModuleCheckboxes() {
		// fix all module checkboxes
		$('.modCheck').each(function(modCheck) {
			var checkedSectionNum = 0;
			$('.secCheck', modCheck.parentNode.parentNode).each(function(node) {
				if (node.checked)
					checkedSectionNum++;
			});
			modCheck.checked = checkedSectionNum > 0;
		});
	}
	
	function fulfillSectionDependencies(element) {
		var sec = s.sectionMap[element.id.substr(4)];
		if (element.checked)
			hhEach(sec.requires, function(rid) {
				$('#sec-'+rid).set('checked', true);
			});
		else
			hhEach(sec.requiredBy, function(rid) {
				$('#sec-'+rid).set('checked', false);
			});
	}
	
	$('#compile').on('click', compileClicked);
	
	for (var i = 1; i < MODULES.length; i++) {
		var moduleCheckBox, div, topDiv = $('#sectionCheckboxes').add(div = MINI.el('div', {'@id': 'divMod-'+i}, MINI.el('div', {'className': 'moduleDescriptor'}, [
			moduleCheckBox = MINI.el('input', {'@id': 'mod-'+i, 'className': 'modCheck', '@type':'checkbox', checked: 'checked'}),
			MINI.el('label', {'@for': 'mod-'+i}, MODULES[i])     
		])));
		
		$(moduleCheckBox).on('change', function() {
			var b = this.checked;
			$('.secCheck', this.parentNode.parentNode)
			 .each(function(cb) {
				 cb.checked = b;
				 fulfillSectionDependencies(cb);
			 });
			setModuleCheckboxes();
			return true;
		});
		
		var sectionCheckBox;
		hhEach(hhFilter(s.sections, function(sec) { return sec.module == MODULES[i] && s.enabledSections[sec.id];}).sort(function(a,b) {
			var ha = a.name || a.id, hb = b.name || b.id;
			if (ha == hb)
				return 0;
			return ha > hb ? 1 : -1;
		}), function(sec) {
			function createList(prefix, map) {
				var MAX = 8;
				var list = hhFilter(hhKeys(map), function(t){ return !!s.sectionMap[t].name;});
				if (!list.length)
					return null;
				var idx = 0, txt=prefix;
				hhEach(list, function(r) {
					if (idx++ < Math.min(list.length, MAX)) {
						if (idx > 1) {
							if (idx == Math.min(list.length, MAX))
								txt += ' and ';
							else 
								txt += ', ';
						}
						
						if (idx == MAX && list.length > MAX)
							txt += 'more';
						else
							txt += s.sectionMap[r].name || s.sectionMap[r].id;
					}
				});
				txt += '.';
				return txt;
			}
		
			var requiredBy = createList('Required by ', sec.requiredBy);
			var requires = createList('Requires ', sec.requires);
		
			div.add(MINI.el('div', {'className': 'sectionDescriptor'}, [
				sectionCheckBox = MINI.el('input', {'className': 'secCheck', '@type': 'checkbox', '@id': 'sec-'+sec.id, checked: sec.configurable=='default' ? 'checked' : null}),
				MINI.el('label', {'@for': 'sec-'+sec.id}, sec.name || sec.id),
				MINI.el('div', {'className': 'requirements'}, [requiredBy ? [requiredBy, MINI.el('br')] : null , requires])
			]));
			
			$(sectionCheckBox).on('change', function() {
				fulfillSectionDependencies(this);
				setModuleCheckboxes();
				return true;
			});
		});
	}
}

MINI(function() {
	MINI.request('get', SRC, null).then(function(src) {
		setUpConfigurationUI(prepareSections(src));
	});
});


