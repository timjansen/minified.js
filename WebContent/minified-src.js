/*
 * Minified.js - Complete library for JavaScript interaction in less than 4kb
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * 
 * Contains code based on https://github.com/douglascrockford/JSON-js (also Public Domain).
 *
 * https://github.com/timjansen/minified.js
 */

/*
 * When you read this code, please keep in mind that it is optimized to produce small and gzip'able code
 * after being minimized with Closure (http://closure-compiler.appspot.com). Run-time performance and readability
 * should be acceptable, but are not a primary concern.
 *
 * 
 * Various comment annotations control the builder in parser-src.js / builder-src.js. This file should always work without the builder,
 * but only the builder allows you to remove functions.
 * 
 * Here's a short summary of that the non-documenting tags mean.
 * 
 * Multi-Line Comments:
 * - @id marks the beginning of an optional block. It ends with the next @id block, or the next @stop comment.
 * - @requires defines the ids that the current block depends on. They will always be available.
 * - @configurable the block can be selected in the GUI. If the value is 'default', it is a enabled by default. If it is 'optional', it is not.
 * - @dependency if set, the block is only used as a dependency and won't show up in builder or documentation
 * - @name a name for builder and reference docs
 * - @doc if 'no', the section will not be displayed in reference docs, only in builder
 * 
 * Single-Line Comments
 * - @cond id defines that the code following after the id will be included if the block id is enabled 
 * - @cond !id include the following line only if the block id is disabled
 * - @condblock id will include all following lines if id is enabled until the next @condend. @condblocks can be nested.
 * - @condend ends a @condblock 
 */

// ==ClosureCompiler==
// @output_file_name minified.js
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
if (/^u/.test(typeof define)) { // no AMD support avaialble ? define a minimal version
	var def = {};
	this['define'] = function(name, f) {def[name] = f();};
	this['require'] = function(name) { return def[name]; }; 
}
 	/*$
 	 * @stop
 	 */

