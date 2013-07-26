/*
 * Minified-util.js - Collections, formatting and other helpers.
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 * To the extent possible under law, Tim Jansen has waived all copyright and related or neighboring rights to Minified.
 * Please see http://creativecommons.org/publicdomain/zero/1.0/.
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
// @output_file_name minified-util.js
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

define('minified', function() { // MINIUTIL is needed by autotest.html
	//// GLOBAL VARIABLES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 	/*$
 	 * @id undef
 	 */
	/** @const */
	var undef;

	///#definesnippet utilVars
	/**
	 * @const
	 */
	function val3(v) {return v.substr(0,3);}
	var MONTH_LONG_NAMES = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(/,/);
	var MONTH_SHORT_NAMES = map(MONTH_LONG_NAMES, val3); // ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var WEEK_LONG_NAMES = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(/,/);
	var WEEK_SHORT_NAMES = map(WEEK_LONG_NAMES, val3); 
	
	/**
	 * @const
	 */
	var MERIDIAN_NAMES = ['am', 'pm'];

	/**
	 * @const
	 */
	var JAVASCRIPT_ESCAPES = {'"': '\\"', "'": "\\'", '\n': '\\n', '\t': '\\t', '\r': '\\r'};
	
	var templateCache={};

	///#endsnippet utilVars
	
	
	
	//// GLOBAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	///#definesnippet commonFuncs
	
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
	function toList(l) {
		return isList(l) ? l : (l != null ? [l] : []);
	}

	function nonOp(v) {
		return v;
	}
	function plusOne(d) { 
		return d+1; 
	}
	function replace(s, regexp, sub) {
		return toString(s).replace(regexp, sub != null ? sub : '');
	}
	function escapeRegExp(s) {
		return replace(s, /[\\\[\]\/{}()*+?.$|^-]/g, "\\$&");
	}
	function trim(s) {
		return replace(s, /^\s+|\s+$/g);
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
	function filterObj(obj, filterFuncOrObject) {
		var r = {};
		var f = isFunction(filterFuncOrObject) ? filterFuncOrObject : function(key) { return filterFuncOrObject != key; };
			eachObj(obj, function(key, value) {
			if (f(key, value))
				r[key] = value;
		});
		return r;
	}
	function filter(list, filterFuncOrObject) {
		var r = []; 
		var f = isFunction(filterFuncOrObject) ? filterFuncOrObject : function(value) { return filterFuncOrObject != value; };
		each(list, function(value, index) {
			if (f(value, index))
				r.push(value);
		});
		return r;
	}
	function collector(iterator, obj, collectFunc) {
		var result = [];
		iterator(obj, function (a, b) {
			if (isList(a = collectFunc(a, b))) // extreme variable reusing: a is now the callback result
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
		return list;
	}
	function values(obj, keys) {
		var list = [];
		if (keys)
			each(keys, function(value) { list.push(obj[value]); });
		else
			eachObj(obj, function(key, value) { list.push(value); });
		return list;
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
	function startsWith(base, start) {
		if (isList(base)) {
			var s2 = _(start); // convert start as we don't know whether it is a list yet
			return equals(_(base).sub(0, s2.length), s2);
		}
		else
			return start != null && base.substr(0, start.length) == start;
	}
	function endsWith(base, end) {
		if (isList(base)) {
			var e2 = _(end);
			return _(base).sub(-e2.length).equals(e2) || !e2.length;
		}
		else
			return end != null && base.substr(base.length - end.length) == end;
	}
	function reverse(list) {
		var i = list.length;
		return map(list, function() { return list[--i]; });
	}
	function sub(list, startIndex, endIndex) {
		if (!list)
			return [];
		var l = list.length;
	    var s = startIndex < 0 ? l+startIndex : startIndex;
	    var e = endIndex == null ? l : (endIndex >= 0 ? endIndex : l+endIndex);
 		return filter(list, function(o, index) { 
 			return index >= s && index < e; 
 		});
 	}
	function toObject(list, value) {
		var obj = {};
		each(list, function(item, index) {
			obj[item] = value;
		});
		return obj;
	}
	function copyObj(from, to, dontOverwrite) {
		eachObj(from, function(name, value) {
			if (to[name] == null || !dontOverwrite)
				to[name] = value;
		});
		return to;
	}
	function find(list, findFunc) {
		var f = isFunction(findFunc) ? findFunc : function(obj, index) { if (findFunc === obj) return index; };
		var r;
		for (var i = 0; i < list.length; i++)
			if ((r = f(list[i], i)) != null)
				return r;
	}
	function array(list) {
		return map(list, nonOp);
	}
	function unite() {
		var self = this;
		return function() {
			return new M(callList(self, arguments));
		};
	}
	function uniq(list) {
		var found = {};
		return filter(list, function(item) {
			if (found[item])
				return false;
			else {
				found[item] = 1;
				return true;
			}
		});
	}
	function intersection(list, otherList) {
		var keys = toObject(otherList, 1);
		return filter(list, function(item) {
			var r = keys[item];
			keys[item] = 0;
			return r;
		});
	}
	function coal() {
		return find(arguments, nonOp);
	}
	function contains(list, value) {
		for (var i = 0; i < list.length; i++)
			if (list[i] == value)
				return true;
		return false;
	}
	// equals if a and b have the same elements and all are equal. Supports getters.
	function equals(x, y) {
		var a = isFunction(x) ? x() : x;
		var b = isFunction(y) ? y() : y;
		if (a == b)
			return true;
		else if (a == null || b == null)
			return false;
		else if (isValue(a) || isValue(b))
			return isDate(a) && isDate(b) && a.getTime()==b.getTime();
		else if (isList(a)) {
			if (a.length != b.length)
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
	
	function once(f) {
		var called = 0;
		return function() {
			if (!(called++))
				return call(f, this, arguments);
		};
	}
	function call(f, fThisOrArgs, args) {
		return f.apply(args && fThisOrArgs, map(args || fThisOrArgs, nonOp));
	}
	function callList(list, fThisOrArgs, args) {
		return map(list, function(f) { if (isFunction(f)) return call(f, fThisOrArgs, args); else return undef;});
	}
	function bind(f, fThis, beforeArgs, afterArgs) {
		return function() {
			return call(f, fThis, collect([beforeArgs, arguments, afterArgs], nonOp));
		};
	}
	function partial(f, beforeArgs, afterArgs) {
		return bind(f, null, beforeArgs, afterArgs);
	}
	function insertString(origString, index, len, newString) {
		return origString.substr(0, index) + newString + origString.substr(index+len);
	}
	function pad(digits, number) {
		return formatNumber(number, 0, 0, 0, digits);
	}
	function formatNumber(number, afterDecimalPoint, omitZerosAfter, decimalPoint, beforeDecimalPoint, groupingSeparator, groupingSize) {
		var signed = number < 0;
		var match = /(\d+)(\.(.*))?/.exec((signed?-number:number).toFixed(afterDecimalPoint));
		var preDecimal = match[1], postDecimal = (decimalPoint||'.') + match[3];
		function group(s) {
			var len = s.length;
			if (len > groupingSize)
				return group(s.substr(0, len-groupingSize)) + (groupingSeparator||',') + s.substr(len-groupingSize);
			else
				return s;					
		}
		while (preDecimal.length < (beforeDecimalPoint||1))
			preDecimal = '0' + preDecimal;
		if (groupingSize)
			preDecimal = group(preDecimal);
		return (signed?'-':'') + preDecimal + (afterDecimalPoint ? ((omitZerosAfter?replace(postDecimal, /[.,]?0+$/):postDecimal)) : '');
	}
	function getTimezone(match, idx, refDate) {
		if (idx == null || !match)
			return 0;
		return parseInt(match[idx])*60 + parseInt(match[idx+1]) + refDate.getTimezoneOffset();
	}
	// formats number with format string (e.g. "#.999", "#,_", "00000", "000.99", "000.000.000,99", "000,000,000.__")
	// choice syntax: <cmp><value>:<format>|<cmp><value>:<format>|... 
	// e.g. 0:no item|1:one item|>=2:# items
	// <value>="null" used to compare with nulls.
	// choice also works with strings or bools, e.g. ERR:error|WAR:warning|FAT:fatal|ok
	function formatValue(format, value) {
		format = replace(format, /^\?/);
		if (isDate(value)) {
			var timezone, match;
			var formatNoTZ = format;
			var date = value;
			var map = {
				'y': ['FullYear', nonOp],
				'M': ['Month', plusOne],
				'n': ['Month', MONTH_SHORT_NAMES],
				'N': ['Month', MONTH_LONG_NAMES],
				'd': ['Date', nonOp],
				'm': ['Minutes', nonOp],
				'H': ['Hours', nonOp],
				'h': ['Hours', function(d) { return (d % 12) || 12; }],
				'K': ['Hours', plusOne],
				'k': ['Hours', function(d) { return d % 12 + 1; }],
				's': ['Seconds', nonOp],
				'S': ['Milliseconds', nonOp],
				'a': ['Hours', function(d, values) { return (values||MERIDIAN_NAMES)[d<12?0:1]; }],
				'w': ['Day', WEEK_SHORT_NAMES],
				'W': ['Day', WEEK_LONG_NAMES],
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
			
			return replace(formatNoTZ, /(\w)(\1*)(?:\[([^\]]+)\])?/g, function(s, placeholderChar, placeholderDigits, params) {
				var val = map[placeholderChar];
				if (val) {
					var d = date['get' + (isList(val)?val[0]:val)].call(date);
					
					var optionArray = params && params.split(',');
					if (isList(val[1])) 
						d = (optionArray || val[1])[d];
					else
						d = val[1](d, optionArray);
					if (d != null && !isString(d))
						d = pad(placeholderDigits.length+1, d);
					return d;
				}
				else
					return s;
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
	// returns date; null if optional and not set; undefined if parsing failed
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
		var timezoneOffsetMatch;
		var timezoneIndex;
		var match;
	
		if (/^\?/.test(format)) {
			if (trim(date) == '')
				return null;
			format = format.substr(1);
		}
		
		if (match = /^\[([+-]\d\d)(\d\d)\]\s*(.*)/.exec(format)) {
			timezoneOffsetMatch = match;
			format = match[3];
		}

		var parser = new RegExp(format.replace(/(.)(\1*)(?:\[([^\]]*)\])?/g, function(wholeMatch, placeholderChar, placeholderDigits, param) {
			if (/[dmhkyhs]/i.test(placeholderChar)) {
				indexMap[reIndex++] = placeholderChar;
				var plen = placeholderDigits.length+1;
				return "(\\d"+(plen<2?"+":("{1,"+plen+"}"))+")";
			}
			else if (placeholderChar == 'z') {
				timezoneIndex = reIndex;
				reIndex += 2;
				return "([+-]\\d\\d)(\\d\\d)";
			}
			else if (/[Nna]/.test(placeholderChar)) {
				indexMap[reIndex++] = [placeholderChar, param && param.split(',')];
				return "([a-zA-Z\x80Ð\u1fff]+)"; 
			}
			else if (/w/i.test(placeholderChar))
				return "[a-zA-Z\x80Ð\u1fff]+";
			else if (/\s/.test(placeholderChar))
				return "\\s+"; 
			else 
				return escapeRegExp(wholeMatch);
		}));
		
		if (!(match = parser.exec(date)))
			return undef;
			
		var ctorArgs = [0, 0, 0, 0, 0, 0,  0];
		for (var i = 1; i < reIndex; i++) {
			var matchVal = match[i];
			var indexEntry = indexMap[i];
			if (isList(indexEntry)) { // for a, n or N
				var placeholderChar = indexEntry[0];
				var mapEntry  = mapping[placeholderChar];
				var ctorIndex = mapEntry[0];
				var valList = indexEntry[1] || mapEntry[1];
				var listValue = find(valList, function(v, index) { return startsWith(matchVal.toLowerCase(), v.toLowerCase()) ? index : null; });
				if (listValue == null)
					return undef;
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
		var d = new Date(ctorArgs[0], ctorArgs[1], ctorArgs[2], ctorArgs[3], ctorArgs[4], ctorArgs[5], ctorArgs[6]);
		return dateAdd(d, 'minutes', -getTimezone(timezoneOffsetMatch, 1, d) - getTimezone(match, timezoneIndex, d));
	}
	// format ?##00,00__
	// returns number; null if optional and not set; undefined if parsing failed
	function parseNumber(format, value) {
		if (arguments.length == 1)
			return parseNumber(null, format);
		if (/^\?/.test(format)) {
			if (trim(value) == '')
				return null;
			format = format.substr(1);
		}
		var match, decSep = (match = /[0#]([.,])[_9]/.exec(format)) ? match[1] : ((match = /^[.,]$/.exec(format)) ? match[0]: '.');
		var r = parseFloat(replace(replace(replace(value, decSep == ',' ? /\./g : /,/g), decSep, '.'), /^[^\d-]*(-?\d)/, '$1'));
		return isNaN(r) ? undef : r;
	}
	function now() {
		return new Date();
	}
	function dateClone(date) {
		return new Date(date.getTime());
	}
	function capWord(w) { 
		return w.charAt(0).toUpperCase() + w.substr(1); 
	}
	function dateAddInline(d, cProp, value) {
		d['set'+cProp].call(d, d['get'+cProp].call(d) + value);
		return d;
	}
	function dateAdd(date, property, value) {
		if (arguments.length < 3)
			return dateAdd(now(), date, property);
		return dateAddInline(dateClone(date), capWord(property), value);
	}
	function dateMidnight(date) {
		var od = date || now();
		return new Date(od.getFullYear(), od.getMonth(), od.getDate());
	}
	function dateDiff(property, date1, date2) {
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
		var cProp = capWord(property);
		var calApproxValues = {'fullYear': DAY*365, 'month': DAY*365/12, 'date': DAY}; // minimum values, a little bit below avg values
		var minimumResult = Math.floor((dt / calApproxValues[property])-2); // -2 to remove the imperfections caused by the values above
		
		var d = dateAddInline(new Date(d1t), cProp, minimumResult);
		for (var i = minimumResult; i < minimumResult*1.2+4; i++) { // try out 20% more than needed, just to be sure
			if (dateAddInline(d, cProp, 1).getTime() > d2t)
				return i;
		}
		// should never ever be reached
	}
	
	
	function escapeJavaScriptString(s) {
		return replace(s, /['"\t\n\r]/g, function(a) {
			return JAVASCRIPT_ESCAPES[a];
		});
	}

	
	
	 
	function template(template, escapeFunction) {
		if (templateCache[template])
			return templateCache[template];
		else {
			var funcBody = 'with(_.isObject(obj)?obj:{}){'+
				map(template.split(/{{|}}}?/), function(chunk, index) {
					var match, c1 = trim(chunk), c2 = replace(c1, /^{/), escapeSnippet  = (c1==c2) ? 'esc(' : '';
					if (index%2) { // odd means JS code
						if (match = /^each\b(\s+([\w_]+(\s*,\s*[\w_]+)?)\s*:)?(.*)/.exec(c2))
							return 'each('+(trim(match[4])==''?'this':match[4])+', function('+match[2]+'){';
						else if (match = /^if\b(.*)/.exec(c2))
							return 'if('+match[1]+'){';
						else if (match = /^else\b\s*(if\b(.*))?/.exec(c2))
							return '}else ' + (match[1]  ? 'if('+match[2] +')' : '')+'{';
						else if (match = /^\/(if)?/.exec(c2))
							return match[1] ? '}\n' : '});\n';
						else if (match = /^#(.*)/.exec(c2))
							return match[1];
						else if (match = /(.*)::\s*(.*)/.exec(c2))
							return 'print('+escapeSnippet+'_.formatValue("'+escapeJavaScriptString(match[2])+'",'+(trim(match[1])==''?'this':match[1])+(escapeSnippet&&')')+'));\n';
						else
							return 'print('+escapeSnippet+(trim(c2)=='' ? 'this' : c2)+(escapeSnippet&&')')+');\n';
					}
					else if (chunk != ''){
						return 'print("'+escapeJavaScriptString(chunk)+'");\n';
					}
				}).join('')+'}';
			var f = (new Function('obj', 'each', 'esc', 'print', '_', funcBody));
			return templateCache[template] = function(obj, thisContext) {
				var result = [];
				f.call(thisContext || obj, obj, function(obj, func) {
					if (isList(obj))
						each(obj, function(value, index) { func.call(value, value, index); });
					else
						eachObj(obj, function(key, value) { func.call(value, key, value); });
				}, escapeFunction || nonOp, function() {call(result.push, result, arguments);}, _);
				return result.join('');
			};
		}
	}

		
	function escapeHtml(s) {
		return replace(s, /[<>'"&]/g, function(s) {
			return '&#'+s.charCodeAt(0)+';';
		});
	}	

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
	function funcArrayBind(func) {
		return function(arg1, arg2, arg3) {
			return new M(func(arg1, arg2, arg3));
		};
	}
	
	///#endsnippet commonFuncs
	
	// NOT a common function: web has a webkit fix in here
	function isFunction(f) {
		return isType(f, 'function');
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

	///#definesnippet utilM
	/*$
	 * @id listunderscore
	 * @name ._
	 * @syntax _
	 * Set to <var>true</var> if this is a Minified list.
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
	

	function _() {
		return new M(arguments, true);
	}

	///#endsnippet utilM
	
	//// LIST FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	copyObj({
		///#definesnippet utilListFuncs
    /*$
     * @id each
     * @group LIST
     * @requires list
     * @configurable default
     * @name .each()
     * @syntax list.each(callback)
     * @syntax _.each(list, callback)
     * @module UTIL, WEB
     * Invokes the given function once for each item in the list. The function will be called with the item as first parameter and 
     * the zero-based index as second.
     *
     * @example Creates the sum of all list entried. 
     * <pre>
     * var sum = 0;
     * _(17, 4, 22).each(function(item, index) {
     *     sum += item;
     * });
     * </pre>
     *
     * @example The previous example with a native array:
     * <pre>
     * var sum = 0;
     * _.each([17, 4, 22], function(item, index) {
     *     sum += item;
     * });
     * </pre>
     * 
     * @example This goes through all h2 elements of the class 'section' on a web page and changes their content:
     * <pre>
     * $('h2.section').each(function(item, index) {
     *     item.innerHTML = 'Section ' + index + ': ' + item.innerHTML;
     * });
     * </pre>
     * 
     * @param list a list to iterate. A list to use as input. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param callback The callback <code>function(item, index)</code> to invoke for each list element. 
     *                 <dl><dt>item</dt><dd>The current list element.</dd>
     *                 <dt>index</dt><dd>The second the zero-based index of the current element.</dd></dl>
     *                 The callback's return value will be ignored.
     * @return the list
     */
	'each': listBind(each),
	
	/*$
	 * @id filter
	 * @group LIST
	 * @requires list
	 * @configurable default
	 * @name .filter()
	 * @syntax list.filter(filterFunc)
	 * @syntax list.filter(value)
     * @syntax _.filter(list, filterFunc)
     * @syntax _.filter(list, value)
   	 * @module WEB, UTIL
	 * Creates a new ##list#Minified list## by taking an existing list and omitting certain elements from it. You
	 * can either specify a callback function to approve those items that will be in the new list, or 
	 * you can pass a value to remove from the new list.
	 *  
	 * If the callback function returns true, the item is shallow-copied in the new list, otherwise it will be removed.
	 * For values, a simple equality operation (<code>==</code>) will be used.
     *
     * @example Removing all instances of the number 10 from a list:
	 * <pre>
	 * var list = _([4, 10, 22, 7, 2, 19, 10]).filter(10);
	 * </pre>
     *
	 * @example Removing all numbers over 10 from a list:
	 * <pre>
	 * var list = _([4, 22, 7, 2, 19]).filter(function(item, index) {
	 *     return item &lt;= 10;
	 * });
	 * </pre>
	 * 
	 * @example The previous example with a native array is input. Note that the result is always a ##list#Minified list##:
	 * <pre>
	 * var list = _.filter([4, 22, 7, 2, 19], function(item, index) {
	 *     return item &lt;= 10;
	 * });
	 * </pre>
	 * 
	 * @example Creates a list of all unchecked checkboxes on a web page:
	 * <pre>
	 * var list = $('input').filter(function(item, index) {
	 *     return item.getAttribute('type') == 'checkbox' && item.checked;
	 * });
	 * </pre>
	 * 
     * @param list a list to filter. A list to use as input. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
	 * @param filterFunc The filter callback <code>function(item, index)</code> that decides which elements to include:
	 *        <dl><dt>item</dt><dd>The current list element.</dd>
	 *        <dt>index</dt><dd>The second the zero-based index of the current element.</dd>
	 *        <dt class="returnValue">(callback return value)</dt><dd><var>true</var> to include the item in the new list, <var>false</var> to omit it.</dd></dl>  
	 * @param value a value to remove from the list. It will be determined which elements to remove using <code>==</code>. Must not
	 *              be a function. 
	 * @return the new, filtered ##list#list##
	 */
	'filter': listBindArray(filter),
	
	/*$ 
     * @id collect 
     * @group LIST 
     * @requires list
     * @configurable default 
     * @name .collect() 
     * @syntax list.collect(collectFunc) 
     * @syntax _.collect(list, collectFunc)
   	 * @module WEB, UTIL
     * Creates a new ##list#Minified list## from the current list using the given callback function. 
     * The callback is invoked once for each element of the current list. The callback results will be added to the result list. 
     * The callback can return 
     * <ul> 
     * <li>an array or another list-like object. Its content will be appended to the resulting list.</li> 
     * <li>a regular object which will be appended to the list</li> 
     * <li><var>null</var> (or <var>undefined</var>), which means that no object will be added to the list. 
     * If you need to add <var>null</var> or <var>undefined</var> to the result list, put it into a single-element array.</li> 
     * </ul>
      * 
     * @example Goes through a list of numbers. Numbers over 10 will be removed. Numbers 5 and below stay. Numbers between 6 and 
     * 10 will be replaced by two numbers whose sum is the original value.
     * <pre> 
     * var texts = _(3, 7, 11, 5, 19, 3).collect(function(number, index) { 
     *     if (number > 10)
     *         return null;           // remove numbers >10
     *     else if (number > 5)
     *         return [5, number-5];  // replace with two entries
     *     else
     *         return number;         // keep lower numbers
     * }); 
     * </pre> 
     *  
     * @example Goes through input elements on a web page. If they are text inputs, their value will be added to the list: 
     * <pre> 
     * var texts = $('input').collect(function(input) { 
     *     if (input.getAttribute('type') != null || input.getAttribute('type') == 'text') 
     *         return input.value; 
     *     else 
     *         return null; // ignore 
     * }); 
     * </pre> 
     * 
     * @example Creates a list of all children of the selected list. 
     * <pre> 
     * var childList = $('.mySections').collect(function(node) { 
     *     return node.childNodes; // adds a while list of nodes 
     * }); 
     * </pre> 
     * 
     * @example Goes through selected input elements. For each hit, the innerHTML is added twice, once in lower case and once in upper case: 
     * <pre> 
     * var elements = $('input.myTexts').collect(function(item) { 
     *     return [item.innerHTML.toLowerCase(), item.innerHTML.toUpperCase()]; 
     * }); 
     * </pre> 
     * 
     * @param list a list to transform. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param collectFunc The callback <code>function(item, index)</code> to invoke for each item:
     * <dl><dt>item</dt><dd>The current list element.</dd><dt>index</dt><dd>The second the zero-based index of the current element.</dd>
	 *        <dt class="returnValue">(callback return value)</dt><dd>If the callback returns a list, its elements will be added to 
	 *        the result list. Other objects will also be added. Nulls and <var>undefined</var> will be ignored and be not added to 
	 *        the new result list. </dd></dl>
     * @return the new ##list#list##
     */ 
	'collect': listBindArray(collect),
	
	/*$ 
     * @id map 
     * @group LIST 
     * @requires list
     * @configurable default 
     * @name .map() 
     * @syntax list.map(mapFunc) 
     * @syntax _.map(list, mapFunc)
   	 * @module WEB, UTIL
     * Creates a new ##list#Minified list## from the current list using the given callback function. 
     * The callback is invoked once for each element of the current list. The callback results will be added to the result list.
     *  
	 * <var>map()</var> is a simpler version of ##collect() that creates lists of the same size as the input list. It is easier to use
	 * if the resulting list should contain nulls or nested list.
     * 
     * @example Goes through a list of numbers and creates a new list with each value increased by 1:
     * <pre> 
     * var texts = _(3, 7, 11, 5, 19, 3).map(function(number, index) { 
     *     return number + 1;
     * }); 
     * </pre> 
     * 
	 * @example The previous example with a native array is input. Note that the result is always a ##list#Minified list##:
     * <pre> 
     * var texts = _.map([3, 7, 11, 5, 19, 3], function(number, index) { 
     *     return number + 1;
     * }); 
     * </pre> 
     * 
     * @param list a list to transform. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param mapFunc The callback <code>function(item, index)</code> to invoke for each item:
     * <dl><dt>item</dt><dd>The current list element.</dd><dt>index</dt><dd>The second the zero-based index of the current element.</dd>
	 *        <dt class="returnValue">(callback return value)</dt><dd>This value will replace the original value in the new list.</dd></dl>
     * @return the new ##list#list##
     */ 
	'map': listBindArray(map),
	

	/*$ 
	 * @id toobject
	 * @group LIST 
	 * @requires list
	 * @configurable default 
	 * @name .toObject() 
	 * @syntax list.toObject(valueList)
	 * @syntax _.toObject(keyList, valueList)
	 * @module UTIL
	 * Creates an object map from a list of keys and a list of values.
	 * <var>toObject()</var> goes through all values of the key list and adds a property with this key and a value taken from the
	 * value list at the same index. If you call toObject as method on a list, this list is the key list.
	 * 
	 * If the key list is longer than the value list, the remaining properties will use <var>undefined</var> as value.
	 * If the value list is longer, the remaining values will be ignored.
	 * 
	 * @example Create a simple object map:
	 *  <pre> 
	 *  var map = _.toObject(['a', 'b', 'c'], [1, 2, 3]);  // creates {a:1, b:2, c:3}
	 * </pre> 
	 * 
	 * @example Same result, but with a list method:
	 *  <pre> 
	 *  var map = _('a', 'b', 'c').toObject([1, 2, 3]);  // creates {a:1, b:2, c:3}
	 * </pre> 
	 * 
	 * @param keyList A list or array to use for the keys of the new object.
	 * @param valueList A list or array to use for the values of the new object. There should be a value for each key. Otherwise the value will be
	 *                           <var>undefined</var>.
     * @return the new object
     */ 
	'toObject': listBind(toObject),
	
	/*$ 
	 * @id equals
	 * @group LIST 
	 * @requires list
	 * @configurable default 
	 * @name .equals() 
	 * @syntax list.equals(otherObject)
	 * @syntax _.equals(thisObject, otherObject)
	 * @module UTIL
	 * Checks whether two values, lists or objects are equal in a deep comparison.
	 * 
	 * First equals checks whether it got a function as parameter. If yes, it will be invoked without arguments and the function is called recursively with the function's result.
	 * 
	 * Once both values are no functions anymore, the values will be evaluated, If the first value is...
	 * <ul><li>...<var>null</var> or <var>undefined</var>, they are only equal if the other one is also either <var>null</var> or <var>undefined</var>.</li>
	 * <li>...a value as defined by #_.isValue(), but not a Date, they are equal if the other value is the same type and is equal according to the '==' operator.</li>
	 * <li>...a Date, they are equal if the other value is a Date representing the same time.</li>
	 * <li>...a list or array, they are equal if the other value is also either a list or an array, has the same number of items and all items equal the items of the other
	 *         list at the same position. The equality of list items is determined recursively using the same rules, so you can also nest lists.</li>
	 * <li>...a function, it will be invoked without arguments and its return value is evaluated using these rules as if the value has been passed. </li>
	 * <li>...any other object, they are equal if they contain exactly the same keys (as defined by #_.eachObj()) and all values are equal as determined using these rules
	 *      recursively.</li>
	 * </ul>
	 * 
	 * Please note that, according to the rules, a ##list#Minified list# is equal to an array, as long as their content is equal. <var>equals</var> does not 
	 * differentiate between <var>null</var> and <var>undefined</var>.
	 *
	 * <var>equals</var> is commutative. If you swap the parameters, the result should be the same.
	 * 
	 * @example Compare a list and an array:
	 *  <pre> 
	 *  _.equals([1, 2, 3], _(1, 2, 3));  // returns true
	 * </pre> 
	 * 
	 * @example Same result, but with a list method:
	 *  <pre> 
	 *  _(1, 2, 3).equals([1, 2, 3]);  // returns true
	 * </pre> 
	 * 
	 * @param thisObject The first reference to evaluate.
	 * @param otherObject The second reference to evaluate.
	 * @return true if both references are equal. False otherwise.
     */ 
	'equals': listBind(equals),

    /*$ 
     * @id sub
     * @group LIST 
     * @requires  
     * @configurable default 
     * @name .sub() 
     * @syntax list.sub(startIndex) 
     * @syntax list.sub(startIndex, endIndex) 
     * @syntax _.sub(list, startIndex) 
     * @syntax _.sub(list, startIndex, endIndex) 
     * @module WEB, UTIL
     * Returns a new ##list#Minified list## containing only the elements in the specified range. If there are no elements in the range,
     * an empty list is returned.
     * Negative indices are supported and will be added to the list's length, thus allowing you to specify ranges at the list's end.
     *
     * @example Takes only the second and third element:
     * <pre> 
     * var secndAndThird = _(5, 6, 7, 8, 9).sub(2, 4);
     * </pre> 
     *
     * @example The same using an array:
     * <pre> 
     * var secndAndThird = _.sub([5, 6, 7, 8, 9], 2, 4);
     * </pre> 
     *
     * @example Adds some text the 3rd to 5th list elements:
     * <pre> 
     * $('#myList li').sub(3, 6).add('Hello');
     * </pre> 
     *
     * @example Clears all elements but the first:
     * <pre> 
     * $('#myList li').sub(1).fill();
     * </pre> 
     *
     * @example Changes the class of the last list element:
     * <pre> 
     * $('#myList li').sub(-1).set('+lastItem');
     * </pre> 
     * 
     * @param list A list to use as input. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param startIndex the 0-based position of the sub-list start. If negative, the list's length is added and the position is relative
     *                   to the list's end.
     * @param endIndex optional the 0-based position of the sub-list end. If negative, the list's length is added and the position is relative
     *                   to the list's end. If omitted or null, all elements following the <var>startIndex</var> are included in the result.
     * @return a new ##list#list## containing only the items in the index range. 
     */ 
	'sub': listBindArray(sub),
	
    /*$ 
     * @id reverse
     * @group LIST 
     * @requires  
     * @configurable default 
     * @name .sub() 
     * @syntax list.reverse() 
     * @syntax _.reverse(list) 
     * @module WEB, UTIL
     * Returns a new ##list#Minified list## with the input list's elements in reverse order. So the first element is swapped 
     * with the last, the second with the second to last and so on.
     *
     * @example Changes the order of a list:
     * <pre> 
     * var rev = _('a', 'b', 'c').reverse(); // returns _('c', 'b', 'a')
     * </pre> 
     * 
     * @example The same with an array:
     * <pre> 
     * var rev = _.reverse(['a', 'b', 'c']); // returns _('c', 'b', 'a')
     * </pre> 
     * 
     * @param list A list to use as input. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param startIndex the 0-based position of the sub-list start. If negative, the list's length is added and the position is relative
     *                   to the list's end.
     * @param endIndex optional the 0-based position of the sub-list end. If negative, the list's length is added and the position is relative
     *                   to the list's end. If omitted or null, all elements following the <var>startIndex</var> are included in the result.
     * @return a new ##list#list## containing only the items in the index range. 
     */ 
	'reverse': listBindArray(reverse),
 	
    /*$ 
     * @id find 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .find() 
     * @syntax list.find(findFunc) 
     * @syntax list.find(element) 
     * @syntax _.find(list, findFunc) 
     * @syntax _.find(list, element) 
     * @module WEB, UTIL
     * Finds a specific value in the list. There are two ways of calling <var>find()</var>:
     * <ol>
     * <li>With a value as argument. Then <var>find()</var> will search for the first occurrence of an identical value in the list,
     *     using the '===' operator for comparisons, and return the index. If it is not found,
     *     <var>find()</var> returns <var>undefined</var>.</li>
     * <li>With a callback function. <var>find()</var> will then call the given function for each list element until the function 
     *     returns a value that is not <var>null</var> or <var>undefined</var>. This value will be returned.</li>
     * </ol>
     *
     * @example Finds the first negative number in the list:
     * <pre> 
     * var i = _(1, 2, -4, 5, 2, -1).find(function(value, index) { if (value < 0) return index; }); // returns 2
     * </pre> 

     * @example Finds the index of the first 5 in the array:
     * <pre> 
     * var i = _.find([3, 6, 7, 6, 5, 4, 5], 5); // returns 4 (index of first 5)
     * </pre> 
	 *
     * @example Determines the position of the element with the id '#wanted' among all li elements:
     * <pre> 
     * var elementIndex = $('li').find($$('#wanted'));
     * </pre> 
     * 
     * @example Goes through the elements to find the first div that has the class 'myClass', and returns this element:
     * <pre> 
     * var myClassElement = $('div').find(function(e) { if ($(e).is('.myClass')) return e; });
     * </pre> 
     * 
     * @param list A list to use as input. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param findFunc The callback <code>function(item, index)</code> that will be invoked for every list item until it returns a non-null value:
     * <dl><dt>item</dt><dd>The current list element.</dd><dt>index</dt><dd>The second the zero-based index of the current element.</dd>
	 *        <dt class="returnValue">(callback return value)</dt><dd>If the callback returns something other than <var>null</var> or
	 *        <var>undefined</var>, <var>find()</var> will return it directly. Otherwise it will continue. </dd></dl>
     * @param element the element to search for
     * @return if called with an element, either the element's index in the list or <var>undefined</var> if not found. If called with a callback function,
     *         it returns either the value returned by the callback or <var>undefined</var>.
     */ 
 	'find': listBind(find),
 	
    /*$ 
     * @id startswith 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .startsWith() 
     * @syntax list.startsWith(otherList) 
     * @syntax _.startsWith(list, otherList) 
     * @syntax _.startsWith(baseString, otherString) 
     * @module UTIL
     * Checks whether the list or string starts with the other string or list.
	 *
	 * If you compare lists, each item of the other list is compared with the item at the same position of the
	 * base list using ##_.equals(). Arrays can be used interchangably with lists.
	 * 
	 * If you compare strings, each character of the other string is compared with the character at the same position of the
	 * base string.
	 * 
     *
     * @example Checks whether a list starts with [1, 2]:
     * <pre> 
     * var r = _(1, 2, 3, 4, 5).startsWith([1, 2]);   // returns true
     * </pre> 

     * @example The same using an array as base list:
     * <pre> 
     * var r = _.startsWith([1, 2, 3, 4, 5], [1, 2]); // returns true
     * </pre> 

     * @example Checks a string:
     * <pre> 
     * var r = _.startsWith("Cookie", "C"); // returns true
     * </pre> 
	 *
     * @param list A list to check. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param otherList A list to find at the beginning of the other string. Can be an array, a ##list#Minified list## or any other 
     *             array-like structure with <var>length</var> property.
     * @param baseString a string to check
     * @param otherString the string to find at the beginning of the other string
     * @return true if the base list or string starts with the other list/string. False otherwise.
     */ 
 	'startsWith': listBind(startsWith),
 	
    /*$ 
     * @id endswith 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .endsWith() 
     * @syntax list.endsWith(otherList) 
     * @syntax _.endsWith(list, otherList) 
     * @syntax _.endsWith(baseString, otherString) 
     * @module UTIL
     * Checks whether the list or string ends with the other string or list.
	 *
	 * If you compare lists, each item of the other list is compared with the item at the same position relative to the end of the
	 * base list using ##_.equals(). Arrays can be used interchangably with lists.
	 * 
	 * If you compare strings, each character of the other string is compared with the character at the same position relative to the end 
	 * of the base string.
	 * 
     *
     * @example Checks whether a list ends with [4, 5]:
     * <pre> 
     * var r = _(1, 2, 3, 4, 5).startsWith([4, 5]);   // returns true
     * </pre> 

     * @example The same using an array as base list:
     * <pre> 
     * var r = _.startsWith([1, 2, 3, 4, 5], [4, 5]); // returns true
     * </pre> 

     * @example Checks a string:
     * <pre> 
     * var r = _.startsWith("Cookie", "okie"); // returns true
     * </pre> 
	 *
     * @param list A list to check. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param otherList A list to find at the end of the other string. Can be an array, a ##list#Minified list## or any other 
     *             array-like structure with <var>length</var> property.
     * @param baseString a string to check
     * @param otherString the string to find at the end of the other string
     * @return true if the base list or string ends with the other list/string. False otherwise.
     */ 
 	'endsWith': listBind(endsWith),
 	
    /*$ 
     * @id contains 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .contains() 
     * @syntax list.contains(item) 
     * @syntax _.contains(list, item) 
     * @module UTIL
     * Checks whether the list contains the given item.
	 *
	 * Each item of the other list is compared with the item using ##_.equals(). The function
	 * returns <var>true</var> as soon as one list item equals the requested item.
	 * 
     *
     * @example Checks whether a list contains a 5:
     * <pre> 
     * var r = _(1, 2, 3, 4, 5).contains(5);   // returns true
     * </pre> 
     *
     * @example The same using an array:
     * <pre> 
     * var r = _.contains([1, 2, 3, 4, 5], 5); // returns true
     * </pre> 
     *
     * @param list A list to check. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param item The item to search.
     * @return true if the list contains the item. False otherwise.
     */ 
 	'contains': listBind(contains),
	
    /*$ 
     * @id call 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .call() 
     * @syntax list.call() 
     * @syntax list.call(fThis) 
     * @syntax list.call(args) 
     * @syntax list.call(fThis, args) 
     * @syntax _.call(list) 
     * @syntax _.call(list, fThis) 
     * @syntax _.call(list, args) 
     * @syntax _.call(list, fThis, args) 
     * @module UTIL
     * Calls all function in the list.
	 *
	 * <var>call</var> goes through all list items and, if they are functions, calls them with the specified arguments. 
	 * Elements that are not functions will be ignored. The return values of the functions will be written into a list
	 * in the same order as the functions. If a input list item is not a function, the value in the result list will
	 * be <var>undefined</var>.
     *
     * @param list A list containing the functions to call. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param fThis optional If set, a value to pass as <var>this</var>. Please note that if you use a list as <var>fThis</var>,
     *              you must set <var>args</var> also to an (possibly empty) array.
     * @param args optional A list or array of arguments to pass to the functions.
     * @return A list containing the return values of the called functions, or <var>undefined</var> for list items that were not 
     *         functions.
     */ 
	'call': listBindArray(callList),

    /*$ 
     * @id array 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .array() 
     * @syntax list.array() 
     * @syntax _.array(list) 
     * @module UTIL
     * Converts a ##list#Minified list## or other array-like structure into a native JavaScript array.
	 *
     * @param list The list to convert. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @return A native array containing a shallow copy of the input array's values.
     */
	'array': listBind(array),

    /*$ 
     * @id unite 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .unite() 
     * @syntax list.unite() 
     * @syntax _.unite(list) 
     * @module UTIL
     * Takes a list of functions as input to create a new function that calls all input functions with the same
     * arguments. 
	 *
     * @param list The list of functions. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @return A function that will invoke all underlying functions with the arguments is has been called with. The function
     *         returns a ##list#Minified list## of result values, using the same mechanics as ##_.call().
     */
	'unite': listBind(unite), 

    /*$ 
     * @id uniq 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .uniq() 
     * @syntax list.uniq() 
     * @syntax _.uniq(list) 
     * @module UTIL
     * Takes a list of values and removes all duplicates. If a value occurs more than once in the input list, only the first occurrence
     * will be kept and all following occurrences will be filtered out.
     * 
     * Uses object properties to keep track which values already occurred. This means that it only works with simple values that can
     * be converted to strings.  
	 *
     * @param list The list of values. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @return A ##list#Minified list## where duplicated had been filtered out.
     */
	'uniq': listBindArray(uniq),
	
    /*$ 
     * @id intersection 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .intersection() 
     * @syntax list.intersection(otherList) 
     * @syntax _.intersection(list, otherList) 
     * @module UTIL
     * Takes two input lists to create a new list containing only those values that exist in both input lists.
     * 
     * Uses object properties to keep track which values exist. This means that it only works with simple values that can
     * be converted to strings.  
	 *
     * @param list The list of values. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param otherList The other list of values. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @return A ##list#Minified list## containing only the duplicate values.
     */
	'intersection': listBindArray(intersection), 
	
	'join': function(separator) {
		return map(this, nonOp).join(separator);
	},
	
	'sort': function(func) {
		return new M(map(this, nonOp).sort(func));
	},

	'tap': function(func) {
		func(this);
		return this;
	}
	///#endsnippet utilListFuncs
	
 	/*$
 	 * @stop
 	 */
	}, M.prototype);
     

 	//// UNDERSCORE FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	///#definesnippet utilUnderscoreFuncs

	var _ = {
		 // @condblock filter
		'filter': funcArrayBind(filter),
		 // @condend
		 // @condblock collect
		'collect': funcArrayBind(collect),
		 // @condend
		 // @condblock collectobj
		'collectObj': funcArrayBind(collectObj),
		 // @condend
		 // @condblock map
		'map': funcArrayBind(map),
		 // @condend
		 // @condblock sub
		'sub': funcArrayBind(sub),
		 // @condend
		 // @condblock reverse
		'reverse': funcArrayBind(reverse),
		 // @condend
		 // @condblock each
		'each': each,
		 // @condend
		 // @condblock each
		'toObject': toObject,
		 // @condend
		 // @condblock find
		'find': find,
		 // @condend
		 // @condblock contains
		'contains': contains,
		 // @condend
		 // @condblock startswith
	 	'startsWith': startsWith,
		 // @condend
		 // @condblock endswith
	 	'endsWith': endsWith,
		 // @condend
		 // @condblock equals
		'equals': equals,
		 // @condend
		 // @condblock keys
		'keys': funcArrayBind(keys),
		 // @condend
		 // @condblock values
		'values': funcArrayBind(values),
		 // @condend
		 // @condblock call
		'call': funcArrayBind(callList),
		 // @condend
		 // @condblock array
		'array': array,
		 // @condend
		 // @condblock unite
		'unite': unite,
		 // @condend
		 // @condblock uniq
		'uniq': funcArrayBind(uniq),
		 // @condend
		 // @condblock intersection
		'intersection': funcArrayBind(intersection),
		 // @condend
		
		'bind': bind,
		'partial': partial,
		'once': once,
		'nonOp': nonOp,
		'eachObj': eachObj,
		'mapObj': mapObj,
		'filterObj': filterObj,

		'isList': isList,
		'isFunction': isFunction,
		'isObject': isObject,
		'isNumber': isNumber,
		'isBool': isBool,
		'isDate': isDate,
		'isValue': isValue,
		'isString': isString,
		'toString': toString,
		'toList': toList,

		'dateClone': dateClone,
		'dateAdd': dateAdd,
		'dateDiff': dateDiff,
		'dateMidnight': dateMidnight,
		
		'formatNumber' : formatNumber,
		'pad' : pad,
		'formatValue': formatValue,
		
		'parseDate': parseDate,
		'parseNumber': parseNumber,

		'copyObj': copyObj,
		
		'coal': coal,

		'trim': trim,
		'escapeRegExp': escapeRegExp,
		'escapeHtml': escapeHtml,
		
		'format': function(format, object) {
			return template(format)(object);
		},

	
		/*$ 
	     * @id template 
	     * @group TEMPLATE
	     * @requires 
	     * @configurable default 
	     * @name _.template() 
	     * @syntax _.template(template)
	     * @syntax _.template(template, escapeFunction)
	   	 * @module UTIL
	     * Parses a Handlebars-like template to create a reusable template function.
	     * 
	     * The syntax of the template uses a syntax that superficially looks like 
	     * <a href="http://handlebarsjs.com/">Handlebars</a>. Unlike Handlebars, it is based on raw JavaScript expressions and thus gives you
	     * complete freedom, but also offers you shortcuts for formatting, iteration and conditionals. 
	     * 
	     * Every template can receive exactly one object as input. If you need more than one value as input, put all requires values
	     * into an object.
	     * 
	     * Use double curly braces to embed a JavaScript expression and insert its result:
	     * <pre>{{a}} plus {{b}} is {{a+b}}</pre>
	     * 
	     * To use such a template, create it with <var>template()</var> and then execute the resulting function:
	     * <pre>var myTemplate = _.template('{{a}} plus {{b}} is {{a+b}}');
	     * var result = myTemplate({a: 5, b: 7});</pre>
	     * If you pass an object as input, its properties will be mapped using JavaScript's <code>with</code>
	     * statement and are available as variables throughout the template.
	     * 
	     * If you have only a simple value to render, you can pass it directly and access it through the pre-defined
	     * variable <var>obj</var>:
	     * <pre>var myTemplate = _.template('The result is {{obj}}.');
	     * var result = myTemplate(17);</pre>	     
	     * Alternatively, you could also access the input as <var>this</var>, but be aware that JavaScript wraps simples types
	     * such as Number and Boolean. <var>this</var> is the default, so you can omit it to get the same result:
	     * <pre>var myTemplate = _.template('The result is {{ }}.');
	     * var result = myTemplate(17);</pre>
	     * 
	     * Minified templates can use ##_.formatValue() formats directly. Just separate them from the expression by
	     * a double-colon:
	     * <pre>The price is {{obj::#.00}}.</pre>	     
	     * 
	     * Conditions can be expressed using <code>if</code> and <code>else</code>:
	     * <pre>Hello {{if visits==0}}New{{else if visits<10}}Returning{{else}}Regular{{/if}} Customer.<pre>
	     * You can use any JavaScript expression as condition.
	     * 
	     * Use <code>each</code> to iterate through a list:
	     * <pre>var myTemplate = _.template(
	     * 	   '{{each names}}{{this.firstName}} {{this.lastName}}{{/each}}');
	     * var result = myTemplate({names: [{firstName: 'Joe', lastName: 'Jones'}, 
	     *                                  {firstName: 'Marc', lastName: 'Meyer'}]});</pre>
	     * <code>each</code> will iterate through the members of the given object. It 
	     * calls its body for each item and put a reference to the item into <var>this</var>.
	     * Optionally, you can specify up to two variables to store the value in (instead of this) and
	     * the zero-based index of the current item:
	     * <pre>var myTemplate = _.template(
	     * 	   '{{each value, index: names}}{{index}}. {{value.firstName}} {{value.lastName}}{{/each}}');
		 * </pre>
	     *
	     * If you do not pass an expression to <code>each</var>, it will take the list from <var>this</var>:
	     * <pre>var myTemplate = _.template('{{each value:}}{{value}};{{/each}}');
	     * var result = myTemplate([1, 2, 3]);</pre>
	     *  
	     * Beside lists, you can also iterate through the properties of an object. The property name will be stored
	     * in the first given parameter and the value in <var>this</var> and the second parameter:
	     * <pre>var myTemplate = _.template('{{each key, value: nicknames}}{{key}}: {{value}}{{/each}}');
	     * var result = myTemplate({nicknames: {Matt: 'Matthew', John: 'Jonathan'} });</pre>
	     * 
	     * Shorter version of the previous example that uses <var>this</var> for the value:
	     * <pre>var myTemplate = _.template('{{each key: nicknames}}{{key}}: {{this}}{{/each}}');</pre>
	     * 
	     * If you do not need the key, you can omit the variable specification:
	     * <pre>var myTemplate = _.template('{{each nicknames}}{{this}}{{/each}}');</pre>
		 *
	     * In some situations, it may be inevitable to embed raw JavaScript in the template. You need it, for example,
	     * if you need to . To embed JavaScript code, prefix the
	     * code with a '#':
	     * <pre>var myTemplate = _.template(
	     *     '{{each}}{{#var outerIndex = index;}}'+
	     *             '{{each}{{outerIndex}}.{{index}} {{this.title}}\n'{{/each}}'+
	     *     '{{/each}}');
	     * var result = myTemplate([['Foreword', 'Intro'], ['Something', 'Something else']]);</pre>
	     * 
	     * 
	     * By default, all output will be escaped. You can prevent this by using triple-curly-braces:
	     * <pre>Here's the original: {{{rawText}}}</pre>.
	     * 
	     * The template's JavaScript code is executed in a sandbox without access to global variables. Minified defines the
	     * following variables for you:
	     * <table>
	     * <tr><th>Name</th><th>Desciption</th></tr>
	     * <tr><td>this</td><td>The template object outside of <code>each</code>. Inside eachs, the current value.</td></tr>
	     * <tr><td>obj</td><td>The parameter given to the template function.</td></tr>
	     * <tr><td>_</td><td>A reference to Minified Util.</td></tr>
	     * <tr><td>esc</td><td>The escape function given when the template has been defined. If no function has been given,
	     *                     a default function that returns the input unmodified.</td></tr>
	     * <tr><td>print</td><td>A <code>function(text,...)</code> that appends one or more strings to the template result.</td></tr>
	     * <tr><td>each</td><td>A <code>function(listOrObject, eachCallback)</code> that can iterate over lists or object properties.
	     * The <var>eachCallback</var> is a <code>function(key, value)</code> for objects or <code>function(value, index)</code>
	     * for arrays that will be invoked for each item.
	     * </table> 
	     * 
	     *  
	     * @param template The template as a string using the syntax described above. 
	     * @param escapeFunction optional The callback <code>function(inputString)</code> that will be used
	     *        to escape all output:
	     * <dl><dt>inputString</dt><dd>The string to escape.</dd>
	     *     <dt class="returnValue">(callback return value)</dt><dd>The escaped string.</dd></dl>
	     *        If no escapeFunction has been given, the output will not be escaped. See ##_.htmlTemplate() for a 
	     *        version of <var>template()</var> that already includes HTML escaping.
	     * @return the value returned by the last invocation of <var>func</var>
	     */ 
		'template': template,
		
		 'htmlTemlplate': function(tpl) { return template(tpl, escapeHtml); }
		
	};

	///#endsnippet utilUnderscoreFuncs

	
	//// GLOBAL INITIALIZATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
	/*$
	 @stop
	 */
	return {
		///#definesnippet utilExports
		/*$
		 * @id underscore
		 * @name _()
		 * @configurable default
		 * @module UTIL
		 */
		'_': _,
		///#endsnippet utilExports
		
	    /*$
		 * @id M
		 * @group SELECTORS
		 * @requires 
		 * @configurable no
		 * @name M
		 * @syntax MINI.M
         * @module WEB, UTIL
		 * 
		 * Exposes the internal class used by all  ##list#Minified lists##. This is mainly intended to allow you adding your
		 * own functions.
		 * 
		 * @example Adding a function printLength() to <var>M</var>:
		 * <pre>
		 * MINI.M.prototype.printLength = function() { console.log(this.length); };
		 * </pre>
		 */
		'M': M
	};
});

/*$
 * @stop 
 */



