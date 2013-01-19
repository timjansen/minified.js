var MODULES = ['SELECTORS', 'ELEMENT', 'REQUEST', 'JSON', 'EVENTS', 'COOKIE', 'ANIMATION', 'SHORTCUTS', 'OPTIONS'];


//takes a section, as created by parseSourceSections(). Adds a 'htmldoc' property containing HTML doc.
function createDocs(sec) {
	if (!sec.name || !sec.desc || sec.doc == 'no')
		return;
	
	var s = hhTemplate('<h3><a name="doc-ID">TITLE</a></h3>\n'+
			'<div class="summary">SUMMARY</div>\n\n',
			{ID: sec.id, TITLE: sec.name, SUMMARY: sec.desc.replace(/\.[^]+$/m, '.')});
	if (sec.syntax.length) {
		s += '<h4>Syntax</h4>\n';
		s += '<div class="syntaxVariant">\n';
		hhEach(sec.syntax, function(syn) {
			s += hhTemplate('<div class="syntax">SYNTAX</div>\n', {SYNTAX: syn});
		});
		s += '</div>\n\n';
	}
		
	if (sec.params.length) {
		s += '<h4>Parameters</h4>\n';
		s += '<dl class="params">\n';
		hhEach(sec.params, function(param) {
			var desc = param.desc.replace(/^optional/, '<span class="optional">optional</span>').replace('&&', '&amp;&amp;');
			if (param.name != '@return')
				s += hhTemplate('<dt id="PARAMREF"><a name="PARAMREF">PARAM</a></dt>\n<dd>DESC</dd>\n', 
						{PARAMREF: sec.id+'_'+param.name, PARAM: param.name, DESC: desc});
			else
				s += hhTemplate('<dt id="RETURNREF" class="returnValue"><a name="RETURNREF">return value</a></dt>\n<dd>DESC</dd>\n',
						{RETURNREF: sec.id+'_RETURN', DESC: desc});
		});
		s += '</dl>\n\n';
	}
	
	s += '<h4>Description</h4>\n';
	s += hhTemplate('<div class="description">DESC</div>\n\n', {DESC: sec.desc});
	
	if (sec.example.length) {
		s += '<div class="examples">\n';
		hhEach(sec.example, function(example) {
			s += '<h4>Example</h4>\n';
			s += hhTemplate('<div class="example">EXAMPLE</div>\n', {EXAMPLE: example.replace('&&', '&amp;&amp;')});
		});
		s += '</div>\n\n';
	}
	sec.htmldoc = s;
}

//takes a section, as created by parseSourceSections(). Adds a 'htmlpreview' property containing a HTML preview of the function.
function createPreview(sec) {
	if (!sec.name || !sec.desc || sec.doc == 'no')
		return;
	
	var s = hhTemplate('<h3><a href="ID.html">TITLE</a></h3>\n'+
			'<div class="summary">SUMMARY</div>\n\n',
			{ID: sec.id, TITLE: sec.name, SUMMARY: sec.desc.replace(/\.[^]+$/m, '.')});
	sec.htmlpreview = s;
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
	hhEach(sections, function(sec) {
		html += sec.htmlpreview;
	});
	return createPage("Reference - Minified.js", html);
}

function createReferencePage(sec) {
	// Gen
	var html = '<p><a href="index.html">back to Overview</a></p>\n';
	html += sec.htmldoc;
	html += '\n<p><a href="index.html">back to Overview</a></p>\n';
	return createPage(sec.name + " - Minified.js", html);
}
