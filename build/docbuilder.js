var GROUPS = ['SELECTORS', 'ELEMENT', 'REQUEST', 'JSON', 'EVENTS', 'COOKIE', 'ANIMATION', 'SHORTCUTS', 'OPTIONS'];


// Parses a description to create some custom HTML: 
//- ##NAME() will be replaced with <a href="NAME.html">NAME()</a>
//- #ID#NAME() will be replaced with <a href="ID.html">NAME()</a>
function parseDescription(desc) {
	return _.toString(desc).replace(/#(\w*)#([\w$.]+)\(\)/, function(all, id, name) {
		var rId = id || name;
		return "<code><a href='"+rId.toLowerCase()+".html'>"+name+"()</a></code>";
	});
}

//takes a section, as created by parseSourceSections(). Adds a 'htmldoc' property containing HTML doc.
function createDocs(sec) {
	if (!sec.name || !sec.desc || sec.doc == 'no')
		return;
	
	var s = _.format('<h2><a name="doc-{ID}">{TITLE}</a></h2>\n'+
			'<div class="summary">{SUMMARY}</div>\n\n',
			{ID: sec.id, TITLE: sec.name, SUMMARY: sec.desc.replace(/\.[^]+$/m, '.')});
	if (sec.syntax.length) {
		if (sec.syntax.length == 1)
			s += '<h4>Syntax</h4>\n';
		else
			s += '<h4>Syntax Variants</h4>\n';
		s += '<div class="syntaxVariant">\n';
		_.each(sec.syntax, function(syn, synIndex) {
			s += _.format('<div class="syntax">{SYNTAX}</div>\n', {SYNTAX: syn});
		});
		s += '</div>\n\n';
	}
		
	if (sec.params.length) {
		s += '<h4>Parameters</h4>\n';
		s += '<dl class="params">\n';
		_.each(sec.params, function(param) {
			var desc = parseDescription(param.desc).replace(/^optional/, '<span class="optional">optional</span>').replace('&&', '&amp;&amp;');
			var re = RegExp('\b' + param.name + '\b');
			var highlightClasses = [];
			_.each(sec.syntax, function(syn, synIndex) {
				if (param.name == '@return' || re.test(syn))
					highlightClasses.push('inSyntax' + synIndex);
				
			});
			if (param.name != '@return')
				s += _.format('<dt id="{PARAMREF}" class="{CLASSDEF}"><a name="{PARAMREF}"><var>{PARAM}</var></a></dt>\n<dd class="{CLASSDEF}">{DESC}</dd>\n', 
						{PARAMREF: sec.id+'_'+param.name, PARAM: param.name, DESC: desc, CLASSDEF: highlightClasses.join(' ')});
			else
				s += _.format('<dt id="{RETURNREF}" class="returnValue {CLASSDEF}"><a name="{RETURNREF}"><var>(return value)</var></a></dt>\n<dd class="{CLASSDEF}">{DESC}</dd>\n',
						{RETURNREF: sec.id+'_RETURN', DESC: desc, CLASSDEF: highlightClasses.join(' ')});
		});
		s += '</dl>\n\n';
	}
	
	s += '<h4>Description</h4>\n';
	s += _.format('<div class="description">{DESC}</div>\n\n', {DESC: parseDescription(sec.desc)});
	
	if (sec.example.length) {
		s += '<div class="examples">\n';
		_.each(sec.example, function(example) {
			s += '<h4>Example</h4>\n';
			s += _.format('<div class="example">{EXAMPLE}</div>\n', {EXAMPLE: parseDescription(example).replace('&&', '&amp;&amp;')});
		});
		s += '</div>\n\n';
	}
	sec.htmldoc = s;
}

//takes a section, as created by parseSourceSections(). Adds a 'htmlpreview' property containing a HTML preview of the function.
function createPreview(sec) {
	if (!sec.name || !sec.desc || sec.doc == 'no')
		return;
	
	var s = _.format('<h3><a href="{ID}.html">{TITLE}</a></h3>\n'+
			'<div class="summary">{SUMMARY}</div>\n\n',
			{ID: sec.id, TITLE: sec.name, SUMMARY: sec.desc.replace(/\.[^]+$/m, '.')});
	sec.htmlpreview = s;
}


//takes a section, as created by parseSourceSections(). Adds a 'tocentry' property containing a HTML preview of the function.
function createTOCEntry(sec) {
	if (!sec.name || !sec.desc || sec.doc == 'no')
		return;
	
	sec.tocentry = _.format('<a href="{ID}.html">{TITLE}</a>\n',	{ID: sec.id, TITLE: sec.name});
}

function documentSections(docSections) {
	_.each(docSections, function(sec) {
		createDocs(sec);
		createPreview(sec);
		createTOCEntry(sec);
	});
}

function createPage(title, main) {
	var p = '<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<!--\n'+
		'   Auto-generated using docbuilder.js. Do not edit manually. \n'+
		'-->\n'+
		'<page xmlns="http://tjansen.de/minifiedPage" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://tjansen.de/minifiedPage ../schemas/page.xsd ">\n' +
        '\t<title>'+title+'</title>\n' +
        '\t<section>reference</section>\n' +
        '\t<externalCss>../css/reference.css</externalCss>\n' +
        '\t<main><![CDATA[\n' + main + '\n]]></main>\n</page>\n';
	return p;
}

function sortTocOrder(sections) {
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
}

function createOverviewPage(sections) {
	sortTocOrder(sections);
	
	// Gen
	var html = '<h1>Minified Web API</h1>\n';
	_.each(sections, function(sec) {
		html += sec.htmlpreview;
	});
	return createPage("Reference - Minified.js", html);
}

function createToc(sections) {
	sortTocOrder(sections);
	
	var html = '<div id="toc"><h3>Functions</h3><ul>';
	_.each(sections, function(sec) {
		html += '<li>'+sec.tocentry+'</li>';
	});
	html += '</ul></div>';
	return html;
}

function createReferencePage(sec, toc) {
	// Gen
	var html = '<div id="docmain"><p class="docHead"><a href="index.html" class="backOverview">back to Overview</a></p>\n';
	html += sec.htmldoc;
	html += '\n<p class="docFoot"><a href="index.html" class="backOverview">back to Overview</a></p>\n';
	html += '</div>\n';
	html += toc;
	html += '\n';
	return createPage(sec.name + " - Minified.js", html);
}
