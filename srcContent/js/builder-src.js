var MINI = require('minified'), $ = MINI.$, $$ = MINI.$$, EE = MINI.EE;
var _ = MINI._;

var VERSION = "Version 2014 beta3 b2";
var MAX_SIZE = 8191;
var SRC='/builder/minified-generated-full-src.js';

var GROUPS = ['INTERNAL', 'SELECTORS', 'ELEMENT', 'REQUEST', 'JSON', 'EVENTS', 'COOKIE', 'ANIMATION',  'LIST', 'OBJECT', 'FUNC', 'FORMAT', 'TYPE', 'DATE', 'STRING', 'OPTIONS'];

//submits the given source code (src) to the Closure online compiler. When finished, will invoke given callback cb with JSON result. 
//On error, it passes null to the callback.
function closureCompile(src, advanced, cb) {
	function onError(e, e2, e3) {
		if(window.console)console.log('error', e, e2, e3);
		cb&&cb(null);
	}
	var URL = 'http://closure-compiler.appspot.com/compile';
	$.request('post', URL, 
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
				window.console && console.log(txt, txt.stack || '');
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
		if ($$('#compressionAdvanced').checked) {
			$$('#compile').disabled = true;
			closureCompile(src, true, function(closureResult) {
				$$('#compile').disabled = false;
				$('#resultDiv').animate({$$slide: 1});
				if (closureResult) {
					$('#gzipRow, #downloadRow').set({$display: 'table-row'});
					$$('#resultSrc').value = header + closureResult.compiledCode;
					$('#resultPlain').fill((closureResult.statistics.compressedSize/1024).toFixed(2) + 'kb (' + closureResult.statistics.compressedSize + ' bytes)');
					$('#resultGzippedSize').fill((closureResult.statistics.compressedGzipSize/1024).toFixed(2) + 'kb (' + closureResult.statistics.compressedGzipSize + ' bytes)');
					$$('#resultLink').setAttribute('href', 'http://closure-compiler.appspot.com' +closureResult.outputFilePath);
					$('#resultGzippedComment').set({$$fade: closureResult.statistics.compressedGzipSize > MAX_SIZE ? 1 : 0});
				}
				else
					alert("Google Closure Service not availble. Try again later.");
			});
		}
		else  {
			$('#resultDiv').animate({$$slide: 1});
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
	
	function recreateConfig() {
		try {
			var inputSrc = $$('#configSrc').value;
			var conf = deserializeEnabledSections(s.sections, s.sectionMap, inputSrc);
			if (conf) {
				_.eachObj(s.sectionMap, function(secName) {
					var secCheck = $$('#sec-'+secName);
					if (secCheck)
						secCheck.checked = !!conf[secName];
				});
				setGroupCheckboxes();
			}
			else
				alert("Can not find configuration in source."); 
		}
		catch (e) {
			console.log(e);
		}
	}
	
	$('#compile').on('click', compileClicked);
	
	var configSrcToggle = $('#configSrcDiv').toggle({$$slide: 0}, {$$slide: 1});
	$('#fromScratch').on('|click', configSrcToggle, [false]);
	$('#loadConfig').on('|click', configSrcToggle, [true]);
	
	$('#recreate').on('click', recreateConfig);
	
	$('#sectionCheckboxes').fill();
	for (var i = 1; i < GROUPS.length; i++) {
		var groupCheckBox, div;
		$('#sectionCheckboxes').add(div = EE('div', {'@id': 'divMod-'+i}, EE('div', {$: 'groupDescriptor'}, [
			groupCheckBox = EE('input', {'@id': 'mod-'+i, $: 'modCheck', '@type':'checkbox', checked: 'checked'}),
			EE('label', {'@for': 'mod-'+i}, GROUPS[i])     
		])));

		groupCheckBox.onChange(function(b) {
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
		
			div.add(EE('div', {$: 'sectionDescriptor'}, [
				sectionCheckBox = EE('input', {$: 'secCheck', '@type': 'checkbox', '@id': 'sec-'+sec.id, checked: sec.configurable=='default' ? 'checked' : null}),
				EE('label', {'@for': 'sec-'+sec.id}, sec.name || sec.id),
				EE('div', {$: 'requirements'}, [requiredBy ? [requiredBy, EE('br')] : null , requires])
			]));
			
			sectionCheckBox.onChange(function() {
				fulfillSectionDependencies(this);
				setGroupCheckboxes();
			});
		});
	}
}

$(function() {
	$('.version').fill(VERSION);
	
	var IEVersion = /MSIE\s([\d.]+)/i.exec(navigator.userAgent);
	if (IEVersion && parseInt(IEVersion[1]) < 10) {
		$('#builderDiv').fill('Sorry, the Builder tool requires at least Internet Explorer 10 (or, alternatively, Chrome or Firefox). '+
				'Earlier versions lack CORS support required to use Google Closure\'s web service.');
	}
	else {
		$.request('get', SRC, null).then(function(src) {
			setUpConfigurationUI(prepareSections(src));
		})
		.error(function(txt) {
			window.console && console.log(txt, txt.stack || '');
		});
	}
});


