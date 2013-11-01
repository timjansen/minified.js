var _ = require('minified-headless');



// Parses a description to create some custom HTML: 
//- ##NAME() will be replaced with <code><a href="NAME.html">NAME()</a></code>
//- #ID#NAME() will be replaced with <code><a href="ID.html">NAME()</a></code>
//- ##ID# bla bla ## will be replaced with <a href="NAME.html"> bla bla </a>
function parseDescription(desc, paragraphSeparator, plainText) {
	return _.toString(desc)
		.replace(/##(\w+)#([^#]+)##/g, function(all, id, text) { // ##id#any text##
			return plainText ? text :  "<a href='"+id.toLowerCase()+".html' class='func'>"+text+"</a>";
		})
		.replace(/#(\w*)#([\w$._]+)\(\)/g, function(all, id, name) { // #id#name()  and   ##name()
			var rId = id || name.replace(/[_.$]+/g);
			return plainText ? name : "<code><a href='"+rId.toLowerCase()+".html' class='func'>"+name+"()</a></code>";
		})
		.replace(/\n\n/mg, paragraphSeparator || '')
		.replace(/<var>/g, '<span class="var">')
		.replace(/<\/var>/g, '</span>');
}

//takes a section, as created by parseSourceSections(). Adds a 'htmldoc' property containing HTML doc.
function createDocs(sec) {
	if (!sec.name || !sec.desc || sec.doc == 'no')
		return;
	
	var s = _.format('<h2><a name="doc-{{ID}}">{{TITLE}}</a></h2>\n'+
			'<div class="summary">{{SUMMARY}}</div>\n\n',
			{ID: sec.id, TITLE: sec.name, SUMMARY: parseDescription(sec.desc.replace(/\.[^]+$/m, '.'), null, true)});
	
	var avail;
	if (/COMMENT/.test(sec.module))
		avail = sec.module.replace(/\s*COMMENT\s*/, '');
	else if (/WEB.UTIL/.test(sec.module) || /UTIL.WEB/.test(sec.module))
		avail = 'Complete distribution only, not available in stand-alone modules.';
	else if (/WEB/.test(sec.module) && /UTIL/.test(sec.module))
		avail = 'Available in all modules.';
	else if (/WEB/.test(sec.module)) 
		avail = 'Web module only.';
	else if (/UTIL/.test(sec.module))
		avail = 'Util module only.';
	if (avail)
		s += '<div class="availability">' + avail + '</div>';
	
	if (sec.syntax.length) {
		if (sec.syntax.length == 1)
			s += '<h4>Syntax</h4>\n';
		else
			s += '<h4>Syntax Variants</h4>\n';
		s += '<div class="syntaxVariant">\n';
		_.each(sec.syntax, function(syn, synIndex) {
			s += _.format('<div class="syntax">{{SYNTAX}}</div>\n', {SYNTAX: syn});
		});
		s += '</div>\n\n';
	}
		
	if (sec.params.length) {
		s += '<h4>Parameters</h4>\n';
		s += '<dl class="params">\n';
		_.each(sec.params, function(param) {
			var isOptional = /^optional\s/.test(param.desc);
			var desc = parseDescription(param.desc).replace(/^optional\s+/, '').replace('&&', '&amp;&amp;');
			var re = RegExp('\b' + param.name + '\b');
			var highlightClasses = [];
			_.each(sec.syntax, function(syn, synIndex) {
				if (param.name == '@return' || re.test(syn))
					highlightClasses.push('inSyntax' + synIndex);
				
			});
			if (param.name != '@return')
				s += _.format('<dt id="{{PARAMREF}}" class="{{CLASSDEF}}"><a name="{{PARAMREF}}"><var>{{PARAM}}</var></a></dt>\n<dd class="{{CLASSDEF}}">{{DESC}}</dd>\n', 
						{PARAMREF: sec.id+'_'+param.name, PARAM: param.name + (isOptional ? ' (optional)' : ''), 
					     DESC: desc, CLASSDEF: highlightClasses.join(' ')});
			else
				s += _.format('<dt id="{{RETURNREF}}" class="returnValue {{CLASSDEF}}"><a name="{{RETURNREF}}"><var>(return value)</var></a></dt>\n<dd class="{{CLASSDEF}}">{{DESC}}</dd>\n',
						{RETURNREF: sec.id+'_RETURN', DESC: desc, CLASSDEF: highlightClasses.join(' ')});
		});
		s += '</dl>\n\n';
	}
	
	s += '<h4>Description</h4>\n';
	s += _.format('<div class="description"><p>{{DESC}}</p></div>\n\n', {DESC: parseDescription(sec.desc, '</p><p>')});
	
	if (sec.example.length) {
		s += '<div class="examples">\n';
		_.each(sec.example, function(example) {
			s += '<h4>Example</h4>\n';
			s += _.format('<div class="example"><p>{{EXAMPLE}}</p></div>\n', {EXAMPLE: parseDescription(example, '\n\n').replace('&&', '&amp;&amp;')});
		});
		s += '</div>\n\n';
	}
	
	if (sec.see.length) {
		s += '<h4>See also..</h4>\n<ul>';
		_.each(sec.see, function(seeAlso) {
			s += _.format('<li>{{SEEALSO}}</li>\n', {SEEALSO: parseDescription(seeAlso)});
		});
		s += '</ul>\n';
	}
	sec.htmldoc = s;
}

