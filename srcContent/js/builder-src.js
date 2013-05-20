var MINI = require('minified'), $ = MINI.$, $$ = MINI.$$, EE = MINI.EE;
var _ = require('minifiedUtil')._;

var SRC='minified-web-src.js';

var GROUPS = ['INTERNAL', 'SELECTORS', 'ELEMENT', 'REQUEST', 'JSON', 'EVENTS', 'COOKIE', 'ANIMATION', 'OPTIONS'];

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
				cb&&cb($.parseJSON(txt));
			}, onError)
			.error(function(txt) {
				window.console && console.log(txt);
			});
}

function setUpConfigurationUI(s) {
	
	// onclick handler for compile button
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
					$$('#resultSrc').value = header + '\n' + closureResult.compiledCode;
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
	
	function setGroupCheckboxes() {
		// fix all group checkboxes
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
			_.eachObj(sec.requires, function(rid) {
				$('#sec-'+rid).set('checked', true);
			});
		else
			_.eachObj(sec.requiredBy, function(rid) {
				$('#sec-'+rid).set('checked', false);
			});
	}
	
	$('#compile').on('click', compileClicked);
	
	for (var i = 1; i < GROUPS.length; i++) {
		var groupCheckBox, div;
		$('#sectionCheckboxes').add(div = EE('div', {'@id': 'divMod-'+i}, EE('div', {'className': 'groupDescriptor'}, [
			groupCheckBox = EE('input', {'@id': 'mod-'+i, 'className': 'modCheck', '@type':'checkbox', checked: 'checked'})(),
			EE('label', {'@for': 'mod-'+i}, GROUPS[i])     
		]))());

		$(groupCheckBox).on('change', function() {
			var b = this.checked;
			$('.secCheck', this.parentNode.parentNode)
			 .each(function(cb) {
				 cb.checked = b;
				 fulfillSectionDependencies(cb);
			 });
			setGroupCheckboxes();
			return true;
		});
		
		var sectionCheckBox;
		_.filter(s.sections, function(sec) { 
			return sec.group == GROUPS[i] && sec.configurable;}
		).sort(function(a,b) {
			var ha = a.name || a.id, hb = b.name || b.id;
			if (ha == hb)
				return 0;
			return ha > hb ? 1 : -1;
		}).each(function(sec) {
			function createReqList(prefix, map) {
				var MAX = 8;
				var list = _.filter(_.keys(map), function(t){ return !!map[t].name;});
				if (!list.length)
					return null;
				var idx = 0, txt=prefix;
				_.each(list, function(r) {
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
		
			var requiredBy = createReqList('Required by ', sec.requiredBy);
			var requires = createReqList('Requires ', sec.requires);
		
			div.add(EE('div', {'className': 'sectionDescriptor'}, [
				sectionCheckBox = EE('input', {'className': 'secCheck', '@type': 'checkbox', '@id': 'sec-'+sec.id, checked: sec.configurable=='default' ? 'checked' : null})(),
				EE('label', {'@for': 'sec-'+sec.id}, sec.name || sec.id),
				EE('div', {'className': 'requirements'}, [requiredBy ? [requiredBy, EE('br')] : null , requires])
			]));
			
			$(sectionCheckBox).on('change', function() {
				fulfillSectionDependencies(this);
				setGroupCheckboxes();
				return true;
			});
		});
	}
}

$(function() {
	MINI.request('get', SRC, null).then(function(src) {
		setUpConfigurationUI(prepareSections(src));
	})
	.error(function(txt) {
		window.console && console.log(txt);
	});;
});


