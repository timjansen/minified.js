var MODULES = ['INTERNAL', 'SELECTORS', 'ELEMENT', 'HTTP REQUEST', 'JSON', 'EVENTS', 'COOKIE', 'ANIMATION', 'SHORTCUTS', 'OPTIONS'];


// takes a section, as created by parseSourceSections(). Adds a 'doc' property containing HTML doc.
function createDocs(sec) {
	if (!sec.name || !sec.desc || sec.doc == 'no')
		return;
	
	var s = template('<h2><a name="doc-ID">TITLE</a></h2>\n'+
			'<div class="summary">SUMMARY</div>\n\n',
			{ID: sec.id, TITLE: sec.name, SUMMARY: sec.desc.replace(/\.[\n.]+$/m, '.')});
	if (sec.syntax.length) {
		s += '<h3>Syntax</h3>\n';
		s += '<div class="syntaxVariant">\n';
		hh.each(sec.syntax, function(syn) {
			s += template('<div class="syntax">SYNTAX</div>\n', {SYNTAX: syn});
		});
		s += '</div>\n\n';
	}
		
	if (sec.params.length) {
		s += '<h3>Parameters</h3>\n';
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
	
	s += '<h3>Description</h3>\n';
	s += template('<div class="description">DESC</div>\n\n', {DESC: sec.desc});
	
	if (sec.example.length) {
		s += '<div class="examples">\n';
		hh.each(sec.example, function(example) {
			s += '<h3>Example</h3>\n';
			s += template('<div class="example">EXAMPLE</div>\n', {EXAMPLE: example});
		});
		s += '</div>\n\n';
	}
	sec.doc = s;
}

function template(tpl, valueMap) {
	var t = tpl;
	hh.each(valueMap, function(name, value) {
		t = t.replace(new RegExp(name, 'g'), value);
	});
	return t;
}

function createPage(sections) {
	
}
