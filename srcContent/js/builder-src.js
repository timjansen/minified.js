var SRC='minified-src.js';

var MODULES = ['INTERNAL', 'SELECTORS', 'ELEMENT', 'REQUEST', 'JSON', 'EVENTS', 'COOKIE', 'ANIMATION', 'SHORTCUTS', 'OPTIONS'];

//submits the given source code (src) to the Closure online compiler. When finished, will invoke given callback cb with JSON result. 
//On error, it passes null to the callback.
function closureCompile(src, advanced, cb) {
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
				compilation_level: advanced ? 'ADVANCED_OPTIMIZATIONS' : 'SIMPLE_OPTIMIZATIONS'
			}).then(function(txt) {
				cb&&cb(MINI.parseJSON(txt));
		}, onError);
}

function setUpConfigurationUI(s) {
	
	function compileClicked() {
		var enabledSections = {};
		$('.secCheck').each(function(cb) {
			if (cb.checked)
				enabledSections[cb.id.substr(4)] = 1;
		});
		
		var src = compile(s.sections, s.sectionMap, enabledSections);
		var header = serializeEnabledSections(s.sections, enabledSections);
		if ($$('#compressionAdvanced').checked || $$('#compressionSimple').checked) {
			$$('#compile').disabled = true;
			closureCompile(src, $$('#compressionAdvanced').checked, function(closureResult) {
				$$('#compile').disabled = false;
				if (closureResult) {
					$$('#compile').disabled = false;
					$('#gzipRow, #downloadRow').set({$display: 'table-row'});
					$$('#resultSrc').value = header + closureResult.compiledCode;
					$('#resultPlain').fill((closureResult.statistics.compressedSize/1024).toFixed(2) + 'kb (' + closureResult.statistics.compressedSize + ' bytes)');
					$('#resultGzipped').fill((closureResult.statistics.compressedGzipSize/1024).toFixed(2) + 'kb (' + closureResult.statistics.compressedGzipSize + ' bytes)');
					$$('#resultLink').setAttribute('href', 'http://closure-compiler.appspot.com' +closureResult.outputFilePath);
				}
				else
					alert("Google Closure Service not availble. Try again later.");
			});
		}
		else  {
			$$('#resultSrc').value = header + src;
			$('#resultPlain').fill((src.length/1024).toFixed(2) + 'kb');
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
		var moduleCheckBox, div, topDiv = $('#sectionCheckboxes').add(div = $.el('div', {'@id': 'divMod-'+i}, $.el('div', {'className': 'moduleDescriptor'}, [
			moduleCheckBox = $.el('input', {'@id': 'mod-'+i, 'className': 'modCheck', '@type':'checkbox', checked: 'checked'}),
			$.el('label', {'@for': 'mod-'+i}, MODULES[i])     
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
		
			div.add($.el('div', {'className': 'sectionDescriptor'}, [
				sectionCheckBox = $.el('input', {'className': 'secCheck', '@type': 'checkbox', '@id': 'sec-'+sec.id, checked: sec.configurable=='default' ? 'checked' : null}),
				$.el('label', {'@for': 'sec-'+sec.id}, sec.name || sec.id),
				$.el('div', {'className': 'requirements'}, [requiredBy ? [requiredBy, $.el('br')] : null , requires])
			]));
			
			$(sectionCheckBox).on('change', function() {
				fulfillSectionDependencies(this);
				setModuleCheckboxes();
				return true;
			});
		});
	}
}

$(function() {
	$.request('get', SRC, null).then(function(src) {
		setUpConfigurationUI(prepareSections(src));
	});
});


