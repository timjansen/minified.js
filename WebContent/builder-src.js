var SRC='minified-src.js';

var MODULES = ['INTERNAL', 'SELECTORS', 'ELEMENT', 'HTTP REQUEST', 'JSON', 'EVENTS', 'COOKIE', 'ANIMATION', 'SHORTCUTS'];

function setUpConfigurationUI(s) {
	
	function compileClicked() {
		var enabledSections = {};
		$('.secCheck').each(function(cb) {
			if (cb.checked)
				enabledSections[cb.id.substr(4)] = 1;
		});
		
		var src = compile(s.sections, s.sectionMap, enabledSections);
		// TODO: add header
		if (EL('#compressionClosure').checked) {
			EL('#compile').disabled = true;
			closureCompile(src, function(closureResult) {
				if (closureResult) {
					EL('#compile').disabled = false;
					$('#gzipRow, #downloadRow').set({$display: 'table-row'});
					EL('#resultSrc').value = closureResult.compiledCode;
					EL('#resultPlain').innerText = (closureResult.statistics.compressedSize/1024).toFixed(2) + 'kb (' + closureResult.statistics.compressedSize + ' bytes)' ;
					EL('#resultGzipped').innerText = (closureResult.statistics.compressedGzipSize/1024).toFixed(2) + 'kb (' + closureResult.statistics.compressedGzipSize + ' bytes)' ;
					EL('#resultLink').setAttribute('href', 'http://closure-compiler.appspot.com' +closureResult.outputFilePath);
				}
			});
		}
		else  {
			EL('#resultSrc').value = src;
			EL('#resultPlain').innerText = (src.length/1024).toFixed(2) + 'kb';
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
			v.each(sec.requires, function(rid) {
				$('#sec-'+rid).set('checked', true);
			});
		else
			v.each(sec.requiredBy, function(rid) {
				$('#sec-'+rid).set('checked', false);
			});
	}
	
	$('#compile').on('click', compileClicked);
	
	for (var i = 1; i < MODULES.length; i++) {
		var moduleCheckBox, div = MINI.elementAdd('#sectionCheckboxes', 'div', {id: 'divMod-'+i}, MINI.element('div', {'class': 'moduleDescriptor'}, [
			moduleCheckBox = MINI.element('input', {id: 'mod-'+i, 'class': 'modCheck', type:'checkbox', checked: 'checked'}),
			MINI.element('label', {'for': 'mod-'+i}, MODULES[i])     
		]));
		
		$(moduleCheckBox).on('change', function() {
			var b = this.checked;
			$('.secCheck', this.parentNode.parentNode)
			 .each(function(cb) {
				 cb.checked = b;
				 fulfillSectionDependencies(cb);
			 });
			setModuleCheckboxes();
		});
		
		var sectionCheckBox;
		v.each(v.filter(s.sections, function(sec) { return sec.module == i && s.enabledSections[sec.id];}).sort(function(a,b) {
			var ha = a.name || a.id, hb = b.name || b.id;
			if (ha == hb)
				return 0;
			return ha > hb ? 1 : -1;
		}), function(sec) {
			function createList(prefix, map) {
				var MAX = 8;
				var list = v.keys(map).filter(function(t){ return !!s.sectionMap[t].name;});
				if (!list.length)
					return null;
				var idx = 0, txt=prefix;
				v.each(list, function(r) {
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
		
			MINI.elementAdd(div, 'div', {'class': 'sectionDescriptor'}, [
				sectionCheckBox = MINI.element('input', {'class': 'secCheck', type:'checkbox', id: 'sec-'+sec.id, checked: sec.configurable=='yes' ? 'checked' : null}),
				MINI.element('label', {'for': 'sec-'+sec.id}, sec.name || sec.id),
				MINI.element('div', {'class': 'requirements'}, [requiredBy ? [requiredBy, MINI.element('br')] : null , requires])
			]);
			
			$(sectionCheckBox).on('change', function() {
				fulfillSectionDependencies(this);
				setModuleCheckboxes();
			});
		});
	}
}

MINI.ready(function() {
	MINI.request('get', SRC, null, function(src) {
		setUpConfigurationUI(prepareSections(src));
	});
});


