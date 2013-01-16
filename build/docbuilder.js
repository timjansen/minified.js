var MODULES = ['SELECTORS', 'ELEMENT', 'REQUEST', 'JSON', 'EVENTS', 'COOKIE', 'ANIMATION', 'SHORTCUTS', 'OPTIONS'];


//takes a section, as created by parseSourceSections(). Adds a 'htmldoc' property containing HTML doc.
function createDocs(sec) {
	if (!sec.name || !sec.desc || sec.doc == 'no')
		return;
	
	var s = template('<h3><a name="doc-ID">TITLE</a></h3>\n'+
			'<div class="summary">SUMMARY</div>\n\n',
			{ID: sec.id, TITLE: sec.name, SUMMARY: sec.desc.replace(/\.[^]+$/m, '.')});
	if (sec.syntax.length) {
		s += '<h4>Syntax</h4>\n';
		s += '<div class="syntaxVariant">\n';
		hh.each(sec.syntax, function(syn) {
			s += template('<div class="syntax">SYNTAX</div>\n', {SYNTAX: syn});
		});
		s += '</div>\n\n';
	}
		
	if (sec.params.length) {
		s += '<h4>Parameters</h4>\n';
		s += '<dl class="params">\n';
		hh.each(sec.params, function(param) {
			if (param.name == '@return')
				s += template('<dt><a name="#PARAMREF">PARAM</a></dt>\n<dd>DESC</dd>\n', 
						{PARAMREF: sec.id+'_'+param.name, PARAM: param.name, DESC: param.desc});
			else
				s += template('<dt class="returnValue"><a name="#RETURNREF">PARAM</a></dt>\n<dd>DESC</dd>\n',
						{RETURNREF: sec.id+'_RETURN', DESC: param.desc});
		});
		s += '</dl>\n\n';
	}
	
	s += '<h4>Description</h4>\n';
	s += template('<div class="description">DESC</div>\n\n', {DESC: sec.desc});
	
	if (sec.example.length) {
		s += '<div class="examples">\n';
		hh.each(sec.example, function(example) {
			s += '<h4>Example</h4>\n';
			s += template('<div class="example">EXAMPLE</div>\n', {EXAMPLE: example});
		});
		s += '</div>\n\n';
	}
	sec.htmldoc = s;
}

//takes a section, as created by parseSourceSections(). Adds a 'htmlpreview' property containing a HTML preview of the function.
function createPreview(sec) {
	if (!sec.name || !sec.desc || sec.doc == 'no')
		return;
	
	var s = template('<h3><a href="ID.html">TITLE</a></h3>\n'+
			'<div class="summary">SUMMARY</div>\n\n',
			{ID: sec.id, TITLE: sec.name, SUMMARY: sec.desc.replace(/\.[^]+$/m, '.')});
	sec.htmlpreview = s;
}

function template(tpl, valueMap) {
	var t = tpl;
	hh.each(valueMap, function(name, value) {
		t = t.replace(new RegExp(name, 'g'), value);
	});
	return t;
}

function createPage(title, main) {
	var p = '<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<!--\n'+
		'   Auto-generated using docbuilder.js. Do not edit manually. \n'+
		'-->\n'+
		'<page xmlns="http://tjansen.de/minifiedPage" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://tjansen.de/minifiedPage ../schemas/page.xsd ">\n' +
        '\t<title>'+title+'</title>\n' +
        '\t<section>reference</section>\n' +
        '\t<main>\n' + main + '\t</main>\n</page>\n';
	return p;
}

function createOverviewPage(sections) {
	// Sort in overview order
	sections.sort(function(a, b) { 
		if (a.id == 'dollar')
			return -1;
		else if (b.id == 'dollar')
			return 1;
		else if (/^list/.test(a.name) && !/^list/.test(b.name))
			return -1;
		else if (/^list/.test(b.name) && !/^list/.test(a.name))
			return 1;
		return a.name > b.name ? 1 : -1;
	});
	
	// Gen
	var html = '';
	hh.each(sections, function(sec) {
		html += sec.htmlpreview;
	});
	return createPage("Reference - Minified.js", html);
}
