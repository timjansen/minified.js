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
	 * @id commonjs
	 * @name Minified Util for Servers (node.js compatible)
	 * @doc no
	 * @configurable optional
	 * This is a define()-version that will export Minified for Node.js and other CommonJS systems. 
	 */
	/*$
	 * @id ie8compatibility
	 * @requires 
	 * @group OPTIONS
	 * @configurable optional
	 * @doc no
	 * @name Backward-Compatibility for IE8 and similar browsers
	 */
	/*$
	 * @stop
	 */

module.exports = (function() { 

	//// GLOBAL VARIABLES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	///#snippet utilVars
	var _null = null, _true = true, _false = false;

	/** @const */
	var undef;

    /*$
	 * @id date_constants
	 * @dependency
     */
	function val3(v) {return v.substr(0,3);}
	var MONTH_LONG_NAMES = split('January,February,March,April,May,June,July,August,September,October,November,December', /,/g);
	var MONTH_SHORT_NAMES = map(MONTH_LONG_NAMES, val3); // ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var WEEK_LONG_NAMES = split('Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday', /,/g);
	var WEEK_SHORT_NAMES = map(WEEK_LONG_NAMES, val3); 
	var MERIDIAN_NAMES = ['am', 'pm'];

	var FORMAT_DATE_MAP = {
			'y': ['FullYear', nonOp],
			'Y': ['FullYear', function(d) { return d % 100; }],
			'M': ['Month', plusOne],
			'n': ['Month', MONTH_SHORT_NAMES],
			'N': ['Month', MONTH_LONG_NAMES],
			'd': ['Date', nonOp],
			'm': ['Minutes', nonOp],
			'H': ['Hours', nonOp],
			'h': ['Hours', function(d) { return (d % 12) || 12; }],
			'k': ['Hours', plusOne],
			'K': ['Hours', function(d) { return d % 12; }],
			's': ['Seconds', nonOp],
			'S': ['Milliseconds', nonOp],
			'a': ['Hours', function(d, values) { return (values||MERIDIAN_NAMES)[d<12?0:1]; }],
			'w': ['Day', WEEK_SHORT_NAMES],
			'W': ['Day', WEEK_LONG_NAMES],
			'z': ['TimezoneOffset', function(d, dummy, timezone) {
				if (timezone)
					return timezone;
				var sign = d < 0 ? '+' : '-'; 
				var off = d > 0 ? d : -d; 
				return sign + pad(2, Math.floor(off/60)) + pad(2, off%60); 
			}]
		};

	var PARSE_DATE_MAP = {
			'y': 0,      // placeholder -> ctorIndex
			'Y': [0, -2000],
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

    /*$
	 * @stop
     */

	var MAX_CACHED_TEMPLATES = 99;
	var templateCache={}; // template -> function
	var templates = [];   // list of MAX_CACHED_TEMPLATES templates

	///#/snippet utilVars

	//// GLOBAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	///#snippet commonFunctions

	/** @param s {?} */
	function toString(s) { 
		return s!=_null ? ''+s : '';
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
		return n && n['nodeType'];
	}
	function isNumber(n) {
		return isType(n, 'number');
	}
	function isDate(n) {
		return isObject(n) && !!n['getDay'];
	}
	function isBool(n) {
		return n === _true || n === _false;
	}
	function isValue(n) {
		var type = typeof n;
		return type == 'object' ? !!(n && n['getDay']) : (type == 'string' || type == 'number' || isBool(n));
	}
	function toList(l) {
		return isList(l) ? l : (l != _null ? [l] : []);
	}

	function nonOp(v) {
		return v;
	}
	function plusOne(d) { 
		return d+1; 
	}
	function replace(s, regexp, sub) {
		return toString(s).replace(regexp, sub != _null ? sub : '');
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
	function filterObj(obj, f) {
		var r = {};
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
			else if (a != _null)
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
			return start != _null && base.substr(0, start.length) == start;
	}
	function endsWith(base, end) {
		if (isList(base)) {
			var e2 = _(end);
			return _(base).sub(-e2.length).equals(e2) || !e2.length;
		}
		else
			return end != _null && base.substr(base.length - end.length) == end;
	}
	function reverse(list) {
		var i = list.length;
		return map(list, function() { return list[--i]; });
	}
	function sub(list, startIndex, endIndex) {
		if (!list)
			return [];
	    var s = getFindIndex(list, startIndex, 0);
	    var e = getFindIndex(list, endIndex, list.length);
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
			if (to[name] == _null || !dontOverwrite)
				to[name] = value;
		});
		return to;
	}
	function extend(target) {
		for (var i = 0; i < arguments.length; i++)
			eachObj(arguments[i], function(name, value) {
				if (value != undef)
					target[name] = value;
			});
		return target;
	}
	function getFindFunc(findFunc) {
		return isFunction(findFunc) ? findFunc : function(obj, index) { if (findFunc === obj) return index; };
	}
	function getFindIndex(list, index, defaultIndex) {
		return index == _null ? defaultIndex : index < 0 ? list.length+index : index;
	}
	function find(list, findFunc, startIndex, endIndex) {
		var f = getFindFunc(findFunc);
		var e = getFindIndex(list, endIndex, list.length);
		var r;
		for (var i = getFindIndex(list, startIndex, 0); i < e; i++)
			if ((r = f(list[i], i)) != _null)
				return r;
	}
	function findLast(list, findFunc, startIndex, endIndex) {
		var f = getFindFunc(findFunc);
		var e = getFindIndex(list, endIndex, -1);
		var r;
		for (var i = getFindIndex(list, startIndex, list.length-1); i > e; i--)
			if ((r = f(list[i], i)) != _null)
				return r;
	}

	function array(list) {
		return map(list, nonOp);
	}
	function unite(list) {
		return function() {
			return new M(callList(list, arguments));
		};
	}
	function uniq(list) {
		var found = {};
		return filter(list, function(item) {
			if (found[item])
				return _false;
			else
				return found[item] = 1;
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
	function contains(list, value) {
		for (var i = 0; i < list.length; i++)
			if (list[i] == value)
				return _true;
		return _false;
	}
	// equals if a and b have the same elements and all are equal. Supports getters.
	function equals(x, y) {
		var a = isFunction(x) ? x() : x;
		var b = isFunction(y) ? y() : y;
		if (a == b)
			return _true;
		else if (a == _null || b == _null)
			return _false;
		else if (isValue(a) || isValue(b))
			return isDate(a) && isDate(b) && a.getTime()==b.getTime();
		else if (isList(a)) {
			if (a.length != b.length)
				return _false;
			else
				return !find(a, function(val, index) {
					if (!equals(val, b[index]))
						return _true;
				});
		}
		else {
			if (isList(b))
				return _false;
			var aKeys = keys(a);
			if (aKeys.length != keyCount(b))
				return _false;
			else
				return !find(aKeys, function(key) {
					if (!equals(a[key],b[key]))
						return _true;
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
	function fixFunc(f, args) {
		return function() {
			return call(f, _null, args);
		};
	}
	function bind(f, fThis, beforeArgs, afterArgs) {
		return function() {
			return call(f, fThis, collect([beforeArgs, arguments, afterArgs], nonOp));
		};
	}
	function partial(f, beforeArgs, afterArgs) {
		return bind(f, _null, beforeArgs, afterArgs);
	}
	function insertString(origString, index, len, newString) {
		return origString.substr(0, index) + newString + origString.substr(index+len);
	}
	function pad(digits, number) {
		var signed = number < 0 ? '-' : '';
		var preDecimal = replace((signed?-number:number).toFixed(0), /\..*/);
		while (preDecimal.length < digits)
			preDecimal = '0' + preDecimal;
		return signed + preDecimal;
	}
	function getTimezone(match, idx, refDate) {
		if (idx == _null || !match)
			return 0;
		return parseInt(match[idx])*60 + parseInt(match[idx+1]) + refDate.getTimezoneOffset();
	}

	// formats number with format string (e.g. "#.000", "#,#", "00000", "000.00", "000.000.000,00", "000,000,000.##")
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

			if (match = /^\[(([+-]\d\d)(\d\d))\]\s*(.*)/.exec(format)) {
				timezone = match[1];
				date = dateAdd(value, 'minutes', getTimezone(match, 2, value));
				formatNoTZ = match[4];
			}

			return replace(formatNoTZ, /(\w)(\1*)(?:\[([^\]]+)\])?/g, function(s, placeholderChar, placeholderDigits, params) {
				var val = FORMAT_DATE_MAP[placeholderChar];
				if (val) {
					var d = date['get' + val[0]].call(date);

					var optionArray = params && params.split(',');
					if (isList(val[1])) 
						d = (optionArray || val[1])[d];
					else
						d = val[1](d, optionArray, timezone);
					if (d != _null && !isString(d))
						d = pad(placeholderDigits.length+1, d);
					return d;
				}
				else
					return s;
			});

		}
		else 
			return find(format.split(/\s*\|\s*/), function(fmtPart) {
				var match, matchGrp, numFmtOrResult, groupSep, groupingSize;
				if (match = /^([<>]?)(=?)([^:]*?)\s*:\s*(.*)$/.exec(fmtPart)) {
					var cmpVal1 = value, cmpVal2 = parseFloat(match[3]);
					if (isNaN(cmpVal2) || !isNumber(cmpVal1)) {
						cmpVal1 = (cmpVal1==_null) ? "null" : toString(cmpVal1); // not ""+value, because undefined is treated as null here
						cmpVal2 = match[3];
					}
					if (match[1]) {
						if ((!match[2] && cmpVal1 == cmpVal2 ) ||
						    (match[1] == '<'  && cmpVal1 > cmpVal2)  ||
						    (match[1] == '>'  && cmpVal1 < cmpVal2))
							return _null;
					}
					else if (cmpVal1 != cmpVal2)
						return _null;
					numFmtOrResult = match[4];
				}
				else
					numFmtOrResult = fmtPart;

				if (isNumber(value) && (match = /[0#]([0#.,]*[0#])?/.exec(numFmtOrResult))) {
					var numFmt = match[0];
					if (matchGrp = /\.([0#]*)[.,]|,([0#]*)[.,]/.exec(numFmt)) {
						groupSep = matchGrp[0].charAt(0);
						groupingSize = matchGrp[1] != null ? matchGrp[1].length : matchGrp[2].length;
						numFmt = replace(numFmt, groupSep == '.' ? /\./g : /,/g);
					}
					var m2 = /([0#]+)(([.,])([0#]+))?/.exec(numFmt);
					var postDecimalMinLen = replace(m2[2], /#/g).length;
					var signed = value < 0 ? '-' : '';
					var m = /(\d+)(\.(\d+))?/.exec((signed?-value:value).toFixed(m2[2]?m2[4].length:0));
					var preDecimal = pad(replace(m2[1], /#/g).length, parseInt(m[1]));
					var postDecimal = (m2[3]||'.') + m[3];
					if (matchGrp) {
						function group(s) {
							var len = s.length;
							if (len > groupingSize)
								return group(s.substr(0, len-groupingSize)) + groupSep + s.substr(len-groupingSize);
							else
								return s;					
						}
						preDecimal = group(preDecimal);
					}
					return insertString(numFmtOrResult, match.index, toString(match[0]).length, 
							signed + preDecimal + 
							(m[2] ? (postDecimal.length>postDecimalMinLen?replace(postDecimal.substr(0, postDecimalMinLen)+replace(postDecimal.substr(postDecimalMinLen), /0+$/), /[.,]$/):postDecimal) : ''));
				}
				else
					return numFmtOrResult;
			});
	}
	// returns date; null if optional and not set; undefined if parsing failed
	function parseDate(format, date) {
		var indexMap = {}; // contains reGroupPosition -> typeLetter or [typeLetter, value array]
		var reIndex = 1;
		var timezoneOffsetMatch;
		var timezoneIndex;
		var match;

		if (/^\?/.test(format)) {
			if (trim(date) == '')
				return _null;
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
				return "([a-zA-Z\x80�\u1fff]+)"; 
			}
			else if (/w/i.test(placeholderChar))
				return "[a-zA-Z\x80�\u1fff]+";
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
				var mapEntry  = PARSE_DATE_MAP[placeholderChar];
				var ctorIndex = mapEntry[0];
				var valList = indexEntry[1] || mapEntry[1];
				var listValue = find(valList, function(v, index) { return startsWith(matchVal.toLowerCase(), v.toLowerCase()) ? index : _null; });
				if (listValue == _null)
					return undef;
				if (placeholderChar == 'a')
					ctorArgs[ctorIndex] += listValue * 12;
				else
					ctorArgs[ctorIndex] = listValue;
			}
			else if (indexEntry) { // for numeric values (yHmMs)
				var value = parseInt(matchVal);
				var mapEntry  = PARSE_DATE_MAP[indexEntry];
				if (isList(mapEntry))
					ctorArgs[mapEntry[0]] += value - mapEntry[1];
				else
					ctorArgs[mapEntry] += value;
			}
		}
		var d = new Date(ctorArgs[0], ctorArgs[1], ctorArgs[2], ctorArgs[3], ctorArgs[4], ctorArgs[5], ctorArgs[6]);
		return dateAdd(d, 'minutes', -getTimezone(timezoneOffsetMatch, 1, d) - getTimezone(match, timezoneIndex, d));
	}
	// format ?##00,00##
	// returns number; null if optional and not set; undefined if parsing failed
	function parseNumber(format, value) {
		if (arguments.length == 1)
			return parseNumber(_null, format);
		if (/^\?/.test(format)) {
			if (trim(value) == '')
				return _null;
			format = format.substr(1);
		}
		var decSep = (/(^|[^0#.,])(,|[0#.]*,[0#]+|[0#]+\.[0#]+\.[0#.,]*)($|[^0#.,])/.test(format)) ? ',' : '.';
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

    function ucode(a) {
        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }

	function escapeJavaScriptString(s) {
		return replace(s, /[\x00-\x1f'"\u2028\u2029]/g, ucode);
	}

	// reimplemented split for IE<=8
	function split(str, regexp) {
		// @condblock ie8compatibility
		var start = 0;
		var m, r = [];
		while (m = regexp.exec(str)) {
			r.push(str.substring(start, m.index));
			start = m.index + m[0].length;
		}
		r.push(str.substr(start));
		return r;
		// @condend ie8compatibility

		// @cond !ie8compatibility return str.split(regexp);
	}

	function template(template, escapeFunction) {
		if (templateCache[template])
			return templateCache[template];
		else {
			var funcBody = 'with(_.isObject(obj)?obj:{}){'+
				map(split(template, /{{|}}}?/g), function(chunk, index) {
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
						else if (match = /^(var\s.*)/.exec(c2))
							return match[1]+';';
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
			var t = function(obj, thisContext) {
				var result = [];
				f.call(thisContext || obj, obj, function(obj, func) {
					if (isList(obj))
						each(obj, function(value, index) { func.call(value, value, index); });
					else
						eachObj(obj, function(key, value) { func.call(value, key, value); });
				}, escapeFunction || nonOp, function() {call(result.push, result, arguments);}, _);
				return result.join('');
			};
			if (templates.push(t) > MAX_CACHED_TEMPLATES)
				delete templateCache[templates.shift()];
			return templateCache[template] = t; 
		}
	}

	function escapeHtml(s) {
		return replace(s, /[<>'"&]/g, function(s) {
			return '&#'+s.charCodeAt(0)+';';
		});
	}	

	function formatHtml(tpl, obj) { 
		return template(tpl, escapeHtml)(obj); 
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

	///#/snippet commonFunctions

	// NOT a common function: web has a webkit fix in here
	function isFunction(f) {
		return isType(f, 'function');
	}

	// NOT a common function: web excludes window
	function isList(v) {
		return !!v && v.length != _null && !isString(v) && !isNode(v) && !isFunction(v);
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

	///#snippet utilM

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
		self['_'] = _true;
	}

	function _() {
		return new M(arguments, _true);
	}

	///#/snippet utilM

	//// LIST FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	copyObj({
		// this function is only used if only Util is selected: Web contains a better version.
		'only': function(index) {
			return filter(this, function(v, i) { return i == index; });
		},

		///#snippet utilListFuncs
    /*$
     * @id each
     * @group LIST
     * @requires
     * @configurable default
     * @name .each()
     * @altname _.each()
     * @syntax list.each(callback)
     * @syntax _.each(list, callback)
     * @module UTIL, WEB
     * Invokes the given function once for each item in the list. The function will be called with the item as first parameter and 
     * the zero-based index as second.
     *
     * @example Creates the sum of all list entries. 
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
     * @param list a list to iterate. Can be an array, a ##list#Minified list## or any other array-like structure with 
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
	 * @requires 
	 * @configurable default
	 * @name .filter()
     * @altname _.filter()
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
     * @requires 
     * @configurable default 
     * @name .collect()
     * @altname _.collect
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
	 *        the result list. Other objects will also be added. Nulls and <var>undefined</var> will be ignored and not be added to 
	 *        the new result list. </dd></dl>
     * @return the new ##list#list##
     * 
     * @see ##map() is a simpler version of <var>collect()</var> that can be useful if there is a 1:1 mapping between
     *      input and output list.
     */ 
	'collect': listBindArray(collect),

	/*$ 
     * @id map 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .map()
     * @altname _.map()
     * @syntax list.map(mapFunc) 
     * @syntax _.map(list, mapFunc)
   	 * @module WEB, UTIL
     * Creates a new ##list#Minified list## from the current list using the given callback function. 
     * The callback is invoked once for each element of the current list. The callback results will be added to the result list.
     *  
	 * <var>map()</var> is a simpler version of ##collect(). Unlike <var>collect()</var>, it always creates lists of the same size as the input list, but 
	 * it is easier to use if the resulting list should contain nulls or nested list.
     * 
     * @example Goes through a list of numbers and creates a new list with each value increased by 1:
     * <pre> 
     * var inced = _(3, 7, 11, 5, 19, 3).map(function(number, index) { 
     *     return number + 1;
     * }); 
     * </pre> 
     * 
	 * @example The previous example with a native array is input. Note that the result is always a ##list#Minified list##:
     * <pre> 
     * var inced = _.map([3, 7, 11, 5, 19, 3], function(number, index) { 
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
     * 
     * @see ##collect() is a more powerful version of <var>map()</var>.
     */ 
	'map': listBindArray(map),

	/*$ 
	 * @id toobject
	 * @group LIST 
	 * @requires
	 * @configurable default 
	 * @name .toObject()
     * @altname _.toObject()
	 * @syntax list.toObject(value)
	 * @syntax _.toObject(keyList, value)
	 * @module UTIL
	 * Creates an object map from a list of keys and a single values.
	 * <var>toObject()</var> goes through all values of the key list and adds a property with this key and the given a value.

	 * @example Create a simple object map:
	 *  <pre> 
	 *  var map = _.toObject(['a', 'b', 'c'], 1);  // creates {a:1, b:1, c:1}
	 * </pre> 
	 * 
	 * @example Same result, but with a list method:
	 *  <pre> 
	 *  var map = _('a', 'b', 'c').toObject(1);  // creates {a:1, b:1, c:1}
	 * </pre> 
	 * 
	 * @param keyList A list or array to use for the keys of the new object.
	 * @param value the value to use
     * @return the new object
     */ 
	'toObject': listBind(toObject),

	/*$ 
	 * @id equals
	 * @group LIST 
	 * @requires
	 * @configurable default 
	 * @name .equals()
     * @altname _.equals()
	 * @syntax list.equals(otherObject)
	 * @syntax _.equals(thisObject, otherObject)
	 * @module UTIL
	 * Checks whether two values, lists or objects are equal in a deep comparison.
	 * 
	 * First <var>equals()</var> checks whether it got a function as parameter. 
	 * If yes, it will be invoked without arguments and <var>equals()</var> calls itself recursively with the function's result.
	 * 
	 * Once both values are no functions anymore, the values will be evaluated, If the first value is...
	 * <ul><li>...<var>null</var> or <var>undefined</var>, they are only equal if the other one is also either <var>null</var> or <var>undefined</var>.</li>
	 * <li>...a value as defined by ##_.isValue(), but not a Date, they are equal if the other value is the same type and is equal according to the '==' operator.</li>
	 * <li>...a Date, they are equal if the other value is a Date representing the same time.</li>
	 * <li>...a list or array, they are equal if the other value is also either a list or an array, has the same number of items and all items equal the items of the other
	 *         list at the same position. The equality of list items is determined recursively using the same rules, so you can also nest lists.</li>
	 * <li>...a function, it will be invoked without arguments and its return value is evaluated using these rules as if the value has been passed. </li>
	 * <li>...any other object, they are equal if they contain exactly the same keys (as defined by ##_.eachObj()) and all values are equal as determined using these rules
	 *      recursively.</li>
	 * </ul>
	 * 
	 * Please note that, according to the rules, a ##list#Minified list## is equal to an array, as long as their content is equal. <var>equals</var> does not 
	 * differentiate between <var>null</var> and <var>undefined</var>.
	 *
	 * <var>equals</var> is commutative. If you swap the parameters, the result is the same as long as no functions are involved.
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
     * @altname _.sub()
     * @syntax list.sub(startIndex) 
     * @syntax list.sub(startIndex, endIndex) 
     * @syntax _.sub(list, startIndex) 
     * @syntax _.sub(list, startIndex, endIndex) 
     * @module WEB, UTIL
     * Returns a new ##list#Minified list## containing only the elements in the specified range. If there are no elements in the range,
     * an empty list is returned.
     * Negative indices are supported and will be added to the list's length, thus allowing you to specify ranges at the list's end.
     *
     * If you only want to have a single element from the list, you can only use ##only().
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
     * @name .reverse()
     * @altname _.reverse()
     * @syntax list.reverse() 
     * @syntax _.reverse(list) 
     * @module UTIL
     * Returns a new ##list#Minified list## with the input list's elements in reverse order. The first element is swapped 
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
     * @return a new ##list#list## containing only the items in the index range. 
     */ 
	'reverse': listBindArray(reverse),

	/*$ 
     * @id find 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .find()
     * @altname _.find()
     * @syntax list.find(findFunc) 
     * @syntax list.find(element) 
     * @syntax list.find(findFunc, startIndex) 
     * @syntax list.find(element, startIndex) 
     * @syntax _.find(list, findFunc) 
     * @syntax _.find(list, element) 
     * @syntax _.find(list, findFunc, startIndex) 
     * @syntax _.find(list, element, startIndex) 
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
     * <var>find()</var can also be used as an alternative to ##each() if you need to abort the loop.
     *
     * @example Finds the first negative number in the list:
     * <pre> 
     * var i = _(1, 2, -4, 5, 2, -1).find(function(value, index) { if (value &lt; 0) return index; }); // returns 2
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
     * @param startIndex optional the 0-based index of the first element to search.
     * @return if called with an element, either the element's index in the list or <var>undefined</var> if not found. If called with a callback function,
     *         it returns either the value returned by the callback or <var>undefined</var>.
     *         
     * @see ##findLast() is the equivalent to <var>find()</var> for the list's end.
     */ 
 	'find': listBind(find),

    /*$ 
     * @id findlast
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .findLast()
     * @altname _.findLast()
     * @syntax list.findLast(findFunc) 
     * @syntax list.findLast(element) 
     * @syntax list.findLast(findFunc, startIndex) 
     * @syntax list.findLast(element, startIndex) 
     * @syntax _.findLast(list, findFunc) 
     * @syntax _.findLast(list, element) 
     * @syntax _.findLast(list, findFunc, startIndex) 
     * @syntax _.findLast(list, element, startIndex) 
     * @module WEB, UTIL
     * Finds the last occurrence of value in the list. There are two ways of calling <var>findLast()</var>:
     * <ol>
     * <li>With a value as argument. Then <var>findLast()</var> will search for the first occurrence of an identical value in the list,
     *     using the '===' operator for comparisons, and return the index. If it is not found,
     *     <var>findLast()</var> returns <var>undefined</var>.</li>
     * <li>With a callback function. <var>findLast()</var> will then call the given function for each list element until the function 
     *     returns a value that is not <var>null</var> or <var>undefined</var>. This value will be returned.</li>
     * </ol>
     *
     * @example Finds the first negative number in the list:
     * <pre> 
     * var i = _(1, 2, -4, 5, 2, -1, 2).findLast(function(value, index) { if (value &lt; 0) return index; }); // returns 5
     * </pre> 
	 *
     * @example Finds the index of the last 5 in the array:
     * <pre> 
     * var i = _.findLast([3, 6, 7, 6, 5, 4, 5], 5); // returns 6
     * </pre> 
	 *
     * @example Determines the last position of the element with the id '#wanted' among all &lt;li> elements:
     * <pre> 
     * var elementIndex = $('li').findLast($$('#wanted'));
     * </pre> 
     * 
     * @example Goes through the elements to find the last &lt;div> that has the class 'myClass', and returns this element:
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
     * @param startIndex optional the 0-based index of the first element to search.
     * @return if called with an element, either the element's index in the list or <var>undefined</var> if not found. If called with a callback function,
     *         it returns either the value returned by the callback or <var>undefined</var>.
     *         
     * @see ##find() is the equivalent to find values at the end of a list.
     */ 
 	'findLast': listBind(findLast),

    /*$ 
     * @id startswith 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .startsWith()
     * @altname _.startsWith()
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
     * 
     * @see ##endsWith() is the equivalent for the list's or string's end.
     */ 
 	'startsWith': listBind(startsWith),

    /*$ 
     * @id endswith 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .endsWith()
     * @altname _.endsWith()
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
     * 
     * @see ##startsWith() is the equalent for the beginning of a list or string.
     */ 
 	'endsWith': listBind(endsWith),

    /*$ 
     * @id contains 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .contains()
     * @altname _.contains()
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
     * 
     * @see ##find() finds the position of a list element's fist occurrence.
     * @see ##findLast() finds the last position of a list element.
     */ 
 	'contains': listBind(contains),

    /*$ 
     * @id call 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .call()
     * @altname _.call()
     * @syntax list.call() 
     * @syntax list.call(args) 
     * @syntax list.call(fThis) 
     * @syntax list.call(fThis, args) 
     * @syntax _.call(list) 
     * @syntax _.call(list, args) 
     * @syntax _.call(list, fThis) 
     * @syntax _.call(list, fThis, args) 
     * @module UTIL
     * Calls all functions in the list.
	 *
	 * <var>call</var> goes through all list items and, if they are functions, calls them with the specified arguments. 
	 * Elements that are not functions will be ignored. The return values of the functions will be written into a list
	 * of the same size and order as original list. If a input list item is not a function, the corresponding value in the result 
	 * list will be <var>undefined</var>.
     *
     * @param list A list containing the functions to call. Can be an array, a ##list#Minified list## or any other array-like structure with 
     *             <var>length</var> property.
     * @param args optional A list or array of arguments to pass to the functions.
     * @param fThis optional If set, a value to pass as <var>this</var>. Please note that if you use a list as <var>fThis</var>,
     *              you must set <var>args</var> also to an (possibly empty) array.
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
     * @altname _.array()
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
     * @altname _.unite()
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
     * @altname _.uniq()
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
     * @return A ##list#Minified list## without duplicates.
     */
	'uniq': listBindArray(uniq),

    /*$ 
     * @id intersection 
     * @group LIST 
     * @requires
     * @configurable default 
     * @name .intersection()
     * @altname _.intersection() 
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

	/*$ 
	 * @id join 
	 * @group LIST 
	 * @requires
	 * @configurable default 
	 * @name .join() 
	 * @syntax list.join() 
	 * @syntax list.join(separator) 
	 * @module UTIL
	 * Converts list elements into strings and joins them into a single string, optionally separated with the given separator.
	 * This method is identical to Array's built-in <var>join()</var> method and also uses it internally.
	 *
	 * @example Join a few string:
	 * <pre>var sorted = _('Harry', 'Bert', 'Tom', 'Bo').join(', '); // returns 'Harry, Bert, Tom, Bo'</pre>
	 *
	 * @param separator optional a separator to put between the joined strings. If omitted, the string "," (comma) will be used.
	 * @param otherList The other list of values. Can be an array, a ##list#Minified list## or any other array-like structure with 
	 *             <var>length</var> property.
	 * @return the resulting string
	 */
	'join': function(separator) {
		return map(this, nonOp).join(separator);
	},

	/*$ 
	 * @id sort 
	 * @group LIST 
	 * @requires
	 * @configurable default 
	 * @name .sort() 
	 * @syntax list.sort() 
	 * @syntax list.sort(cmpFunc) 
	 * @module UTIL
	 * Sorts the list elements and returns a new, sorted list. You can specify a function to compare two elements.
	 * If you don't, the list elements will be converted into strings and sorted lexicographically.
	 * 
	 * <var>sort()</var> uses Array's method of the same name internally and shares its properties.
	 *    
	 * @example Sort a few names:
	 * <pre>var sorted = _('Harry', 'Bert', 'Tom', 'Bo').sort(); // returns _('Bo', 'Bert', 'Harry', 'Tom')</pre>
	 *    
	 * @param cmpFunc optional an optional <code>function(a, b)</code> to compare two list elements. It must return a number &lt;0 if <var>a</var> is smaller, than <var>b</var> 
	 *                         &gt;0 if <var>b</var> is larger and 0 if both are equal. If the function is omitted, the list elements will be converted into strings and compared 
	 *                        lexicographically.
	 * @return a new, sorted list
	 */
	'sort': function(func) {
		return new M(map(this, nonOp).sort(func));
	},
	/*$
	 * @stop 
	 */
	///#/snippet utilListFuncs
	dummy:0
	}, M.prototype);

 	//// UNDERSCORE FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	///#snippet utilUnderscoreFuncs

	copyObj({
		 // @condblock filter
		'filter': funcArrayBind(filter),
		 // @condend
		 // @condblock collect
		'collect': funcArrayBind(collect),
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
		 // @condblock findlast
		'findLast': findLast,
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

	    /*$ 
	     * @id keys 
	     * @group OBJECT 
	     * @requires
	     * @configurable default 
	     * @name _.keys() 
	     * @syntax _.keys(obj) 
	     * @module UTIL
	     * Creates a ##list#Minified list## containing all property names of the specified object. Only direct properies are
	     * included, not inherited ones. The order of the keys in the list is undefined and runtime-specific.
		 *
		 * @example Using <var>keys()</var>:
		 * <pre>var obj = {a: 2, b: 52};
		 * var keys = _.keys(obj);  // keys contains ['a', 'b'] now
		 * </pre>
		 *
	     * @param object The object to gather keys from.
	     * @return A Minified list containing the property names.
	     * 
	     * @see ##_.values() returns the values of an object as a list.
	     */
		'keys': funcArrayBind(keys),

	    /*$ 
	     * @id objvalues 
	     * @group OBJECT 
	     * @requires
	     * @configurable default 
	     * @name _.values() 
	     * @syntax _.values(obj) 
	     * @module UTIL
	     * Creates a ##list#Minified list## containing all property values of the specified object. Only direct properies are
	     * included, not inherited ones. The order of the values in the list is undefined and runtime-specific.
		 *
		 * @example Using <var>values()</var>:
		 * <pre>var obj = {a: 2, b: 52};
		 * var values = _.values(obj);  // keys contains [2, 52] now
		 * </pre>
		 * 
		 * @param object The object to gather values from.
	     * @return A Minified list containing the property names.
	     * 
	     * @see ##_.keys() retrieves the property names of an object as a list.
	     */
		'values': funcArrayBind(values),

		/*$
		 * @id copyobj
		 * @group OBJECT
		 * @requires 
		 * @configurable default
		 * @name _.copyObj()
		 * @syntax _.copyObj(from, to)
		 * @module UTIL
		 * Copies every property of the first object into the second object. The properties are copied as shallow-copies. Only own properties
		 * are copied, but not inherited properties.
		 * 
		 *  @example Copying properties:
		 * <pre>var target = {a:3, c: 3};
		 * _.copyObj({a: 1, b: 2}, target); // target is now {a: 1, b: 2, c: 3}</pre>
		 *
		 *  @example Inline property merge:
		 * <pre>var target = _.copyObj({a: 1, b: 2}, {a:3, c: 3}); // target is now {a: 1, b: 2, c: 3}</pre>
		 *
		 * @param from the object to copy from
		 * @param to the object to copy to
		 * @return the object that has been copied to
		 * 
		 * @see ##extend() is very similar to <var>copyObj()</var>, but with a slightly different syntax.
		 */
		'copyObj': copyObj,

		/*$
		 * @id extend
		 * @group OBJECT
		 * @requires 
		 * @configurable default
		 * @name _.extend()
		 * @syntax _.extend(target, src...)
		 * @module UTIL
		 * Copies every property of the source objects into the first object. The source objects are specified using variable arguments. 
		 * There can be more than one. If a source parameter is <var>undefined</var> or <var>null</var>, it will be ignored.
		 * The properties are copied as shallow-copies. <var>undefined</var> values will not be copied or inherited properties
		 * will not be copied.
		 * 
		 * <b>Please note:</b> Unlike jQuery, <var>extend</var> does not directly a function to extend Minified, although
		 * you can use it to for this. To add a function to ##list#Minified lists##, add a property to
		 * ##M#MINI.M##. If you want to extend <var>$</var> or <var>_</var>, just assign the new function(s) as property.
		 * 
		 *  @example Copying properties:
		 * <pre>var target = {a:3, c: 3};
		 * _.extend(target, {a: 1, b: 2}); // target is now {a: 1, b: 2, c: 3}</pre>
		 *
		 *  @example Using several source values:
		 * <pre>var extend = _.copyObj({a: 1, b: 2}, {a:3, c: 3}, {d: 5}); // target is now {a: 1, b: 2, c: 3, d: 5}</pre>
		 *
		 * @param target the object to copy to
		 * @param src the object(s) to copy from. Variable argument, there can be any number of sources. Nulls and <var>undefined</var>
		 *            parameters will be ignored.
		 * @return the target
		 *
		 * @see ##copyObj() is very similar to <var>extend()</var>, but with a slightly different and more straightforward syntax.
		 */
		'extend': extend,

		/*$ 
		 * @id range 
		 * @group FUNC 
		 * @requires
		 * @configurable default 
		 * @name _.range() 
		 * @syntax _.range(end) 
		 * @syntax _.range(start, end) 
		 * @module LIST
		 * Creates a new ##list#Minified list## containing an interval of numbers from <var>start</var> (inclusive)
		 * until <var>end</var> (exclusive). <var>start</var> can also be omitted to start at 0.
		 *
		 * @example Creates some ranges
		 * <pre>var l123 = _.range(1, 4);      // same as _(1, 2, 3)
		 * var l0123 = _.range(3);        // same as _(0, 1, 2)
		 * var neg123 = _.range(-3, 0);   // same as _(-3, -2, -1)
		 * var empty = _.range(2,1);      // same as _()</pre>	
		 *
		 * @param start optional the start number. If omitted, the range starts at 0.
		 * @param end the end of the range (exclusive)
		 * @return the new Minfied list containing the numbers. Empty is <var>start</var> is not smaller than <var>end</var>.
		 */		
		'range': function(start, end) {
			var r = [], e = (end==_null) ? start : end;
			for (var i = (end!=_null)?start:0; i < e; i++)
				r.push(i);
			return new M(r);
		},

		/*$ 
		 * @id bind 
		 * @group FUNC 
		 * @requires
		 * @configurable default 
		 * @name _.bind() 
		 * @syntax _.bind(f, fThis) 
		 * @syntax _.bind(f, fThis, beforeArgs) 
		 * @syntax _.bind(f, fThis, beforeArgs, afterArgs) 
		 * @module UTIL
		 * Creates a new function that calls the given function bound to the given object as 'this', and optionally with the specified 'pre-filled' arguments
		 * to be appended or prepended to the arguments you all the new function with.
		 *
		 * See also ##_.partial(), if you do not need to set 'this'.
		 *
		 * @example Create a method that multiplies all list elements:
		 * <pre>function mul(factor) { return this.map(function(v) { return v * factor; }; }
		 * var myList = _(1, 2, 3);
		 * var mulMyList = _.bind(mul, myList);       // binding only 'this'
		 * var mulMyList5 = _.bind(mul, myList, 5);   // binding 'this' and prepending a parameter
		 * 
		 * var myList4 = mulMyList(4); // returns _(4, 8, 12)
		 * var myList5 = mulMyList(); // returns _(5, 10, 15)</pre>	
		 *
		 * @param f the function to bind
		 * @param fThis the object to pass as 'this'. Please note JavaScript's limitations for 'this'. If you attempt to pass a string or number, they will be wrapped using
		 *              JavaScript's wrapper classes String and Number.
		 * @param beforeArgs optional either a list of values to insert in front of the arguments, or a single non-list value to put in front. If null or not set,
		 *                             there won't be any arguments inserted. If you need to insert a <var>null</var>, <var>undefined</var> or a list, just wrap them in an array 
		 *                             (e.g. <code>[null]</code>).
		 * @param afterArgs optional either a list of values to append to the end of the arguments, or a single non-list value to append. If null or not set,
		 *                             there won't be any arguments appended. If you need to append a <var>null</var>, <var>undefined</var> or a list, just wrap them in an array 
		 *                             (e.g. <code>[null]</code>).
		 * @return the new function that will invoke <var>f</var> with its arguments modified as specified about.
		 * 
		 * @see _.partial() is similar to <var>bind()</var>, but without the 'this' argument.
		 */
		'bind': bind,

		/*$ 
	 	 * @id partial 
		 * @group FUNC 
		 * @requires
		 * @configurable default 
		 * @name _.partial() 
		 * @syntax _.partial(f, beforeArgs) 
		 * @syntax _.partial(f, beforeArgs, afterArgs) 
		 * @module UTIL
		 * Creates a new function that calls the given function with some arguments pre-filled. You can specify one or more arguments to 
		 * be put in front of the arguments list as well as arguments that will be appended to the argument list.
		 *
		 * See also ##_.bind(), if you want to set 'this' as well.
		 * 
		 * @example Create functions that divide:
		 * <pre>function div(a, b) { return a / b; }
		 * var div5 = _.partial(add, 5);         // like function(a) { return 5 / a; }
		 * var divBy5 = _.partial(add, null, 5); // like function(a) { return a / 5; }
		 * </pre>
		 *
		 * @example Create functions that remove characters from the beginning and/or end of a string:
		 * <pre>// This function multiplies the first <var>count</var> items of the <var>list</var> by <var>factor</var>
		 * function multiply(list, count, factor) { 
		 *     return list.map(function(v, index) { 
		 *         return index &lt; count ? factor * v : v; 
		 *     }); 
		 * }
		 * 
		 * var mul3by2 = _.partial(multiply, null, [3, 2]); 
		 * var r1 = mul10by2(_(1, 2, 3, 4, 5));   // returns _(2, 4, 6, 4, 5)
		 * 
		 * var mul123 = _.partial(multiply, [_(1, 2, 3)]);                // array wrapper required to pass a list!
		 * var r2 = mul123(2, 5);                 // returns _(5, 10, 3)
		 * 
		 * var mul12345By2 = _.partial(multiply, [_(1, 2, 3, 4, 5)], 2);  // array wrapper required!
		 * var r3 = mul12345By2(3);               // returns _(2, 4, 6, 4, 5)
		 * </pre>
		 *
		 * @param f the function to bind
		 * @param beforeArgs either a list of values to insert in front of the arguments, or a single non-list value to put in front. If null or not set,
		 *                             there won't be any arguments inserted. If you need to insert a <var>null</var>, <var>undefined</var> or a list, just wrap them in an array 
		 *                             (e.g. <code>[null]</code>).
		 * @param afterArgs optional either a list of values to append to the end of the arguments, or a single non-list value to append. If null or not set,
		 *                             there won't be any arguments appended. If you need to append a <var>null</var>, <var>undefined</var> or a list, just wrap them in an array 
		 *                             (e.g. <code>[null]</code>).
		 * @return the resulting string
		 * 
		 * @see ##_.bind() is similar to <var>partial()</var>, but allows you to set 'this'.
		 */
		'partial': partial,

		/*$
		 * @id eachobj
		 * @group OBJECT
		 * @requires 
		 * @configurable default
		 * @name _.eachObj()
		 * @syntax _.eachObj(obj, callback)
		 * @module UTIL
		 * Invokes the given function once for each property of the given object. The callback is not invoked for inherited properties.
		 *
		 * @example Dumps all properties of an object.
		 * <pre>
		 * var s = '';
		 * _.eachObj({a: 1, b: 5, c: 2}, function(key, value) {
		 *     s += 'key=' + key + ' value=' + value + '\n';
		 * });
		 * </pre>
		 * 
		 * @param obj the object to use
		 * @param callback The callback <code>function(key, value)</code> to invoke for each property. 
		 *                 <dl><dt>key</dt><dd>The name of the current property.</dd>
		 *                 <dt>value</dt><dd>The value of the current property.</dd></dl>
		 *                 The callback's return value will be ignored.
		 * @return the object
		 * 
		 * @see ##_.each() iterates through a list.
		 */
		'eachObj': eachObj,

		/*$
		 * @id mapobj
		 * @group OBJECT
		 * @requires 
		 * @configurable default
		 * @name _.mapObj()
		 * @syntax _.mapObj(obj, callback)
		 * @module UTIL
		 * Creates a new object with the same properties but different values using the given callback function. The function is called
		 * for each property of the input object to provice a new value for the property.
		 *
		 * @example Increases the values of all properties.
		 * <pre>
		 * var r = _.mapObj({a: 1, b: 5, c: 2}, function(key, value) {
		 *     return value + 1;
		 * });
		 * // r is now {a: 2, b: 6, c: 2}
		 * </pre>
		 * 
		 * @param obj the object to use
		 * @param callback The callback <code>function(key, value)</code> to invoke for each property. 
		 *                 <dl><dt>key</dt><dd>The name of the current property.</dd>
		 *                 <dt>value</dt><dd>The value of the current property.</dd>
		 *                 <dt class="returnValue">(callback return value)</dt><dd>This value will replace the original value in the new object.</dd></dl>
		 * @return the new object
		 * 
		 * @see ##_.filterObj() filters an object.
		 * @see ##map() maps a list.
		 */
		'mapObj': mapObj,

		/*$
		 * @id filterobj
		 * @group OBJECT
		 * @requires 
		 * @configurable default
		 * @name _.filterObj()
		 * @syntax _.filterObj(obj, filterFunc)
		 * @module UTIL
		 * Creates a new object that contains only those properties of the input object that have been approved by the filter function.
		 *  
		 * If the callback function returns true, the property and its value are shallow-copied in the new object, otherwise it will be removed.
		 *
		 * @example Removing all values over 10 from an object:
		 * <pre>
		 * var list = _.filterObj({a: 4, b: 22, c: 7, d: 2, e: 19}, function(key, value) {
		 *     return value &lt;= 10;
		 * });
		 * </pre>
		 * 
		 * @param obj the object to use
		 * @param callback The callback <code>function(key, value)</code> to invoke for each property. 
		 *                 <dl><dt>key</dt><dd>The name of the current property.</dd>
		 *                 <dt>value</dt><dd>The value of the current property.</dd>
		 *                 <dt class="returnValue">(callback return value)</dt><dd><var>true</var> to include the property in the new object, <var>false</var> to omit it.</dd></dl>
		 * @return the new object
		 * 
		 * @see ##_.mapObj() can be used to modify the values og an object.
		 */
		'filterObj': filterObj,

		/*$
		 * @id islist
		 * @group TYPE
		 * @requires 
		 * @configurable default
		 * @name _.isList()
		 * @syntax _.isList(obj)
		 * @module UTIL
		 * Checks whether the given object resembles a list or array. To qualify, it must have a <var>length</var> property, but must not be a string, a function or have a 
		 * <var>nodeType</var> property.
		 *
		 * @param obj the object to test
		 * @return <var>true</var> if the object is a list or array, <var>false</var> otherwise.
		 */
		'isList': isList,

		/*$
		 * @id isfunction
		 * @group TYPE
		 * @requires 
		 * @configurable default
		 * @name _.isFunction()
		 * @syntax _.isFunction(obj)
		 * @module UTIL
		 * Checks whether the given object is a function.
		 *
		 * @param obj the object to test
		 * @return <var>true</var> if the object is a function, <var>false</var> otherwise.
		 */
		'isFunction': isFunction,

		/*$
		 * @id isobject
		 * @group TYPE
		 * @requires 
		 * @configurable default
		 * @name _.isObject()
		 * @syntax _.isObject(obj)
		 * @module UTIL
		 * Checks whether the given reference is an object as defined by <var>typeof</var>.
		 *
		 * @param obj the object to test
		 * @return <var>true</var> if the object is an object, <var>false</var> otherwise.
		 */
		'isObject': isObject,

		/*$
		 * @id isnumber
		 * @group TYPE
		 * @requires 
		 * @configurable default
		 * @name _.isNumber()
		 * @syntax _.isNumber(obj)
		 * @module UTIL
		 * Checks whether the given reference is a number as defined by <var>typeof</var>.
		 *
		 * @param obj the object to test
		 * @return <var>true</var> if the object is a number, <var>false</var> otherwise.
		 * 
		 * @see ##_.isValue() matches basic types such as dates numbers.
		 */
		'isNumber': isNumber,

		/*$
		 * @id isbool
		 * @group TYPE
		 * @requires 
		 * @configurable default
		 * @name _.isBool()
		 * @syntax _.isBool(obj)
		 * @module UTIL
		 * Checks whether the given reference is a boolean <var>true</var>  or <var>false</var>.
		 *
		 * @param obj the object to test
		 * @return <var>true</var> if the object is a boolean, <var>false</var> otherwise.
		 *
		 * @see ##_.isValue() matches basic types such as booleans.
		 */
		'isBool': isBool,

		/*$
		 * @id isdate
		 * @group TYPE
		 * @requires 
		 * @configurable default
		 * @name _.isDate()
		 * @syntax _.isDate(obj)
		 * @module UTIL
		 * Checks whether the given object is a <var>Date</var>. To be recognized as a date, the object
		 * must pass ##_.isObject() and have a <var>getDate</var> property.
		 *
		 * @param obj the object to test
		 * @return <var>true</var> if the object is a <var>Date</var>, <var>false</var> otherwise.
		 * 
		 * @see ##_.isValue() matches basic types such as dates.
		 */
		'isDate': isDate,

		/*$
		 * @id isvalue
		 * @group TYPE
		 * @requires 
		 * @configurable default
		 * @name _.isValue()
		 * @syntax _.isValue(obj)
		 * @module UTIL
		 * Checks whether the given object is a value. Minified defines values as all basic types (strings, booleans and numbers)
		 * and Dates.
		 *
		 * @param obj the object to test
		 * @return <var>true</var> if the object is a value, <var>false</var> otherwise.
		 * 
		 * @see ##_.isString() checks for a string.
		 * @see ##_.isNumber() checks for a number.
		 * @see ##_.isBool() checks for a boolean.
		 * @see ##_.isDate() checks for a date.
		 */
		'isValue': isValue,

		/*$
		 * @id isstring
		 * @group TYPE
		 * @requires 
		 * @configurable default
		 * @name _.isString()
		 * @syntax _.isString(object)
		 * @module UTIL
		 * Checks whether the given reference is a string as defined by <var>typeof</var>.
		 *
		 * @param obj the object to test
		 * @return <var>true</var> if the object is a string, <var>false</var> otherwise.
		 * 
		 * @see ##_.isValue() matches basic types such as strings.
		 */
		'isString': isString,

		/*$
		 * @id tostring
		 * @group TYPE
		 * @requires 
		 * @configurable default
		 * @name _.toString()
		 * @syntax _.toString(obj)
		 * @module UTIL
		 * Converts the given object to a string. <var>null</var> and <var>undefined</var> will be converted to an empty string.
		 *
		 * @param obj the object to convert
		 * @return the resulting string
		 */
		'toString': toString,

		/*$
		 * @id dateclone
		 * @group DATE
		 * @requires 
		 * @configurable default
		 * @name _.dateClone()
		 * @syntax _.dateClone(date)
		 * @module UTIL
		 * Creates a new <var>Date</var> object that represents the same time as the given date.
		 *
		 * @param date the <var>Date</var> to clone
		 * @return the new <var>Date</var> copy
		 */
		'dateClone': dateClone,

		/*$
		 * @id dateadd
		 * @group DATE
		 * @requires 
		 * @configurable default
		 * @name _.dateAdd()
		 * @syntax _.dateAdd(date, property, value)
		 * @module UTIL
		 * Adds the specified time to the given <var>Date</var> and returns the result as a new <var>Date</var> .  The unit for the <var>value</var> can be any <var>Date</var>
		 * property that has get and set methods: 'fullYear', 'month', 'date', 'hours', 'minutes', 'seconds' or 'milliseconds'.
		 * 
		 * @example Calculate some dates based on the current time:
		 * <pre>var now = new Date();
		 * var yesterday = _.dateAdd(now, 'date', -1);
		 * var inOneHour = _.dateAdd(now, 'hours', 1);
		 * var tomorrow = _.dateAdd(now, 'date', 1);
		 * var inThreeMonths = _.dateAdd(now, 'month', 3);</pre>
		 *
		 * @param date the <var>Date</var> to add to
		 * @param property a property name to represent the unit of the <var>value</var>. Can be 'fullYear', 'month', 'date', 'hours', 'minutes', 'seconds' or 'milliseconds'.
		 * @param value the amount to add
		 * @return the new <var>Date</var> copy
		 */
		'dateAdd': dateAdd,

		/*$
		 * @id datediff
		 * @group DATE
		 * @requires 
		 * @configurable default
		 * @name _.dateDiff()
		 * @syntax _.dateDiff(property, date1, date2)
		 * @module UTIL
		 * 
		 * Calculates the time difference between both dates, using in the unit determined by the <var>property</var>.
		 * 
		 * If the unit is not calendar-based ('hours', 'minutes', 'seconds' or 'milliseconds')
		 * the result is calculated with full precision and not rounded. 
		 * If the unit is calendar-based ('fullYear', 'month', 'date'),
		 * the result is the amount of full units between those dates in the current time zone.
		 * 
		 * If <var>date2</var> is earlier than <var>date1</var>, the result is negative.
		 * 
		 * @example Calculate duration between two dates:
		 * <pre>function diff(d1, d2) {
		 *     return _.dateDiff('fullYears', d1, d2) + ' years,' +
		 *            _.dateDiff('months', d1, d2) + ' months and' +
		 *            _.dateDiff('date', d1, d2) + ' days';
		 * }</pre>
		 *
		 * @param date1 the first <var>Date</var>
		 * @param date2 the first <var>Date</var>
		 * @param property a property name to represent the unit of the <var>value</var>. Can be 'fullYear', 'month', 'date', 'hours', 'minutes', 'seconds' or 'milliseconds'.
		 * @return the time difference between the two dates. Negative if <var>date2</var> is earlier than <var>date1</var>.
		 */
		'dateDiff': dateDiff,

		/*$
		 * @id datemidnight
		 * @group DATE
		 * @requires 
		 * @configurable default
		 * @name _.dateMidnight()
		 * @syntax _.dateMidnight()
		 * @syntax _.dateMidnight(date)
		 * @module UTIL
		 * 
		 * Returns a new <var>Date</var> object with the same calendar date, but at midnight in the current time zone. If no parameter 
		 * is given, it returns the current day at midnight.
		 *
		 * @param date optional the <var>Date</var>. If omitted, the current date is used.
		 * @return a new <var>Date</var> representing midnight in the current time zone
		 */
		'dateMidnight': dateMidnight,

		/*$
		 * @id pad
		 * @group FORMAT
		 * @requires 
		 * @configurable default
		 * @name _.pad()
		 * @syntax _.pad(digits, number)
		 * @module UTIL
		 * 
		 * Converts a number into a string by 'padding' it with leading zeros until it has at least the given number of digits.
		 *
		 * @param digits the minimum number of digits for the number
		 * @param number the number to format
		 * @return the number converted to a string and padded with zeros
		 * 
		 * @see ##_.formatValue() offers real formatting of numbers.
		 */
		'pad' : pad,

		/*$
		 * @id formatvalue
		 * @group FORMAT
		 * @requires date_constants
		 * @configurable default
		 * @name _.formatValue()
		 * @syntax _.formatValue(format, value)
		 * @module UTIL
		 * 
		 * Formats a single value as a string, using the given format template.  It has support for numbers, dates, booleans and strings.
		 * 
		 * <b>Choice Formatting</b><br/>
		 * With a choice format, you can map input values into output values. In the format string the choices are separated by pipes ('|')
		 * and each choice has the format <code>&ltcmp>&ltvalue>:&lt;result></code>:
		 * <ul><li>&lt;cmp> is a comparison operator ('=', '>', '&lt;', '>=', '&lt;='), but can be omitted to check for equality.</li>
		 * <li>&lt;value> is the value as string.</li>
		 * <li>&lt;result> is the result, either a string or a number format</li></ul>
		 * You can have a default choice at the end without &lt;cmp> or &lt;value>.
		 * 
		 * <b>Examples</b> 
		 * <pre>_.formatValue('true:is True|is False', value);
		 * _.formatValue('&lt;5:under 5|&gt;=15:at least 15|=7:is seven|some other number', value);
		 * _.formatValue('1:one item|2:two items|&gt;3:many items', value);
		 * _.formatValue('ERR:error|WARN:warning|INFO:info|debug', value);
		 * </pre>
		 *
		 * <b>Number Formatting</b><br/> 
		 * Number formatting allows you to specify the number of digits before and optionally after the decimal separator, the decimal separator itself
		 * as well as how to group digits. The following characters are used in the format:
		 * 
		 * <table><tr><th>Character</th><th>Description</th></tr>
		 * <tr><td>#</td><td>Optional digit before decimal separator.</td></tr>
		 * <tr><td>0</td><td>Required digit before decimal separator (0 if number is smaller).</td></tr>
		 * <tr><td>.</td><td>Either decimal separator or group separator, depending on position.</td></tr>
		 * <tr><td>,</td><td>Either decimal separator or group separator, depending on position.</td></tr>
		 * </table>
		 * 
		 * If you only define a group separator, but not a decimal separator, the group separator must appear
		 * at least twice in the format. Otherwise it will be considered a decimal separator. Please note that when you
		 * have several group separators, Minified counts only the number of digit between its first and second
		 * appearance to determine how to group the digits. If you have only one group separator and a decimal separator, 
		 * the number of digits between them is used to format the number. 
		 * 
		 * <b>Examples</b> 
		 * <pre>var v1  = _.formatValue('#', 15); // '15'
		 * var v2  = _.formatValue('####', 15);   // '15' (same as '#')
		 * var v3  = _.formatValue('0000', 15);   // '0015'
		 * var v4  = _.formatValue('#.###', 15.14274); // '15.143'
		 * var v5  = _.formatValue('#.000', 15.14274); // '15.143'
		 * var v6  = _.formatValue('#.###', 15.1);     // '15.1'
		 * var v7  = _.formatValue('#.000', 15.1);     // '15.100'
		 * var v8  = _.formatValue('000,000', 15.1);   // '015,100'
		 * var v9  = _.formatValue('#.###', 15);     // '15'
		 * var v10 = _.formatValue('#.000', 15);    // '15.000'
		 * var v11 = _.formatValue('#,###', 15.1);  // '15,1' (comma as decimal separator)
		 * var v12 = _.formatValue('###,###,###', 92548);    // '92,548' (grouped digits)
		 * var v13 = _.formatValue('000,000.###', 92548.42); // '92,548.42'
		 * var v14 = _.formatValue('000.000,###', 92548.42); // '92.548,42' (comma as separator)
		 * var v15 = _.formatValue('&lt;10:#.00|&lt;100:#.0|#', 7.356); // '7.36' (choice format)
		 * var v16 = _.formatValue('&lt;10:#.00|&lt;100:#.0|#', 25.04); // '25.0' 
		 * var v17 = _.formatValue('&lt;10:#.00|&lt;100:#.0|#', 71.51); // '72' 
		 * </pre>
		 * 
		 * <b>Choice Number Formatting</b><br/>
		 * It is possible to combine number formatting with choices. You can also use additional characters in a number format.
		 * 
		 * <b>Examples</b> 
		 * <pre>_.formatValue('$#.00', 17);  // '$17.00'
		 * _.formatValue('0:no eggs|1:1 egg|>1:# eggs', 12);  // '12 eggs'
		 * </pre>
		 *
		 * <b>Date Formatting</b><br/> 
		 * In a date format, there are a number of reserved characters that represent parts of the date. If you repeat the same character, you
		 * specify the minimum number of digits. Some elements allow a comma-separated list of translations in angular brackets, see below.
		 * <table>
		 * <tr><th>Character</th><th>Description</th></tr>
		 * <tr><td>y</td><td>Year (4 digits)</td></tr>
		 * <tr><td>Y</td><td>Year (2 digits)</td></tr>
		 * <tr><td>M</td><td>Month (1-12)</td></tr>
		 * <tr><td>n</td><td>Month as short name ('Jan', 'Feb'...). Supports translations.</td></tr>
		 * <tr><td>N</td><td>Month as long name ('January', 'February'...). Supports translations.</td></tr>
		 * <tr><td>d</td><td>Day of month (1-31)</td></tr>
		 * <tr><td>m</td><td>Minutes (0-59)</td></tr> 
		 * <tr><td>H</td><td>Hours in 24h format (0-23)</td></tr>
		 * <tr><td>h</td><td>Hours in 12h format (1-12)</td></tr> 
		 * <tr><td>K</td><td>Hours in 0-based 12h format (0-11)</td></tr>
		 * <tr><td>k</td><td>Hours in 1-based 24h format (1-24)</td></tr> 
		 * <tr><td>s</td><td>Seconds (0-59)</td></tr>
		 * <tr><td>S</td><td>Milliseconds (0-999)</td></tr>
		 * <tr><td>a</td><td>Either 'am' or 'pm'. Supports translations.</td></tr>
		 * <tr><td>w</td><td>Day of week as short name ('Sun', 'Mon'...). Supports translations.</td></tr>
		 * <tr><td>W</td><td>Day of week as long name ('Sunday', 'Monday'...). Supports translations.</td></tr>
		 * <tr><td>z</td><td>Timezone offset, e.g. '+0700'</td></tr>
		 * </table>
		 * <var>formatValue</var> also supports formatting a date in a different timezone. You only need to put the timezone in brackets at the front of
		 * the format, e.g. '[+0100]'.
		 *
		 * <b>Examples</b> 
		 * <pre>var now = new Date();
		 * var v1  = _.formatValue('y-M-d', now);       // e.g. '2013-7-9'
		 * var v2  = _.formatValue('yyyy-MM-dd', now);  // e.g. '2013-07-09'
		 * var v3  = _.formatValue('yyyy-MM-ddTHH:mm:ss.SS z', now); // e.g. '2013-07-09T23:07:38.472 +0700'
		 * var v4  = _.formatValue('MM/dd/YY h:mm:ss a', now);       // e.g. '07/09/13 11:07:38 pm'
		 * var v5  = _.formatValue('dd.MM.yyyy HH:mm:ss', now);      // e.g. '09.07.2013 23:07:38'
		 * var v6  = _.formatValue('H:mm', now);                // e.g. '23:07'
		 * var v7  = _.formatValue('W, N d y', now);            // e.g. 'Tuesday, July 9 2013'
		 * var v8  = _.formatValue('Nd', now);                  // e.g. 'July9'
		 * var v9  = _.formatValue('d.N[Januar,Februar,M&auml;rz,April,Mai,Juni,Juli,'+
		 *             'August,September,Oktober,November,Dezember]', now); // German translation: '9. Juli'
		 * var v10 = _.formatValue('[+0100]yyyy-MM-dd h:mm a', now);  // different timezone: '2013-07-09 5:07 pm' 
		 * </pre>
		 *
		 * @param format the format that describes the output
		 * @param value the value to format. Either a Date, a number, a string or a value that can be converted to a string.
		 * @return the string-formatted value
		 * 
		 * @see ##_.pad() will pad a number with zeros.
		 * @see ##_.parseDate() parses a date.
		 * @see ##_.parseNumber() parses a number.
		 * @see ##_.format() allows more complex formats.
		 */
		'formatValue': formatValue,

		/*$
		 * @id parsedate
		 * @group FORMAT
		 * @requires date_constants
		 * @configurable default
		 * @name _.parseDate()
		 * @syntax _.parseDate(format, dateString)
		 * @module UTIL
		 * 
		 * Parses the given string as Date using the given format. The format specifies which date component is expected where in the string.
		 * It can also be used to specify the timezone of the input string, and it may specify whether an empty string (including strings containing
		 * only whitespace) is allowed.
		 *
		 * In the date format there are a number of reserved characters that are used as placeholders of date components. If you put a single
		 * character in the format, this will match numbers of any length. If you have two or more of the same character, this is recognized as
		 * fixed-length string.<br/>
		 * Some placeholders, such as month names, support translations. To parse dates in other languages, you can specify a comma-separated
		 * list of translations in brackets following the placeholder.<br/>
		 * The following placeholder characters are supported.
		 * <table>
		 * <tr><th>Character</th><th>Description</th></tr>
		 * <tr><td>y</td><td>Year (4 digits)</td></tr>
		 * <tr><td>Y</td><td>Year (2 digits, 2000-based)</td></tr>
		 * <tr><td>M</td><td>Month (1-12)</td></tr>
		 * <tr><td>n</td><td>Month as short name ('Jan', 'Feb'...). Supports translations.</td></tr>
		 * <tr><td>N</td><td>Month as long name ('January', 'February'...). Supports translations.</td></tr>
		 * <tr><td>d</td><td>Day of month (1-31)</td></tr>
		 * <tr><td>m</td><td>Minutes (0-59)</td></tr> 
		 * <tr><td>H</td><td>Hours in 24h format (0-23)</td></tr>
		 * <tr><td>h</td><td>Hours in 12h format (1-12)</td></tr> 
		 * <tr><td>K</td><td>Hours in 0-based 12h format (0-11)</td></tr>
		 * <tr><td>k</td><td>Hours in 1-based 24h format (1-24)</td></tr> 
		 * <tr><td>s</td><td>Seconds (0-59)</td></tr>
		 * <tr><td>S</td><td>Milliseconds (0-999)</td></tr>
		 * <tr><td>a</td><td>Either 'am' or 'pm'. Supports translations.</td></tr>
		 * <tr><td>w</td><td>Day of week as short name ('Sun', 'Mon'...). Supports translations.</td></tr>
		 * <tr><td>W</td><td>Day of week as long name ('Sunday', 'Monday'...). Supports translations.</td></tr>
		 * <tr><td>z</td><td>Timezone offset, e.g. '+0700'</td></tr>
		 * </table>
		 * If you prefix the input string with a question mark ('?'), this means that the date is optional. If the input string is empty or consists
		 * solely of whitespace, <var>parseDate</var> will return null.<br/>
		 * <var>parseDate()</var> also supports parsing a date in a different timezone. You only need to put the timezone in brackets at the front of
		 * the format, e.g. '[+0100]'.<br/>
		 * 
		 * All other characters  are expected to be identical in format and input string, with the exception of whitespace. Each whitespace character 
		 * in the format can match any number of other whitespace characters in the input string, but at least one.
		 *
		 * Any components that are not in the format will be set to 0. For example, if your format has only date, month and day, the resulting 
		 * date will be at midnight.
		 *
		 * @example Parsing dates in various formats.
		 * <pre>
		 * var v1  = _.parseDate('y-M-d', '2013-7-9');
		 * var v2  = _.parseDate('?yyyyMMdd', '20130709');
		 * var v3  = _.parseDate('?yyyyMMdd', ' ');  // returns null
		 * var v4  = _.parseDate('yyyy-MM-ddTHH:mm:ss.SS z', '2013-07-09T23:07:38.472 +0700');
		 * var v5  = _.parseDate('MM/dd/YY h:mm:ss a', '07/09/13 11:07:38 pm');
		 * var v6  = _.parseDate('dd.MM.yyyy HH:mm:ss', '09.07.2013 23:07:38');
		 * var v7  = _.parseDate('W, N d y', 'Tuesday, July 9 2013');
		 * var v8  = _.parseDate('d.N[Januar,Februar,Maerz,April,Mai,Juni,Juli,'+
		 *             'August,September,Oktober,November,Dezember] y', '9. Juli 2013'); // parsing german
		 * var v9  = _.parseDate('[+0100]yyyy-MM-dd h:mm a', '2013-07-09 5:07 pm');  // different timezone:  
		 * </pre>
		 *
		 * @param format the format that describes the output
		 * @param dateString the string-formatted date to parse
		 * @return the Date; <var>undefined</var> if parsing failed; or <var>null</var> if the string was empty and 
		 *              the date format is flagged as optional ('?' at the beginning)
		 *              
		 * @see ##_.formatValue() can format dates using the same syntax.
		 */
		'parseDate': parseDate,

		/*$
		 * @id parsenumber
		 * @group FORMAT
		 * @requires 
		 * @configurable default
		 * @name _.parseNumber()
		 * @syntax _.parseNumber(format, numberString)
		 * @module UTIL
		 * 
		 * Parses the given string as number using the given format. <var>parseNumber</var> uses the same format as <var>formatValue</var>,
		 * but does not support choices. These are the allowed placeholders in the format:
		 * <table>
		 * <tr><th>Character</th><th>Description</th></tr>
		 * <tr><td>#</td><td>Optional digit before decimal separator.</td></tr>
		 * <tr><td>0</td><td>Required digit before decimal separator (0 if number is smaller).</td></tr>
		 * <tr><td>_</td><td>Optional digit after decimal separator.</td></tr>
		 * <tr><td>9</td><td>Required digit after decimal separator (0 if number is smaller).</td></tr>
		 * <tr><td>.</td><td>Either decimal separator or group separator, depending on position.</td></tr>
		 * <tr><td>,</td><td>Either decimal separator or group separator, depending on position.</td></tr>
		 * </table>
		 *
		 * The format string is mainly used to find out what the decimal separator is ('.' or ','). It defaults to '.'. 
		 *
		 * <var>parseNumber</var> will ignore any non-numeric characters at the beginning or end of the input string.
		 *
		 * If you prefix the input string with a question mark ('?'), this means that the number is optional. If the input string is empty or consists
		 * solely of whitespace, <var>parseNumber</var> will return null.
		 *
		 * If the input string is not valid and can not be parsed,  <var>parseNumber</var> will return <var>undefined</var>.
		 *
		 * @example Parsing numbers in various formats.
		 * <pre>
		 * _.parseNumber('00.99', '2.1');      // returns 2.1
		 * _.parseNumber('00.99', '');          // returns undefined
		 * _.parseNumber('?00.99', '2.1');    // optional number. Returns 2.1
		 * _.parseNumber('?00.99', '');        // returns null
		 * _.parseNumber('0.9', '=2.1 inch'); // returns 2.1 (non-numeric characters ignored)
		 * _.parseNumber('0,9', '2,1');         // comma as decimal separator
		 * _.parseNumber('0,9', '2.1');         // returns 21!! '.' is used as group separator
		 * _.parseNumber('0.9', '20');         // returns 20 (number of digits ignored)
		 * _.parseNumber('0.9', '147.789');  // returns 147.789  (number of digits ignored)
		 * </pre>
		 *
		 * @param format the format that describes the input number
		 * @param numberString the string-formatted number to parse
		 * @return the resulting number; <var>undefined</var> if parsing failed; or <var>null</var> if the string was empty and 
		 *              the number format is flagged as optional ('?' at the beginning)
		 *              
		 * @see ##_.formatValue() can format numbers using the same syntax.
		 */
		'parseNumber': parseNumber,

		/*$
		 * @id trim
		 * @group STRING
		 * @requires 
		 * @configurable default
		 * @name _.trim()
		 * @syntax _.trim(s)
		 * @module UTIL
		 * Removes whitespace from the beginning and end of the given string and returns the result.
		 * 
		 * @example Removing whitespace
		 * <pre>_.trim('abc'); // no change: returns 'abc'
		 * _.trim('  abc '); // returns 'abc'
		 * _.trim(' a b c '); // returns 'a b c' (only whitespace at beginning and end is removed)</pre>
		 *
		 * @param s the string to trim. If not a string, it will be converted using ##_.toString().
		 * @return the trimmed string
		 */
		'trim': trim,

		/*$
		 * @id escaperegexp
		 * @group STRING
		 * @requires 
		 * @configurable default
		 * @name _.escapeRegExp()
		 * @syntax _.escapeRegExp(s)
		 * @module UTIL
		 * Escapes all reserved characters for regular expressions by preceding them with a backslash. 
		 * 
		 * @example Creating regular expressions for words:
		 * <pre>function createWordRE(s) {
		 *     return new RegExp('\b' + _.escapeRegExp(s) + '\b');
		 * }</pre>
		 *
		 * @param s the string to escape
		 * @return the escaped string
		 * 
		 * @see _.format() can use <var>escapeRegExp</var> as escape function.
		 * @see _.template() can use <var>escapeRegExp</var> as escape function.
		 */
		'escapeRegExp': escapeRegExp,

		/*$
		 * @id escapehtml
		 * @group STRING
		 * @requires 
		 * @configurable default
		 * @name _.escapeHtml()
		 * @syntax _.escapeHtml(s)
		 * @module UTIL
		 * Escapes all reserved characters for HTML so the string can be used in text or as attribute value. The escaped characters are
		 * '&amp;', '&lt;', '>', ''' (single quote) and '"' (double quote), and they will be escaped using char codes (e.g. '&amp;#123;').
		 * 
		 * @example Creating a HTML title
		 * <pre>function createTitle(s) {
		 *     return '&lt;h1>' + _.escapeHtml(s) + '&lt;/h1>';
		 * }</pre>
		 *
		 * @param s the string to escape
		 * @return the escaped string
		 * 
		 * @see _.formatHtml() uses <var>escapeHtml</var> for escaping.
		 * @see _.format() can use <var>escapeHtml</var> as escape function.
		 * @see _.template() can use <var>escapeHtml</var> as escape function.
		 */
		'escapeHtml': escapeHtml,

		/*$ 
	     * @id format 
	     * @group FORMAT
	     * @requires template
	     * @configurable default 
	     * @name _.format() 
	     * @syntax _.format()
	     * @syntax _.format(template, object)
	   	 * @module UTIL
	     * Formats an object using a ##template#template##. The template syntax is shared with ##_.template(). The only difference is that
	     * <var>format()</var> frees you from the extra step of creating the template. In any case, whether you use 
	     * <var>format()</var> or ##_.template(), the template will be cached. Be careful when you create templates dynamically, as 
	     * every template is cached and consumes memory.<br/>
	     * If you only want to format a single value, use ##_.formatValue().
	     * 
	     * @example Format a list of dates:
	     * <pre>var s = _.format("{{each}}{{::yyyy-MM-dd{{/each}}", dateList);</pre>
	     * 
	     * @param template The ##template#template## as a string. The template, once created, will be cached. 
	     * @param object the object to format 
	     * @param escapeFunction optional The callback <code>function(inputString)</code> that will be used
	     *        to escape all output:
	     * <dl><dt>inputString</dt><dd>The string to escape.</dd>
	     *     <dt class="returnValue">(callback return value)</dt><dd>The escaped string.</dd></dl>
	     *        If no escapeFunction has been given, the output will not be escaped.
	     *        ##_.escapeHtml() can be used as an escape function for HTML, and ##_.escapeRegExp() for regular expressions. 
	     *        JavaScript's built-in <var>escape()</var> function can escape URL components. 
	     *        See ##_.htmlFormat() for a version of <var>format()</var> that already includes HTML escaping.
	     * @return the string created by the template
	     * 
	     * @see ##_.template() creates a template function, using the same syntax. 
	     * @see ##_.formatHtml() is a variant of <var>format()</var> with HTML-escpaping built it.
	     * @see ##_.formatValue() formats a single number or date.
	     * @see ##_.escapeRegExp() can be used by <var>format()</var> to escape regular expressions. 
	     */ 
		'format': function(tpl, object, escapeFunction) {
			return template(tpl, escapeFunction)(object);
		},

		/*$ 
	     * @id template 
	     * @group FORMAT
	     * @requires date_constants
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
	     * Every template can receive exactly one object as input. If you need more than one value as input, put all required values
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
	     * <pre>Hello {{if visits==0}}New{{else if visits&lt;10}}Returning{{else}}Regular{{/if}} Customer.</pre>
	     * You can use any JavaScript expression as condition.
	     * 
	     * Use <code>each</code> to iterate through a list:
	     * <pre>var myTemplate = _.template(
	     * 	   '{{each names}}{{this.firstName}} {{this.lastName}}{{/each}}');
	     * var result = myTemplate({names: [{firstName: 'Joe', lastName: 'Jones'}, 
	     *                                  {firstName: 'Marc', lastName: 'Meyer'}]});</pre>
	     * <code>each</code> will iterate through the members of the given object. It 
	     * calls its body for each item and put a reference to the item into <var>this</var>.
	     * Optionally, you can specify up to two variables to store the value in and
	     * the zero-based index of the current item:
	     * <pre>var myTemplate = _.template(
	     * 	   '{{each value, index: names}}{{index}}. {{value.firstName}} {{value.lastName}}{{/each}}');
		 * </pre>
	     *
	     * If you do not pass an expression to <code>each</code>, it will take the list from <var>this</var>:
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
		 * You can define your own variables, using the regular JavaScript syntax, with 'var':
	     * <pre>var myTemplate = _.template('{{var s=very.long.name, sum=a+b;}}{{s.desc}}, {{sum}}');</pre>
		 *
	     * In some situations, it may be inevitable to embed raw JavaScript in the template. 
	     * To embed JavaScript code, prefix the code with a '#':
	     * <pre>var myTemplate = _.template(
	     *     '{{each}}{{#var sum = 0; for (var i = 0; i &lt; 3; i++) sum += this.numbers[i]; }}{{sum}}{{/each}}');
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
	     * <tr><td>this</td><td>The template object outside of <code>each</code>. Inside <code>each</code>s, the current value.</td></tr>
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
	     * Every template you create is already cached, so it not an expensive operation to call ##_.template() a second
	     * time with the same template. However, because of caching, you should be careful when creating templates
	     * dynamically, as this will fill the cache up quickly.
	     * 
	     * @param template The template as a string using the syntax described below. 
	     * @param escapeFunction optional The callback <code>function(inputString)</code> that will be used
	     *        to escape all output:
	     * <dl><dt>inputString</dt><dd>The string to escape.</dd>
	     *     <dt class="returnValue">(callback return value)</dt><dd>The escaped string.</dd></dl>
	     *        If no escapeFunction has been given, the output will not be escaped.
	     *        ##_.escapeHtml() can be used as an escape function for HTML, and ##_.escapeRegExp() for regular expressions. 
	     *        JavaScript's built-in <var>escape()</var> function can escape URL components. 
	     * @return the value returned by the last invocation of <var>func</var>
	     * 
	     * @see ##_.format() shares <var>template()</var>'s syntax but returns the result directly.
	     * @see ##_.formatHtml() is a variant of <var>format()</var> with HTML escaping.
	     * @see ##_.escapeHtml() can be used by <var>template()</var> to escape HTML. 
	     * @see ##_.escapeRegExp() can be used by <var>template()</var> to escape regular expressions. 
	     */ 
		'template': template,

		/*$ 
	     * @id formathtml 
	     * @group FORMAT
	     * @requires template
	     * @configurable default 
	     * @name _.formatHtml() 
	     * @syntax _.formatHtml()
	     * @syntax _.formatHtml(template, object)
	   	 * @module UTIL
	     * Formats an object using a ##template#template## with HTML escaping for the output. 
	     * The template syntax is shared with ##_.template(). Output in double curly braces is automatically escaped using ##_.escapeHtml(). 
	     * <var>formatHtml()</var> just creates a new template with HTML escaping and invokes it immediately.
	     * The template will be cached. Be careful when you create templates dynamically, as 
	     * every template is cached and consumes memory.<br/>
	     * If you only want to format a single value, use ##_.formatValue().
	     * 
	     * @example Format a list of dates:
	     * <pre>var s = _.formatHtml("{{each}}{{::yyyy-MM-dd{{/each}}", dateList);</pre>
	     * 
	     * @param template The #template as a string. The template, once created, will be cached.
	     * @param object the object to format 
	     * @return the string created by the template
		 *
		 * @see ##ht() works uses <var>formatHtml</var> to set element's innerHTML. 
		 * @see ##HTML() create HTML nodes using <var>formatHtml</var>. 
	     * @see ##_.template() creates a template function, using the same syntax. 
	     * @see ##_.format() allows you to specify alternative escape mechanisms.
	     */ 
		 'formatHtml': formatHtml
		/*$
		 * @stop
		 */

		// @cond !format '':0
	}, _);

	///#/snippet utilUnderscoreFuncs

	//// GLOBAL INITIALIZATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/*$
	 @stop
	 */


_.M=M; _._=_;
return _;
})();

