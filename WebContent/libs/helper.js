// Simple list of helper functions


function hhToString(s) { 
	return s!=null ? ''+s : '';
}
function hhTrim(s) { 
	return hhToString(s).replace(/^\s+|\s+$/, '');
}
function hhIsType(s,o) {
	return typeof s == o;
}
function hhIsString(s) {
	return hhIsType(s, 'string');
}
function hhIsFunction(f) {
	return hhIsType(f, 'function');
}
function hhIsObject(f) {
	return hhIsType(f, 'object');
}
function hhIsList(v) {
	return v && v.length != null && !hhIsString(v) && !hhIsFunction(v);
}
function hhEach(list, cb) {
	if (hhIsList(list))
		for (var i = 0; i < list.length; i++)
			cb(list[i], i);
	else
		for (var n in list)
			if (list.hasOwnProperty(n))
				cb(n, list[n]);
	return list;
}
function hhFilter(list, filterFunc) {
	var r = []; 
	hhEach(list, function(node,index) {
		if (!filterFunc||filterFunc(node,index))
			r.push(node);
	});
	return r;
}
function hhFilterMap(map, filterFunc) {
	var r = {}; 
	hhEach(list, function(name, value) {
		if (!filterFunc||filterFunc(name, value))
			map[name] = value;
	});
	return r;
}
function hhCollect(list, collectFunc, result) {
	result = result || [];
	hhEach(list, function(item, index) {
		if (hhIsList(item = collectFunc(item, index))) // extreme variable reusing: item is now the callback result
			each(item, function(rr) { result.push(rr); });
		else if (item != null)
			result.push(item);
	});
	return result;
}
function hhCopy(from, to) {
	hhEach(from, function(name, value) {
		to[name] = value;
	});
	return to;
}
function hhKeys(map) {
	return hhCollect(map, function(name, value) {
		return name;
	});
}	


//simple template function. Input is tpl. valueMap is a map of replacements in the form name->value. 
function hhTemplate(tpl, valueMap) {
	var t = tpl;
	hhEach(valueMap, function(name, value) {
		t = t.replace(new RegExp(name, 'g'), value.replace(/(\$)/g, '$1$1')); 
	});
	return t;
}