//takes a section, as created by parseSourceSections(). Adds a 'htmlpreview' property containing a HTML preview of the function.
function createPreview(sec) {
	if (!sec.name || !sec.desc || sec.doc == 'no')
		return;
	
	var s = _.format('<h3><a href="{{ID}}.html">{{TITLE}}</a></h3>\n'+
			'<div class="summary">{{SUMMARY}}</div>\n\n',
			{ID: sec.id, TITLE: sec.name, SUMMARY: parseDescription(sec.desc.replace(/\.[^]+$/m, '.'), null, true)});
	sec.htmlpreview = s;
}


//takes a section, as created by parseSourceSections(). Adds a 'tocentry' properties containing a HTML preview of the function.
function createTOCEntry(sec) {
	if (!sec.name || !sec.desc || sec.doc == 'no')
		return;
	
	sec.tocentries = {};
	sec.tocentries[sec.name] = _.format('<a href="{{id}}.html" class="func">{{name}}</a> '+
			'{{if obj.module && !/WEB.UTIL/.test(obj.module)}}<span class="tocMod">{{if /WEB/.test(module) && !/UTIL/.test(module)}}Web{{else if /WEB/.test(module) && /UTIL/.test(module)}}Web, Util{{else if /UTIL/.test(module)}}Util{{/if}}</span>{{/if}}\n', sec);
//	if (sec.altname)
//		sec.tocentries[sec.altname] = _.format('<a href="{{id}}.html" class="func">{{altname}}</a>\n', sec);
}

function documentSections(docSections) {
	_.each(docSections, function(sec) {
		createDocs(sec);
		createPreview(sec);
		createTOCEntry(sec);
	});
}

function createPage(title, main) {
	var p = '{\n' +
		'/*\n'+
		'   Auto-generated using docbuilder.js. Do not edit manually. \n'+
		'*/\n'+
        '\ttitle: `'+title+'`,\n' +
        '\tsection:"reference",\n' +
        '\texternalCss: ["../css/reference.css"],\n' +
        '\tmain: `\n' + main.replace(/`/g, '\\`') + '\n`\n}\n';
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

function createToc(sections) {
	var tocEntries = [];
	_.each(sections, function(sec) {
		_.eachObj(sec.tocentries, function(name, html) {
			tocEntries.push({id: sec.id, name: name, html: html});
		});
	});
	sortTocOrder(tocEntries);
	
	var html = '<div id="toc"><h3>Functions</h3><ul>';
	_.each(tocEntries, function(te) {
		html += '<li>'+te.html+'</li>';
	});
	html += '<li><a href="/docs/howto.html" class="func">How to...</a></li>';
	html += '</ul></div>';
	return html;
}

function createOverviewPage(sections) {
	sortTocOrder(sections);
	
	var html = '<div id="docmain"><p class="docHead"><h1>Minified API</h1>\n</p>\n';
	_.each(sections, function(sec) {
		html += sec.htmlpreview;
	});
	html += '<h3><a href="/docs/howto.html">How to...</a></h3>\n<div class="summary">Can\'t find something? Try this page!</div><p><br/></p>';
	html += '</div>\n';
	html += createToc(sections);
	html += '\n';
	return createPage("Reference - Minified.js", html);
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

module.exports = {
	documentSections: documentSections,
	createOverviewPage: createOverviewPage,
	createToc: createToc,
	createReferencePage: createReferencePage
};




