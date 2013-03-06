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
		return f && isType(f, 'object');
	}
	function isNode(n) {
		return n && n['nodeType'];
	}
	function isList(v) {
		return v && v.length != null && !isString(v) && !isNode(v) && !isFunction(v);
	}
	function selfFunc(v) {
		return v;
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
		var r;
		if (isList(list)) {
			r = []; 
			each(list, function(value, index) {
				if (filterFunc(value, index))
					r.push(value);
			});
		}
		else {
			r = {};
			each(list, function(key, value) {
				if (filterFunc(key, value))
					r[key] = value;
			});
		}
		return r;
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
	function replace(s, regexp, sub) {
		return toString(s).replace(regexp, sub != null ? sub : '');
	}
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
		return list ? (list['_'] ? list['array']() : (Object.prototype.toString.call(arr) === '[object Array]') ? list : toArray(UNDERSCORE(list))) : []; 
	}
	
	function call(f, fThisOrArgs, args) {
		return f.apply(args && fThisOrArgs, toRealArray(args || fThisOrArgs));
	}
	function bind(f, fThisOrArgs, beforeArgs, afterArgs) {
		return function() {
			return call(f, beforeArgs && fThisOrArgs, collect([beforeArgs, arguments, afterArgs], selfFunc));
		};
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
	// formats number with format string (e.g. "#.999", "#,_", "00000", "000.99", "000.000.000,99", "000,000,000.__")
	// choice syntax: <cmp><value>:<format>|<cmp><value>:<format>|... 
	// e.g. 0:no item|1:one item|>=2:# items
	// <value>="null" used to compare with nulls.
	// choice also works with strings, e.g. ERR:error|WAR:warning|FAT:fatal|ok
	function formatValue(format, dateOrNumber) {
		if (isObject(dateOrNumber) && dateOrNumber['getDay']) {
			var map = {
				'y': 'FullYear',
				'M': ['Month', function(d) { return d + 1; }],
				'n': ['Month', function(d, values) { return (values||['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'])[d]; }],
				'N': ['Month', function(d, values) { return (values||['January','February','March','April','May','June','July','August','September','October','November','December'])[d]; }],
				'd':  'Date',
				'm':  'Minutes',
				'H':  'Hours',
				'h': ['Hours', function(d) { return d % 12; }],
				'K': ['Hours', function(d) { return d+1; }],
				'k': ['Hours', function(d) { return d % 12 + 1; }],
				's':  'Seconds',
				'S':  'Milliseconds',
				'a': ['Hours', function(d, values) { return (values||['am', 'pm'])[d<12?0:1]; }],
				'w': ['Day', function(d, values) { return (values||['Sun','Mon','Tue','Wed','Thu','Fri','Sat'])[d]; }],
				'W': ['Day', function(d, values) { return (values||['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'])[d]; }],
				'z': ['TimezoneOffset', function(d) { var sign = d > 0 ? '+' : '-'; d = d > 0 ? d : -d; return sign + pad(2, Math.floor(d/60)) + pad(2, d%60); }]
				
			};
			return replace(format, /(y+|M+|n+|N+|d+|m+|H+|h+|K+|k+|s+|S+|a+|w+|W+)0?(\[[^\]]+\])?/g, function(s) {
				var utc = /0/.test(s);
				var len = replace(/[0\[].*/).length;
				var val = map[s.charAt(0)];
				var d = dateOrNumber['get' + (utc?'UTC':'') + (isList(val)?val[0]:val)].call(dateOrNumber);
				
				if (isList(val)) {
					var match, optionArray;
					if (match = /\[(.*)\]/.exec(s)) 
						optionArray = match[1].split('|');
					d = val[1](dateOrNumber, optionArray);
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
	// reads / writes property in name.name.name syntax. 
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

	'toObject': listBind(toObject),
	
	'equals': listBind(equals),

	'sub': listBindWrapped(sub),
 	
 	'find': listBind(find),
 	
 	'contains': listBind(contains),
	
	'array': function() {
		return map(this, selfFunc);
	},
	
	'join': function(separator) {
		return new M(map(this, selfFunc).join(separator));
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
			return keys[item];
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
		'selfFunc': selfFunc,
		'each': each,
		'toObject': toObject,
		'filter': funcListBind(filter),
		'collect': funcListBind(collect),
		'map': funcListBind(map),
		'find': find,
		'sub': funcListBind(sub),
		'equals': equals,
		'call': call,
		'toString': toString,
		'isList': isList,
		'isFunction': isFunction,
		'isObject': isObject,
		'isString': isString,
		'toString': toString,
		'defer': defer,
		'delay': delay,
		
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
		
		'extend': function(to, from) {
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
		
		'prop': prop,
		
		'escapeRegExp': function(s) {
			return replace(s, /[\\\[\]\/{}()*+?.$|^-]/g, "\\$&");
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
		
		'formatNumber' : formatNumber,
		'pad' : pad,
		'formatValue': formatValue,
		
		'template': function(format, object) {
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



