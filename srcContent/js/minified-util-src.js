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
	var MONTH_LONG_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var MONTH_SHORT_NAMES = map(MONTH_LONG_NAMES, function(v) {return v.substr(0,3);}); // ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	
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
	function escapeRegExp(s) {
		return replace(s, /[\\\[\]\/{}()*+?.$|^-]/g, "\\$&");
	}
	function eachObj(obj, cb) {
		for (var n in obj)
			if (obj.hasOwnProperty(n))
				cb(n, obj[n]);
		return obj;
	}
	function each(list, cb) {
		if (list)
			for (var i = 0; i < list.length; i++)
				cb(list[i], i);
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
		var r = []; 
		each(list, function(value, index) {
			if (filterFunc(value, index))
				r.push(value);
		});
		return r;
	}
	function collector(iterator, obj, collectFunc) {
		var result = [];
		iterator(obj, function (a, b) {
			if (isList(item = collectFunc(a, b))) // extreme variable reusing: a is now the callback result
				each(a, function(rr) { result.push(rr); });
			else if (a != null)
				result.push(a);
		});
		return result;
	}
	function collectObj(obj, collectFunc) {
		return collector(eachObj, obj, collectFunc);
	}
	function collect(list, collectFunc) {
		return collector(each, list, collectFunc);
	}
	function keyCount(obj) {
		var c = 0;
		eachObj(obj, function(key) { c++; });
		return c;
	}
	function keys(obj) {
		var list = [];
		eachObj(obj, function(key) { list.push(key); });
		return new M(list);
	}
	function values(obj) {
		var list = [];
		eachObj(obj, function(key, value) { list.push(value); });
		return new M(list);
	}
	function mapObj(list, mapFunc) {
		var result = {};
		eachObj(list, function(key, value) {
			result[key] = mapFunc(key, value);
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
			var s2 = UNDERSCORE(start); // convert start as we don't know whether it is a list yet
			return equals(UNDERSCORE(base).sub(0, s2.length), s2);
		}
		else
			return start != null && base.substr(0, start.length) == start;
	}
	function endsWith(base, end) {
		if (isList(base)) {
			var e2 = UNDERSCORE(end);
			return UNDERSCORE(base).sub(-e2.length).equals(e2) || !e2.length;
		}
		else
			return end != null && base.substr(base.length - end.length) == end;
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
	function equals(a, b) {
		if (a == b)
			return true;
		else if (a == null || b == null)
			return false;
		else if (isValue(a) || isValue(b))
			return isDate(a) && isDate(b) && a.getTime()==b.getTime();
		else if (isList(a)) {
			if (!isList(b))
				return false;
			else if (a.length != b.length)
				return false;
			else
				return !find(a, function(val, index) {
					if (!equals(val, b[index]))
						return true;
				});
		}
		else {
			if (isList(b))
				return false;
			var aKeys = keys(a);
			if (aKeys.length != keyCount(b))
				return false;
			else
				return !find(aKeys, function(key) {
					if (!equals(a[key],b[key]))
						return true;
				});
		}
	}
	function toRealArray(list) { 
		return list ? (list['_'] ? list['array']() : (Object.prototype.toString.call(list) === '[object Array]') ? list : toRealArray(UNDERSCORE(list))) : []; 
	}
	
	function once(f) {
		var called = 0;
		return function() {
			if (!(called++))
				return call(f, this, arguments);
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
		var match = /(\d+)(\.(.*))?/.exec((signed?-number:number).toFixed(afterDecimalPoint));
		var preDecimal = match[1], postDecimal = (decimalPoint||'.') + match[3];
		function group(s) {
			var len = s.length;
			if (len > groupingSize)
				return group(s.substring(0, len-groupingSize)) + (groupingSeparator||',') + s.substr(len-groupingSize);
			else
				return s;					
		}
		while (preDecimal.length < (beforeDecimalPoint||1))
			preDecimal = '0' + preDecimal;
		if (groupingSize)
			preDecimal = group(preDecimal);
		return (signed?'-':'') + preDecimal + 
			(afterDecimalPoint ? ((omitZerosAfter?replace(replace(postDecimal, /0+$/), /\.$/):postDecimal)) : '');
	}
	function getTimezone(match, idx, refDate) {
		var currentOffset = refDate.getTimezoneOffset();
		var requestedOffset = parseInt(match[idx])*60 + parseInt(match[idx+1]);
		return requestedOffset + currentOffset;
	}
	// formats number with format string (e.g. "#.999", "#,_", "00000", "000.99", "000.000.000,99", "000,000,000.__")
	// choice syntax: <cmp><value>:<format>|<cmp><value>:<format>|... 
	// e.g. 0:no item|1:one item|>=2:# items
	// <value>="null" used to compare with nulls.
	// choice also works with strings or bools, e.g. ERR:error|WAR:warning|FAT:fatal|ok
	function formatValue(format, value) {
		if (isDate(value)) {
			var timezone, match;
			var formatNoTZ = format;
			var date = value;
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
				'z': ['TimezoneOffset', function(d) {
					if (timezone)
						return timezone;
					var sign = d < 0 ? '+' : '-'; 
					var off = d > 0 ? d : -d; 
					return sign + pad(2, Math.floor(off/60)) + pad(2, off%60); 
				}]
			};
			if (match = /^\[(([+-]\d\d)(\d\d))\]\s*(.*)/.exec(format)) {
				timezone = match[1];
				date = dateAdd(value, 'minutes', getTimezone(match, 2, value));
				formatNoTZ = match[4];
			}
			
			return replace(formatNoTZ, /(y+|M+|n+|N+|d+|m+|H+|h+|K+|k+|s+|S+|a+|w+|W+|z+)(?:\[([^\]]+)\])?/g, function(s, placeholder, params) {
				var len = placeholder.length;
				var val = map[placeholder.charAt(0)];
				var d = date['get' + (isList(val)?val[0]:val)].call(date);
				
				if (isList(val)) {
					var optionArray = params ? params.split(',') : null;
					d = val[1](d, optionArray);
				}
				if (d != null && !isString(d))
					d = pad(len, d);
				return d;
			});
			
		}
		else 
			return find(format.split(/\s*\|\s*/), function(fmtPart) {
				var match, matchGrp, numFmtOrResult;
				if (match = /^([<>]?)(=?)([^:]*?)\s*:\s*(.*)$/.exec(fmtPart)) {
					var cmpVal1 = value, cmpVal2 = parseFloat(match[3]);
					if (isNaN(cmpVal2) || !isNumber(cmpVal1)) {
						cmpVal1 = (cmpVal1==null) ? "null" : toString(cmpVal1); // not ""+value, because undefined is treated as null here
						cmpVal2 = match[3];
					}
					if (match[1]) {
						if ((!match[2] && cmpVal1 == cmpVal2 ) ||
						    (match[1] == '<'  && cmpVal1 > cmpVal2)  ||
						    (match[1] == '>'  && cmpVal1 < cmpVal2))
							return null;
					}
					else if (cmpVal1 != cmpVal2)
						return null;
					numFmtOrResult = match[4];
				}
				else
					numFmtOrResult = fmtPart;

				//  formatNumber(number, afterDecimalPoint, omitZerosAfter, decimalPoint, beforeDecimalPoint, groupingSeparator, groupingSize)
				if (isNumber(value) && (match = /(?:(0[0.,]*)|(#[#.,]*))(_*)(9*)/.exec(numFmtOrResult))) {
					var part1 = toString(match[1]) + toString(match[2]);
					var preDecimalLen = toString(match[1]).length ? replace(part1, /[.,]/g).length : 1;
					var decimalPoint = replace(replace(part1, /^.*[0#]/), /[^,.]/g);
					var postDecimal = toString(match[3]).length + toString(match[4]).length;
					var groupingSeparator, groupingSize;
					if (matchGrp = /([.,])[^.,]+[.,]/.exec(match[0])) {
						groupingSeparator = matchGrp[1];
						groupingSize = matchGrp[0].length - 2;
					}
					var formatted = formatNumber(value, postDecimal, toString(match[3]).length, decimalPoint, preDecimalLen, groupingSeparator, groupingSize);
					return insertString(numFmtOrResult, match.index, toString(match[0]).length, formatted);
				}
				else
					return numFmtOrResult;
			});
	}
	function parseDate(format, date) {
		var mapping = {
			'y': 0,      // placeholder -> ctorIndex
			'M': [1,1], // placeholder -> [ctorIndex, offset|value array]
			'n': [1, MONTH_SHORT_NAMES], 
			'N': [1, MONTH_LONG_NAMES],
			'd': 2,
			'm': 4,
			'H': 3,
			'h': 3,
			'K': [3,1],
			'k': [3,1],
			's':  5,
			'S':  6,
			'a': [3, MERIDIAN_NAMES]
		};
		var indexMap = {}; // contains reGroupPosition -> typeLetter or [typeLetter, value array]
		var reIndex = 1;
		var timezoneOffsetMin = 0;
		var timezoneIndex;
		var match, formatNoTZ;
			
		if (match = /^\[([+-]\d\d)(\d\d)\]\s*(.*)/.exec(format)) {
			timezoneOffsetMin = getTimezone(match, 1, now());
			formatNoTZ = match[3];
		}
		else
			formatNoTZ = format;
			var parser = new RegExp(formatNoTZ.replace(/(m+|y+|d+|h+|k+|s+|z+|\s+|n+|a+|w+)(?:\[([^\]]*)\])?/ig, function(wholeMatch, placeholder, param) {
			var placeholderChar = placeholder.charAt(0);

			if (/[dmhkyhs]/i.test(placeholderChar)) {
				indexMap[reIndex++] = placeholderChar;
				var plen = placeholder.length;
				return "(\\d"+(plen<2?"+":("{1,"+plen+"}"))+")";
			}
			else if (placeholderChar == 'z') {
				timezoneIndex = reIndex;
				reIndex += 2;
				return "([+-]\\d\\d)(\\d\\d)";
			}
			else if (/[Nna]/.test(placeholderChar)) {
				indexMap[reIndex++] = [placeholderChar, param && param.split('|')];
				return "(\\w+)"; 
			}
			else if (/w/i.test(placeholderChar))
				return "\\w+";
			else if (/\s/.test(placeholderChar))
				return "\\s+"; 
			else 
				return escapeRegExp(placeholder);
		}));
		
		if (!(match = parser.exec(date)))
			return null;
		
		if (timezoneIndex != null)
			timezoneOffsetMin = getTimezone(match, timezoneIndex, now());
			
		var ctorArgs = [0, 0, 0, 0, -timezoneOffsetMin, 0,  0];
		for (var i = 1; i < reIndex; i++) {
			var matchVal = match[i];
			var indexEntry = indexMap[i];
			if (isList(indexEntry)) { // for a, n or N
				var placeholderChar = indexEntry[0];
				var mapEntry  = mapping[placeholderChar];
				var ctorIndex = mapEntry[0];
				var valList = indexEntry[1] || mapEntry[1];
				var listValue = find(valList, function(v, index) { return startsWith(matchVal, v) ? index : null; });
				if (listValue == null)
					return null;
				if (placeholderChar == 'a')
					ctorArgs[ctorIndex] += listValue * 12;
				else
					ctorArgs[ctorIndex] = listValue;
			}
			else if (indexEntry) { // for numeric values (yHmMs)
				var value = parseInt(matchVal);
				var mapEntry  = mapping[indexEntry];
				if (isList(mapEntry))
					ctorArgs[mapEntry[0]] += value - mapEntry[1];
				else
					ctorArgs[mapEntry] += value;
			}
		}
		return new Date(ctorArgs[0], ctorArgs[1], ctorArgs[2], ctorArgs[3], ctorArgs[4], ctorArgs[5], ctorArgs[6]);
	}
	function parseNumber(format, value) {
		if (arguments.length == 1)
			return parseNumber(null, format);
		var match, decSep = (match = /[0#]([.,])[_9]/.exec(format)) ? match[1] : ((match = /^[.,]$/.exec(format)) ? match[0]: '.');
		var r = parseFloat(replace(replace(replace(value, decSep == ',' ? /\./g : /,/g), decSep, '.'), /^[^\d-]*(-?\d)/, '$1'));
		return isNaN(r) ? null : r;
	}
	function now() {
		return new Date();
	}
	function dateClone(date) {
		return new Date(date.getTime());
	}
	function dateAddInline(d, cProp, value) {
		d['set'+cProp].call(d, d['get'+cProp].call(d) + value);
	}
	function dateAdd(date, property, value) {
		if (arguments.length < 3)
			return dateAdd(now(), date, property);
		var d = dateClone(date);
		var cProp = property.charAt(0).toUpperCase() + property.substr(1);
		dateAddInline(d, cProp, value);
		return d;
	}
	function dateMidnight(date) {
		var od = date || now();
		return new Date(od.getFullYear(), od.getMonth(), od.getDate());
	}
	function dateDiff(property, date1, date2, console) {
		var d1t = date1.getTime();
		var d2t = date2.getTime();
		var dt = d2t - d1t;
		if (dt < 0)
			return -dateDiff(property, date2, date1);

		var propValues = {'milliseconds': 1, 'seconds': 1000, 'minutes': 60000, 'hours': 3600000};
		var ft = propValues[property];
		if (ft)
			return dt / ft;

		var DAY = 8.64e7;
		var cProp = property.charAt(0).toUpperCase() + property.substr(1);
		var calApproxValues = {'fullYear': DAY*365, 'month': DAY*365/12, 'date': DAY}; // minimum values, a little bit below avg values
		var minimumResult = Math.floor((dt / calApproxValues[property])-2); // -2 to remove the imperfections caused by the values above
		
		var d = new Date(d1t);
		dateAddInline(d, cProp, minimumResult);
		for (var i = minimumResult; i < minimumResult*1.2+4; i++) { // try out 20% more than needed, just to be sure
			dateAddInline(d, cProp, 1);
			if (d.getTime() > d2t)
				return i;
		}
		// should never ever be reached
	}
	// reads / writes property in name.name.name syntax. Supports setter/getter functions
	function prop(path, object, value) {
		var match = /([^.]+)\.(.*)/.exec(path);
		if (match) {
			var name = match[1];
			var val = object[name];
			return prop(match[2], isFunction(val) ? val() : val, value);
		}
		else {
			var val = object[path];
			if (value === undef)
				return isFunction(val) ? val() : val;
			else if (isFunction(val))
				return val(value);
			else
				return object[path] = value;
		}
	}
	// copies all elements of from into to, merging into existing structures.
	// to is optional. Writes result in to if it is a non-value object.
	// Returns the copy, which may be to if it was an object
	function copyTree(from, to) {
		if (isValue(from))
			return isDate(from) ? dateClone(from) : from;

		var toIsFunc = isFunction(to);
		var oldTo = toIsFunc ? to() : to;
		var result;
		if (!from || equals(from, oldTo))
			return from;
		else if (isList(from)) {
			result = map(from, function(v, idx) { 
				return oldTo && equals(oldTo[idx], v) ? oldTo[idx] : copyTree(v);
			});
			if ((oldTo ? oldTo : from)['_'])
				result = UNDERSCORE(result);
		}
		else {
			var target = oldTo || {};
			each(target, function(key) {
				if (from[key] == null || (isFunction(from[key]) && from[key]() == null)) {
					if (isFunction(target[key]))
						target[key](null);
					else
						delete target[key];
				}
			});
			each(from, function(key, value) {
				var isFunc = isFunction(target[key]);
				var oldValue = isFunc ? target[key]() : target[key];
				if (!equals(value, oldValue)) {
					if (isFunc)
						target[key](copyTree(value));
					else
						target[key] = copyTree(value);
				}
			});
		}
			
		if (toIsFunc)
			to(result);
		return result;
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
	function M(list, assimilateSublists) {
		var self = this, idx = 0;
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			if (assimilateSublists && isList(item))
				for (var j = 0; j < item.length; j++)
					self[idx++] = item[j];
			else 
				self[idx++] = item;
		};

		self['length'] = idx;
		self['_'] = true;
	}
	
	/*$
	 * @id underscore
	 * @name _()
	 * @configurable default
	 */
	function UNDERSCORE() {
		return new M(arguments, true);
	}
	
	//// LIST FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function listBindArray(func) {
		return function(arg1, arg2) {
			return new M(func(this, arg1, arg2));
		};
	}
	function listBind(func) {
		return function(arg1, arg2) {
			return func(this, arg1, arg2);
		};
	}
	
	
	eachObj({
	'each': listBind(each),
	
	'filter': listBindArray(filter),
	
	'collect': listBindArray(collect),
	
	'map': listBindArray(map),
	
	'reduce': listBind(reduce),

	'toObject': listBind(toObject),
	
	'equals': listBind(equals),

	'sub': listBindArray(sub),
 	
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
	function funcArrayBind(func) {
		return function(arg1, arg2, arg3) {
			return new M(func(arg1, arg2, arg3));
		};
	}
	eachObj({
		'bind': bind,
		'partial': partial,
		'once': once,
		'selfFunc': selfFunc,
		'each': each,
		'eachObj': eachObj,
		'toObject': toObject,
		'filter': funcArrayBind(filter),
		'filterObj': filterObj,
		'collect': funcArrayBind(collect),
		'collectObj': funcArrayBind(collectObj),
		'map': funcArrayBind(map),
		'mapObj': mapObj,
		'reduce': reduce,
		'reduceObj': reduceObj,
		'find': find,
		'contains': contains,
		'sub': funcListBind(sub),
	 	'startsWith': startsWith,
	 	'endsWith': endsWith,
		'equals': equals,

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
		'escapeRegExp': escapeRegExp,
		
		'defer': defer,
		'delay': delay,
		
		'dateClone': dateClone,
		'dateAdd': dateAdd,
		'dateDiff': dateDiff,
		'dateMidnight': dateMidnight,
		
		'formatNumber' : formatNumber,
		'pad' : pad,
		'formatValue': formatValue,
		
		'parseDate': parseDate,
		'parseNumber': parseNumber,

		'keys': keys,
		'values': values,
		
		// tests whether all values of object b exist in a and are equal. Keys not in b are ignored.
		'equalsRight': function(left, right) {
			var eq = true;
			eachObj(right, function(key, value) {
				eq = eq && value == left[key];
			});
			return eq;
		},
		
		'copyObj': function(from, to) {
			eachObj(from, function(name, value) {
				to[name] = value;
			});
			return to;
		},
		
		'defaults': function(from, to) {
			eachObj(from, function(name, value) {
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
		
		// takes vararg of other promises to assimilate
		// if one promise is given, this promise assimilates the given promise as-is, and just forwards fulfillment and rejection with the original values.
		//
		// if more than one promise given, it will assimilate all of them with slightly different rules:
		//    - the new promise is fulfilled if all assimilated promises have been fulfilled. The fulfillment values
		//      of all assimilated promises are given to the handler as arguments. Note that the fulfillment values themselves are always arrays, as a promise can have several fulfillment values in
		//      the Minified implementation.
		//    - when one of the promises is rejected, the new promise is rejected immediately. The rejection handler gets the promises rejection value (first argument is it got several)
		//      as first argument, an array of the result values of all promises as a second (that means one array of arguments for each promise), and the index of the failed promise as third
		'promise': function promise() {
			var state; // undefined/null = pending, true = fulfilled, false = rejected
			var values = [];     // an array of arguments arrays for the then() handlers
			var deferred = [];   // this function calls the functions supplied by then()

			var assimilatedPromises = arguments;
			var assimilatedNum = assimilatedPromises.length;
			var numCompleted = 0; // number of completed, assimilated promises
			var values = []; // array containing the result arrays of all assimilated promises
		    
			function set(newState, newValues) {
				if (state == null) {
					state = newState;
					values = isList(newValues) ? newValues : [newValues];
					defer(function() {
						each(deferred, function(f) {f();});
					});
				}		
			}

			// use promise varargs
			each(assimilatedPromises, function assimilate(promise, index) {
				try {
					promise['then'](function resolvePromise(v) {
						if (v && isFunction(v['then'])) {
							assimilate(v['then'], index);
						}
						else {
							values[index] = map(arguments, selfFunc);
							if (++numCompleted == assimilatedNum)
								set(true, assimilatedNum < 2 ? values[index] : values);
						}
					}, 
					function rejectPromise(e) {
						values[index] = map(arguments, selfFunc);
						set(false, assimilatedNum < 2 ? values[index] : [values[index][0], values, index]);
					});
				}
				catch (e) {
					set(false, [e, values, index]);
				}
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



