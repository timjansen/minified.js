/*
 * Minified-base.js - Collections, formatting and other helpers.
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * 
 * https://github.com/timjansen/minified.js
 */

/*
 * When you read this code, please keep in mind that it is optimized to produce small and gzip'able code
 * after being minimized with Closure (http://closure-compiler.appspot.com). Run-time performance and readability
 * should be acceptable, but are not a primary concern.
 */

// ==ClosureCompiler==
// @output_file_name minified-base.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==

    /*$
     * @id amdfallback
     * @name Fallback if AMD is not available.
     * @configurable default
     * @module OPTIONS
     * @doc no
     * If enabled, there will be fallback code to provide a require function even if no AMD framework such as 
     * require.js is available. If you always use Minified with an AMD framework, you can safely turn this off.
     */
if (/^u/.test(typeof define)) { // no AMD support available ? define a minimal version
	var def = {};
	this['define'] = function(name, f) {def[name] = f();};
	this['require'] = function(name) { return def[name]; }; 
}
 	/*$
 	 * @id minifieddefine
 	 */

define('minifiedUtil', function() {
	//// GLOBAL VARIABLES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
 	/*$
 	 * @id window
 	 */
	/**
	 * @const
	 */
	var _this = this;

 	/*$
 	 * @id undef
 	 */
	/** @const */
	var undef;

	/**
	 * @const
	 */
	var MONTH_SHORT_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	/**
	 * @const
	 */
	var MONTH_LONG_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	/**
	 * @const
	 */
	var MERIDIAN_NAMES = ['am', 'pm'];

	//// GLOBAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	
	/*$
	 * @id globalfuncs
	 */
	
	/** @param s {?} */
	function toString(s) { 
		return s!=null ? ''+s : '';
	}
	/**
	 * @param s {?}
	 * @param o {string}
	 */
	function isType(s,o) {
		return typeof s == o;
	}
	/** @param s {?} */
	function isString(s) {
		return isType(s, 'string');
	}
	function isFunction(f) {
		return isType(f, 'function');
	}
	function isObject(f) {
		return !!f && isType(f, 'object');
	}
	function isNode(n) {
		return !!n && n['nodeType'];
	}
	function isNumber(n) {
		return isType(n, 'number');
	}
	function isDate(n) {
		return isObject(n) && !!n['getDay'];
	}
	function isBool(n) {
		return n === true || n === false;
	}
	function isValue(n) {
		var type = typeof n;
		return type == 'object' ? !!(n && n['getDay']) : (type == 'string' || type == 'number' || isBool(n));
	}
	function isList(v) {
		return !!v && v.length != null && !isString(v) && !isNode(v) && !isFunction(v);
	}
	function selfFunc(v) {
		return v;
	}
	function replace(s, regexp, sub) {
		return toString(s).replace(regexp, sub != null ? sub : '');
	}
	function escapeRegEx(s) {
		return replace(s, /[\\\[\]\/{}()*+?.$|^-]/g, "\\$&");
	}
	function eachObj(obj, cb) {
		for (var n in obj)
			if (obj.hasOwnProperty(n))
				cb(n, obj[n]);
		return obj;
	}
	function each(list, cb) {
		if (isList(list))
			for (var i = 0; i < list.length; i++)
				cb(list[i], i);
		else
			eachObj(list, cb);
		return list;
	}
	function filterObj(obj, filterFunc) {
		var r = {};
		eachObj(obj, function(key, value) {
			if (filterFunc(key, value))
				r[key] = value;
		});
		return r;
	}
	function filter(list, filterFunc) {
		if (isList(list)) {
			var r = []; 
			each(list, function(value, index) {
				if (filterFunc(value, index))
					r.push(value);
			});
			return r;
		}
		else
			return filterObj(list, filterFunc);
	}
	function collect(list, collectFunc, addNulls) {
		var result = [];
		collectFunc = collectFunc || selfFunc;
		each(list, function(item, index) {
			if (isList(item = collectFunc(item, index))) // extreme variable reusing: item is now the callback result
				each(item, function(rr) { result.push(rr); });
			else if (addNulls || item != null)
				result.push(item);
		});
		return result;
	}
	function map(list, mapFunc) {
		var result = [];
		each(list, function(item, index) {
			result.push(mapFunc(item, index));
		});
		return result;
	}
	function reduceObj(obj, memoInit, func) {
		var memo = memoInit;
		eachObj(obj, function(key, value) {
			memo = func(memo, key, value);
		});
		return memo;
	}
	function reduce(list, memoInit, func) {
		if (isList(list)) {
			var memo = memoInit;
			each(list, function(value, index) {
				memo = func(memo, value, index);
			});
			return memo;
		}
		else
			return reduceObj(list, memoInit, func);
	}
	function startsWith(base, start) {
		if (isList(base)) {
			var s2 = UNDERSCORE(start);
			return UNDERSCORE(base).sub(0, s2.length).equals(s2);
		}
		else
			return base.substr(0, start.length) == start;
	}
	function endsWith(base, end) {
		// TODO: make public
		if (isList(base)) {
			var e2 = UNDERSCORE(end);
			return UNDERSCORE(base).sub(-e2.length).equals(e2);
		}
		else
			return base.substr(base.length - start.length) == start;
	}
	function sub(list, startIndex, endIndex) {
		if (!isList(list))
			return [];
		var l = list.length;
	    var s = startIndex < 0 ? l+startIndex : startIndex;
	    var e = endIndex == null ? l : (endIndex >= 0 ? endIndex : l+endIndex);
 		return filter(list, function(o, index) { 
 			return index >= s && index < e; 
 		});
 	};
	function toObject(list, values) {
		var obj = {};
		var gotList = isList(values);
		each(list, function(item, index) {
			obj[item] = gotList ? values[index] : values;
		});
		return obj;
	}
	function find(list, findFunc) {
		var f = isFunction(findFunc) ? findFunc : function(obj, index) { if (findFunc === obj) return index; };
		var r;
		for (var i = 0; i < list.length; i++)
			if ((r = f(list[i], i)) != null)
				return r;
	}
	function contains(list, value) {
		if (isList(list))
			for (var i = 0; i < list.length; i++)
				if (list[i] == value)
					return true;
		return false;
	}
	// equals if a and b have the same elements and all are equal
	function equals(a, b, compareFunc) {
		if (a == b)
			return true;
		else if (isList(a)) {
			if (!isList(b))
				return false;
			if (a.length != b.length)
				return false;
			return !find(a, function(val, index) {
				if (compareFunc ? !compareFunc(val, b[index]) : val != b[index])
					return true;
			});
		}
		else {
			if (isList(b) || !a || !b)
				return false;
			var aKeys = map(a, selfFunc);
			if (aKeys.length != map(b, selfFunc).length)
				return false;
			return !find(aKeys, function(key) {
				if (compareFunc ? !compareFunc(a[key], b[key]) : a[key] != b[key])
					return true;
			});
			
		}
	}
	function toRealArray(list) { 
		return list ? (list['_'] ? list['array']() : (Object.prototype.toString.call(arr) === '[object Array]') ? list : toRealArray(UNDERSCORE(list))) : []; 
	}
	
	function once(f) {
		var called = 0;
		return function() {
			if (!(called++))
				return f.apply(this, arguments);
		};
	}
	function call(f, fThisOrArgs, args) {
		return f.apply(args && fThisOrArgs, toRealArray(args || fThisOrArgs));
	}
	function bind(f, fThis, beforeArgs, afterArgs) {
		return function() {
			return call(f, fThis, collect([beforeArgs, arguments, afterArgs], selfFunc));
		};
	}
	function partial(f, beforeArgs, afterArgs) {
		return bind(f, null, beforeArgs, afterArgs);
	}
	function delay(delayMs, callback, fThisOrArgs, args) {
		setTimeout(bind(callback, fThisOrArgs, args), delayMs);
	}
	function defer(callback, fThisOrArgs, args) {
		if (typeof process != 'undefined' && process.nextTick)
			process.nextTick(bind(callback, fThisOrArgs, args));
		else
			delay(0, callback, fThisOrArgs, args);
	}
	function insertString(origString, index, len, newString) {
		return origString.substr(0, index) + newString + origString.substr(index+len);
	}
	function pad(digits, number) {
		var signed = number < 0;
		var s = (signed?-number:number).toFixed();
		while (s.length < digits)
			s = '0' + s;
		return (signed?'-':'') + s;
	}
	function formatNumber(number, afterDecimalPoint, omitZerosAfter, decimalPoint, beforeDecimalPoint, groupingSeparator, groupingSize) {
		var signed = number < 0;
		var s = (signed?-number:number).toFixed(afterDecimalPoint);
		var preDecimal = replace(s, /\..*/), postDecimal = replace(s, /.*\./);
		function group(s) {
			var len = s.length;
			if (len > groupingSize)
				return group(s.substring(0, len-groupingSize)) + groupingSeparator + s.substr(len-groupingSize);
			else
				return s;					
		}
		while (preDecimal.length < (beforeDecimalPoint||1))
			preDecimal = '0' + preDecimal;
		if (groupingSize)
			preDecimal = group(preDecimal);
		return (signed?'-':'') + preDecimal + (decimalPoint||'.') + omitZerosAfter?replace(/(\.[1-9]+)0+$|\.0+$/, postDecimal, '$1'):postDecimal;
	}
	function getTimezone(match, idx) {
		var currentOffset = (new Date()).getTimezoneOffset;
		var requestedOffset = parseInt(match[idx])*60 + parseInt(match[idx+1]);
		return requestedOffset-currentOffset;
	}
	// formats number with format string (e.g. "#.999", "#,_", "00000", "000.99", "000.000.000,99", "000,000,000.__")
	// choice syntax: <cmp><value>:<format>|<cmp><value>:<format>|... 
	// e.g. 0:no item|1:one item|>=2:# items
	// <value>="null" used to compare with nulls.
	// choice also works with strings, e.g. ERR:error|WAR:warning|FAT:fatal|ok
	function formatValue(format, dateOrNumber) {
		if (isDate(dateOrNumber)) {
			var timezoneOffsetMin, match, formatNoTZ = format;
			var map = {
				'y': 'FullYear',
				'M': ['Month', function(d) { return d + 1; }],
				'n': ['Month', function(d, values) { return (values||MONTH_SHORT_NAMES)[d]; }],
				'N': ['Month', function(d, values) { return (values||MONTH_LONG_NAMES)[d]; }],
				'd':  'Date',
				'm':  'Minutes',
				'H':  'Hours',
				'h': ['Hours', function(d) { return d % 12; }],
				'K': ['Hours', function(d) { return d+1; }],
				'k': ['Hours', function(d) { return d % 12 + 1; }],
				's':  'Seconds',
				'S':  'Milliseconds',
				'a': ['Hours', function(d, values) { return (values||MERIDIAN_NAMES)[d<12?0:1]; }],
				'w': ['Day', function(d, values) { return (values||['Sun','Mon','Tue','Wed','Thu','Fri','Sat'])[d]; }],
				'W': ['Day', function(d, values) { return (values||['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'])[d]; }],
				'z': ['TimezoneOffset', function(d) { var sign = d > 0 ? '+' : '-'; d = d > 0 ? d : -d; return sign + pad(2, Math.floor(d/60)) + pad(2, d%60); }]
			};
			if (match = /^\[([+-]\d\d)(\d\d)\](.*)/.exec(format)) {
				timezoneOffsetMin = getTimezone(match, 1);
				formatNoTZ = match[3];
			}
			var date = timezoneOffsetMin ? dateAdd(dateOrNumber, 'minutes', timezoneOffsetMin) : dateOrNumber;
			return replace(formatNoTZ, /(y+|M+|n+|N+|d+|m+|H+|h+|K+|k+|s+|S+|a+|w+|W+)(?:\[([^\]]+)\])?/g, function(s, placeholder, params) {
				var len = placeholder.length;
				var val = map[placeholder.charAt(0)];
				var d = date['get' + (isList(val)?val[0]:val)].call(date);
				
				if (isList(val)) {
					var optionArray = params ? params.split('|') : null;
					d = val[1](date, optionArray);
				}
				if (!isString(d))
					d = pad(len, d);
				return d;
			});
			
		}
		else 
			return find(format.split('|'), function(fmtPart) {
				var match, matchGrp, numFmt;
				if (match = /([<>]?)(=?)([^:]*):(.*)/.exec(fmtPart)) {
					var cmpVal1 = parseFloat(dateOrNumber), cmpVal2 = parseFloat(match[3]);
					if (isNan(cmpVal1) || isNaN(cmpVal2)) {
						cmpVal1 = toString(dateOrNumber);
						cmpVal2 = match[3];
					}
					if (match[1]) {
						if ((match[1] == '<' && match[2] && cmpVal1 > cmpVal2) ||
							(match[1] == '<' && !match[2] && cmpVal1 >= cmpVal2) ||
							(match[1] == '>' && match[2] && cmpVal1 < cmpVal2) ||
							(match[1] == '>' && !match[2] && cmpVal1 <= cmpVal2))
							return null;
					}
					else if (cmpVal1 != dateOrNumber)
						return null;
					numFmt = match[4];
				}
				else
					numFmt = fmtPart;

				//  formatNumber(number, afterDecimalPoint, omitZerosAfter, decimalPoint, beforeDecimalPoint, groupingSeparator, groupingSize)
				if (match = /(0[0.,]*)(#[,.#]*)(_*)(9*)/.exec(numFmt)) {
					var part1 = match[1] + match[2];
					var preDecimalLen = match[1].length ? replace(part1, /[.,]/).length : 1;
					var decimalPoint = replace(replace(part1, /^.*[0#]/), /[^,.]/);
					var postDecimal = match[3].length + match[4].length;
					var groupingSeparator, groupingSize;
					if (matchGrp = /([.,])[^.,]+[.,]/.exec(match[0])) {
						groupingSeparator = matchGrp[1];
						groupingSize = matchGrp[0].length - 2;
					}
					var formatted = formatNumber(dateOrNumber, postDecimal, match[3].length, decimalPoint, preDecimalLen, groupingSeparator, groupingSize);
					return insertString(format, match.index, match[0].length, formatted);
				}
				else
					return numFmt;
			});
	}
	function parseDate(format, date) {
		var mapping = {
			'y': 0, // [ctorIndex, offset]
			'M': [1,-1],
			'n': [1, MONTH_SHORT_NAMES], // ctorIndex, value array
			'N': [1, MONTH_LONG_NAMES],
			'd': 2,
			'm': 4,
			'H': 3,
			'h': 3,
			'K': [3, 1],
			'k': [3, 1],
			's':  5,
			'S':  6,
			'a': [3, MERIDIAN_NAMES]
		};
		var indexMap = {}; // contains reGroupPosition -> typeLetter or [typeLetter, value array]
		var reIndex = 1;
		var timezoneOffsetMin = 0;
		var timezoneIndex;
		var match, formatNoTZ;
			
			
		if (match = /^\[([+-]\d\d)(\d\d)\](.*)/.exec(format)) {
			timezoneOffsetMin = getTimezone(match, 1);
			formatNoTZ = match[3];
		}
		else
			formatNoTZ = format;
			
		var parser = formatNoTZ.replace(/\s+|(?:M+|m+|y+|d+|H+|h+|K+|k+|s+|S+|z+)|(?:n+|N+|a+|w+|W+)(?:{([^}]*)})?|[^dMmyhHkKsSnNa\s]+/g, function(placeholder, param) { 
			var placeholderChar = placeholder.charAt(0);
			if (/[dmyMhsSkK]/.test(placeholderChar)) {
				indexMap[reIndex++](placeholderChar);
				var plen = placeholder.length;
				return "(\\d"+(plen<2?"+":("{1,"+plen+"}"))+")";
			}
			else if (placeholderChar == 'z') {
				timezoneIndex = reIndex;
				reIndex += 2;
				return "([+-]\\d\\d)(\\d\\d)";
			}
			else if (/[nN]/.test(placeholderChar)) {
				indexMap[reIndex++]([placeholderChar, param && param.split('|')]);
				return "(\\w+)"; 
			}
			else if (/[wW]/.test(placeholderChar))
				return "\\w+";
			else if (/\s/.test(placeholderChar))
				return "\\s+"; 
			else 
				return escapeRegEx(placeholder);
		});
		
		if (!(match = parser.exec(date)))
			return null;
		
		if (timezoneIndex != null)
			timezoneOffsetMin = getTimezone(match, timezoneIndex);
			
		var ctorArgs = [0, 0, 0, timezoneOffsetMin, 0, 0,  0];
		for (var i = 1; i < reIndex; i++) {
			var indexEntry = indexMap[i];
			if (isList(indexEntry)) { // for n or N
				var mapEntry  = mapping[indexEntry[0]];
				var valList = indexEntry[1] || mapEntry[1];
				var listValue = find(valList, function(v) { return startsWith(match[i], v); });
				if (!listValue)
					return null;
				if (indexEntry[0] == 'a')
					ctorArgs[mapEntry[0]] += listValue * 12;
				else
					ctorArgs[mapEntry[0]] = listValue;
			}
			else if (indexEntry) { // for numeric values (yHmMs)
				var value = parseInt(match[i]);
				var mapEntry  = mapping[indexEntry];
				if (isList(mapEntry))
					ctorArgs[mapEntry[0]] += value + mapEntry[1];
				else
					ctorArgs[mapEntry] += value;
			}
		}
		return new Date(ctorArgs[0], ctorArgs[1], ctorArgs[2], ctorArgs[3], ctorArgs[4], ctorArgs[5], ctorArgs[6]);
	}
	function parseNumber(format, value) {
		if (arguments.length == 1)
			return parseNumber(null, value);
		var decSep = replace(replace(format, '.*[0#]([,.])[_9].*', '$1'), /[^,.]/g) || '.';
		var grpSep = decSep == ',' ? '.' : ',';
		var cleanNum = replace(replace(replace(value, escapeRegEx(grpSep)), escapeRegEx(decSep), '.'), /^.*?(-?\d)/, '$1');
		var r = parseFloat(cleanNum);
		return isNaN(r) ? null : r;
	}
	function dateClone(date) {
		return new Date(date.getTime());
	}
	function dateAdd(date, property, value) {
		if (arguments.length < 3)
			return calAdd(new Date(), date, property);
		var d = dateClone(date);
		var cProp = property.charAt(0).toUpperCase() + property.substr(1);
		d['set'+cProp].call(d, d['get'+cProp].call(d) + value);
		return d;
	}
	function dateMidnight(date) {
		var od = date || new Date();
		return new Date(od.getYear(), od.getMonth(), od.getDay());
	}
	function dateDiff(date1, date2, property) {
		var dt = date1.getTime() - date2.getTime();
		if (dt < 0)
			return -dateDiff(date2, date1, property);

		var propValues = {'milliseconds': 1, 'seconds': 1000, 'minutes': 60000, 'hours': 3600000};
		var ft = propValues[property];
		if (ft)
			return dt / ft;
		var DAY = 24*3600000;
		var calApproxValues = {'fullYear': DAY*365, 'month': DAY*30, 'date': DAY*0.999}; // minimum values, a little bit below avg values
		var minimumResult = (dt / calApproxValues[property])-2; // -2 to remove the imperfections caused by the values above
		
		var d = new Date(date2.getTime());
		dateAdd(d, property, minimumResult);
		for (var i = minimumResult; i < minimumResult*1.2+3; i++) { // try out 20% more than needed, just to be sure
			dateAdd(d, property, 1);
			if (d.getTime() > date1.getTime())
				return i;
		}
		// should never ever be reached
	}
	// reads / writes property in name.name.name syntax. Supports setter/getter functions
	function prop(path, object, value) {
		var ppos = path.indexOf('.');
		if (ppos < 0) {
			var val = object[path];
			if (value === undef)
				return isFunction(val) ? val() : val;
			else if (isFunction(val))
				return val(value);
			else
				return object[path] = value;
		}
		else {
			var name = path.substr(0, ppos);
			var val = object[name];
			return prop(path.substr(ppos), isFunction(val) ? val() : val, value);
		}
	}
	// copies all elements of from into to, merging into existing structures
	function copyTree(from, to) {
		// TODO 
	}
	
	/*$
	 * @id length

	 * @name .length
	 * @syntax length
	 * Contains the number of elements in the list.
	 * 
	 * @example
	 * <pre>
	 * var list = _(1, 2, 3);
	 * var sum = 0;
	 * for (var i = 0; i &lt; list.length; i++)
	 *    sum += list[i];
	 * </pre>
	 */
	// always defined below

	/*$
	 * @id listunderscore
	 * @name ._
	 * @syntax _
	 * Set and true if this is a Minified list.
	 */
	
	/*$
     * @id listctor
     */
    /** @constructor */
	function M(list) {
		for (var i = 0; i < list.length; i++)
			this[i] = list[i];

		this['length'] = list.length;
		
		
		this['_'] = true;

	    /*$
	     * @stop
	     */
	}
	
	/*$
	 * @id underscore
	 * @name _()
	 * @configurable default
	 */
	function UNDERSCORE() {
		return new M(collect(arguments, selfFunc, true));
	}
	
	//// LIST FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function listBindWrapped(func) {
		return function(arg1, arg2) {
			var r = func(this, arg1, arg2);
			return r['_'] ? r : new M(r);
		};
	}
	function listBind(func) {
		return function(arg1, arg2) {
			return func(this, arg1, arg2);
		};
	}
	
	
	each({
	'each': listBind(each),
	
	'filter': listBindWrapped(filter),
	
	'collect': listBindWrapped(collect),
	
	'map': listBindWrapped(collect),
	
	'reduce': listBind(reduce),

	'toObject': listBind(toObject),
	
	'equals': listBind(equals),

	'sub': listBindWrapped(sub),
 	
 	'find': listBind(find),
 	
 	'startsWith': listBind(startsWith),
 	'endsWith': listBind(endsWith),
 	
 	'contains': listBind(contains),
	
	'array': function() {
		return map(this, selfFunc);
	},
	
	'join': function(separator) {
		return map(this, selfFunc).join(separator);
	},
	
	'sort': function(func) {
		return new M(map(this, selfFunc).sort(func));
	},
	
	'uniq': function() {
		var found = {};
		return this['filter'](function(item) {
			if (found[item])
				return false;
			else {
				found[item] = 1;
				return true;
			}
		});
	},
	
	'intersection': function(otherList) {
		var keys = toObject(otherList, 1);
		return this['filter'](function(item) {
			var r = keys[item];
			keys[item] = 0;
			return r;
		});
	},

	// a.onlyLeft(b) returns values that are only in a 
	'onlyLeft': function(rightList) {
		var keys = toObject(rightList, 1);
		return this['filter'](function(item) {
			return !keys[item];
		});
	},
	
	'tap': function(func) {
		func(this);
		return this;
	},
	
	'toString': function() {
		return '[' + this['map'](function(v) { if (isString(v)) return "'" + replace(v, /'/, "\\'") + "'"; else return v;})['join'](', ') + ']';
	}
	
	

	
 	/*$
 	 * @stop
 	 */
	}, function(n, v) {M.prototype[n]=v;});
     

 	//// UNDERSCORE FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/*$
	 * @id underscorefuncdef
	 */
	function funcListBind(func) {
		return function(arg1, arg2, arg3) {
			var r = func(arg1, arg2, arg3);
			return r['_']||!isList(r) ? r : new M(r);
		};
	}
	each({
		'bind': bind,
		'partial': partial,
		'once': once,
		'selfFunc': selfFunc,
		'each': each,
		'eachObj': eachObj,
		'toObject': toObject,
		'filter': funcListBind(filter),
		'filterObj': filterObj,
		'collect': funcListBind(collect),
		'map': funcListBind(map),
		'reduce': reduce,
		'reduceObj': reduceObj,
		'find': find,
		'contains': contains,
		'sub': funcListBind(sub),
	 	'startsWith': startsWith,
	 	'endsWith': endsWith,
		'equals': equals,
		'call': call,

		'toString': toString,
		'isList': isList,
		'isFunction': isFunction,
		'isObject': isObject,
		'isNumber': isNumber,
		'isBool': isBool,
		'isDate': isDate,
		'isValue': isValue,
		'isString': isString,
		'toString': toString,

		'prop': prop,
		'escapeRegEx': escapeRegEx,
		
		'defer': defer,
		'delay': delay,
		
		'dateAdd': dateAdd,
		'dateClone': dateClone,
		'dateDiff': dateDiff,
		'dateMidnight': dateMidnight,
		
		'formatNumber' : formatNumber,
		'pad' : pad,
		'formatValue': formatValue,
		
		'parseDate': parseDate,
		'parseNumber': parseNumber,

		// returns all keys of a map as list
		'keys': function(obj) {
			return new M(map(obj, function(value, key) { return key; }));
		},
		
		// returns all values of a map as list
		'values': function(obj) {
			return new M(map(obj, selfFunc));
		},
		
		// tests whether all values of object b are equal in a. Keys not in b are ignored.
		'equalsRight': function(a, b, compareFunc) {
			var eq = true;
			each(a, function(key, value) {
				if (compareFunc ? !compareFunc(value, b[key]) : value != b[key])
					eq = false;
			});
			return eq;
		},
		
		'copyObj': function(to, from) {
			each(from, function(name, value) {
				to[name] = value;
			});
			return to;
		},
		
		'defaults': function(to, from) {
			each(from, function(name, value) {
				if (to[name] == null)
					to[name] = value;
			});
			return to;
		},
		
		'trim': function(s) {
			return replace(s, /^\s+|\s+$/g);
		},
		
		'coal': function() {
			var args = arguments;
			for (var i = 0; i < args.length; i++) 
				if (args[i] != null)
					return args[i];
			return null;
		},
		
		// takes vararg of other promises to join
		'promise': function promise() {
			var state; // undefined/null = pending, true = fulfilled, false = rejected
		    var values = [];     // an array of values as arguments for the then() handlers
		    var deferred = [];   // this function calls the functions supplied by then()

		    // extra vals to be used if ctor called with varargs
			var joinedPromises = arguments;
			var numCompleted = 0; // number of completed promises
			var values = []; // array containing the result arrays of all joined promises
		    
		    function set(newState, newValues) {
		  		if (state == null) {
		    		state = newState;
		    		values = hhToList(newValues);
		    		defer(function() {
						each(deferred, function(f) {f();});
					});
				}		
		    }

		    // use promise varargs
			each(joinedPromises, function(promise, index) {
				promise.then(function(v) {
					values[index] = v;
					if (++numCompleted == joinedPromises.length)
						set(true, [values]);
				}, function(e) {
					values[index] = v;
					set(false, [index, values]);
				});
			});

		    
		    set['then'] = function then(onFulfilled, onRejected) {
				var newPromise = promise();
				var callCallbacks = function() {
		    		try {
		    			var f = (state ? onFulfilled : onRejected);
		    			if (isFunction(f)) {
			   				var r = call(f, values);
			   				if (r && isFunction(r['then']))
			   					r['then'](function(value){newPromise(true,[value]);}, function(value){newPromise(false,[value]);});
			   				else
			   					newPromise(true, [r]);
			   			}
			   			else
			   				newPromise(state, values);
					}
					catch (e) {
						newPromise(false, [e]);
					}
				};
				if (state != null)
					defer(callCallbacks);
				else
					deferred.push(callCallbacks);    		
				return newPromise;
			};

		   	set['always'] = function(func) { return then(func, func); };
		   	set['error'] = function(func) { return then(0, func); };

			// Takes a list of promises and registers with them by calling their then(). If all given promises succeed, this promise succeeds
		   	// and their values are given to the fulfillment handler as array in the same order the promised were given to join().
			// If one promise fails, this promise fails. The rejected handler will be called with the index of the failed promise as 
		   	// first argument and an array containing all results as the second.
			// The array has one entry per promise, containing its success value, rejection value or undefined if not completed.
		   	return set;
		},
		
		'format': function(format, object) {
			return replace(format, /{([\w\d_]+)(,([^}]*))?}/g, function(match, path, subFormatPart, subFormat) {
				var value = path=='' ? object : prop(path, object);
				return subFormatPart ? formatValue(subFormat, value) : toString(value);
					
		    });
		}

		
	/*$
	 * @id underscorefuncdefend
	 */
	}, function(n, v) {UNDERSCORE[n]=v;});

	//// GLOBAL INITIALIZATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
	/*$
	 @stop
	 */
	return {_: UNDERSCORE};
});

/*$
 * @stop 
 */