define('minified', function() {
	//// GLOBAL VARIABLES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * @const
	 */
	var _this = this;

	/**
	 * @const
	 */
	var _document = document;
	
	/**
	 * @const
	 * @type {!string}
	 */
	var BACKSLASHB = '\\b';
	/** @const */
	var undef;
	
    /*$
	 * @id ready_vars
	 * @dependency
     */
    /** @type {!Array.<function()>} */
    var DOMREADY_HANDLER = [];

    /*$
     * @id animation_vars
     * @dependency
     */
     /** @type {!Array.<{c:!function(), t:!number, s:!function()}>} */
	var ANIMATION_HANDLERS = []; // global list of {c: <callback function>, t: <timestamp>, s:<stop function>} currently active
	
	/** @type {!function()} */
	var REQUEST_ANIMATION_FRAME = collect(['msR', 'webkitR', 'mozR', 'r'], function(n) { return _this[n+'equestAnimationFrame']; })[0] || function(callback) {
		delay(callback, 33); // 30 fps as fallback
	};
	
	
	/*$
	 * @id ie8compatibility
	 * @module OPTIONS
	 * @configurable default
	 * @doc no
	 * @name Backward-Compatibility for IE8 and similar browsers
	 * The only difference for Minified between IE8 and IE9 is the lack of support for the CSS opacity attribute in IE8.
	 */
	/**
	 * @const 
	 * @type {boolean} 
	 */
	// @condblock ready_vars
	 var IS_PRE_IE9 = !!_document.all && !DOMREADY_HANDLER.map;
	// @condend
	 // @cond !ready_vars var IS_PRE_IE9 = !!_document.all && ![].map;
	/*$
	 * @id ie7compatibility
	 * @requires ie8compatibility 
	 * @module OPTIONS
	 * @configurable default
	 * @doc no
	 * @name Backward-Compatibility for IE7 and similar browsers
	 * The difference between IE7 and IE8 compatibility that IE7 provides neither native selector support (querySelectorAll) nor native JSON.
	 * Disabling IE6 and IE7 will not only make Minified smaller, but give you full CSS selectors and complete JSON support. 
	 */
    // @condblock ucode
    /**
     * @const 
     * @type {Object.<string, string>} 
     */
	var STRING_SUBSTITUTIONS = {    // table of character substitutions
            '\t': '\\t',
            '\r': '\\r',
            '\n': '\\n',
            '"' : '\\"',
            '\\': '\\\\'
        };
    // @condend

	/*$
	 * @id ie6compatibility
	 * @requires ie7compatibility 
	 * @module OPTIONS
	 * @configurable default
	 * @doc no
	 * @name Backward-Compatibility for IE6 and similar browsers
	 * The only difference for Minified between IE6 and IE7 is the lack of a native XmlHttpRequest in IE6 which makes the library a tiny 
	 * little bit larger.
	 */

	/*$
	 * @id fadeslide
	 * @requires animate set 
	 * @module ANIMATION
	 * @configurable default
	 * @doc no
	 * @name Support for $$fade and $$slide
	 */
	/*$
	 * @stop
	 */

	//// GLOBAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/** @param s {?} */
	function toString(s) { // wrapper for Closure optimization
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
		return isType(f, 'object');
	}
	function isNode(n) {
		return n && n['nodeType'];
	}
	function isList(v) {
		return v && v.length != null && !isString(v) && !isNode(v) && !isFunction(v);
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
			if (filterFunc(node,index))
				r.push(node);
		});
		return r;
	}
	function collect(list, collectFunc) {
		var result = [];
		each(list, function(item, index) {
			if (isList(item = collectFunc(item, index))) // extreme variable reusing: item is now the callback result
				each(item, function(rr) { result.push(rr); });
			else if (item != null)
				result.push(item);
		});
		return result;
	}
	function replace(s, regexp, sub) {
		return toString(s).replace(regexp, sub||'');
	}
	function delay(f, delayMs) {
		_this.setTimeout(f, delayMs||0);
	}
	function extractNumber(v) {
		return parseFloat(replace(v, /^[^\d-]/));
	}
	
	function getNaturalHeight(elementList) {
		var q = {$position: 'absolute', $visibility: 'hidden', $display: 'block', $height: null};
		var oldStyles = elementList['get'](q);
		elementList['set'](q);
		var h = elementList[0].offsetHeight;
		elementList.set(oldStyles);
		return h;
	}
	
    function now() {
    	return new Date().getTime();
    }

	function callArg(f) {f();}

    // for ready()
    function triggerDomReady() {
		each(DOMREADY_HANDLER, callArg);
		DOMREADY_HANDLER = null;
    }
    
    function ready(handler) {
    	// @cond debug if (typeof handler != 'function') error("First argument must be a function");
    	if (DOMREADY_HANDLER) // if DOM ready, call immediately
			DOMREADY_HANDLER.push(handler);
		else
			delay(handler);
    }
     
    function promise() {
    	var state;           // undefined/null = pending, true = fulfilled, false = rejected
    	var values = [];     // an array of values as arguments for the then() handlers
 		var deferred = [];   // functions to call when set() is invoked
 	 	
    	var set = function (newState, newValues) {
    		if (state == null) {
	    		state = newState;
	    		values = newValues;
   				delay(function() {
   					each(deferred, callArg);
   				});
    		}
    	};
 	/*$
	 * @id then
	 * @module REQUEST
	 * @name promise.then()
	 * @syntax promise.then(onSuccess)
	 * @syntax promise.then(onSuccess, onError)
	 * Allows you to add callbacks to an asynchronous operation that will be invoked when the operation finished 
	 * successfully (onSuccess) or an error occurred (onError). 
	 * Implements the Promises/A+ specification, allowing interoperability with Promises frameworks for managing promises. 
	 * You can chain then() invocations, as then() returns another Promise object that you can attach to. 
	 *
	 * @example Simple handler for a HTTP request.
	 * <pre>
	 * MINI.request('get', '/weather.html')
	 *     .then(function(txt) {
	 *        alert('Got response!');
	 *     });
	 * </pre>
	 *
	 * @example Including an error handler.
	 * <pre>
	 * MINI.request('get', '/weather.html')
	 *     .then(function(txt) {
	 *        alert('Got response!');
	 *     }, function(err) {
	 *        alert('Error!');
	 *     }));
	 * </pre>
	 *
	 * @example Chained handler.
	 * <pre>
	 * MINI.request('get', '/weather.do')
	 *     .then(function(txt) {
	 *        showWeather(txt);
	 *     }
	 *     .then(function() {
	 *        return MINI.request('get', '/traffic.do');
	 *     }
	 *     .then(function(txt) {
	 *        showTraffic(txt);
	 *     }
	 *     .then(function() {
	 *        alert('All result displayed');
	 *     }, function() {
	 *        alert('An error occurred');
	 *     });
	 * </pre>
	 *
	 * @param onSuccess optional a function to be called when the operation has been completed successfully. The exact arguments depend on the operation.  
	 *                           If provided and it returns a Promise, that promise will
	 *                           be evaluated to determine the state of the returned promise. If provided and it returns regularly, the returned promise will 
	 *                           have success status. If it throws an error, the returned promise will be in the error state.
	 * @param onError optional a function to be called when the operation failed. The exact arguments depend on the operation. If provided and it returns a Promise, that promise will
	 *                           be evaluated to determine the state of the returned promise. If provided and it returns regularly, the returned promise will 
	 *                           have success status. If it throws an error, the returned promise will be in the error state.
	 * @return a new Promises object. If you specified a callback for success or error, the new object's state will be determined by that callback if it is called.
	 *         If no callback has been provided for success or error and the original Promise changes to that state, the new promise will change to that state as well.
	 */    	        
 		var then = set['then'] = function(onFulfilled, onRejected) {
			var newPromise = promise();
			var callCallbacks = function() {
	    		try {
	    			var f = (state ? onFulfilled : onRejected);
	    			if (isFunction(f)) {
		   				var r = f.apply(null, values);
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
				delay(callCallbacks);
			else
				deferred.push(callCallbacks);    		
    		return newPromise;
    	};
  	/*$
	 * @id always
	 * @module REQUEST
	 * @name promise.always()
	 * @syntax promise.always(callback)
	 * Allows you to add a callback that will always be called, no matter whether the operation succeeded or not.
	 * This is a convenience function that will call then() with the same function for both arguments. 
	 *
	 * @example Simple handler for a HTTP request.
	 * <pre>
	 * MINI.request('get', '/weather.html')
	 *     .always(function() {
	 *        alert('Got response or error!');
	 *     });
	 * </pre>
	 *
	 * @param callback a function to be called when the operation has been finished, no matter what its result was. The exact arguments depend on the operation and may
	 *                 vary depending on whether it succeeded or not. If the function returns a Promise, that promise will
	 *                           be evaluated to determine the state of the returned promise. If provided and it returns regularly, the returned promise will 
	 *                           have success status. If it throws an error, the returned promise will be in the error state.
	 * @return a new Promises object. Its state is determined by the callback.
	 */
      	set['always'] = function(func) { return then(func, func); };
      	
 	/*$
	 * @id error
	 * @module REQUEST
	 * @name promise.error()
	 * @syntax promise.error(callback)
	 * Allows you to add a callback that will be called when the operation failed.
	 * This is a convenience function that will call then() with the only the second argument set.
	 *
	 * @example Simple handler for a HTTP request.
	 * <pre>
	 * $.request('get', '/weather.html')
	 *     .error(function() {
	 *        alert('Got error!');
	 *     });
	 * </pre>
	 *
	 * @param callback a function to be called when the operation has failed. The exact arguments depend on the operation. If the function returns a Promise, that promise will
	 *                           be evaluated to determine the state of the returned promise. If provided and it returns regularly, the returned promise will 
	 *                           have success status. If it throws an error, the returned promise will be in the error state.
	 * @return a new Promises object. Its state is determined by the callback.
	 */    			 
     	set['error'] = function(func) { return then(0, func); };
    	return set;
    }
    
    /*$
	 * @id ucode
	 * @dependency
     */
    // @condblock ie7compatibility
    function ucode(a) {
        return STRING_SUBSTITUTIONS[a] ||  ('\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4));
    }
    // @condend

    
	/*$
	 * @id dollar
	 * @module SELECTORS
	 * @requires dollarraw 
	 * @dependency yes
	 * @name MINI()
	 * @syntax MINI(selector)
	 * @syntax MINI(selector, context)
	 * @syntax MINI(selector, context, childOnly)
	 * @syntax MINI(function)
	 * @shortcut $(selector) - Enabled by default, but can be disabled in the builder.
	 * Uses a CSS-like selector to create an list containing all elements that fulfill the filter conditions. This is the most central function in Minified. The returned 
	 * list has a number of functions to work with the list elements.
	 *
	 * As a special shortcut, if you pass a function to MINI(), it will be registered using MINI.ready() to be executed when the DOM model is complete.
	 *
	 * The name of this function is MINI(), but by default Minified also creates an alias "$" for it, which should be more convenient and also familiar for most users.
	 *
	 * @example A simple selector to find an element by id.
	 * <pre>
	 * var l1 = $('#myElementId');
	 * </pre>
     * 	 
	 * @example You can also pass a reference to an DOM node to the function to receive a list containing only this node:
	 * <pre>
	 * var l2 = $(document.getElementById('myElementId')); 
	 * </pre>
     * 	 
	 * @example Lists will be copied:
	 * <pre>
	 * var l2 = $([elementA, elementB, elementC]); 
	 * </pre>
     * 	 
	 * @example A simple selector to find all elements with the given class.
	 * <pre>
	 * var l3 = $('.myClass');
	 * </pre>
     * 	 
	 * @example A selector to find all elements with the given name.
	 * <pre>
	 * var l4 = $('input'); // finds all input elements
	 * </pre>
     * 	 
	 * @example A selector to find all elements with the given name and class.
	 * <pre>
	 * var l5 = $('input.myRadio'); // finds all input elements wit
	 * </pre>
     * 	 
	 * @example A selector to find all elements that are descendants of the given element.
	 * <pre>
	 * var l6 = $('#myForm input'); // finds all input elements that are in the element with the id myForm
	 * </pre>
     * 	 
	 * @example A selector to find all elements with one of the given classes:
	 * <pre>
	 * var l7 = $('.a, .b'); // finds all elements that have either the class a or class b
	 * </pre>
     * 	 
	 * @example A selector that finds all elements that are descendants of the element myDivision, are inside a .myForm class and are input elements:
	 * <pre>
	 * var l8 = $('#myDivision .myForm input'); 
	 * </pre>
     * 	 
	 * @example Using contexts to make it easier to specify ancestors:
	 * <pre>
	 * var l9 = $('.myRadio', '#formA, #formB, #formC');  // same as $('#formA .myRadio, #formB .myRadio, #formC .myRadio')
	 * </pre>
     * 	 
	 * @example Using one of the list functions, set(), on the list, and set the element's text color. '$' at the beginning of the property name is short for 'style.' and thus
	 *               sets a CSS value.
	 * <pre>
	 * $('#myElementId').set('$color', 'red');
	 * </pre>
     *
	 * @example Most functions return the list you invoked them on, allowing you to chain them:
	 * <pre>
	 * $('#myForm .myRadio').addClass('uncheckedRadio')
	 *                               .set('checked', true)
	 *                               .on('click', function() {
	 *                                     $(this).set({@: 'uncheckedRadio');
	 *                                });
	 * </pre>
	 * 
	 * @example Using $() as a MINI.ready() shortcut:
	 * <pre>
	 * $(function() {
	 *   // work with the DOM tree
	 * });
	 * </pre>
	 * 
	 * @param selector a simple, CSS-like selector for the elements. It supports '#id' (lookup by id), '.class' (lookup by class),
	 *             'element' (lookup by elements) and 'element.class' (combined class and element). Use commas to combine several selectors.
	 *             You can also separate two (or more) selectors by space to find elements which are descendants of the previous selectors.
	 *             For example, use 'div' to find all div elements, '.header' to find all elements containing a class name called 'header', and
	 *             'a.popup' for all a elements with the class 'popup'. To find all elements with 'header' or 'footer' class names, 
	 *             write '.header, .footer'. To find all divs elements below the element with the id 'main', use '#main div'.
	 *             The string "*" will return all elements.
	 *             You can also use a DOM node as selector, it will be returned as a single-element list.  
	 *             If you pass a list, a shallow copy of the list will be returned. Nulls will be automatically removed from the copy. Nested lists will be flattened
	 *             so the result only contains elements.
	 *             If you pass a function, it will be registered using MINI.ready().
	 * @param context optional an optional selector, DOM node or list of DOM nodes which specifies one or more common ancestor nodes for the selection. 
	 *             The returned list contains only descendants of the context nodes, all others will be filtered out. 
	 * @param childOnly optional if set, only direct children of the context nodes are included in the list. If omitted or not true, all descendants of the
	 *             context will be included. 
	 * @return the array-like object containing the content specified by the selector. The returned object is guaranteed to
	 *             have a property 'length', specifying the number of elements, and allows you to access elements with numbered properties, as in 
	 *             regular arrays (e.g. list[2] for the second elements). Other Array functions are not guaranteed to be available, but you can use the filter()
	 *             function to get a list that is guaranteed to extend Array.
	 *             Please note that duplicates (e.g. created using the comma-syntax or several context nodes) will not be removed. If the selector was a list, 
	 *             the existing order will be kept. If the selector was a simple selector, the elements are in document order. If you combined several selectors 
	 *             using commas, only the individual results of the selectors will keep the document order, but will then be joined to a single list. This list will, 
	 *             as a whole, not be in document order anymore. The array returned has several convenience functions listed below:
	 */
	function MINI(selector, context, childOnly) { 
		// @condblock ready
		return isFunction(selector) ? ready(selector) : new M(dollarRaw(selector, context, childOnly));
		// @condend
		// @cond !ready return new M(dollarRaw(selector, context));
	}
	
	/*$
	 * @id debug
	 * @module OPTIONS
	 * (TBD) @configurable optional
	 * @doc no
	 * @name Debugging Support
	 */
	function error(msg) {
		if (_this.console) console.log(msg);
		throw Exception("MINI debug error: " + msg);
	}
    // @cond debug MINI['debug'] = true;
	
  
    /*$
     * @id dollarraw
     * @requires 
     * @dependency yes
     */
    function dollarRaw(selector, context, childOnly) { 
		function flatten(a) { // flatten list, keep non-lists, remove nulls
			return isList(a) ? collect(a, flatten) : a; 
		}
		function filterElements(list) {
			var retList = flatten(list);
			if (!parent)
				return retList;
			else
				return filter(retList, function(node) {
					var a = node;
					while (a = a.parentNode) {
						if (a === parent)
							return true;
						if (childOnly)
							return false;
					}
					// fall through to return undef
				});
		}
		
		var parent, steps, dotPos, subSelectors;
		var elements, regexpFilter, useGEbC, className, elementName, reg;

		if (context && (context = dollarRaw(context)).length != 1) // if not exactly one node, iterate through all and concat
			return collect(context, function(ci) { return dollarRaw(selector, ci);});
		parent = context && context[0]; // note that context may have changed in the previous two lines!! you can't move this line
		
		if (!isString(selector))
		    return filterElements(isList(selector) ? selector : [selector]); 

		// @condblock ie7compatibility
		if ((subSelectors = selector.split(/\s*,\s*/)).length>1)
			return collect(subSelectors, function(ssi) { return dollarRaw(ssi, parent);});

		if (steps = (/(\S+)\s+(.+)$/.exec(selector)))
			return dollarRaw(steps[2], dollarRaw(steps[1], parent));

		if (selector != (subSelectors = replace(selector, /^#/)))
			return filterElements([_document.getElementById(subSelectors)]); 

		// @cond debug if (/\s/.test(selector)) error("Selector has invalid format, please check for whitespace.");
		// @cond debug if (/[ :\[\]]/.test(selector)) error("Only simple selectors with ids, classes and element names are allowed.");

		parent = parent || _document;

		elementName = (dotPos = /([^.]*)\.?([^.]*)/.exec(selector))[1];
		className = dotPos[2];
		elements = (useGEbC = parent.getElementsByClassName && className) ? parent.getElementsByClassName(className) : parent.getElementsByTagName(elementName || '*'); 

		if (regexpFilter = useGEbC ? elementName : className) {
			reg = new RegExp(BACKSLASHB +  regexpFilter + BACKSLASHB, 'i'); 
			elements =  filter(elements, function(l) {return reg.test(l[useGEbC ? 'nodeName' : 'className']);});
		}
		// @condend
		
		// @cond !ie7compatibility elements = (parent || _document).querySelectorAll(selector);
		return childOnly ? filterElements(elements) : elements;
	};
	
    
 	/*$
	 * @id length
	 * @module SELECTORS
	 * @requires dollar
	 * @name .length
	 * @syntax length
	 * Contains the number of elements in the list.
	 * 
	 * @example
	 * <pre>
	 * var list = $('input');
	 * var myValues = {};
	 * for (var i = 0; i &lt; list.length; i++)
	 *    myValues[list[i].name] = list[i].value;
	 * </pre>
	 */
	// empty, always defined below
		
	/*$
	 * @id listctor
	 */	
    /** @constructor */
	function M(list) {
		for (var i = 0; i < list.length; i++)
			this[i] = list[i];

		this['length'] = list.length;
	}
	
	//// LIST FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	each({
    /*$
     * @id each
     * @module SELECTORS
     * @requires dollar
     * @configurable default
     * @name .each()
     * @syntax each(callback)
     * Invokes the given function once for each item in the list. The function will be called with the item as first parameter and the zero-based index as second.
     *
     * @example This goes through all h2 elements of the class 'section' and changes their content:
     * <pre>
     * $('h2.section').each(function(item, index) {
     *     item.innerHTML = 'Section ' + index + ': ' + item.innerHTML;
     * });
     * </pre>
     *
     * @param callback the callback function(item, index) to invoke.
     * @return the list
     */
	'each': function (callback) {
		each(this, callback);
		return this;
	},
	
	/*$
	 * @id filter
	 * @module SELECTORS
	 * @requires dollar
	 * @configurable default
	 * @name .filter()
	 * @syntax filter(filterFunc)
	 * Creates a new list that contains only those items approved by the given function. The function is called once for each item. 
	 * If it returns true, the item is in the returned list, otherwise it will be removed.
	 *
	 * @example Creates a list of all unchecked checkboxes.
	 * <pre>
	 * var list = $('input').filter(function(item) {
	 *     return item.getAttribute('type') == 'checkbox' && item.checked;
	 * });
	 * </pre>
	 * 
	 * @param filterFunc the callback function(item, index) to invoke for each item with the item as first argument and the 0-based index as second argument.  
	 *        If the function returns false for an item, it is not included in the resulting list. 
	 * @return the new, filtered list
	 */
	'filter': function(filterFunc) {
	    return new M(filter(this, filterFunc));
	},
	
	/*$ 
     * @id collect 
     * @module SELECTORS 
     * @requires dollar 
     * @configurable default 
     * @name .collect() 
     * @syntax collect(collectFunc) 
     * Creates a new list from the current list using given callback function. 
     * The callback is invoked once for each element of the current 
     * list. The callback results will be added to the result list. 
     * The callback can return 
     * <ul> 
     * <li>An array or another list-like object whose elements will be appended to the result array as single elements.</li> 
     * <li>A regular object which will be appended to the list</li> 
     * <li>null (or undefined), which means that no object will be added to the list. 
     * If you need to add null or modified to the result list, put it into a single-element array.</li> 
     * </ul> 
     * 
     * @example Goes through input elements. If they are text inputs, their value will be added to the list: 
     * <pre> 
     * var texts = $('input').collect(function(input) { 
     * if (input.getAttribute('type') != null || input.getAttribute('type') == 'text') // text is default, so check for null 
     *     return input.value; 
     * else 
     *     return null; // ignore 
     * }); 
     * </pre> 
     * 
     * @example Creates a list of all children of the selected list. 
     * <pre> 
     * var childList = $('.mySections').collect(function(node) { 
     * return node.childNodes; // adds a while list of nodes 
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
     * @param collectFunc the callback function(item, index) to invoke for each item with the item as first argument and the 
     * 0-based index as second argument. 
     * If the function returns a list, its elements will be added to the result list. Other objects will also be added. Nulls 
     * will be ignored and not added. 
     * @return the new list
     */ 
	'collect': function(collectFunc) { 
    	 return new M(collect(this, collectFunc)); 
     },
	
     /*$ 
      * @id sub
      * @module SELECTORS 
      * @requires filter 
      * @configurable default 
      * @name .sub() 
      * @syntax sub() 
      * Returns a new list containing only the element in the specified range. If there are no elements in the range, an empty list is returned.
      *
      * @example Remove the third to 5th list elements:
      * <pre> 
      * $('#myList li').sub(3, 6).remove();
      * </pre> 
      *
      * @example Clear all elements but the first:
      * <pre> 
      * $('#myList li').sub(1).fill();
      * </pre> 
      *
      * @example Changes the class of the last list element:
      * <pre> 
      * $('#myList li').sub(-1).set('+lastItem');
      * </pre> 
      * 
      * @param startIndex the 0-based position of the sub-list start. If negative, the list's length is added and thus it is the position
      *                   seen from the list end.
      * @param endIndex optional the 0-based position of the sub-list end. If negative, the list's length is added and thus it is the position
      *                   seen from the list end. If omitted, all elements to the list end are included.
      * @return a new list containing only the items in the index range. 
      */ 
	'sub': function(startIndex, endIndex) {
		var l = this['length'];
	    var s = (startIndex < 0 ? l+startIndex : startIndex);
	    var e = endIndex == null ? l : (endIndex >= 0 ? endIndex : l+endIndex);
 		return this['filter'](function(o, index) { 
 			return index >= s && index < e; 
 		});
 	},
 	
     
    /*$ 
     * @id find 
     * @module SELECTORS 
     * @requires
     * @configurable default 
     * @name .find() 
     * @syntax find(findFunc) 
     * @syntax find(element) 
     * Allows you to find a specific value in the list. There are two ways of calling find():
     * <ol>
     * <li>With an element as argument. The function will search for the first occurrence of that element in the list
     *     and return the index. If it is not found, the function returns undefined.</li>
     * <li>With a callback function. find() will then call the given function for each list element until the function 
     *     returns a value that is not null or undefined. This value will be returned.</li>
     * </ol>
     *
     * @example Determine the position of #wanted among all li elements:
     * <pre> 
     * var elementIndex = $('li').find($$('#wanted'));
     * </pre> 
     * 
     * @example Goes through the elements to find the first div that has the class 'myClass', and returns this element:
     * <pre> 
     * var myClassElement = $('div').find(function(e) { if ($(e).hasClass('myClass')) return e; });
     * </pre> 
     * 
     * @param findFunc the callback function(item, index) that will be invoked for every list item until it returns a non-null value.
     * @param element the element to search for
     * @return if called with an element, either the element's index in the list or undefined if not found. If called with a callback function,
     *         it returns either the value returned by the callback or undefined.
     */ 
	'find': function(findFunc) {
		var f = isFunction(findFunc) ? findFunc : function(obj, index) { if (findFunc === obj) return index; };
		var list = this, r;
		for (var i = 0; i < list.length; i++)
			if ((r = f(list[i], i)) != null)
				return r;
	},
	
    /*$ 
     * @id hasclass 
     * @module SELECTORS 
     * @requires find
     * @configurable default 
     * @name .hasClass() 
     * @syntax hasClass(className) 
     * Checks whether at least one element in the list has the given class name. If yes, the first element that matches is returned. Otherwise
     * the function returns undefined.
     *
	 * @example Checks whether the element 'myElement' the class 'myClass'. If yes, it sets the text color to red.
	 * <pre>
	 * if($('#myElement').hasClass('myClass'))
	 *     $('#myElement').set('$color', 'red');
	 * </pre>
     * 
     * @param name the class to to find
     * @return the first element that has the given class, or undefined if not found
     */ 
	'hasClass': function(name) {
		var regexp = new RegExp(BACKSLASHB +  name + BACKSLASHB);
		return this.find(function(e) { return regexp.test(e.className) ? e : null; });
	},
	
	/*$
	 * @id remove
	 * @module SELECTORS
	 * @requires dollar each
	 * @configurable default
	 * @name .remove()
	 * @syntax remove()
	 * Removes all nodes of the list from the DOM tree.
	 * 
	 * @example Removes the element with the id 'myContainer', including all children, from the DOM tree.
	 * <pre>
	 * $('#myContainer').remove(); 
	 * </pre>
	 */
     'remove': function() {
    	this['each'](function(obj) {obj.parentNode.removeChild(obj);});
     },

	/*$
	 * @id get
	 * @module SELECTORS
	 * @requires dollar
	 * @configurable default
	 * @name .get()
	 * @syntax get(name)
	 * @syntax get(name, toNumber)
	 * @syntax get(list)
	 * @syntax get(map)
	 * Retrieves properties, attributes and styles from the list's first element. The syntax to request those values is mostly identical with set(). You can either
	 * retrieve a single value if you specify only one name, or a name->value map when you specify several names using either an array or a map.
	 * 
	 * @example Retrieves the id, title attribute and the background color of the element:
	 * <pre>
	 * var id = $('#myElement).get('id'); 
	 * var title = $('#myElement).get('@title'); 
	 * var bgColor = $('#myElement).get('$backgroundColor'); 
	 * </pre>
	 *
	 * @example Retrieves the title attribute of the element:
	 * <pre>
	 * </pre>
	 *
	 * @param name the name of the property, attribute or style. To retrieve a JavaScript property, just use its name without prefix. To get an attribute value,
	 *                     prefix the name with a '@'. A '$' prefix will retrieve a CSS style. The syntax for the CSS style is camel-case (e.g. "backgroundColor", not "background-color"). 
     *                     Shorthand properties like "border" or "margin" are not supported. You must use the full name, e.g. "marginTop". Minified will try to determine the effective style
	 *                     and thus will also return the value set in style sheets if not overwritten using a regular style.
	 * 	  		           Just '$' will retrieve the 'className' property of the object, a space-separated list of all CSS classes.
	 *                     The special name '$$' allows you setting the style attribute in a browser independent way.
	 *                     '$$fade' will return a value between 0 and 1 that specifies the element's
	 *                     opacity. '$$slide' returns the height of the element in pixels, with a 'px' suffix. Both '$$fade' and '$$slide' will also check the CSS styles 'visibility' and 'display'
	 *                     to determine whether the object is visible at all. If not, they will return 0 or '0px', respectively.
	 * @param list in order to retrieve more than one value, you can specify several names in an array or list. get() will then return a name->value map of results.
	 * @param map if you specify an object that it neither list nor string, it will use it as a map of property names. Each property name will be requested. The values of the properties in 
	 *                   the map will be ignored. get() will then return a name->value map of results.
	 * @param toNumber if set to 'true', convert the value into a number and, if it is a string, remove any non-numeric characters. This is useful when you request a CSS property such as "$marginTop" 
	 *                 that returns a value with a unit suffix, such as "21px". get() will then convert it into a number and return 21. If the returned value is not parsable as a
	 *                 numeric, NaN will be returned.
	 * @return if a string was specified as parameter, get() returns the corresponding value. If a list or map was given, get() returns a new map with the names as keys and the values as values.
	 */
    'get': function(spec, toNumber) {
    	var self = this, element = self[0];

		if (element) {
			if (isString(spec)) {
				var name = replace(spec, /^[$@]/);
				var s;
				var isHidden = /^\$\$/.test(spec) && (self.get('$visibility') == 'hidden' || self.get('$display') == 'none');
				if (spec == '$')
					s = element.className;
				else if (spec == '$$') {
					// @condblock ie8compatibility
					 if (IS_PRE_IE9)
						s = element.style.cssText;
					 else
					// @condend
						s = element.getAttribute('style');
				}
				else if (spec == '$$fade') {
					s = isNaN(s = isHidden ? 0 :
					// @condblock ie8compatibility
						  IS_PRE_IE9 ? extractNumber(self.get('$filter'))/100 :
					// @condend
						  extractNumber(self.get('$opacity')) 
						 ) ? 1 : s;
				}
				else if (spec == '$$slide') {
					s = (isHidden ? 0 : element.offsetHeight) + 'px';
				}
				else if (/^\$/.test(spec)) {
					// @condblock ie8compatibility 
					if (!_this.getComputedStyle)
						s = element.currentStyle[name];
					else 
					// @condend
						s = _this.getComputedStyle(element, null).getPropertyValue(replace(name, /[A-Z]/g, function (match) {  return '-' + match.toLowerCase(); }));
					
				}
				else if (/^@/.test(spec))
					s = element.getAttribute(name);
				else
					s = element[name];
				return toNumber ? extractNumber(s) : s;
			}
			var r = {};
			each(spec, function(name) {
				r[name] = self.get(name);
			});
			return r;
		}
	},

	/*$
	 * @id set
	 * @module SELECTORS
	 * @requires dollar each get
	 * @configurable default
	 * @name .set()
	 * @syntax MINI(selector).set(name, value)
	 * @syntax MINI(selector).set(properties)
	 * @syntax MINI(selector).set(cssClasses)
	 * @syntax MINI(selector).set(name, value, defaultFunction)
	 * @syntax MINI(selector).set(properties, undefined, defaultFunction)
	 * @syntax MINI(selector).set(properties, undefined, defaultFunction, defaultPrefix)
	 * Modifies the list's DOM elements or objects by setting their properties, attributes, CSS style and/or CSS classes. You can either supply a 
	 * single name and value to set only one property, or you can provide a map of properties to set.
	 * More complex operations can be accomplished by supplying a function as value. It will then be called for each element that will
	 * be set.
	 * 
	 * @example Unchecking checkboxes:
	 * <pre>
	 * $('input.checkbox').set('checked', false);
	 * </pre>
	 * 
	 * @example Changing the text of the next sibling:
	 * <pre>
	 * $('input.checkbox').set('nextSibling.innerHTML', 'New Text');
	 * </pre>
	 * 
	 * @example Changing attributes:
	 * <pre>
	 * $('a.someLinks').set('@href', 'http://www.example.com/');
	 * </pre>
	 * 
	 * @example Changing styles:
	 * <pre>
	 * $('.bigText').set('$font-size', 'x-large');
	 * </pre>
	 * 
	 * @example Adding and removing CSS classes:
	 * <pre>
	 * $('.myElem').set('$', '+myClass -otherClass');
	 * </pre>
	 *  
	 * @example Toggling a CSS class:
	 * <pre>
	 * $('.myElem').set('$', 'on');
	 * </pre>
	 * 
	 * @example Shortcut for CSS manipulation (omit the name - $ is the default name):
	 * <pre>
	 * $('.myElem').set('+myClass -otherClass on');
	 * </pre>
	 * 	 
	 * @example Making an element transparent:
	 * <pre>
	 * $('.seeThrough').set('$$fade', 0.5);
	 * </pre>
	 * 	  
	 * @example Making an element visible. Note that $$fade will set the element's display style to 'block' and visibility style to 'visible'.
	 * <pre>
	 * $('.myElem').set('$$fade', 1);
	 * </pre>
	 * 
	 * @example Using a map to change several properties:
	 * <pre>
	 * $('input.checkbox').set({checked: false,
	 *                          'nextSibling.innerHTML': 'New Text',
	 *                          'parentNode.@title': 'Check this'});
	 * </pre>
	 * 
	 * @example Changing CSS with a map:
	 * <pre>
	 * $('.importantText').set({$fontSize: 'x-large',
	 *                          $color: 'black',
	 *                          $backgroundColor: 'red',
	 *                          $: '+selected -default'});
	 * </pre>
	 * 
	 * @example You can specify a function as value to modify a value instead of just setting it:
	 * <pre>
	 * $('h2').set('innerHTML', function(oldValue, index) { 
	 * 		return 'Chapter ' + index + ': ' + oldValue.toUpperCase(); 
	 * });
	 * </pre>
	 * 
	 * @param name the name of a single property or attribute to modify. If prefixed with '@', it is treated as a DOM element's attribute. 
	 *             A dollar ('$') prefix is a shortcut for CSS styles. A simple dollar ('$') as name modifies CSS classes.
	 *             The special name '$$' allows you setting the style attribute in a browser independent way.
	 *             The special name '$$fade' expects a value between 0 and 1 and sets the opacity of the element in a browser-independent way. 
	 *             The special name '$$slide' expects a value between 0 and 1 that defines how much of the element is visible. The rest will
	 *             be cut up at its buttom. It can be used in animations to slide in or out an element. 
	 *             Both '$$fade' and '$$slide' will automatically control the element's 'visibility' and 'display' styles. If the value is 0,
	 *             the element's visibility will automatically be set to 'hidden'. If the value is larger, the visibility will be set to 
	 *             'visible' and the display style to 'block'. Both special names only work with block elements.
	 *             In order to stay compatible with Internet Explorer 7 and earlier, you should not set the attributes '@class' and '@style'. Instead
	 *             use the '$' syntax.
	 * 
	 * @param value the value to set. If it is a function, the function(oldValue, index, obj) will be invoked for each list element to evaluate the value. 
	 * The function is called with with the old value as first argument and the index in the list as second.
	 * The third value is the object being modified. Functions are not possible for virtual properties ('$$fade' and '$$slide'). For the CSS style names,
	 * the old value given to the function is the old value of the className property containing the existing classes.
	 * If value is null and name specified an attribute, the value will be ignored.
	 * If a dollar ('$') has been passed as name, the value can contain space-separated CSS class names. If prefix with a '+' the class will be added,
	 * with a '+' prefix the class will be removed. Without prefix, the class will be toggled. Functions are not supported by '$'.
	 * @param properties a map containing names as keys and the values to set as map values. See above for the syntax.
	 * @param cssClasses if set() is invoked with a string as single argument, the name "$" (CSS classes) is taken by default and the argument is the
	 *                   value. See value above for CSS syntax.
	 *                   Instead of a string, you can also specify a function(oldValue, index, obj) to generate the string. 
	 * @param defaultFunction optional if set and no function is provided as value, this function(oldValue, index, obj, newValue) will be invoked for each list element 
	 *                                 and property to determine the value. The function is called with with the old value as first 
	 *                                 argument and the item's list index as second, and the object being modified as third. The fourth value is the new value specified
	 *                                 in the set() call.
	 * @return the list
	 */
     'set': function (name, value, defaultFunction) {
    	 var self = this, v;
 		 // @cond debug if (name == null) error("First argument must be set!");
    	 if (value !== undef) {
    		 // @cond debug if (!/string/i.test(typeof name)) error('If second argument is given, the first one must be a string specifying the property name");
 			
    		 // @condblock fadeslide
    		 if (name == '$$fade' || name == '$$slide') {
    			 self.set({$visibility: (v = extractNumber(value)) > 0 ? 'visible' : 'hidden', $display: 'block'})
    			     .set((name == '$$fade')  ? (
    			 // @condblock ie8compatibility 
    			    	  IS_PRE_IE9 ? {$filter: 'alpha(opacity = '+(100*v)+')', $zoom: 1} :
    			 // @condend
    			    	  {$opacity: v})
    			        :
    			        {$height: /px$/.test(value) ? value : function(oldValue, idx, element) { return v * (v && getNaturalHeight($(element)))  + 'px';},
    			         $overflow: 'hidden'}
 					);
    		 }
    		 else
    			// @condend
    			 self['each'](function(obj, c) {
    				 var f = isFunction(value) ? value : defaultFunction;
    				 var nameClean = replace(name, /^[@$]/);
    				 var className = obj.className || '';
    				 var newObj = /^\$/.test(name) ? obj.style : obj;
    				 var newValue = f ? f(MINI(obj).get(name), c, obj, value) : value;
    				 if (name == '$') {
    					 each(newValue.split(/\s+/), function(clzz) {
    						 var cName = replace(clzz, /^[+-]/);
    						 var oldClassName = className;
    						 className = replace(className, new RegExp(BACKSLASHB + cName + BACKSLASHB));
    						 if (/^\+/.test(clzz) || (cName==clzz && oldClassName == className)) // for + and toggle-add
    							 className += ' ' + cName;
    					 });
    					 obj.className = replace(className, /^\s+|\s+(?=\s|$)/g);
    				 }
   				 	 else if (name == '$$') {
						// @condblock ie8compatibility 
						if (IS_PRE_IE9)
							newObj.cssText = newValue;
						else
						// @condend
							 obj.setAttribute('style', newValue);
					 }
    				 else if (!/^@/.test(name))
    					 newObj[nameClean] = newValue;
    				 else if (newValue != null)  
    					 newObj.setAttribute(nameClean, newValue);
    			 });
    	 }
    	 else if (isString(name) || isFunction(name))
    		 self.set('$', name);
    	 else
    		 each(name, function(n,v) { self.set(n, v, defaultFunction); });
    	 return self;
     },
 	
	/*$
	 * @id append
	 * @module SELECTORS
	 * @requires set
	 * @configurable default
	 * @name .append()
	 * @syntax MINI(selector).append(name, value)
	 * @syntax MINI(selector).append(properties)
	 * Appends strings to properties or attributes of list items. append() works mostly like set() and supports the same syntax for properties, but instead of
	 * overwriting the old values, it reads the old value, converts it to a string and then appends the given value.
	 * 
	 * @example Add a link after each h2 headline:
	 * <pre>
	 * $('h2').append('outerHTML', '<a href="#toc">Table of Content</a>');
	 * </pre>
	 *
	 * @param name the name of a single property or attribute to modify. If prefixed with '@', it is treated as a DOM element's attribute. 
	 *                     A dollar ('$') is used to select a CSS style.
	 * @param value the value to append. It will be converted to a string before appending it. 
	 *                    If it is a function, the function will be invoked for each list element to evaluate the value, exactly like a in set(). Please note that the function's
	 *                    return value will not be appended, but will overwrite the existing value.
	 * @param properties a map containing names as keys and the values to append as map values. See above for the syntax.
	 * @return the list
	 */
	'append': function (name, value) { return this.set(name, value, function(oldValue, idx, obj, newValue) { return toString(oldValue) + newValue;});},

	/*$
	 * @id prepend
	 * @module SELECTORS
	 * @requires set
	 * @configurable default
	 * @name .prepend()
	 * @syntax MINI(selector).prepend(name, value)
	 * @syntax MINI(selector).prepend(properties)
	 * Prepends strings to properties or attributes of list items. prepend() works mostly like set() and supports the same syntax for properties, but instead of
	 * overwriting the old values, it reads the old value, converts it to a string and then prepends the given value.
	 * 
	 * @example Put a horizontal ruler in front of each h2 headline:
	 * <pre>
	 * $('h2').prepend('outerHTML', '<hr />');
	 * </pre>
	 *
	 * @param name the name of a single property or attribute to modify. If prefixed with '@', it is treated as a DOM element's attribute. 
	 *                     A dollar ('$') is used to select a CSS style.
	 * @param value the value to prepend. It will be converted to a string before prepending it. 
	 *                    If it is a function, the function will be invoked for each list element to evaluate the value, exactly like a in set(). Please note that the function's
	 *                    return value will not be prepended, but will overwrite the existing value.
	 * @param properties a map containing names as keys and the values to prepend as map values. See above for the syntax.
	 * @return the list
	 */
	'prepend': function (name, value) { return this.set(name, value, function(oldValue, idx, obj, newValue) { return newValue + toString(oldValue);});},

	
	/*$
	 * @id add
	 * @module ELEMENT
	 * @requires dollar each
	 * @configurable default
	 * @name .add()
	 * @syntax MINI(selector).add(text)
	 * @syntax MINI(selector).add(factoryFunction)
	 * @syntax MINI(selector).add(list)
	 * @syntax MINI(selector).add(node)
	 * Adds the given node(s) as content to the list elements as additional nodes. If a string has been given, it will be added as text node.
	 * If you pass a function, it will be invoked to create node(s) with the arguments function(parent, index). It can return all values
	 * allowed by add(), including another function to be called.
	 * If you pass a list or a function returns a list, all its elements will be added using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will be added <strong>only to the first element of the list</strong>, because DOM
	 * does not allow adding it more than once.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">Here is some text.&lt;br/>&lt;/div>
	 * </pre> 
	 * Add a text to the given 'comment' div:
	 * <pre>
	 * $('#comments').add('Some additional text.');
	 * </pre>
	 * This results in:
	 * <pre>
	 * &lt;div id="comments">Here is some text.&lt;br/>&lt;Some additional text./div>
	 * </pre> 
	 *
	 * @example Using the following HTML: 
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>First list entry&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 * The following Javascript adds an element to the list:
	 * <pre>
	 * $('#myList').add(EE('li', 'My extra point');
	 * </pre>
	 * This results in
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>First list entry&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 *   &lt;li>My extra point&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 *
	 * @example Use a list to add several elements at once:
	 * <pre>
	 * $('#comments').add([EE('br'), 'Some text', EE('span', {'className': 'highlight'}, 'Some highlighted text')]);
	 * </pre>
	 *
	 * @example You can implement functions to create elements depending on the context:
	 * <pre>
	 * $('.chapter').add(function(parent, index) { return EE('h2', 'Chapter number ' + index); });
	 * </pre>
	 *
	 * @param text a string to add as text node of the list elements
	 * @param factoryFunction a function(listItem, listIndex) that will be invoked for each list element to create the nodes. 
	 *              The function can return either a string for a text node, a function to invoke, an HTML element or a list 
	 *              containing strings, lists, functions and/or DOM nodes.
	 * @param list a list containing text, functions, nodes or more list. Please note that if you have DOM nodes in this list
	 *             and attempt to add them to more than one element, the result is undefined. You should always use factories if your
	 *             MINI list contains more than one item.
	 * @param node a DOM node to add <strong>only to the first element</strong> of the list. 
	 * @return the current list
	 */
	'add': function (children, addFunction) {
		return this['each'](function(e, index) {
			var lastAdded;
			(function appendChildren(c) {
				if (isList(c))
					each(c, appendChildren);
				else if (isFunction(c))
					appendChildren(c(e, index));
				else if (c != null) {   // must check null, as 0 is a valid parameter 
					var n = isNode(c) ? c : _document.createTextNode(c);
					if (lastAdded)
						lastAdded.parentNode.insertBefore(n, lastAdded.nextSibling);
					else if (addFunction)
						addFunction(n, e, e.parentNode); 
					else
						e.appendChild(n);
					lastAdded = n;
				}
			})(isNode(children) && index ? null : children);
		});
	},

	
	/*$
	 * @id fill
	 * @module ELEMENT
	 * @requires dollar add remove
	 * @configurable default
	 * @name .fill()
	 * @syntax MINI(selector).fill()
	 * @syntax MINI(selector).fill(text)
	 * @syntax MINI(selector).fill(factoryFunction)
	 * @syntax MINI(selector).fill(list)
	 * @syntax MINI(selector).fill(node)
	 * Sets the content of the list elements, replacing old content. If a string has been given, it will be added as text node.
	 * If you pass a function, it will be invoked to create node(s) with the arguments function(parent, index). It can return all values
	 * allowed by fill(), including another function to be called.
	 * If you pass a list or a function returns a list, all its elements will be added using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will be set <strong>only in the first element of the list</strong>, because DOM
	 * does not allow adding it more than once.
	 *
	 * Call fill() without arguments to remove all children from a node.
	 * 
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="status">Done&lt;/div>
	 * </pre> 
	 * fill() with a simple string replaces the element's content with the text:
	 * <pre>
	 * $('#status').fill('Please Wait..');
	 * </pre>
	 * Results in:
	 * <pre>
	 * &lt;div id="status">Please Wait..&lt;/div>
	 * </pre> 
	 *
	 * @example Pass an Element Factory to replace the old content with that:
	 * <pre>
	 * $('#status').fill(EE('span', {'className': 'bold'}, 'Please Wait...'));
	 * </pre>
	 * With the previous example's HTML, this would create this:
	 * <pre>
	 * &lt;div id="status">&lt;span class='bold'>Please Wait..&lt;/span>&lt;/div>
	 * </pre> 
	 *
	 * @example You can also pass a list of elements and texts:
	 * <pre>
	 * $('#status').fill(['Here', EE('br'), 'are', EE('br'), 'four', EE('br'), 'lines.]);
	 * </pre>
	 *
	 * @example Or a complete structure built using EE:
	 * <pre>
	 * $('#myListContainer').fill([EE('h2', 'My List'), EE('ol', [EE('li', 'First Item'), EE('li', 'Second Item'), EE('li', 'Third Item')])]);
	 * </pre>
	 *
	 * @example You can write a factory function that re-creates the list for every instance:
	 * <pre>
	 * $('.listContainers').fill(function(e, index) { return [EE('h2', 'List Number '+index), EE('ol', [EE('li', 'First Item'), EE('li', 'Second Item'), EE('li', 'Third Item')])]});
	 * </pre>
	 *
	 * @example fill() without arguments deletes the content of the list elements:
	 * <pre>
	 * $('.listContainers').fill();
	 * </pre>
	 *
	 * @param text a string to set as text node of the list elements
	 * @param factoryFunction a function(listItem, listIndex) that will be invoked for each list element to create the nodes. 
	 *              The function can return either a string for a text node, a function to invoke, an HTML element or a list 
	 *              containing strings, lists, functions and/or DOM nodes.
	 * @param list a list containing text, functions, nodes or more list. Please note that if you have DOM nodes in this list
	 *             and attempt to add them to more than one element, the result is undefined. You should always use factories if your
	 *             MINI list contains more than one item.
	 * @param node a DOM node to set <strong>only in the first element</strong> of the list. 

	 * @return the current list
	 */
	'fill': function (children) {
		return this['each'](function(e) { MINI(e.childNodes)['remove'](); })['add'](children);
	},

	/*$
	 * @id addbefore
	 * @module ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .addBefore()
	 * @syntax MINI(selector).addBefore(text)
	 * @syntax MINI(selector).addBefore(factoryFunction)
	 * @syntax MINI(selector).addBefore(list)
	 * @syntax MINI(selector).addBefore(node)
	 * Inserts the given text or element(s) as sibling in front of each element of this list. 
	 * If a string has been given, it will be added as text node.
	 * If you pass a function, it will be invoked to create node(s) with the arguments function(parent, index). It can return all values
	 * allowed by addBefore(), including another function to be called.
	 * If you pass a list or a function returns a list, all its elements will be added using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will be added <strong>only to the first element of the list</strong>, because DOM
	 * does not allow adding it more than once.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div>
	 *   <div id="mainText">Here is some text</div>
	 * &lt;/div>
	 * </pre>  
	 * addBefore() adds text in front of the selected list items.
	 * <pre>
	 * $('#mainText').addBefore('COMMENT');
	 * </pre>
	 * This results in:
	 * <pre>
	 * &lt;div>
	 *   COMMENT
	 *   <div id="mainText">Here is some text</div>
	 * &lt;/div>
	 * </pre>  
	 *
	 * @example You can also pass an Element Factory:
	 * <pre>
	 * $('#mainText').addBefore(EE('span', {'className': 'important'}, 'WARNING'));
	 * </pre>
	 * With the previous example's HTML, this would create this:
	 * <pre>
	 * &lt;div>
	 *   &lt;span class="important">WARNING&lt;/span>
	 *   <div id="mainText">Here is some text</div>
	 * &lt;/div>
	 * </pre> 
	 *
	 * @example Lists of elements and nodes are possible as well.
	 * <pre>
	 * $('#status').addBefore([EE('hr'), 'WARNING']);
	 * </pre>
	 *
	 * @param text a string to add as text node of the list elements
	 * @param factoryFunction a function(listItem, listIndex) that will be invoked for each list element to create the nodes. 
	 *              The function can return either a string for a text node, a function to invoke, an HTML element or a list 
	 *              containing strings, lists, functions and/or DOM nodes.
	 * @param list a list containing text, functions, nodes or more list. Please note that if you have DOM nodes in this list
	 *             and attempt to add them to more than one element, the result is undefined. You should always use factories if your
	 *             MINI list contains more than one item.
	 * @param node a DOM node to add <strong>only to the first element</strong> of the list. 
	 * @return the current list
	 */
	'addBefore': function (children) {
		return this.add(children, function(newNode, refNode, parent) { parent.insertBefore(newNode, refNode); });
	},
	
	/*$
	 * @id addafter
	 * @module ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .addAfter()
	 * @syntax MINI(selector).addAfter(text)
	 * @syntax MINI(selector).addAfter(factoryFunction)
	 * @syntax MINI(selector).addAfter(list)
	 * @syntax MINI(selector).addAfter(node)
	 * Inserts the given text or element(s) as sibling after each element of this list. 
	 * If a string has been given, it will be added as text node.
	 * If you pass a function, it will be invoked to create node(s) with the arguments function(parent, index). It can return all values
	 * allowed by addAfter(), including another function to be called.
	 * If you pass a list or a function returns a list, all its elements will be added using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will be added <strong>only to the first element of the list</strong>, because DOM
	 * does not allow adding it more than once.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div>
	 *   <div id="mainText">Here is some text</div>
	 * &lt;/div>
	 * </pre>   
	 * Use addAfter() with a simple string to add a text node.
	 * <pre>
	 * $('#mainText').addAfter('Disclaimer: bla bla bla');
	 * </pre>
	 * This results in the following HTML:
	 * <pre>
	 * &lt;div>
	 *   <div id="mainText">Here is some text</div>
	 *   Disclaimer: bla bla bla
	 * &lt;/div>
	 * </pre>   
	 *
	 * @example You can also pass an Element Factory:
	 * <pre>
	 * $('#mainText').addAfter(EE('span', {'className': 'disclaimer'}, 'Disclaimer: bla bla bla'));
	 * </pre>
	 * With the previous example's HTML, this would create this:
	 * <pre>
	 * &lt;div>
	 *   <div id="mainText">Disclaimer: bla bla bla</div>
	 *   &lt;span class="disclaimer">WARNING&lt;/span>
	 * &lt;/div>
	 * </pre> 
	 *
	 * @param text a string to add as text node of the list elements
	 * @param factoryFunction a function(listItem, listIndex) that will be invoked for each list element to create the nodes. 
	 *              The function can return either a string for a text node, a function to invoke, an HTML element or a list 
	 *              containing strings, lists, functions and/or DOM nodes.
	 * @param list a list containing text, functions, nodes or more list. Please note that if you have DOM nodes in this list
	 *             and attempt to add them to more than one element, the result is undefined. You should always use factories if your
	 *             MINI list contains more than one item.
	 * @param node a DOM node to add <strong>only to the first element</strong> of the list. 
	 * @return the current list
	 */
	'addAfter': function (children) {
		return this.add(children, function(newNode, refNode, parent) { parent.insertBefore(newNode, refNode.nextSibling); });
	},
	
	/*$
	 * @id addfront
	 * @module ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .addFront()
	 * @syntax MINI(selector).addFront(text)
	 * @syntax MINI(selector).addFront(factoryFunction)
	 * @syntax MINI(selector).addFront(list)
	 * @syntax MINI(selector).addFront(node)
	 * Adds the given node(s) as content to the list elements as additional nodes. Unlike add(), the new nodes will be the first children of the list items.
	 * If a string has been given, it will be added as text node.
	 * If you pass a function, it will be invoked to create node(s) with the arguments function(parent, index). It can return all values
	 * allowed by addFront(), including another function to be called.
	 * If you pass a list or a function returns a list, all its elements will be added using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will be added <strong>only to the first element of the list</strong>, because DOM
	 * does not allow adding it more than once.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">Here is some text.&lt;br/>&lt;/div>
	 * </pre> 
	 * Add a text to the given 'comment' div:
	 * <pre>
	 * $('#comments').addFront('Some additional text. ');
	 * </pre>
	 * This results in:
	 * <pre>
	 * &lt;div id="comments">Some additional text.Here is some text.&lt;br/>&lt;/div>
	 * </pre> 
	 *
	 * @example Using the following HTML: 
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>First list entry&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 * The following Javascript adds an element to the list:
	 * <pre>
	 * $('#myList').addFront(EE('li', 'My extra point'));
	 * </pre>
	 * This results in
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>My extra point&lt;/li>
	 *   &lt;li>First list entry&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 *
	 * @example Use a list to add several elements at once:
	 * <pre>
	 * $('#comments').addFront([EE('br'), 'Some text', EE('span', {'className': 'highlight'}, 'Some highlighted text')]);
	 * </pre>
	 *
	 * @param text a string to add as text node of the list elements
	 * @param factoryFunction a function(listItem, listIndex) that will be invoked for each list element to create the nodes. 
	 *              The function can return either a string for a text node, a function to invoke, an HTML element or a list 
	 *              containing strings, lists, functions and/or DOM nodes.
	 * @param list a list containing text, functions, nodes or more list. Please note that if you have DOM nodes in this list
	 *             and attempt to add them to more than one element, the result is undefined. You should always use factories if your
	 *             MINI list contains more than one item.
	 * @param node a DOM node to add <strong>only to the first element</strong> of the list. 
	 * @return the current list
	 */
	'addFront': function (children) {
		return this.add(children, function(newNode, refNode) { refNode.insertBefore(newNode, refNode.firstChild); });
	},
	
	/*$
	 * @id replace
	 * @module ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .replace()
	 * @syntax MINI(selector).replace(text)
	 * @syntax MINI(selector).replace(factoryFunction)
	 * @syntax MINI(selector).replace(list)
	 * @syntax MINI(selector).replace(node)
	 * Replaces the list items with the the given node(s) in the DOM tree. 
	 * If a string has been given, it will be set as text node.
	 * If you pass a function, it will be invoked to create node(s) with the arguments function(parent, index). It can return all values
	 * allowed by replace(), including another function to be called.
	 * If you pass a list or a function returns a list, all its elements will be set using the rules above.
	 *
	 * It is also possible to pass a DOM node, but it will replace <strong>only the first element of the list</strong>, because DOM
	 * does not allow adding it more than once.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">
	 *    &lt;div id="commentOne">My old comment.&lt;/div>
	 * &lt;/div>
	 * </pre> 
	 * Replaces the div 'commentOne':
	 * <pre>
	 * $('#commentOne').replace('Some new comment.');
	 * </pre>
	 * This results in:
	 * <pre>
	 * &lt;div id="comments">
	 *    Some new comment.
	 * &lt;/div>
	 * </pre> 
	 * Please note that not only the text has changed, but the whole &lt;div> has been replaced. If you only want to replace the element's text content
	 * you should use fill() instead of replace().
	 *
	 * @example Using the following HTML: 
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>First list entry&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 * The following example will replace <strong>only the first &lt;li> element</strong>:
	 * <pre>
	 * $('#myList li').sub(0, 1).replace(EE('li', 'My extra point'));
	 * </pre>
	 * This results in
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>My extra point&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 *
	 *
	 * @param text a text for the text nodes that replace the list elements
	 * @param callbackFunction a function that will be invoked for each list element to determine its content. The function can return either a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements.
	 * @param elementContent content to replace <strong>only to the first element</strong> of the list with. The content can be a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements.
	 * @return the current list
	 */
	'replace': function (children) {
		return this.add(children, function(newNode, refNode, parent) { parent.replaceChild(newNode, refNode); });
	},

	/*$
	 * @id clone
	 * @module ELEMENT
	 * @requires dollar el
	 * @configurable default
	 * @name .clone()
	 * @syntax MINI(selector).clone()
	 * Creates a MINI list of strings and Element Factories that returns clones of the list elements. An Element Factory is a function
	 * that does not take arguments and returns a MINI list of DOM nodes. You can pass the list to add() and similar functions
	 * to re-create the cloned nodes.
	 *
	 * If you call clone() on a list with several items, the ElementFactory will return all of them in its list.
	 *
	 * clone() is very limited in what it will clone. Only elements, their attributes, text nodes and CDATA will be cloned.
	 * Modifications of the elements, such as event handlers, will not be cloned.
	 *
	 * Please note that id attributes will be automatically skipped by the Element Factory. This allows you to address the element to clone by id
	 * without having to worry about duplicate ids in the result.
	 * 
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">
	 *    &lt;div class="comment">My comment.&lt;/div>
	 * &lt;/div>
	 * </pre> 
	 * Creating a clone factory:
	 * <pre>
	 * var myCloneFactory = $('.comment').clone();
	 * </pre>
	 * Cloning a comment and adding it below the existing one:
	 * <pre>
	 * $('#comments').add($('.comment').clone());
	 * </pre> 
	 * 
	 * @return the list of Element Factory functions and strings to create clones
	 */
	'clone': function () {
		return this['collect'](function(e) {
			var attrs = {}, attrName, nodeType = isNode(e);
			if (nodeType == 1) {
				each(e['attributes'], function(a) {
					attrName = a['name'];
					if (attrName != 'id') {
						// @condblock ie8compatibility
							attrs[attrName == 'style' ? '$$' : (attrName  == 'class' ? '$' : ('@'+attrName))] =
						// @condend
						// @cond !ie8compatibility attrs['@'+attrName] =
								a['value'];
					}
				});
				return MINI['EE'](e['tagName'], attrs, MINI(e['childNodes'])['clone']());
			}
			else if (nodeType < 5)        // 2 is impossible (attribute), so only 3 (text) and 4 (cdata)
				return e['textContent'];
			else 
				return null;
		});
	},



	
	/*$
	 * @id animate
	 * @module ANIMATION
	 * @requires loop dollar each set get
	 * @configurable default
	 * @name .animate()
	 * @syntax MINI(selector).animate(properties)
	 * @syntax MINI(selector).animate(properties, durationMs)
	 * @syntax MINI(selector).animate(properties, durationMs, linearity)
	 * @syntax MINI(selector).animate(properties, durationMs, linearity)
	 * @syntax MINI(selector).animate(properties, durationMs, linearity, state)
	 * Animates the items of the list by modifying their properties, CSS styles and attributes. animate() can work with numbers, strings that contain exactly one
	 * number and which may also contain units or other text, and with colors in the CSS notations 'rgb(r,g,b)', '#rrggbb' or '#rgb'.
	 *
	 * When you invoke the function, it will first read all old values from the object and extract their numbers and colors. These start values will be compared to 
	 * the destination values that have been specified in the given properties. Then animate() will create a background task using MINI.loop() that updates the 
	 * specified properties in frequent intervals so that they transition to their destination values.
	 *
	 * The start values will be obtained using get(). It is recommended to set the start values using set() before you start the animation, even if this is not
	 * always required.
	 *
	 * You can define the kind of transition using the 'linearity' parameter. If you omit it or pass 0, animate's default algorithm will cause a smooth transition
	 * from the start value to the end value. If you pass 1, the transition will be linear, with a sudden start and end of the animation. Any value between 0 and 1 
	 * is also allowed and will give you a transition that is 'somewhat smooth'. 
	 *
	 * If the start value of a property is a string containing a number, animate() will always ignore all the surrounding text and use the destination value as a template 
	 * for the value to write. This can cause problems if you mix units in CSS. For example, if the start value is '10%' and you specify an end value of '20px', animate
	 * will do an animation from '10px' to '20px'. It is not able to convert units. 
	 *
	 * animate() does not only support strings with units, but any string containing exactly one number. This allows you, among other things, with IE-specific CSS properties.
	 * For example, you can transition from a start value 'alpha(opacity = 0)' to 'alpha(opacity = 100)'. 
	 *
	 * When you animate colors, animate() is able to convert between the three notations rgb(r,g,b), #rrggbb or #rgb. You can use them interchangeably, but you can not 
	 * use color names such as 'red'.
	 *
	 * You can prefix any number, including numbers with units, with "-=" or "+=" in order to specify a value relative to the starting value. The new value will be added
	 * to or substracted from the start value to determine the end value.
	 *
	 * To allow more complex animation, animate() returns a promise that is fulfulled when the animation has finished. 
	 *
	 * @example Move an element. Note that you need to set the initial value for styles, unless they have been explicitly set
	 * for the HTML element using the style attribute before or you set it earlier with an earlier set() or animate() invocation.
	 * <pre>
	 * $('#myMovingDiv').set({$left: '0px', $top: '0px'})                // start values
	 *                  .animate({$left: '50px', $top: '100px'}, 1000);  // animation
	 * </pre>
	 *
	 * @example Using relative values for animation:
	 * <pre>
	 * $('#myMovingDiv').set({$left: '100px', $top: '100px'})                // start values
	 *                  .animate({$left: '-=50px', $top: '+=100px'}, 1000);  // animation
	 * </pre>
	 * 
	 * @example Change the color of an element:
	 * <pre>
	 * $('#myBlushingDiv').set({$backgroundColor: '#000000'})
	 *                    .animate({$backgroundColor: '#ff0000'}, 1000);
	 * </pre>
	 * 
	 * @example Fade-out effect:
	 * <pre>
	 * $('#myFadingDiv').animate({$$fade: 0}, 1000);
	 * </pre>
	 * 
 	 * @example Slide-in effect:
	 * <pre>
	 * $('#myInvisibleDiv').animate({$$slide: 1}, 1000);
	 * </pre>
	 *
	 * @example Chained animation using promise callbacks. The element is first moved to the position 200/0, then to 200/200, and finally to 100/100.
	 * <pre>
	 * var div = $('#myMovingDiv').set({$left: '0px', $top: '0px'});
	 * div.animate({$left: '200px', $top: '0px'}, 600, 0)
	 *    .then(function() {
	 *           div.animate({$left: '200px', $top: '200px'}, 800, 0);
	 *    }).then(function() {
	 *           div.animate({$left: '100px', $top: '100px'}, 400);
	 *    });
	 * });
	 * </pre>
	 *
	 *
	 * @param properties a property map describing the end values of the corresponding properties. The names can use the
	 *                   set() syntax ('@' prefix for attributes, '$' for styles, '$$fade' for fading and '$$slide' for slide effects). 
	 *                   Values must be either numbers, numbers with units (e.g. "2 px") or colors ('rgb(r,g,b)', '#rrggbb' or '#rgb'). 
	 *                   Number values, including those with units, can be prefixed with "+=" or "-=", meaning that the value is relative 
	 *                   to the original value and should be added or subtracted.
	 * @param durationMs optional the duration of the animation in milliseconds. Default: 500ms.
	 * @param linearity optional defines whether the animation should be linear (1), very smooth (0) or something in between. Default: 0.
	 * @param state optional if set, the animation controller will write information about its state in this object. When animate() returns,
	 *                       there will be a MINI.loop() stop() function in the property state.stop. The property state.time will be continously updated
	 *                       while the animation is running and contains the number of milliseconds that have
	 *                       passed from the start until the last invocation of the animation loop, describing the progress of the animation. 
	 *                       If the animation finished, controller writes null into state.time. state.stop will remain unmodified during the whole time. 
	 * @return a Promise object for the animation's state. It is fulfilled when the animation ended, and rejected if the animation had been stopped.
	 */
	'animate': function (properties, durationMs, linearity, state) {
		// @cond debug if (!properties || typeof properties == 'string') error('First parameter must be a map of properties (e.g. "{top: 0, left: 0}") ');
		// @cond debug if (linearity < 0 || linearity > 1) error('Third parameter must be at least 0 and not larger than 1.');
		// @cond debug var colorRegexp = /^(rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|#\w{3}|#\w{6})\s*$/i;
		var self = this;
		var initState = []; // for each item contains a map {s:{}, e:{}, o} s/e are property name -> startValue of start/end. The item is in o.
		var numRegExp = /-?[\d.]+/;
		var loopStop;
		var prom = promise();
		state = state || {};
		state['time'] = 0;
		state['stop'] = function() { loopStop(); prom(false); };
		durationMs = durationMs || 500;
		linearity = linearity || 0;
		
		// find start values
		self['each'](function(li) {
			var p = {o:MINI(li), s:{}, e:{}}; 
			each(p.s = p.o.get(properties), function(name, start) {
				var dest = properties[name];
				if (name == '$$slide') 
					dest = dest*getNaturalHeight(p.o) + 'px';
				p.e[name] = /^[+-]=/.test(dest) ?
						replace(dest.substr(2), numRegExp, extractNumber(start) + extractNumber(replace(dest, /\+?=/))) 
						: dest;
			});
			initState.push(p);
		});
				
		// start animation
		loopStop = MINI.loop(function(timePassedMs, stop) { 
			function getColorComponent(colorCode, index) {
				return (/^#/.test(colorCode)) ?
					parseInt(colorCode.length > 6 ? colorCode.substr(1+index*2, 2) : ((colorCode=colorCode.charAt(1+index))+colorCode), 16)
					:
					parseInt(replace(colorCode, /[^\d,]+/g).split(',')[index]);
			}

			function interpolate(startValue, endValue) {
				return startValue +  timePassedMs/durationMs * (endValue - startValue) * (linearity + (1-linearity) * timePassedMs/durationMs * (3 - 2*timePassedMs/durationMs)); 
			}
			
			state['time'] = timePassedMs;
			if (timePassedMs >= durationMs || timePassedMs < 0) {
				each(initState, function(isi) { // set destination values
					isi.o.set(isi.e);
				});
				stop();
				state['time'] = state['stop'] = null;
				prom(true, [self]);
			}
			else
				each(initState, function(isi) {
					each(isi.s, function(name, start) {
						var newValue= 'rgb(', end=isi.e[name];
						if (/^#|rgb\(/.test(end)) { // color in format '#rgb' or '#rrggbb' or 'rgb(r,g,b)'?
							for (var i = 0; i < 3; i++) 
								newValue += Math.round(interpolate(getColorComponent(start, i), getColorComponent(end, i))) + (i < 2 ? ',' : ')');
						}
						else 
							newValue = replace(end, numRegExp, interpolate(extractNumber(start), extractNumber(end)));
						isi.o.set(name, newValue);
					});
				});
			});
			return prom;		
		},
		
		
		/*$
		 * @id toggle
		 * @module ANIMATION
		 * @requires animate set
		 * @configurable default
		 * @name .toggle()
		 * @syntax MINI(selector).toggle(cssClasses)
		 * @syntax MINI(selector).toggle(state1, state2)
		 * @syntax MINI(selector).toggle(state1, state2, durationMs)
		 * @syntax MINI(selector).toggle(state1, state2, durationMs, linearity)
		 * @shortcut $(selector).toggle(state1, state2, durationMs, linearity) - Enabled by default, but can be disabled in the builder.
		 * 
		 * Creates a function that switches between the two given states for the list. The states use set() syntax. 
		 *
 	     * If no duration is given, the returned function changes the state immediately using set(). If a duration has been passed, the returned function
 	     * uses animate() to change the state. If the returned function is invoked while an animation is running, it interrupts the animation and returns
 	     * to the other state.
		 *
		 * @example Creates a toggle function that changes the background color of the page.
		 * <pre>
		 * var light = $('body').set({$backgroundColor: #000}, {$backgroundColor: #fff});
		 * light();      // toggles state to second state
		 * light(false); // sets first state (background color to #000).
		 * light(true);  // sets second state (background color to #fff).
		 * light();      // toggles state to first state
		 * </pre>
		 * 
		 * @example Takes the previous function, but adds it as onclick event handler that toggles the color.
		 * <pre>
		 * var light = $('body').toggle({$backgroundColor: #000}, {$backgroundColor: #fff});
		 * $('#mySwitch').on('click', light);
		 * </pre>
		 *
		 * @example Using an animated transition by passing a duration:
		 * <pre>
		 * var dimmer = $('body').toggle({$backgroundColor: #000}, {$backgroundColor: #fff}, 500);
		 * $('#mySwitch').on('click', dimmer);
		 * </pre>
		 *
		 * @example To toggle CSS classes specify both states:
		 * <pre>
		 * var t = $('#myElement').toggle({$: '-myClass1 -myClass2'}, {$: '+myClass1 +myClass2'});
		 * $('#myController').on('click', t);
		 * </pre>
		 *
		 * @example There is a shortcut for toggling CSS classes. Just list them space-separated in a string:
		 * <pre>
		 * var t = $('#myElement').toggle('myClass1 myClass2');
		 * </pre>
		 * 
		 * @param cssClasses a string containing space-separated CSS class names that will be toggled. Classes are disabled in the first state
		 *                   and enabled in the second.
		 * @param state1 a property map describing the initial state of the properties. The properties will automatically be set when the
		 *                   toggle() function is created. The property names use the set() syntax ('@' prefix for attributes, '$' for styles). 
		 *                   For animation, values must be either numbers, numbers with
		 *                   units (e.g. "2 px") or colors ('rgb(r,g,b)', '#rrggbb' or '#rgb'). The properties will be set 
		 *                   for all elements of the list.
		 * @param state2 a property map describing the second state of the properties. Uses set() syntax, like the other state. 
		 * @param durationMs optional if set, the duration of the animation in milliseconds. By default, there is no animation and the set will be changed
		 *                   immediately.
		 * @param linearity optional defines whether the animation should be linear (1), very smooth (0) or something in between. Default: 0. Ignored if durationMs is 0.
		 * @return a function(newState) that will change from the first to the second state and vice versa if called without argument or with
		 *         newState set to null. If the argument is a boolean false or true, the first or second state will be set respectively. 
		 *         If the argument is not boolean or the function is called without arguments, the function toggles between both states. 
		 */
		'toggle': function(state1, state2, durationMs, linearity) {
			var animState = {};
			var state = false, regexg = /\b(?=\w)/g;
			var self = this;

			return !state2 ?
				self.toggle(replace(state1, regexg, '-'), replace(state1, regexg, '+')) :			
				self.set(state1) && 
			    function(newState) {
					if (newState === state) 
						return;
					state = isType(newState, 'boolean') ? newState : !state;
	
					if (durationMs) 
						self.animate(state ? state2 : state1, animState.stop ? (animState.stop() || animState.time) : durationMs, linearity, animState);
					else
						self.set(state ? state2 : state1); 
				};
		},

		/*$
		 * @id on
		 * @module EVENTS
		 * @requires dollar each
		 * @configurable default
		 * @name .on()
		 * @syntax MINI(selector).on(name, handler)
		 * @syntax MINI(selector).on(name, handler, args)
		 * @syntax MINI(selector).on(name, handler, fThis, args)
		 * @shortcut $(selector).on(name, handler) - Enabled by default, but can be disabled in the builder.
		 * Registers the function as event handler for all items in the list.
		 * 
		 * By default, handlers get a the original event object and minified's compatibility event object as arguments, and 'this' set to the source element
		 * of the event (e.g. the button that has been clicked). The original event object the is object given to the event or obtained 
		 * from 'window.event'. Unless the handler returns 'true', the event will not be propagated to other handlers.
		 * 
		 * Instead of the event objects, you can also pass an array of arguments and a new value for 'this' to the event handler. When you pass arguments, the
		 * handler's return value is always ignored and the event will always be cancelled.
		 * 
		 * @example Adds a handler to all divs that paints their background color to red when clicked. The event object is not needed.
		 * <pre>
		 * $('div').on('click', function() {
		 *    this.style.backgroundColor = 'red';    // 'this' contains the element that caused the event
		 * });
		 * </pre>
		 *
		 * @example handler to call a method setStatus('running') using an inline function:
		 * <pre>
		 * $('#myButton').on('click', function() {
		 *    myObject.setStatus('running');
		 * });
		 * </pre>
		 * The same can be written like this using on() argument and fThis parameters:
		 * <pre>
		 * $('#myButton').on('click', myObject.setStatus, myObject, ['running']);
		 * </pre>
		 *
		 * @param name the name of the event, e.g. 'click'. Case-sensitive. The 'on' prefix in front of the name must not used.
		 * @param handler the function(event, index) to invoke when the event has been triggered. If no new arguments have been given using 
		 *                on()'s second argument, the handler gets the original event object as first parameter and the index
		 *                of the object in the current MINI list as second. 'this' is the element that caused the event, unless you override it with the
		 *                third argument.
		 *                Unless the handler returns true, all further processing of the event will be stopped and event bubbling will be disabled. If you supply
		 *                custom arguments, the event processing and bubbling will always be disabled, no mattter what the handler returns.
		 *                Minified will not use directly add this handler to the element, but create a wrapper that will eventually invoke it. The wrapper 
		 *                is added to the handler in an array property called 'M'.
		 * @param fThis an optional value for 'this' in the handler, as alternative to the event target
		 * @param args optional an array of arguments to pass to the handler function instead of the event objects. If you pass custom arguments, the
		 *                      return value of the handler will always be ignored.
		 * @return the list
		 */
		'on': function (name, handler, fThisOrArgs, args) {
			// @cond debug if (!(name && handler)) error("Both parameters to on() are required!"); 
			// @cond debug if (/^on/i.test(name)) error("The event name looks invalid. Don't use an 'on' prefix (e.g. use 'click', not 'onclick'"); 
			return this['each'](function(el, index) {
				var h = function(event) {
					var e = event || _this.event;
					// @cond debug try {
					if (!handler.apply(args ? fThisOrArgs : e.target, args || fThisOrArgs || [e, index]) || args) {
						// @condblock ie8compatibility 
						if (e.stopPropagation) {// W3C DOM3 event cancelling available?
						// @condend
							e.preventDefault();
							e.stopPropagation();
						// @condblock ie8compatibility 
						}
						e.returnValue = false; // cancel for IE
						e.cancelBubble = true; // cancel bubble for IE
						// @condend
					}
					// @cond debug } catch (ex) { error("Error in event handler \""+name+"\": "+ex); }
				};
				(handler['M'] = handler['M'] || []).push({'e':el, 'h':h, 'n': name});
				// @condblock ie8compatibility 
				if (el.addEventListener)
				// @condend
					el.addEventListener(name, h, true); // W3C DOM
				// @condblock ie8compatibility 
				else 
					el.attachEvent('on'+name, h);  // IE < 9 version
				// @condend
			});
		},

	
	/*$
	 * @id offset
	 * @module SELECTORS
	 * @requires dollar
	 * @configurable default
	 * @name .offset()
	 * @syntax MINI(selector).offset()
	 * @shortcut $(selector).offset() - Enabled by default, unless disabled with "Disable $ and $$" option
	 * Returns the pixel page coordinates of the list's first element. Page coordinates are the pixel coordinates within the document, with 0/0 being the upper left corner, independent of the user's
	 * current view (which depends on the user's current scroll position and zoom level).
	 *
	 * @example Displays the position of the element with the id 'myElement' in the element 'resultElement':
	 * <pre>
	 * var pos = $('#myElement').offset();
	 * $('#resultElement').set('innerHTML', '#myElement's position is left=' + pos.x + ' top=' + pos.y);
	 * </pre>
	 *
	 * @param element the element whose coordinates should be determined
	 * @return an object containing pixel coordinates in two properties 'x' and 'y'
	 */
	'offset': function() {
		var elem = this[0];
		var dest = {'x': 0, 'y': 0};
		while (elem) {
			dest.x += elem.offsetLeft;
			dest.y += elem.offsetTop;
			elem = elem.offsetParent;
		}
		return dest;
     }
 	/*$
 	 * @stop
 	 */
	}, function(n, v) {M.prototype[n]=v;});
     

 	//// MINI FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	each({

    /*$
	 * @id dollardollar
	 * @module SELECTORS
	 * @requires dollarraw
	 * @configurable default
	 * @name MINI.$$()
	 * @syntax MINI.$$(selector)
	 * @shortcut $$(selector) - Enabled by default, but can be disabled in the builder.
	 * Returns an DOM object containing the first match of the given selector, or undefined if no match. $$ allows you to easily access
	 * an element directly. It is the equivalent to writing "$(selector)[0]".
	 *
	 * @example Select the checkbox 'myCheckbox':
	 * <pre>
	 * $$('#myCheckbox').selected = true;
	 * </pre>
	 * 
	 * @param selector a simple, CSS-like selector for the element. Uses the syntax described in MINI. The most common
	 *                 parameter for this function is the id selector with the syntax "#id".
	 * @return a DOM object of the first match, or undefined if the selector did not return at least one match
	 */
    '$$': function(selector) {
		return dollarRaw(selector)[0];
	},

		
	/*$
	 * @id el
	 * @module ELEMENT
	 * @requires dollardollar set
	 * @configurable default
	 * @name MINI.el()
	 * @syntax MINI.el(elementName)
	 * @syntax MINI.el(elementName, attributes)
	 * @syntax MINI.el(elementName, children)
	 * @syntax MINI.el(elementName, attributes, children)
	 * @syntax MINI.el(elementName, attributes, children, onCreate)
	 * @shortcut EE(elementName, attributes, children)
	 * Creates a new Element Factory. An Element Factory is a function without arguments that returns MINI list
	 * containing a newly created element, optionally with attributes and children.
	 * Typically it will be used to inset elements into the DOM tree using add() or a similar function. 
	 *
	 * By default, Minified creates a shortcut called EE for this function.
	 *
	 * The function is namespace-aware and will create XHTML nodes if called in an XHTML document.
	 * 
	 * @example Creating a simple factory for a &lt;span> element with some text:
	 * <pre>
	 * var mySpan = EE('span', 'Hello World'); 
	 * </pre>
	 * creates this:
	 * <pre>
	 *  &lt;span>Hello World&lt;/span> 
	 * </pre>
	 * @example Creating a factory for a &lt;span> element with style, some text, and append it to elements with the class 'greetingsDiv':
	 * <pre>
	 * $('.greetingsDiv').add(EE('span', {'@title': 'Greetings'}, 'Hello World')); 
	 * </pre>
	 * creates this:
	 * <pre>
	 *  &lt;span title="Greetings">Hello World&lt;/span> 
	 * </pre>
	 * 
	 * @example The factory function always returns a MINI list with a single element. You can directly use it, for example,
	 *          to add an event handler.
	 * <pre>
	 * var myDiv = EE('div', 'Hello World')();
	 * container.add(myDiv);
	 * myDiv.on('click', function() { window.alert('Clicked!'); }); 
	 * </pre>
	 * 
	 * @example Creating a &lt;form> element with two text fields, labels and a submit button:
	 * <pre>
	 * var myForm = EE('form', {'@method': 'post'}, [
	 *     EE('label', {'@for': 'nameInput'}, 'Name:'),
	 *     EE('input', {'@id': 'nameInput', '@type': 'input'}),
	 *     EE('br'),
	 *     EE('label', {'@for': 'ageInput'}, 'Age:'),
	 *     EE('input', {'@id': 'ageInput', '@type': 'input'}),
	 *     EE('br'),
	 *     EE('input', {'@type': 'submit, '@value': 'Join'})
	 * ]); 
	 * </pre>
	 * results in (newlines and indentation added for readability):
	 * <pre>
	 * 	&lt;form method="post>
	 *     &lt;label for="nameInput">Name:&lt;/label>
	 *     &lt;input id="nameInput" type="input"/>
	 *     &lt;br/>
	 *     &lt;label for="ageInput"/>Age:&lt;/label>
	 *     &lt;input id="ageInput" type="input"/>
	 *     &lt;br/>
	 *     &lt;input value="Join" type="submit"/>
	 *  &lt;/form>
	 * </pre>
	 * 
	 * @example Null attributes often come handy when you don't always need a particular attribute. Attributes with null values will be ignored:
	 * <pre>
	 * var myInput = EE('input', {'@id': 'myCheckbox', '@type': 'checkbox', '@checked': shouldBeChecked() ? 'checked' : null});
	 * </pre>
	 * 
	 * @example You can set styles directly using a $ prefix for the name:
	 * <pre>
	 * var myStylesSpan = EE('span', {$color: "red", $fontWeight: "bold"}, "I'm styled");
	 * </pre>
	 * 
	 * @example To add event handlers, use the fourth argument:
	 * <pre>
	 * var myStylesSpan = EE('input', {'@name': "myInput"}, null, function(e) {
	 *     e.on('change', inputChanged);
	 * });
	 * </pre>
	 * 
	 * @param elementName the element name to create (e.g. 'div')
	 * @param attributes optional an object which contains a map of attributes and other values. The syntax is exactly like set(): Attribute values are prefixed with '@',
	 *                   CSS styles with '$' and regular properties can be set without prefix.
	 *                   If the attribute value is null, the attribute will omitted (styles and properties can be set to null). 
	 *                   In order to stay compatible with Internet Explorer 7 and earlier, you should not set the attributes '@class' and '@style'. Instead
	 *                   set the property 'className' instead of '@class' and set styles using the '$' syntax.
	 * @param children optional  an element or a list of elements to add as children. Strings will be converted as text nodes. 
	 *                         Functions will be invoked and their return value will be used. Lists can be 
	 *                         nested and will then automatically be flattened. Null elements in lists will be ignored. 
	 *                         The syntax is exactly like add().
	 * @param onCreate optional a function(elementList) that will be called each time an element had been created. This allows you, for example, to 
	 *                 add event handlers with on(). Will be called with the created element in a MINI list as argument.
	 * @return a Element Factory function returning a MINI list containing the DOM HTMLElement that has been created or modified as only element
	 */
	'EE': function(elementName, attributes, children, onCreate) {
		// @cond debug if (!elementName) error("el() requires the element name."); 
		// @cond debug if (/:/.test(elementName)) error("The element name can not create a colon (':'). In XML/XHTML documents, all elements are automatically in the document's namespace.");
	
		return function() {
			var nu = _document.documentElement.namespaceURI; // to check whether doc is XHTML
			var list = MINI(nu ? _document.createElementNS(nu, elementName) : _document.createElement(elementName));
			(isList(attributes) || !isObject(attributes)) ? list['add'](attributes) : list['set'](attributes)['add'](children);
			if (onCreate)
				onCreate(list);
			return list; 
		};
	},
		
	
	/*$
	* @id request
	* @module REQUEST
	* @requires 
	* @configurable default
	* @name MINI.request()
	* @syntax MINI.request(method, url)
	* @syntax MINI.request(method, url, data)
	* @syntax MINI.request(method, url, data, onSuccess)
	* @syntax MINI.request(method, url, data, onSuccess, onFailure)
	* @syntax MINI.request(method, url, data, onSuccess, onFailure, headers)
	* @syntax MINI.request(method, url, data, onSuccess, onFailure, headers, username, password)
	* Initiates a HTTP request (using XmlHTTPRequest) to the given URL. It returns a Promise object that allows you to obtain the result.
	* 
	* @example Invoke a REST web service and parse the resulting document using JSON:
	* <pre>
	* MINI.request('get', 'http://service.example.com/weather', {zipcode: 90210})
	*    .then(function(txt) {
	*         var json = MINI.parseJSON(txt);
	*         $('#weatherResult').fill('Today's forecast is is: ' + json.today.forecast);
	*    })
	*    .error(function(status, statusText, responseText) {
	*         $('#weatherResult').fill('The weather service was not available.');
	*     });
	* </pre>
	* 
	* @example Send a JSON object to a REST web service:
	* <pre>
	* var myRequest = {         // create a request object that can be serialized via JSON
	*      request: 'register',
	*      entries: [
	*        {name: 'Joe',
	*      	    job: 'Plumber'
	*      }]};
	* 
	* function failureHandler() {
	*   $('#registrationResult').fill('Registration failed');
	* }
	*
	* MINI.request('post', 'http://service.example.com/directory', MINI.toJSON(myRequest))
	*     .then(function(txt) {
	*        if (txt == 'OK')
	*             $('#registrationResult').fill('Registration succeeded');
	*        else
	*              failureHandler();
	*        })
	*     .error(failureHandler);
	* </pre>
	*
	* 
	* @param method the HTTP method, e.g. 'get', 'post' or 'head' (rule of thumb: use 'post' for requests that change data on the server, and 'get' to only request data). Not case sensitive.
	* @param url the server URL to request. May be a relative URL (relative to the document) or an absolute URL. Note that unless you do something 
	*             fancy on the server (keyword to google:  Access-Control-Allow-Origin), you can only call URLs on the server your script originates from.
	* @param data optional data to send in the request, either as POST body or as URL parameters. It can be either a map of 
	*             parameters (all HTTP methods), a string (all methods) or a DOM document ('post' only). If the method is 'post', it will be 
	*             sent as body, otherwise appended to the URL. In order to send several parameters with the same name, use an array of values
	*             in the map. Use null as value for a parameter without value.
	* @param headers optional a map of HTTP headers to add to the request. Note that you should use the proper capitalization for the
	*                header 'Content-Type', if you set it, because otherwise it may be overwritten.
	* @param username optional username to be used for HTTP authentication, together with the password parameter
	* @param password optional password for HTTP authentication
	* @return a Promise containing the request's status. If the request has successfully completed with HTTP status 200, the success handler will be called.
	*         Its first argument is the text sent by the server. The second argument will contain the XML sent by the server, if there was a XML response.
	*         The failure handler will receive three arguments. The first argument is the HTTP status (never 200; 0 if no HTTP request took place), 
	*                  the second a status text (or null, if the browser threw an exception) and the third the returned text, if there was 
	*                  any (the exception as string if the browser threw it).
	*/
	'request': function (method, url, data, headers, username, password) {
		// @cond debug if (!method) error("request() requires a HTTP method as first argument.");
		// @cond debug if (!url) error("request() requires a url as second argument.");
		// @cond debug if (onSuccess && typeof onSuccess != 'function') error("request()'s fourth argument is optional, but if it is set, it must be a function.");
		// @cond debug if (onFailure && typeof onFailure != 'function') error("request()'s fifth argument is optional, but if it is set, it must be a function.");
		// @cond debug if (username && !password) error("If the user name is set (7th argument), you must also provide a password as 8th argument.");		method = method.toUpperCase();
		/** @const */ var ContentType = 'Content-Type';
		var xhr, body = data, callbackCalled = 0, prom = promise();
		try {
			//@condblock ie6compatibility
			xhr = _this.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Msxml2.XMLHTTP.3.0");
			//@condend
			// @cond !ie6compatibility xhr = new XMLHttpRequest();
			if (data != null) {
				headers = headers || {};
				if (!isString(data) && !isNode(data)) { // if data is parameter map...
					body = collect(data, function processParam(paramName, paramValue) {
						if (isList(paramValue))
							return collect(paramValue, function(v) {return processParam(paramName, v);});
						else
							return encodeURIComponent(paramName) + ((paramValue != null) ?  '=' + encodeURIComponent(paramValue) : '');
					}).join('&');
				}
				
				if (!/post/i.test(method)) {
					url += '?' + body;
					body = null;
				}
				else if (!isNode(data) && !isString(data) && !headers[ContentType])
					headers[ContentType] = 'application/x-www-form-urlencoded';
			}
			
			xhr.open(method, url, true, username, password);
			each(headers, function(hdrName, hdrValue) {
				xhr.setRequestHeader(hdrName, hdrValue);
			});

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && !callbackCalled++) {
					if (xhr.status == 200) {
						prom(true, [xhr.responseText, xhr.responseXML]);
					}
					else
						prom(false, [xhr.status, xhr.statusText, xhr.responseText]);
				}
			};
			
			xhr.send(body);
			return prom;
		}
		catch (e) {
			if (!callbackCalled) 
				prom(false, [0, null, toString(e)]);
		}
	},
	
	
	/*
	 * JSON Module. Uses browser built-ins or json.org implementation if available. Otherwise its own implementation,
	 * originally based on public domain implementation http://www.JSON.org/json2.js / http://www.JSON.org/js.html.
	 * Extremely simplified code, made variables local, removed all side-effects (especially new properties for String, Date and Number).
	 */
    

	/*$
    * @id tojson
    * @module JSON
    * @requires ucode 
    * @configurable default
    * @name MINI.toJSON()
    * @syntax MINI.toJSON(value)
    * Converts the given value into a JSON string. The value may be a map-like object, an array, a string, number, date, boolean or null.
    * If JSON.stringify is defined (built-in in some browsers), it will be used; otherwise MINI's own implementation.
    * 
    * The following types are supported by the built-in implementation:
    * <ul>
    *   <li>Objects (direct properties will be serialized)</li>
    *   <li>Arrays</li>
    *   <li>Strings</li>
    *   <li>Numbers</li>
    *   <li>Boolean</li>
    *   <li>null</li>
    * </ul>
    * Any other types in your value, especially Dates, should be converted into Strings by you.
    *
    * @example Convert an object into a JSON object:
    * <pre>
    * var myObj = {name: 'Fruits', roles: ['apple', 'banana', 'orange']};
    * var jsonString = MINI.toJSON(myObj);
    * </pre>
    * 
    * @param value the value (map-like object, array, string, number, date, boolean or null)
    * @return the JSON string
    */
    // @condblock ie7compatibility
    'toJSON': function toJSON(value) {
		if (value == null)
			return ""+value;                  //result: "null"; toString(value) is not possible, because it returns an empty string for null
		if (isString(value = value.valueOf()))
			return '"' + replace(value, /[\\\"\x00-\x1f\x22\x5c]/g, ucode) + '"' ;
		if (isList(value)) 
			return '[' + collect(value, toJSON).join() + ']';
		if (isObject(value))
			return '{' + collect(value, function(k, n) { return toJSON(k) + ':' + toJSON(n); }).join() + '}';
		return toString(value);
	},
    // @condend
    // @cond !ie7compatibility 'toJSON': _this.JSON && JSON.stringify,
    
	/*$
	* @id parsejson
	* @module JSON
	* @requires ucode
	* @configurable default
	* @name MINI.parseJSON()
	* @syntax MINI.parseJSON(text)
	* Parses a string containing JSON and returns the de-serialized object.
	* If JSON.parse is defined (built-in in some browsers), it will be used; otherwise MINI's own implementation.
	*
	* @example Parsing a JSON string:
	* <pre>
	* var jsonString = "{name: 'Fruits', roles: ['apple', 'banana', 'orange']}";
	* var myObj = MINI.parseJSON(jsonString);
	* </pre>
	*
	* @param text the JSON string
	* @return the resulting JavaScript object. Undefined if not valid.
	*/
    // @condblock ie7compatibility
    'parseJSON': _this.JSON ? _this.JSON.parse : function (text) {
    	var t = replace(text, /[\x00\xad\u0600-\uffff]/g, ucode); // encode unsafe characters
        if (/^[[\],:{}\s]*$/                  // test that, after getting rid of literals, only allowed characters can be found
				.test(replace(replace(t , /\\["\\\/bfnrtu]/g),             // remove all escapes
						/"[^"\\\n\r]*"|true|false|null|[\d.eE+-]+/g))      // remove all literals
				)
        	return eval('(' + t + ')');
        // fall through if not valid
        // @cond debug error('Can not parse JSON string. Aborting for security reasons.');
    },
    // @condend
    // @cond !ie7compatibility 'parseJSON': _this.JSON && JSON.parse,
    
	/*$
    * @id ready
    * @module EVENTS
    * @requires ready_vars ready_init
    * @configurable default
    * @name MINI.ready()
    * @syntax MINI.ready(handler)
    * Registers a handler to be called as soon as the HTML has been fully loaded (but not necessarily images and other elements).
    * On older browsers, it is the same as 'window.onload'. 
    *
    * @example Registers a handler that sets some text in an element:
    * <pre>
    * MINI.ready(function() {
    *   $$('#someElement').innerHTML = 'ready() called';
    * });
    * </pre>
    *
    * @param handler the function to be called when the HTML is ready
    */
    'ready': ready,

   
	/*$
     * @id setcookie
     * @module COOKIE
     * @configurable default
     * @name MINI.setCookie()
     * @syntax MINI.setCookie(name, value)
     * @syntax MINI.setCookie(name, value, dateOrDays)
     * @syntax MINI.setCookie(name, value, dateOrDays, path)
     * @syntax MINI.setCookie(name, value, dateOrDays, path, domain)
     * Creates, updates or deletes a cookie. If there is an an existing cookie
     * of the same name, will be overwritten with the new value and settings. Use a 
     *
     * @example Reads the existing cookie 'numberOfVisits', increases the number and stores it:
     * <pre>
     * var visits = MINI.getCookie('numberOfVisits');
     * MINI.setCookie('numberOfVisits', 
     *                      visits ? (parseInt(visits) + 1) : 1,         // if cookie not set, start with 1
     *                      365);                                              // store for 365 days
     * </pre>
     * 
     * @example Deletes the cookie "numberOfVisits":
     * <pre>
     * MINI.setCookie('numberOfVisits', '', -1);
     * </pre>
     * 
     * @param name the name of the cookie. This should be ideally an alphanumeric name, as it will not be escaped by Minified and this
     *             guarantees compatibility with all systems.
     *             If it contains a '=', it is guaranteed not to work, because it breaks the cookie syntax. 
     * @param value the value of the cookie. All characters except alphanumeric and "*@-_+./" will be escaped using the 
     *              JavaScript escape() function and thus can be used, unless you set the optional dontEscape parameter.
     * @param dateOrDays optional specifies when the cookie expires. Can be either a Date object or a number that specifies the
     *                   amount of days. If not set, the cookie has a session lifetime, which means it will be deleted as soon as the
     *                   browser has been closes. If the number negative or the date in the past, the cookie will be deleted.
     * @param path optional if set, the cookie will be restricted to documents in the given certain path. Otherwise it is valid
     *                       for the whole domain. This is rarely needed.
     * @param domain optional if set, you use it to specify the domain (e.g. example.com) which can read the cookie. If you don't set it,
     *               the domain which hosts the current document is used. This parameter is rarely used, because there are only very
     *               few use cases in which this makes sense.
     * @param dontEscape optional if set, the cookie value is not escaped. Note that without escaping you can not use every possible
     *                    character (e.g. ";" will break the cookie), but it may be needed for interoperability with systems that need
     *                    some non-alphanumeric characters unescaped or use a different escaping algorithm.
     */
    'setCookie': function(name, value, dateOrDays, path, domain, dontEscape) {
		// @cond debug if (!name) error('Cookie name must be set!');
		// @cond debug if (/[^\w\d-_%]/.test(name)) error('Cookie name must not contain non-alphanumeric characters other than underscore and minus. Please escape them using encodeURIComponent().');
    	_document.cookie = name + '=' + (dontEscape ? value : escape(value)) + 
    	    (dateOrDays ? ('; expires='+(isObject(dateOrDays) ? dateOrDays : new Date(now() + dateOrDays * 8.64E7)).toUTCString()) : '') + 
    		'; path=' + (path ? escapeURI(path) : '/') + (domain ? ('; domain=' + escape(domain)) : '');
    },
    
    /*$
     * @id getcookie
     * @module COOKIE
     * @requires
     * @configurable default
     * @name MINI.getCookie()
     * @syntax MINI.getCookie(name)
     * @syntax MINI.getCookie(name, dontUnescape)
     * Tries to find the cookie with the given name and returns it.
     *
     * @example Reads the existing cookie 'numberOfVisits' and displays the number in the element 'myCounter':
     * <pre>
     * var visits = MINI.getCookie('numberOfVisits');
     * if (!visits)    // check whether cookie set. Null if not
     *     $('#myCounter').set('innerHML', 'Your first visit.');
     * else
     *     $('#myCounter').set('innerHTML', 'Visit No ' + visits);
     * </pre>
     *  
     * @param name the name of the cookie. Should consist of alphanumeric characters, percentage, minus and underscore only, as it will not be escaped. 
     *             You may want to escape the name using encodeURIComponent() for all other characters.
     * @param dontUnescape optional if set and true, the value will be returned unescaped (use this only if the value has been encoded
     *                     in a special way, and not with the JavaScript encode() method)
     * @return the value of the cookie, or null if not found. Depending on the dontUnescape parameter, it may be unescape or not.
     */
    'getCookie': function(name, dontUnescape) {
    	// @cond debug if (!name) error('Cookie name must be set!');
    	// @cond debug if (/[^\w\d-_%]/.test(name)) error('Cookie name must not contain non-alphanumeric characters other than underscore and minus. Please escape them using encodeURIComponent().');
    	var regexp, match = (regexp = new RegExp('(^|;)\\s*'+name+'=([^;]*)').exec(_document.cookie)) && regexp[2];
    	return dontUnescape ? match : match && unescape(match);
    },

	/*$
	* @id loop
	* @module ANIMATION
	* @requires animation_vars 
	* @configurable default
	* @name MINI.loop()
	* @syntax MINI.loop(paintCallback)
	* @syntax MINI.loop(paintCallback, element)
	* Use this function to run an animation loop. In modern browser that support requestAnimationFrame, the given callback is invoked as often 
	* as the browser is ready for a new animation frame. The frequency is determined by the browser and may vary depending on factors such as the time needed to render the current page.
	* the screen's framerate and whether the page is currently shown to the user (page is the current tab, browser window not minimized etc). 
	* In older browsers, the callback function will be invoked every 33 milliseconds.
	* To stop a running animation loop, either invoke the function that is returned or the function given as second parameter to the callback.
	*
	* @example A animates a div by moving along in a circle.
	* <pre>
	*   var myDiv = $$('#myAnimatedDiv');
	*   var rotationsPerMs = 1000;                           // one rotation per second
	*   var radius = 100;
	*   var d = 3000;                                        // duration in ms
	*   MINI.loop(function(t, stopFunc) {
	*     if (t > d) {                                       // time is up: call stopFunc()!
	*       stopFunc();
	*       return;
	*     }
	* 
	*     var a = 2 * Math.PI * t / rotationsPerMs           // angular position
	*     myDiv.style.left = (radius * Math.cos(a) + ' px';
	*     myDiv.style.top = (radius * Math.sin(a) + ' px';
	*   });
	* </pre>
	*
	* @param paintCallback a callback function(timestamp, stopFunc) to invoke for painting. Parameters given to callback:
	* <ul>
	*            <li>timestamp - number of miliseconds since animation start</li>
	*            <li>stopFunc - call this function() to stop the currently running animation</li>
	* </ul>
	* @return a function() that stops the currently running animation.
	*/
	'loop': function(paintCallback) { 
        var entry = {c: paintCallback, t: now()};
        entry.s = function() {
    		for (var i = 0; i < ANIMATION_HANDLERS.length; i++) // can't use each() or filter() here, list may be modified during run!!
    			if (ANIMATION_HANDLERS[i] === entry) 
    				ANIMATION_HANDLERS.splice(i--, 1);
        };
        
        if (ANIMATION_HANDLERS.push(entry) < 2) { // if first handler.. 
			(function raFunc() {
				if (each(ANIMATION_HANDLERS, function(a) {a.c(Math.max(0, now() - a.t), a.s);}).length) // check len after run, in case the callback invoked stop func
					REQUEST_ANIMATION_FRAME(raFunc); 
			})(); 
        } 
        return entry.s; 
    },
    
    /*$
	 * @id off
	 * @module EVENTS
	 * @requires dollar on each
	 * @configurable default
	 * @name MINI.off()
	 * @syntax MINI.off(handler)
	 * Removes the event handler. The call will be ignored if the given handler has not registered using on(). If the handler has been registered
	 * for more than one element or event, it will be removed from all instances.
	 * 
	 * @example Adds a handler to an element
	 * <pre>
	 * function myEventHandler() {
	 *    this.style.backgroundColor = 'red';    // 'this' contains the element that caused the event
	 * }
	 * $('#myElement').on('click', myEventHandler);     // add event handler
	 *
	 * window.setInterval(function() {                      // after 5s, remove event handler
	 *    MINI.off(myEventHandler);
	 * }, 5000);
	 * </pre>
	 * 
	 * @param handler the handler to unregister, as given to on(). It must be a handler that has previously been registered using on().
     */
	'off': function (handler) {
		// @cond debug if (!handler || !handler['M']) error("No handler given or handler invalid.");
	   	each(handler['M'], function(h) {	
			// @condblock ie8compatibility 
			if (h['e'].addEventListener)
				// @condend
				h['e'].removeEventListener(h['n'], h['h'], true); // W3C DOM
			// @condblock ie8compatibility 
			else 
				h['e'].detachEvent('on'+h['n'], h['h']);  // IE < 9 version
			// @condend
		});
		handler['M'] = null;
	}
	
 	/*$
 	 * @stop
 	 */

	}, function(n, v) {MINI[n]=v;});

	//// GLOBAL INITIALIZATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /*$
	 * @id ready_init
	 * @dependency
     */
    // @condblock ie8compatibility
    _this.onload = triggerDomReady;

    if (_document.addEventListener)
    // @condend
    	_document.addEventListener("DOMContentLoaded", triggerDomReady, false);
	/*$
	 @stop
	 */
	return {'$':MINI};
});

/*$
 * @stop 
 */



