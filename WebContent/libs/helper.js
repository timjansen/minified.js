// Simple list of helper functions

(function(hh) {

	function toString(s) { // wrapper for Closure optimization
		return s!=null ? ''+s : '';
	}
	function trim(s) { // wrapper for Closure optimization
		return toString(s).replace(/^\s+|\s+$/, '');
	}
	function isType(s,o) {
		return typeof s == o;
	}
	function isString(s) {
		return isType(s, 'string');
	}
	function isFunction(f) {
		return isType(f, 'function');
	}
	function isObject(f) {
		return isType(f, 'object');
	}
	function isList(v) {
		return v && v.length != null && !isString(v) && !isFunction(v);
	}
	function each(list, cb) {
		if (isList(list))
			for (var i = 0; i < list.length; i++)
				cb(list[i], i);
		else
			for (var n in list)
				if (list.hasOwnProperty(n))
					cb(n, list[n]);
		return list;
	}
	function filter(list, filterFunc) {
		var r = []; 
		each(list, function(node,index) {
			if (!filterFunc||filterFunc(node,index))
				r.push(node);
		});
		return r;
	}
	function filterMap(map, filterFunc) {
		var r = {}; 
		each(list, function(name, value) {
			if (!filterFunc||filterFunc(name, value))
				map[name] = value;
		});
		return r;
	}
	function collect(list, collectFunc, result) {
		result = result || [];
		each(list, function(item, index) {
			if (isList(item = collectFunc(item, index))) // extreme variable reusing: item is now the callback result
				each(item, function(rr) { result.push(rr); });
			else if (item != null)
				result.push(item);
		});
		return result;
	}
	function copy(from, to) {
		each(from, function(name, value) {
			to[name] = value;
		});
		return to;
	}
	function keys(map) {
		return collect(map, function(name, value) {
			return name;
		});
	}	
	
	copy({
		'toString':toString,
		'trim':trim,
		'isType':isType,
		'isString':isString,
		'isFunction':isFunction,
		'isObject':isObject,
		'isList':isList,
		'each':each,
		'filter':filter,
		'filterMap':filterMap,
		'collect':collect,
		'copy':copy,
		'keys':keys
	}, hh);
	
})(window['hh'] = {});