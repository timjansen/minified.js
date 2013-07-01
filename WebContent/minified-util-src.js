/*
 * Minified-util.js - Collections, formatting and other helpers.
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
	function values(obj) {
		var list = [];
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
	function reduce(list, memoInit, func) {
		var memo = memoInit;
		each(list, function(value, index) {
			memo = func(memo, value, index);
		});
		return memo;
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
	function reverse(list) {
		var i = list.length;
		return map(list, function() { return list[--i]; });
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
	function coal() {
		return find(arguments, nonOp);
	}
	function contains(list, value) {
		if (isList(list))
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
	/*
	function template(template, escapeFunction) {
		if (templateCache[template])
			return templateCache[template];
		else {
			var match;
			var f = (new Function('obj', 'out', 'esc', 'print', '_', 'with(obj||{}){'+
			 		map(template.split(/<%|%>/), function(chunk, index) {
						if (index%2) { // odd means JS code
							if (match = /^=(.*)::(.*)/.exec(chunk)) 
								return 'print(esc(_.formatValue("'+escapeJavaScriptString(match[2])+'",'+match[1]+')));\n';
							else if (match = /^=(.*)/.exec(chunk)) 
								return 'print(esc('+match[1]+'));\n';
							else
								return chunk + ';\n';
						}
						else {
							return 'print("'+escapeJavaScriptString(chunk)+'");\n';
						}
					}).join('')+'}'));
			return templateCache[template] = function(obj) {
				var result = [];
				f(obj, result, escapeFunction || nonOp, function() {call(result.push, result, arguments);}, UNDERSCORE);
				return result.join('');
			};
		}
	}
	
	*/
	 
	var templateCache={};
	function template(template, escapeFunction) {
		if (templateCache[template])
			return templateCache[template];
		else {
			var f = (new Function('obj', 'each', 'esc', 'print', '_', 'with(_.isObject(obj)?obj:{}){'+
			 		map(template.split(/{{|}}}?/), function(chunk, index) {
						var match, c2, escapeSnippet  = (chunk==(c2 = replace(chunk, /^{/))) ? 'esc(' : '';
						if (index%2) { // odd means JS code
							if (match = /^#each\b(.*)/.exec(c2))
								return 'each('+(match[1]||'obj')+', function(key, value, index){with(_.isObject(value)?value:{}){';
							else if (match = /^#(else\s*)?(if\b)?(.*)/.exec(c2))
								return (match[1]?'}else':'') + (match[2] ? 'if('+(match[3]||'obj')+')' : '')+'{';
							else if (match = /^\/(if)?/.exec(c2))
								return match[1] ? '}\n' : '}});\n';
							else if (match = /(.*)::(.*)/.exec(c2)) 
								return 'print('+escapeSnippet+'_.formatValue("'+escapeJavaScriptString(match[2])+'",'+(trim(match[1])==''?'obj':match[1])+(escapeSnippet&&')')+'));\n';
							else
								return 'print('+escapeSnippet+(trim(c2)=='' ? 'obj' : c2)+(escapeSnippet&&')')+');\n';
						}
						else {
							return 'print("'+escapeJavaScriptString(chunk)+'");\n';
						}
					}).join('')+'}'));

			return templateCache[template] = function(obj) {
				var result = [];
				f(obj, function(obj, func) {
					if (isList(obj))
						each(obj, function(value, index) { func.call(value, index, value, index); });
					else
						eachObj(obj, func);
				}, escapeFunction || nonOp, function() {call(result.push, result, arguments);}, UNDERSCORE);
				return result.join('');
			};
		}

	}

	
	
	function escapeHtml(s) {
		return replace(s, /[<>'"&]/g, function(s) {
			return '&#'+s.charCodeAt(0)+';';
		});
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
	
	
	copyObj({
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
     * @param list a list to iterate. Can be an array, a ##list#Minified list## or anything other array-like structure 
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
     * @syntax _.filter(list, filterFunc)
   	 * @module WEB, UTIL
	 * Creates a new ##list#Minified list## that contains only those items approved by the given callback function. The function is 
	 * called once for each item. 
	 * If the callback function returns true, the item is shallow-copied in the new list, otherwise it will be removed.
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
     * @param list a list to filter. Can be an array, a ##list#Minified list## or anything other array-like structure 
     *             <var>length</var> property.
	 * @param filterFunc The filter callback <code>function(item, index)</code> that decides which elements to include:
	 *        <dl><dt>item</dt><dd>The current list element.</dd>
	 *        <dt>index</dt><dd>The second the zero-based index of the current element.</dd>
	 *        <dt class="returnValue">(callback return value)</dt><dd><var>true</var> to include the item in the new list, <var>false</var> to omit it.</dd></dl>  
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
     * @param list a list to transform. Can be an array, a ##list#Minified list## or anything other array-like structure 
     *             <var>length</var> property
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
     * @param list a list to transform. Can be an array, a ##list#Minified list## or anything other array-like structure 
     *             <var>length</var> property
     * @param mapFunc The callback <code>function(item, index)</code> to invoke for each item:
     * <dl><dt>item</dt><dd>The current list element.</dd><dt>index</dt><dd>The second the zero-based index of the current element.</dd>
	 *        <dt class="returnValue">(callback return value)</dt><dd>This value will replace the original value in the new list.</dd></dl>
     * @return the new ##list#list##
     */ 
	'map': listBindArray(map),
	
	/*$ 
     * @id reduce 
     * @group LIST 
     * @requires list
     * @configurable default 
     * @name .reduce() 
     * @syntax list.reduce(memoInit, func)
     * @syntax _.reduce(list, memoInit, func)
   	 * @module UTIL
     * Reduces a list into a single value.
     * <var>reduce()</var> allows you to create a single value from a list of values in a functional style.
     * The callback <var>func</func> is invoked for each list member. Beside the list member and its index, it also
     * receives a 'memo' which is the return value of the previous invocation.
     * 
     * @example Calculate the sum of a list of numbers:
     * <pre> 
     * var sum = _(3, 7, 11, 5, 19, 3).reduce(0, function(memo, value, index) { 
     *     return memo + value;
     * }); 
     * </pre> 
     * 
	 * @example The previous example with a native array is input:
     * <pre> 
     * var sum = _.reduce([3, 7, 11, 5, 19, 3], 0, function(memo, value, index) { 
     *     return memo + value;
     * }); 
     * </pre> 
     * 
     * @param list a list to use as input. Can be an array, a ##list#Minified list## or anything other array-like structure 
     *             <var>length</var> property
     * @param memoInit this value will be passed to the callback as <var>memo</var> the first time it is called. In all subsequent
     *                 invocations, the <var>memo</var> will be the last invocation's return value.            
     * @param func The callback <code>function(memo, value, index)</code> to invoke for each item:
     * <dl><dt>memo</dt><dd>The current memo. This is <var>memoInit</var> for the first invocation. After that it is the previous
     *      invocation's return value.</dd>
     * <dt>value</dt><dd>The current list element.</dd>
     * <dt>index</dt><dd>The second the zero-based index of the current element.</dd>
	 *        <dt class="returnValue">(callback return value)</dt><dd>The new memo for subsequent calls. The return
	 *        value of the last callback invocation is also <var>reduce()</var's return value.</dd></dl>
     * @return the value returned by the last invocation of <var>func</var>
     */ 
	'reduce': listBind(reduce),

	'toObject': listBind(toObject),
	
	'equals': listBind(equals),

	'sub': listBindArray(sub),
	
	'reverse': listBindArray(reverse),
 	
 	'find': listBind(find),
 	
 	'startsWith': listBind(startsWith),
 	'endsWith': listBind(endsWith),
 	
 	'contains': listBind(contains),
	
	'call': listBindArray(callList),

	'array': function() {
		return map(this, nonOp);
	},

	// returns a function that calls all functions of the list
	'func': function() {
		var self = this;
		return function() {
			return new M(callList(self, arguments));
		};
	},
	
	'join': function(separator) {
		return map(this, nonOp).join(separator);
	},
	
	'sort': function(func) {
		return new M(map(this, nonOp).sort(func));
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

	'tap': function(func) {
		func(this);
		return this;
	}

	
 	/*$
 	 * @stop
 	 */
	}, M.prototype);
     

 	//// UNDERSCORE FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/*$
	 * @id underscorefuncdef
	 */
	function funcArrayBind(func) {
		return function(arg1, arg2, arg3) {
			return new M(func(arg1, arg2, arg3));
		};
	}
	copyObj({
		'bind': bind,
		'partial': partial,
		'once': once,
		'nonOp': nonOp,
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
		'find': find,
		'contains': contains,
		'sub': funcArrayBind(sub),
		'reverse': funcArrayBind(reverse),
	 	'startsWith': startsWith,
	 	'endsWith': endsWith,
		'equals': equals,

		'isList': isList,
		'isFunction': isFunction,
		'isObject': isObject,
		'isNumber': isNumber,
		'isBool': isBool,
		'isDate': isDate,
		'isValue': isValue,
		'isString': isString,
		'toString': toString,

		//'prop': prop,
		'escapeRegExp': escapeRegExp,
		'trim': trim,
		
		'dateClone': dateClone,
		'dateAdd': dateAdd,
		'dateDiff': dateDiff,
		'dateMidnight': dateMidnight,
		
		'formatNumber' : formatNumber,
		'pad' : pad,
		'formatValue': formatValue,
		
		'parseDate': parseDate,
		'parseNumber': parseNumber,

		'keys': funcArrayBind(keys),
		'values': funcArrayBind(values),
		
		'copyObj': copyObj,
		
		'coal': coal,
		
		'format': function(format, object) {
			return template(format)(object);
		},

/*		'format': function(format, object) {
			return replace(format, /{([^,}]*)(,([^}]*))?}/g, function(match, path, subFormatPart, subFormat) {
				var value = path=='' ? object : prop(object, path);
				return subFormatPart ? formatValue(subFormat, value) : toString(value);
					
		    });
		},
*/
		
		'escapeHtml': escapeHtml,
		
		'template': template,
		
		 'htmlTemlplate': function(tpl) { return template(tpl, escapeHtml); }
		
	/*$
	 * @id underscorefuncdefend
	 */
	}, UNDERSCORE);

	//// GLOBAL INITIALIZATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
	/*$
	 @stop
	 */
	return {
		/*$
		 * @id underscore
		 * @name _()
		 * @configurable default
		 * @module UTIL
		 */
		'_': UNDERSCORE
	};
});

/*$
 * @stop 
 */



