 /*
 * Minified-web.js - Lightweight Client-Side JavaScript Libary (web module only)
 * Version: @@@VERSION@@@
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 * To the extent possible under law, Tim Jansen has waived all copyright and related or neighboring rights to Minified.
 * Please see http://creativecommons.org/publicdomain/zero/1.0/.
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
 * - @required if set, the block is always enabled. This can be useful for conditions.
 * - @name a name for builder and reference docs
 * - @doc if 'no', the section will not be displayed in reference docs, only in builder
 * - @module the module(s), comma-separated. Can be WEB, UTIL or APP
 * 
 * Single-Line Comments
 * - @cond id defines that the code following after the id will be included if the block id is enabled 
 * - @cond !id include the following line only if the block id is disabled
 * - @condblock id will include all following lines if id is enabled until the next @condend. @condblocks can be nested.
 * - @condend ends a @condblock 
 */

// ==ClosureCompiler==
// @output_file_name minified-web.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==

///#snippet commonAmdStart

/*$
 * @id require
 * @name require()
 * @syntax require(name)
 * @group OPTIONS
 * @module WEB, UTIL
 * Returns a reference to a module. If you do not use an AMD loader to load Minified, just call <var>require()</var> with the
 * argument 'minified' to get a reference to Minified. You can also access all modules defined using ##define().
 * 
 * If you do use an AMD loader, Minified will not define this function and you can use the AMD loader to obtain the
 * reference to Minified.
 * Minified's version of <var>require</var> is very simple and will only support Minified and other libraries designed
 * for Minfied, but <strong>no real AMD libraries</strong>. If you need to work with libraries requiring AMD, you need a real AMD loader.
 * 
 * @param name the name of the module to request. Minified is available as 'minified'.
 * @return the reference to the module. Use the name 'minified' to get Minified. You can also access any modules defined using
 * ##define(). If the name is unknown, it returns <var>undefined</var>.
 * 
 * @see ##define() allows you to define modules that can be obtained using <var>require()</var>.
 */


/*$
 * @id define
 * @name define()
 * @syntax define(name, factoryFunction)
 * @group OPTIONS
 * @module WEB, UTIL
 * Defines a module that can be returned by ##require(), in case you don't have a AMD loader. If you have a AMD loader before you include Minified,
 * <var>define()</var> will not be set and you can use the AMD loader's (more powerful) variant.
 *
 * Minified's versions of <var>require()</var> and <var>define()</var> are very simple and can not resolve things like circular references.
 * Also, they are not AMD-compatible and only useful for simple modules. If you need to work with real AMD libraries that are not written
 * for Minified, you need a real AMD loader.
 * 
 * @example Creates a simple module and uses it:
 * <pre>
 * define('makeGreen', function(require) {
 *     var MINI = require('minified'), $ = MINI.$; // obtain own ref to Minified
 *     return function(list) {
 *         $(list).set({$color: '#0f0', $backgroundColor: '#050'});
 *     });
 * });
 * 
 * var makeGreen = require('makeGreen');
 * makeGreen('.notGreenEnough');
 * </pre>
 * 
 * @param name the name of the module to request. In Minified's implementation, only 'minified' is supported.
 * @param factoryFunction is a <code>function(require)</code> will be called the first time the name is defined to obtain the module 
 * 						  reference. It received a reference to ##require() (which is required for AMD backward-compatibility) and 
 * 						  must return the value that is returned by ##require(). The function will only be called once, its result will 
 *                        be cached.
 *                        <dl><dt>require</dt><dd>A reference to ##require(). While you could use <var>require()</var> from the global
 *                        context, this would prevent backward compatibility with AMD.</dd>
 *                        <dt class="returnValue">(callback return value)</dt><dd>The reference to be returned by ##require().</dd></dl>
 *                        
 * @see ##require() can be used to obtain references defined with ##define().                       
 */

/*$
 * @id amdsupport
 * @name AMD stubs
 * @configurable default
 * @group OPTIONS
 * @doc no
 * @module WEB, UTIL
 * If enabled, Minified will create stubs so you can use it without an AMD framework.
 * It requires AMD's <code>define()</code> function.
 */
if (/^u/.test(typeof define) || !define.amd) { // no AMD support available ? define a minimal version
	(function(def){
		var require = this['require'] = function(name) { return def[name]; };
		this['define'] = function(name, f) { def[name] = def[name] || f(require); };
	})({});
}
/*$
 * @stop
 */

define('minified', function() {

///#/snippet commonAmdStart
	

	//// GLOBAL VARIABLES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var _null = null;
	var undef;
		
	///#snippet webVars
	/*$
	 * @id WEB
	 * @doc no
	 * @required
	 * This id allows identifying whether the Web module is available.
	 */

	/**
	 * @const
	 */
	var _window = window;

	/**
	 * @const
	 * @type {!string}
	 */
	var MINIFIED_MAGIC_NODEID = 'Nia';

	/**
	 * @const
	 * @type {!string}
	 */
	var MINIFIED_MAGIC_PREV = 'NiaP';

	var setter = {}, getter = {};
	
	var idSequence = 1;  // used as node id to identify nodes, and as general id for other maps

	// @condblock ie8compatibility
	var registeredEvents = {}; // nodeId -> [handler objects] ; for on()
	// @condend
	

	/*$
	 * @id ready_vars
	 * @dependency
	 */
	/** @type {!Array.<function()>} */
	var DOMREADY_HANDLER = /^[ic]/.test(document['readyState']) ? _null : []; // check for 'interactive' and 'complete'
	/*$
	 * @id animation_vars
	 * @dependency
	 */
	var animationHandlers = {}; // global map of id->run() currently active
	var animationHandlerCount = 0; // number of active handlers
	

	/*$
	 * @id ie9compatibility
	 * @group OPTIONS
	 * @configurable default
	 * @doc no
	 * @name Backward-Compatibility for IE9 and similar browsers
	 * The only difference between IE9 and IE10 for Minified are the lack of a 'relatedTarget' property in events
	 * and the 'elements' property of forms, which is a node in IE9.  
	 */

	
	/*$
	 * @id ie8compatibility
	 * @group OPTIONS
	 * @requires ie9compatibility 
	 * @configurable default
	 * @doc no
	 * @name Backward-Compatibility for IE8 and similar browsers
	 * The only difference for Minified between IE8 and IE9 is the lack of support for the CSS opacity attribute in IE8,
	 * and the existence of cssText (which is used instead of the style attribute).
	 */
	 var IS_PRE_IE9 = !!document['all'] && !document['addEventListener'];
	/*$
	 * @id ie7compatibility
	 * @group OPTIONS
	 * @requires ie8compatibility 
	 * @configurable default
	 * @doc no
	 * @name Backward-Compatibility for IE7 and similar browsers
	 * The difference between IE7 and IE8 compatibility that IE7 provides neither native selector support (querySelectorAll) nor native JSON.
	 * Disabling IE6 and IE7 will not only make Minified smaller, but give you full CSS selectors and complete JSON support. 
	 */

	/*$
	 * @id ie6compatibility
	 * @group OPTIONS
	 * @requires ie7compatibility 
	 * @configurable default
	 * @doc no
	 * @name Backward-Compatibility for IE6 and similar browsers
	 * The only difference for Minified between IE6 and IE7 is the lack of a native XmlHttpRequest in IE6 which makes the library a tiny 
	 * little bit larger.
	 */
	/*$
	 * @stop
	 */

	///#/snippet webVars

	
	//// GLOBAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	 // THE FOLLOWING FUNCTION ARE FOR WEB-MODULE. In full package they will be provided by Util. 
	 
	 /** @param s {?} */
	function toString(s) { // wrapper for Closure optimization
		return s!=_null ? ''+s : '';
	}
	/**
	 * @param s {?}
	 * @param regexp {string}
	 */
	function isType(s,regexp) {
		return regexp.test(typeof s);
	}
	/** @param s {?} */
	function isString(s) {
		return isType(s, /^str/);
	}
	function isNumber(s) {
		return isType(s, /^num/);
	}
	function isObject(f) {
		return isType(f, /^ob/);
	}
	function isNode(n) {
		return n && n['nodeType'];
	}
	function nonOp(v) {
		return v;
	}
	function callList(fl, arg) { // simplified impl with one  arg no checks. For web only!
		flexiEach(fl, function(f) { f(arg); });
	}
	function eachObj(obj, cb) { // web version does not use hasOwnProperty()
		for (var n in obj)
			cb(n, obj[n]);
		// web version has no return, no 'this', as this implementation is not exported
	}
	function filter(list, f) { // web version, no filter by idenitity
		var r = []; 
		flexiEach(list, function(value, index) {
			if (f.call(list, value, index))
				r.push(value);
		});
		return r;
	}
	function collector(iterator, obj, collectFunc) {
		var result = [];
		iterator(obj, function (a, b) {
			flexiEach(collectFunc.call(obj, a, b), function(v) { result.push(v);});
		});
		return result;
	}
	function replace(s, regexp, sub) {
		return toString(s).replace(regexp, sub||'');
	}

	function flexiEach(list, cb) { // extras contains an alt impl that uses Util
		if (isList(list))
			for (var i = 0; i < list.length; i++)
				cb.call(list, list[i], i);
		else if (list != _null)
			cb(list, 0);
		return list;
	}

	function ucode(a) {
		return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	}


	///#snippet webFunctions

	// note: only the web version has the f.item check
	function isFunction(f) {
		return typeof f == 'function' && !f['item']; // item check as work-around for webkit bug 14547
	}

	function isList(v) {
		return v && v.length != _null && !isString(v) && !isNode(v) && !isFunction(v) && v !== _window;
	}
	
	// used by IE impl of on() only
	function push(obj, prop, value) {
		(obj[prop] = (obj[prop] || [])).push(value);
	}
	// used by IE impl of on()/off() only
	function removeFromArray(array, value) {
		for (var i = 0; array && i < array.length; i++) 
			if (array[i] === value) 
				array['splice'](i--, 1);
	}
	
	function extractNumber(v) {
		return parseFloat(replace(v, /^[^\d-]+/));
	}

	// retrieves the node id of the element, create one if needed.
	function getNodeId(el) {
		return (el[MINIFIED_MAGIC_NODEID] = (el[MINIFIED_MAGIC_NODEID] || ++idSequence));
	}

	// collect variant that filters out duplicate nodes from the given list, returns a new array
	function collectUniqNodes(list, func) {
		var result = [];
		var nodeIds = {};
		var currentNodeId;
		
		flexiEach(list, function(value) {
			flexiEach(func(value), function(node) {
				if (!nodeIds[currentNodeId = getNodeId(node)]) {
					result.push(node);
					nodeIds[currentNodeId] = true;
				}
			});
		});
		return result;
	}
	
	// finds out the 'natural' height of the first element, the one if $$slide=1
	function getNaturalHeight(elementList, factor) {
		var q = {'$position': 'absolute', '$visibility': 'hidden', '$display': 'block', '$height': _null};
		var oldStyles = elementList['get'](q);
		var h = elementList['set'](q)['get']('clientHeight');
		elementList['set'](oldStyles);
		return h*factor + 'px';
	}
	
	// @condblock ie8compatibility 
	// event handler creation for on(). Outside of on() to prevent unneccessary circular refs
	function createEventHandler(handler, registeredOn, args, index, prefix, selectorFilter) {
		// triggerOriginalTarget is set only if the event handler is called by trigger()!! 
		return function(event, triggerOriginalTarget) {
			var stop;
			var e = event || _window.event;
			var match = !selectorFilter, el = triggerOriginalTarget || e['target'] || e['srcElement'];
			if (selectorFilter)
				while (el && el != registeredOn && !(match = selectorFilter(el)))
					el = el['parentNode'];

			if (match && 
			   (stop = (((!handler.apply($(selectorFilter ? el : registeredOn), args || [e, index])) || prefix=='') && prefix != '|')) && 
			   !triggerOriginalTarget) {
				if (e['preventDefault']) {// W3C DOM3 event cancelling available?
					e['preventDefault']();
					e['stopPropagation']();
				}
				e['cancelBubble'] = true; // cancel bubble for IE
			}
			return !stop;
		};
	}
	
	function on(subSelector, eventSpec, handler, args, bubbleSelector) {
		if (isFunction(eventSpec)) 
			return this['on'](_null, subSelector, eventSpec, handler, bubbleSelector);
		else if (isString(args)) 
			return this['on'](subSelector, eventSpec, handler, _null, args);
		else
			return this['each'](function(baseElement, index) {
				flexiEach(subSelector ? dollarRaw(subSelector, baseElement) : baseElement, function(el) {
					flexiEach(toString(eventSpec).split(/\s/), function(namePrefixed) {
						var name = replace(namePrefixed, /[?|]/);
						var capture = !!bubbleSelector && (name == 'blur' || name == 'focus'); // bubble selectors for 'blur' and 'focus' registered as capuring!
						var miniHandler = createEventHandler(handler, el, args,	index, replace(namePrefixed, /[^?|]/g), bubbleSelector && getFilterFunc(bubbleSelector, el));
		
						var handlerDescriptor = {element: el,          
								                 handlerFunc: miniHandler, 
								                 eventType: name,
								                 capture: capture
								                };
						push(handler, 'M', handlerDescriptor);
						if (IS_PRE_IE9) {
							el.attachEvent('on'+handlerDescriptor.eventType + (capture ? 'in' : ''), miniHandler);  // IE < 9 version
							push(registeredEvents, getNodeId(el), handlerDescriptor);
						}
						else {
							el.addEventListener(name, miniHandler, capture); // W3C DOM
							push(el, 'M', handlerDescriptor);
						}
					});
				});
			});
	}
	// @condend ie8compatibility 
	// @condblock !ie8compatibility 
	function on(subSelector, eventSpec, handler, args, bubbleSelector) {
		if (isFunction(eventSpec))
			return this['on'](_null, subSelector, eventSpec, handler, args);
		else if (isString(args)) 
			return this['on'](subSelector, eventSpec, handler, _null, args);
		else
			return this['each'](function(baseElement, index) {
				flexiEach(subSelector ? dollarRaw(subSelector, baseElement) : baseElement, function(registeredOn) {
					flexiEach(toString(eventSpec).split(/\s/), function(namePrefixed) {
						var name = replace(namePrefixed, /[?|]/g);
						var prefix = replace(namePrefixed, /[^?|]/g);
						var capture = (name == 'blur' || name == 'focus') && !!bubbleSelector; // bubble selectors for 'blur' and 'focus' registered as capuring!
						var triggerId = idSequence++;

						// returns true if processing should be continued
						function triggerHandler(eventName, event, target) {
							var match = !bubbleSelector;
							var el = bubbleSelector ? target : registeredOn;
							if (bubbleSelector) {
								var selectorFilter = getFilterFunc(bubbleSelector, registeredOn);
								while (el && el != registeredOn && !(match = selectorFilter(el)))
									el = el['parentNode'];
							}
							return (!match) || (name != eventName) || ((handler.apply($(el), args || [event, index]) && prefix=='?') || prefix == '|');
						};
						
						function eventHandler(event) {
							if (!triggerHandler(name, event, event['target'])) {
								event['preventDefault']();
								event['stopPropagation']();
							}
						};

						
						registeredOn.addEventListener(name, eventHandler, capture);
						
						if (!registeredOn['M']) 
							registeredOn['M'] = {};
						registeredOn['M'][triggerId] = triggerHandler;                  // to be called by trigger()
						
						handler['M'] = collector(flexiEach, [handler['M'], function () { // this function will be called by off()
							registeredOn.removeEventListener(name, eventHandler, capture);
							delete registeredOn['M'][triggerId];
						}], nonOp);
						
					});
				});
			});
	}
	// @condend !ie8compatibility 
	
	// @condblock ie8compatibility 
	function off(handler) {
	   	flexiEach(handler['M'], function(h) {
			if (IS_PRE_IE9) {
				h.element.detachEvent('on'+h.eventType + (h.capture ? 'in' : ''), h.handlerFunc);  // IE < 9 version
				removeFromArray(registeredEvents[h.element[MINIFIED_MAGIC_NODEID]], h);
			}
			else {
				h.element.removeEventListener(h.eventType, h.handlerFunc, h.capture); // W3C DOM
				removeFromArray(h.element['M'], h);
			}
		});
		handler['M'] = _null;
	}
	// @condend ie8compatibility 

	// @condblock !ie8compatibility 
	function off(handler) {
		callList(handler['M']);
		handler['M'] = _null;
	}
	// @condend !ie8compatibility 

	// for remove & window.unload, IE only
	function detachHandlerList(dummy, handlerList) {
		flexiEach(handlerList, function(h) {
			h.element.detachEvent('on'+h.eventType, h.handlerFunc);
		});
	}
	
	function ready(handler) {
		if (DOMREADY_HANDLER)
			DOMREADY_HANDLER.push(handler);
		else
			setTimeout(handler, 0);
	}

	function $$(selector, context, childrenOnly) {
		return dollarRaw(selector, context, childrenOnly)[0];
	}

	function EE(elementName, attributes, children) {
		var e = $(document.createElement(elementName));
		// @condblock UTIL
		// this attributes != null check is only required with Util's isObject() implementation. Web's isObject() is simpler.
		return (isList(attributes) || (attributes != _null && !isObject(attributes)) ) ? e['add'](attributes) : e['set'](attributes)['add'](children);
		// @condend UTIL
		// @cond !UTIL return (isList(attributes) || (!isObject(attributes)) ) ? e['add'](attributes) : e['set'](attributes)['add'](children);
	}
	
	function clone(listOrNode) {
		return collector(flexiEach, listOrNode, function(e) {
			var c;
			if (isList(e))
				return clone(e);
			else if (isNode(e)) {
				c = e['cloneNode'](true); 
				c['removeAttribute'] && c['removeAttribute']('id');
				return c;
			}
		    else
		    	return e;
		});
   }
   

	/*$
	 * @stop
	 */
	
	function $(selector, context, childOnly) { 
		// @condblock ready
		return isFunction(selector) ? ready(selector) : new M(dollarRaw(selector, context, childOnly));
		// @condend
		// @cond !ready return new M(dollarRaw(selector, context));
	}
  
	
	// implementation of $ that does not produce a Minified list, but just an array
	// @condblock ie7compatibility
	function dollarRaw(selector, context, childOnly) { 
		function filterElements(list) { // converts into array, makes sure context is respected
			var retList = collector(flexiEach, list, function flatten(a) { // flatten list, keep non-lists, remove nulls
				return isList(a) ? collector(flexiEach, a, flatten) : a; 
			});
			if (parent)
				return filter(retList, function(node) {
					var a = node;
					while (a = a['parentNode'])
						if (a == parent || childOnly)
							return a == parent;
					// fall through to return undef
				});
			else
				return retList;
		}
		function wordRegExpTester(name, prop) {
			var re = RegExp('(^|\\s+)' + name + '(?=$|\\s)', 'i');
			return function(obj) {return  name ? re.test(obj[prop]) : true;};
		}

		
		var parent, steps, dotPos, subSelectors;
		var elements, regexpFilter, useGEbC, className, elementName;
	
		if (context && (context = dollarRaw(context)).length != 1) // if not exactly one node, iterate through all and concat
			return collectUniqNodes(context, function(ci) { return dollarRaw(selector, ci, childOnly);});
		parent = context && context[0]; // note that context may have changed in the previous two lines!! you can't move this line
		
		if (!isString(selector))
		    return filterElements(selector); 
	
		if (parent && isNode(parent) != 1)
			return [];

		if ((subSelectors = selector.split(/\s*,\s*/)).length>1)
			return collectUniqNodes(subSelectors, function(ssi) { return dollarRaw(ssi, parent, childOnly);});
	
		if (steps = (/(\S+)\s+(.+)$/.exec(selector)))
			return dollarRaw(steps[2], dollarRaw(steps[1], parent), childOnly);
	
		if (selector != (subSelectors = replace(selector, /^#/)))
			return filterElements(document.getElementById(subSelectors)); 
	
		elementName = (dotPos = /([\w-]*)\.?([\w-]*)/.exec(selector))[1];
		className = dotPos[2];
		elements = (useGEbC = document.getElementsByClassName && className) ? (parent || document).getElementsByClassName(className) : (parent || document).getElementsByTagName(elementName || '*'); 
	
		if (regexpFilter = useGEbC ? elementName : className)
			elements =  filter(elements, wordRegExpTester(regexpFilter, useGEbC ? 'tagName' : 'className'));
		return childOnly ? filterElements(elements) : elements;
	};
	// @condend ie7compatibility
	
	// @condblock !ie7compatibility
	function dollarRaw(selector, context, childOnly) { 
		function flatten(a) { // flatten list, keep non-lists, remove nulls
		      return isList(a) ? collector(flexiEach, a, flatten) : a;
		 }
		 function filterElements(list) { // converts into array, makes sure context is respected
		      return filter(collector(flexiEach, list, flatten), function(node) {
		           var a = node;
		           while (a = a['parentNode'])
		                if (a == context[0] || childOnly)
		                     return a == context[0];
		           // fall through to return undef
		      });
		 }

		 if (context) {
		      if ((context = dollarRaw(context)).length != 1)
		           return collectUniqNodes(context, function(ci) { return dollarRaw(selector, ci, childOnly);});
		      else if (isString(selector)) {
		      		if (isNode(context[0]) != 1)
						return [];
					else 
		        		return childOnly ? filterElements(context[0].querySelectorAll(selector)) : context[0].querySelectorAll(selector);
		      }
		      else
		           return filterElements(selector);
		          
		 }
		 else if (isString(selector))
		      return document.querySelectorAll(selector);
		 else
		      return collector(flexiEach, selector, flatten);
	};
	// @condend !ie7compatibility

	
	// If context is set, live updates will be possible. 
	// Please note that the context is not evaluated for the '*' and 'tagname.classname' patterns, because context is used only
	// by on(), and in on() only nodes in the right context will be checked
	function getFilterFunc(selector, context) {
		function wordRegExpTester(name, prop) {
			var re = RegExp('(^|\\s+)' + name + '(?=$|\\s)', 'i');
			return function(obj) {return  name ? re.test(obj[prop]) : true;};
		}

		var nodeSet = {};
		var dotPos = nodeSet;
		if (isFunction(selector))
			return selector;
		else if (isNumber(selector))
			return function(v, index) { return index == selector; };
		else if (!selector || selector == '*' ||
				 (isString(selector) && (dotPos = /^([\w-]*)\.?([\w-]*)$/.exec(selector)))) {
			var nodeNameFilter = wordRegExpTester(dotPos[1], 'tagName');
			var classNameFilter = wordRegExpTester(dotPos[2], 'className');
			return function(v) {
				return isNode(v) == 1 && nodeNameFilter(v) && classNameFilter(v);
			};
		}
		else if (context) 
			return function(v) { 
				return $(selector, context)['find'](v)!=_null; // live search instead of node set, for on()
			};
		else {
			$(selector)['each'](function(node) {
				nodeSet[getNodeId(node)] = true;
			});
			return function(v) { 
				return nodeSet[getNodeId(v)]; 
			};
		}	
	}
	
	function getInverseFilterFunc(selector) {
		var f = getFilterFunc(selector);
		return function(v) {return f(v) ? _null : true;};
	}
	///#/snippet webFunctions

	
	
	// Special private promise impl only for web module. A public one  is in minified-extras, but only available if util is availble.
	// @condblock !promise
	function promise() {
		var state;           // undefined/null = pending, true = fulfilled, false = rejected
		var values;     // an array of values as arguments for the then() handlers
 		var deferred = [];   // functions to call when set() is invoked
 	 	
  
		var then = function(onFulfilled, onRejected) {
			var promise2 = promise();
			var callCallbacks = function() {
				var f = (state ? onFulfilled : onRejected);
				if (isFunction(f)) {
	   				var r = f.apply(undef, values);
	   				if (r && r['then'])
	   					r['then'](function(value){promise2['fire'](true,[value]);}, function(value){promise2['fire'](false,[value]);});
	   				else
	   					promise2['fire'](true, [r]);
	   			}
	   			else
	   				promise2['fire'](state, values);
			};
			if (state == _null)
				deferred.push(callCallbacks);
			else
				setTimeout(callCallbacks, 0);
			return promise2;
		};

 	 	var obj = {
 	 	    'fire': function (newState, newValues) {
    			if (state == _null) {
    				state = newState;
    				values = newValues;
       				setTimeout(function() {
       					callList(deferred);
       				}, 0);
    			}
    		},
    		/*$
	    	 * @id then
		     * @group REQUEST
		     * @module WEB, UTIL
		     * See extras module for documentation.
		     */ 
    		'then': then,
    		/*$
    		 * @id error
    		 * @group REQUEST
    		 * @module WEB, UTIL
    		 * See ##catch().
    		 */  
    		'error': function(func) { return then(0, func); },
    		/*$
    		 * @id catch
    		 * @group REQUEST
    		 * @module WEB, UTIL
    		 * See util module for documentation.
    		 */  
    		'catch': function(func) { return then(0, func); }
     	 	    
 	 	}; 
	 	return obj;
	}
	// @condend !promise
	
	
 	/*$
	 * @id length
	 * @group SELECTORS
	 * @requires dollar
   	 * @module WEB, UTIL
	 * 
	 * See util module for documentation.
	 */
	// empty, always defined below
		
	/*$
	 * @id listctor
	 */	
	/** @constructor */
	function M(array) {
		var len = this['length'] = array.length;
		for (var i = 0; i < len; i++)
			this[i] = array[i];
	}
	
	//// LIST FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	eachObj({
	// THE FOLLOWING IMPLs are WEB-MODULE ONLY!!
		
		
	/*$
	 * @id each
	 * @group SELECTORS
	 * @requires dollar
	 * @configurable default
 	 * @module WEB, UTIL
	 * See util module for documentation.
	 */
	'each': function (callback) {
		return flexiEach(this, callback);
	},
	
	/*$
	 * @id filter
	 * @group SELECTORS
	 * @requires dollar
	 * @configurable default
   	 * @module WEB, UTIL
	 * See util module for documentation.
	 */
	'filter': function(filterFunc) {
		return new M(filter(this, filterFunc));
	},
	
	/*$ 
	 * @id collect 
	 * @group SELECTORS 
	 * @requires dollar 
	 * @configurable default 
   	 * @module WEB, UTIL
	 * See util module for documentation.
	 */ 
	'collect': function(collectFunc) { 
		 return new M(collector(flexiEach, this, collectFunc)); 
	 },
	
	 /*$ 
	  * @id sub
	  * @group SELECTORS 
	  * @requires filter 
	  * @configurable default 
  	 * @module WEB, UTIL
	  * See util module for documentation.
	  */ 
	'sub': function(startIndex, endIndex) {
		var s = (startIndex < 0 ? this['length']+startIndex : startIndex);
		var e = endIndex >= 0 ? endIndex : this['length'] + (endIndex || 0);
 		return new M(filter(this, function(o, index) { 
 			return index >= s && index < e; 
 		}));
 	},
 	
	 
	/*$ 
	 * @id find 
	 * @group SELECTORS 
	 * @requires
	 * @configurable default 
 	 * @module WEB, UTIL
	 * See util module for documentation.
	 */ 
	'find': function(findFunc, startIndex) {
		var r;
		var f = isFunction(findFunc) ? findFunc : function(obj, index) { if (findFunc === obj) return index; };
		for (var i = startIndex || 0; i < this.length; i++)
			if ((r = f.call(this, this[i], i)) != _null)
				return r;
	},
	
	///#snippet webListFuncs

	/*$
	 * @id remove
	 * @group SELECTORS
	 * @requires dollar
	 * @configurable default
	 * @name .remove()
	 * @syntax list.remove()
 	 * @module WEB
	 * Removes all elements in the list from the DOM tree.
	 * 
	 * On Minified builds with IE compatibility, <var>remove()</var> will also remove all event handlers in the
	 * removed DOM nodes to prevent memory leaks.
	 * 
	 * @example Removes the element with the id 'myContainer', including all children, from the DOM tree.
	 * <pre>
	 * $('#myContainer').remove(); 
	 * </pre>
	 */
	 'remove': function() {
		flexiEach(this, function(obj) {
			// @condblock ie8compatibility
			if (IS_PRE_IE9 && isNode(obj) == 1) {
				flexiEach(dollarRaw('*', obj), function(node) {
					detachHandlerList(0, registeredEvents[node[MINIFIED_MAGIC_NODEID]]);
					delete registeredEvents[node[MINIFIED_MAGIC_NODEID]];
				});
				detachHandlerList(0, registeredEvents[obj[MINIFIED_MAGIC_NODEID]]);
				delete registeredEvents[obj[MINIFIED_MAGIC_NODEID]];
			}
			// @condend

			obj['parentNode'].removeChild(obj);
		});
	 },

 	/*$
 	 * @id text
 	 * @group SELECTORS
 	 * @requires dollar
 	 * @configurable default
 	 * @name .text()
 	 * @syntax list.text()
 	 * @module WEB
 	 * Returns the concatenated text content of all nodes in the list. 
 	 * This is done by going recursively through all elements and their children. The values of text and CDATA nodes
 	 * will be appended to the resulting string. Without legacy support, Minified will obtain the data using
 	 * the <var>textContent</var> property of all nodes.
 	 * 
 	 * Please note that unlike jQuery's <var>text()</var>, Minified's will not set text content. Use ##fill() to set text.
 	 * 
 	 * @example Returns the text of the element with the id 'myContainer'.
 	 * <pre>
 	 * var content = $('#myContainer').text(); 
 	 * </pre>
 	 * 
 	 * @return the concatenated text content of the nodes
 	 */
 	'text': function () {
 		// @condblock ie8compatibility
		function extractString(e) {
			var nodeType = isNode(e);
			if (nodeType == 1)
				return collector(flexiEach, e['childNodes'], extractString);
			else if (nodeType < 5)        // 2 is impossible (attribute), so only 3 (text) and 4 (cdata)..
				return e['data'];
			else 
				return _null;
		}
		return collector(flexiEach, this, extractString)['join']('');
		// @condend
		// @cond !ie8compatibility return collector(flexiEach, this, function(e) {return e['textContent'];})['join']('');
 	},
	
 	/*$
 	 * @id trav
 	 * @group SELECTORS
 	 * @requires each
 	 * @configurable default
 	 * @name .trav()
 	 * @syntax list.trav(property)
 	 * @syntax list.trav(property, selector)
 	 * @syntax list.trav(property, selector, maxDepth)
 	 * @syntax list.trav(property, maxDepth)
 	 * @syntax list.trav(property, filterFunc)
 	 * @syntax list.trav(property, filterFunc, maxDepth)
 	 * @module WEB
 	 * Traverses each DOM node in the list using the given property; creates a new list that includes each visited node,
 	 * optionally filtered by the given selector.
 	 * 
 	 * <var>trav()</var> traverses the DOM tree for each list element until it finds a <var>null</var>.  
 	 * All visited nodes that match the given selector are added to the result list. If no selector is given,
 	 * only elements will be added. Duplicates will be automatically be removed from the resulting list.
 	 * 
 	 * Instead of the selector, you can also specify a function that evaluates whether an element matches.
 	 * 
 	 * DOM provides the following properties for traveral:
 	 * <table>
 	 * <tr><th>firstChild</th><td>Contains the first child.</td></tr>
 	 * <tr><th>firstElementChild</th><td>Contains the first element (not in IE &lt; 9).</td></tr>
 	 * <tr><th>lastChild</th><td>Contains the last child element.</td></tr>
 	 * <tr><th>lastElementChild</th><td>Contains the last child element (not in IE &lt; 9).</td></tr>
 	 * <tr><th>nextElementSibling</th><td>Contains the element that follows the current node (not in IE &lt; 9).</td></tr>
 	 * <tr><th>nextSibling</th><td>Contains the node that follows the current node (see also ##next() ).</td></tr>
 	 * <tr><th>parentNode</th><td>Contains the node's parent (see also ##up() ).</td></tr>
 	 * <tr><th>previousElementSibling</th><td>Contains the element that precedes the current node (not in IE &lt; 9).</td></tr>
 	 * <tr><th>previousSibling</th><td>Contains the node that precedes the current node.</td></tr>
 	 * </table>
 	 * 
 	 * @example Returns a list of all parent nodes, direct and indirect:
 	 * <pre>
 	 * var parents = $('.myElements').trav('parentNode'); 
 	 * </pre>
 	 *
 	 * @example Returns a list of all direct siblings of the original list:
 	 * <pre>
 	 * var parents = $('.sibs').trav('nextSibling', '*', 1); 
 	 * </pre>
 	 * 
 	 * @example Returns a list of all parent nodes, direct and indirect, that have the class 'specialParent':
 	 * <pre>
 	 * var parents = $('.myElements').trav('parentNode', '.specialParent'); 
 	 * </pre>
 	 * 
 	 * @example Returns a list of all direct parent nodes that are tables and have the class 'specialParent':
 	 * <pre>
 	 * var parents = $('.myElements').trav('parentNode', 'table.specialParent', 1); 
 	 * </pre>
 	 *
  	 * @parm property the name of the property to traverse.
 	 * @param selector optional any selector valid for #dollar#$(), including CSS selectors and lists.
 	 *        <br/>Selectors are optimized for '*', '.classname', 'tagname' and 'tagname.classname'. The performance for other selectors
 	 *        is relative to the number of matches for the selector in the document. Default is '*', which includes all elements
 	 *        (but no other nodes such as text nodes).
	 * @param filterFunc a <code>function(node)</code> returning <var>true</var> for those nodes that match.
 	 * @param maxDepth optional the maximum number of steps to traverse. Defaults to unlimited.
 	 * @return the new list containing all visited nodes. Nodes of the original list are not included, unless they
 	 *         have been visited when traversing another node. Duplicate nodes will be automatically removed.
 	 *         
 	 * @see ##up() finds exactly one parent element that matches a selector.
 	 * @see ##next() finds one or more siblings that match a selector.
 	 */
	'trav': function(property, selector, maxDepth) {
		var isNum = isNumber(selector);
		var f = getFilterFunc(isNum ? _null : selector); 
		var max = isNum ? selector : maxDepth;
		return new M(collectUniqNodes(this, function(node) {
				var r = [];
				var c = node;
				while ((c = c[property]) && r.length != max) // note that maxDepth and max can be undef
					if (f(c))
						r.push(c);
				return r;
			}));
	},


	/*$
 	 * @id next
 	 * @group SELECTORS
 	 * @requires trav
 	 * @configurable default
 	 * @name .next()
 	 * @syntax list.next()
 	 * @syntax list.next(selector)
 	 * @syntax list.next(maxDepth)
 	 * @syntax list.next(selector, maxDepth)
 	 * @syntax list.next(filterFunc)
 	 * @syntax list.next(filterFunc, maxDepth)
 	 * @module WEB
 	 * Finds the next sibling elements matching the given selector or filter function for each list element, and returns the results as a list.
 	 * By default, only one match is returned per list element, but you can increase the number of results using the second argument. 
 	 * You can get an infinite number of results per list element by passing -1.
 	 * 
 	 * <var>next(selector, maxDepth)</var> is just a shortcut for <code>trav('nextSibling', selector, maxDepth||1)</code>. 
 	 * <var>next()</var> uses ##trav() to traverse the DOM tree using <var>nextSibling</var> for each list element, until it either finds a 
 	 * matching element the specified amount of matches or there are no more elements. All matches will added to the result list. 
 	 * The result list is filtered to include only unique elements.
	 * 
 	 * Instead of the selector, you can also specify a function that evaluates whether an element matches.
 	 * 
 	 * @example Returns the immediate sibling element of a node:
 	 * <pre>
 	 * var parent = $('#child').next(); 
 	 * </pre>
 	 *
 	 * @example Returns the next &lt;hr> element following the node:
 	 * <pre>
 	 * var parent = $('#child').next('hr'); 
 	 * </pre>
 	 *
 	 * @example Returns all &lt;hr> elements following the node:
 	 * <pre>
 	 * var parent = $('#child').next('hr', -1); 
 	 * </pre>
 	 *
 	 * @example Returns the next 2 sibling elements of a node:
 	 * <pre>
 	 * var parent = $('#child').next(2); 
 	 * </pre>
 	 *
 	 * @example Returns all following siblings of a node:
 	 * <pre>
 	 * var parent = $('#child').next(-1); 
 	 * </pre>
 	 *
 	 * @example Returns a list of all direct sibling elements that have a class that starts with 'special':
 	 * <pre>
 	 * var specialSiblings = $('.myElements').next(function(node) {
 	 *     return /(^|\\s)special/.test(node.className);
 	 * }); 
 	 * </pre>
 	 *
  	 * @parm property the name of the property to traverse.
 	 * @param selector optional any selector valid for #dollar#$(), including CSS selectors and lists.
 	 *        <br/>Selectors are optimized for '*', '.classname', 'tagname' and 'tagname.classname'. The performance for other selectors
 	 *        is relative to the number of matches for the selector in the document. Default is '*', which includes all elements.
	 * @param filterFunc a <code>function(node)</code> returning <var>true</var> for those nodes that match.
 	 * @param maxSiblings optional the maximum number of siblings to include per list element. Defaults to 1.
 	 * @return the new list that contains matching siblings elements. Duplicate nodes will be automatically removed.
 	 *         
 	 * @see ##trav() allows you to select other relatives such as preceding siblings or children.
 	 */
	'next': function(selector, maxSiblings) {
		return this['trav']('nextSibling', selector, maxSiblings||1);
	},

	
	/*$
 	 * @id up
 	 * @group SELECTORS
 	 * @requires trav
 	 * @configurable default
 	 * @name .up()
 	 * @syntax list.up()
 	 * @syntax list.up(selector)
 	 * @syntax list.up(filterFunc)
 	 * @syntax list.up(selector, parentNum)
 	 * @syntax list.up(filterFunc, parentNum)
 	 * @module WEB
 	 * Finds the closest parents matching the given selector or filter function for each list element, and returns the results as a list.
 	 * 
 	 * <var>up(selector)</var> is just a shortcut for <code>trav('parentNode', selector, parentNum)</code>. 
 	 * <var>up()</var> uses ##trav() to traverse the DOM tree using <var>parentNode</var> for each list element, until it either finds a 
 	 * matching element or the tree's root has been reached. All matches will added to the result list, at most one for each item in the
 	 * original list. The result list is filtered to include only unique elements.
	 * 
 	 * Instead of the selector, you can also specify a function that evaluates whether an element matches.
 	 * 
 	 * @example Returns the immediate parent of a node:
 	 * <pre>
 	 * var parent = $('#child').up(); 
 	 * </pre>
 	 *
 	 * @example Returns all table elements that the list elements are directly contained in.
 	 * <pre>
 	 * var tables = $('td.selected').up('table'); 
 	 * </pre>
 	 * 
 	 * @example Returns a list of all direct parent nodes that have a class that starts with 'special':
 	 * <pre>
 	 * var specialParents = $('.myElements').up(function(node) {
 	 *     return /(^|\\s)special/.test(node.className);
 	 * }); 
 	 * </pre>
 	 *
  	 * @parm property the name of the property to traverse.
 	 * @param selector optional any selector valid for #dollar#$(), including CSS selectors and lists.
 	 *        <br/>Selectors are optimized for '*', '.classname', 'tagname' and 'tagname.classname'. The performance for other selectors
 	 *        is relative to the number of matches for the selector in the document. Default is '*', which includes all elements.
	 * @param filterFunc a <code>function(node)</code> returning <var>true</var> for those nodes that match.
	 * @param maxParents maximum number of parents to return per list element. Default is 1.
 	 * @return the new list that contains matching parent elements. Duplicate nodes will be automatically removed.
 	 *         
 	 * @see ##trav() allows you to match more than one element. You can also select other relatives such as siblings or children.
 	 */
	'up': function(selector, maxParents) {
		return this['trav']('parentNode', selector, maxParents||1);
	},

	
 	/*$
 	 * @id select
 	 * @group SELECTORS
 	 * @requires dollar
 	 * @configurable default
 	 * @name .select()
 	 * @syntax list.select(selector)
 	 * @syntax list.select(selector, childrenOnly)
 	 * @module WEB
 	 * Executes a selector with the list as context. <code>list.select(selector, childrenOnly)</code> is equivalent 
 	 * to <code>$(selector, list, childrenOnly)</code>. 
 	 * 
 	 * @example Returns a list of all list elements:
 	 * <pre>
 	 * var parents = $('ol.myList').select('li', true); 
 	 * </pre>
 	 * 
 	 * @example Returns a list of all child elements:
 	 * <pre>
 	 * var children = $('.myElements').select('*', true); 
 	 * </pre>
 	 * 
 	 * @param selector a selector or any other valid first argument for #dollar#$().
 	 * @param childrenOnly optional if set, only direct children of the context nodes are included in the list. Children of children will be filtered out. If omitted or not 
 	 *             true, all descendants of the context will be included. 
 	 * @return the new list containing the selected descendants.
 	 * 
 	 * @see ##only() executes a selector on the list elements, instead of their descendants.
 	 */
	'select': function(selector, childOnly) {
		return $(selector, this, childOnly);
	},
	
 	/*$
 	 * @id is
 	 * @group SELECTORS
 	 * @requires find each
 	 * @configurable default
 	 * @name .is()
 	 * @syntax list.is()
 	 * @syntax list.is(selector)
 	 * @syntax list.is(filterFunc)
 	 * @module WEB
 	 * Checks whether all elements in the list match the given selector. Returns <var>true</var> if they all do, or <var>false</var>
 	 * if at least one does not.
 	 * 
 	 * One common use for <var>is()</var> is to check whether an element has a certain CSS class.
 	 * 
 	 * Please note that this method is optimized for the four simple selector forms '*', '.classname', 'tagname' 
 	 * and 'tagname.classname'. If you use any other kind of selector, be aware that selectors that match
 	 * many elements in the document can be slow.
 	 * 
 	 * @example Checks whether the element has the class 'myClass':
 	 * <pre>
 	 * var isMyClass = $('#myElement').is('.myClass'); 
 	 * </pre>
 	 * 
 	 * @example Checks whether the list contains only table rows:
 	 * <pre>
 	 * var areRows = $('.myRows').is('tr'); 
 	 * </pre>
 	 * 
 	 * @param selector optional any selector valid for #dollar#$(), including CSS selectors and lists.
 	 *        <br/>Selectors are optimized for '*', '.classname', 'tagname' and 'tagname.classname'. The performance for other selectors
 	 *        is relative to the number of matches for the selector in the document. Default is '*', which checks whether all list items
 	 *        are HTML elements.
 	 * @param filterFunc a <code>function(node)</code> returning <var>true</var> for those nodes that are approved.
 	 * @return <var>true</var> if all list elements match the selector. <var>false</var> otherwise.
 	 * 
 	 * @see ##only() removes elements from a list that do not match a selector.
 	 */
	'is': function(selector) {
		return !this['find'](getInverseFilterFunc(selector));
	},
	
 	/*$
 	 * @id only
 	 * @group SELECTORS
 	 * @requires filter
 	 * @configurable default
 	 * @name .only()
 	 * @syntax list.only()
 	 * @syntax list.only(selector)
 	 * @syntax list.only(filterFunc)
 	 * @syntax list.only(index)
	 * @module COMMENT only(index) is always available. All others variants are only in the Web module.
 	 * Returns a new list that contains only those elements that match the given selector, match the callback function
 	 * or have the given index. If no parameter has been given, the method keeps all HTML elements 
 	 * and removes everything else (same as '*').
 	 * 
 	 * When you use selectors, please note that this method is optimized for the four simple 
 	 * selector forms '*', '.classname', 'tagname' and 'tagname.classname'. If you use any other kind of 
 	 * selector, be aware that selectors that match many elements can be slow.
 	 * 
 	 * @example Returns only those list elements have the classes 'listItem' and 'myClass':
 	 * <pre>
 	 * var myLis = $('li.listItem').only('.myClass'); 
 	 * </pre>
 	 * 
 	 * @example Returns a list of all forms:
 	 * <pre>
 	 * var forms = $('#content *').only('form'); 
 	 * </pre>
 	 * 
 	 * @param selector any selector valid for #dollar#$(), including CSS selectors and lists. 
 	 *        <br/>Selectors are optimized for '*', '.classname', 'tagname' and 'tagname.classname'. The performance for other selectors
 	 *        depends on the number of matches for the selector in the document. Default is '*', which keeps all elements
 	 *        (but no other nodes such as text nodes).
 	 * @param filterFunc a <code>function(node)</code> returning <var>true</var> for those nodes that are approved.
 	 * @param index the index of the element to keep. All elements with other index will be omitted. If there is no element
 	 *        with this index in the list, the returned list is empty.
 	 * @return a new list containing only elements matched by the selector/function/index.
 	 * 
 	 * @see ##not() creates a list of all elements not matching the selector.
 	 * @see ##select() executes a selector on the descendants of the list elements.
 	 * @see ##filter() offers function-based filtering.
 	 */
	'only': function(selector) {
		return new M(filter(this, getFilterFunc(selector)));
	},
	
	
 	/*$
 	 * @id not
 	 * @group SELECTORS
 	 * @requires filter
 	 * @configurable default
 	 * @name .not()
 	 * @syntax list.not()
 	 * @syntax list.not(selector)
 	 * @syntax list.not(filterFunc)
 	 * @syntax list.not(index)
 	 * @module WEB
 	 * Returns a new list that contains only those elements that do not match the given selector, callback function
 	 * or have the given index. If no parameter has been given, the method removes all HTML elements 
 	 * and keeps the rest (same as '*').
 	 * 
 	 * When you use selectors, please note that this method is optimized for the four simple 
 	 * selector forms '*', '.classname', 'tagname' and 'tagname.classname'. If you use any other kind of 
 	 * selector, be aware that selectors that match many elements can be slow.
 	 * 
 	 * @example Returns only those list elements have the classes 'listItem' but not 'myClass':
 	 * <pre>
 	 * var myLis = $('li.listItem').not('.myClass'); 
 	 * </pre>
 	 * 
 	 * @example Returns a list of all elements except forms:
 	 * <pre>
 	 * var forms = $('#content *').not('form'); 
 	 * </pre>
 	 * 
 	 * @param selector any selector valid for #dollar#$(), including CSS selectors and lists. 
 	 *        <br/>Selectors are optimized for '*', '.classname', 'tagname' and 'tagname.classname'. The performance for other selectors
 	 *        depends on the number of matches for the selector in the document. Default is '*', which removes all elements
 	 *        (but keeps other nodes such as text nodes).
 	 * @param filterFunc a <code>function(node)</code> returning <var>true</var> for those nodes that should be removed.
 	 * @param index the index of the element to remove. All elements with other index will be kept. If there is no element
 	 *        with this index in the list, the returned list is identical to the original list.
 	 * @return a new list containing only elements not matched by the selector/function/index.
 	 * 
 	 * @see ##only() is the opposite of <var>not()</var> - it keeps all elements that match the selector.
 	 */
	'not': function(selector) {
		return new M(filter(this, getInverseFilterFunc(selector)));
	},

	
  	/*$
 	 * @id get
 	 * @group SELECTORS
 	 * @requires dollar
 	 * @configurable default
 	 * @name .get()
 	 * @syntax list.get(name)
 	 * @syntax list.get(name, toNumber)
 	 * @syntax list.get(list)
 	 * @syntax list.get(list, toNumber)
 	 * @syntax list.get(map)
 	 * @syntax list.get(map, toNumber)
 	 * @module WEB
 	 * Retrieves properties, attributes and styles from the list's first element. The syntax to request those values is mostly identical with ##set(). You can either
 	 * get a single value if you specify only one name, or get an object map when you specify several names using an array or an object map.
 	 * 
	 * The <var>name</var> parameter defines what kind of data you are reading. The following name schemes are supported:
	 * <table>
	 * <tr><th>Name Schema</th><th>Example</th><th>Sets what?</th><th>Description</th></tr>
	 * <tr><td>name</td><td>innerHTML</td><td>Property</td><td>A name without prefix of '$' or '@' gets a property of the object.</td></tr>
	 * <tr><td>@name</td><td>@href</td><td>Attribute</td><td>Gets the HTML attribute using getAttribute().</td></tr>
	 * <tr><td>%name</td><td>%phone</td><td>Data-Attribute</td><td>Gets a data attribute using getAttribute(). Data attributes are
	 *         attributes whose names start with 'data-'. '%myattr' and '@data-myattr' are equivalent.</td></tr>
	 * <tr><td>$name</td><td>$fontSize</td><td>CSS Property</td><td>Gets a style using the element's <var>style</var> object. 
	 *             The syntax for the CSS styles is camel-case (e.g. "$backgroundColor", not "$background-color"). Shorthand properties like "border" or "margin" are 
	 *             not supported. You must use the full name, e.g. "$marginTop". Minified will try to determine the effective style
 	 *             and thus will return the value set in style sheets if not overwritten using a regular style.</td></tr>
	 * <tr><td>$</td><td>$</td><td>CSS Classes</td><td>A simple <var>$</var> returns the CSS classes of the element and is identical with "className".</td></tr>
	 * <tr><td>$$</td><td>$$</td><td>Style</td><td>Reads the element's style attribute in a browser-independent way. On legacy IEs it uses
	 *             <var>style.cssText</var>, and on everything else just the "style" attribute.</td></tr>
	 * <tr><td>$$show</td><td>$$show</td><td>Show/Hide</td><td>Returns 1 if the element is visible and 0 if it is not visible. An element counts as
	 * visible if '$visibility' is not 'hidden' and '$display' is not 'none'. Other properties will be ignored, even if they can also be used to hide the element.</td></tr>
	 * <tr><td>$$fade</td><td>$$fade</td><td>Fade Effect</td><td>The name '$$fade' returns the opacity of the element as a value between 0 and 1.
	 * 			   '$$fade' will also automatically evaluate the element's 'visibility' and 'display' styles to find out whether the element is actually visible.</td></tr>
	 * <tr><td>$$slide</td><td>$$slide</td><td>Slide Effect</td><td>'$$slide' returns the height of the element in pixels with a 'px' suffix and is equivalent to '$height'.
	 * Please note that you can pass that 'px' value to '$$slide' in ##set(), which will then set the according '$height'.</td></tr>
	 * <tr><td>$$scrollX, $$scrollY</td><td>$$scrollY</td><td>Scroll Coordinates</td><td>The names '$$scrollX' and
	 *             '$$scrollY' can be used on <code>$(window)</code> to retrieve the scroll coordinates of the document.
	 *             The coordinates are specified in pixels without a 'px' unit postfix.</td></tr>
	 * </table>
 	 * 
 	 * @example Retrieves the id, title attribute and the background color of the element '#myElement':
 	 * <pre>
 	 * var id = $('#myElement).get('id'); 
 	 * var title = $('#myElement).get('@title'); 
 	 * var bgColor = $('#myElement).get('$backgroundColor'); 
 	 * </pre>
 	 *
 	 * @example Retrieves the id, title attribute and the background color of the element '#myElement' as a map:
 	 * <pre>
 	 * var m = $('#myElement).get(['id', '@title', '$backgroundColor']); 
 	 * var id = m.id;
 	 * var title = m['@title'];
 	 * var bgColor = m.$backgroundColor;
 	 * </pre>
 	 *
 	 * @example Uses ##get() and ##set() to reposition an element:
 	 * <pre>
 	 * var coords = $('#myElement').get({$top: 0, $left: 0}, true); 
 	 * coords.$top = coords.$top + 10 + 'px';
 	 * coords.$left = coords.$left + 20 + 'px';
 	 * $('#myElement').set(coords);
 	 * </pre>
 	 * Please note that the values of $top and $left in the <var>get()</var> invocation do not matter and will be ignored!
 	 *
	 * @param name the name of a single property or attribute to modify. Unprefixed names set properties, a '$' prefix sets CSS styles and
	 *        '@' sets attributes. Please see the table above for special properties and other options.
 	 * @param list in order to retrieve more than one value, you can specify several names in an array or list. <var>get()</var> will then return an object map
 	 *        containing the values.
 	 * @param map if you specify an object that is neither list nor string, <var>get()</var> will use it as a map of property names. Each property name will be requested. 
 	 * The values of the properties in the map will be ignored. <var>get()</var> will then return a new object map containing of results.
 	 * @param toNumber if 'true', <var>get()</var> converts all returned values into numbers. If they are strings, 
 	 *                 <var>get()</var> removes any non-numeric characters before the conversion. This is useful when you request 
 	 *                 a CSS property such as '$marginTop'  that returns a value with a unit suffix, like "21px". <var>get()</var> will convert it 
 	 *                 into a number and return 21. If the returned value is not parsable as a number, <var>NaN</var> will be returned.
 	 * @return if <var>get()</var> was called with a single name, it returns the corresponding value. 
 	 *         If a list or map was given, <var>get()</var> returns a new object map with the names as keys and the values as values.
 	 *         It returns <var>undefined</var> if the list is empty.
	 *
 	 * @see ##set() sets values using the same property syntax.
 	 */
	'get': function(spec, toNumber) {
		var self = this;
		var element = self[0];

		if (element) {
			if (isString(spec)) {
				var match = /^(\W*)(.*)/.exec(replace(spec, /^%/,'@data-'));
				var prefix = match[1];
				var s;
	 			 
				if (getter[prefix])
					s = getter[prefix](this, match[2]);
				else if (spec == '$') 
					s = self['get']('className');
				else if (spec == '$$') {
					// @condblock ie8compatibility
					 if (IS_PRE_IE9)
						s = element['style']['cssText'];
					 else
					// @condend
						s = self['get']('@style');
				}
				else if (spec == '$$slide')
					s = self['get']('$height');
				else if (spec == '$$fade' || spec == '$$show') {
					if  (self['get']('$visibility') == 'hidden' || self['get']('$display') == 'none')
						s = 0;
					else if (spec == '$$fade') {
						s = 
						// @condblock ie8compatibility
						IS_PRE_IE9 ? (isNaN(self['get']('$filter', true)) ? 1 : self['get']('$filter', true)/100) : 
						// @condend
							isNaN(self['get']('$opacity', true)) ? 1 : self['get']('$opacity', true); 
					}
					else // $$show
						s = 1;
				}
				// @condblock ie8compatibility 
				else if (spec == '$$scrollX') // for non-IE, $$scrollX/Y fall right thought to element[match[2]]...
					s = _window['pageXOffset'] != _null ? _window['pageXOffset'] : (document['documentElement'] || document['body']['parentNode'] || document['body'])['scrollLeft'];
				else if (spec == '$$scrollY')
					s = _window['pageXOffset'] != _null ? _window['pageYOffset'] : (document['documentElement'] || document['body']['parentNode'] || document['body'])['scrollTop'];
				// @condend ie8compatibility
				else if (prefix == '$') {
					// @condblock ie8compatibility 
					if (!_window['getComputedStyle'])
						s = (element['currentStyle']||element['style'])[replace(match[2], /^float$/, 'cssFloat')];
					else 
					// @condend
						s = _window['getComputedStyle'](element, _null)['getPropertyValue'](replace(match[2], /[A-Z]/g, function (match2) {  return '-' + match2.toLowerCase(); }));
				}
				else if (prefix == '@')
					s = element.getAttribute(match[2]);
				else
					s = element[match[2]];
				return toNumber ? extractNumber(s) : s;
			}
			else {
				var r = {};
				(isList(spec) ? flexiEach : eachObj)(spec, function(name) {
					r[name] = self['get'](name, toNumber);
				});
				return r;
			}
		}
	},

	/*$
	 * @id set
	 * @group SELECTORS
	 * @requires dollar get
	 * @configurable default
	 * @name .set()
	 * @syntax list.set(name, value)
	 * @syntax list.set(properties)
	 * @syntax list.set(cssClasses)
 	 * @module WEB
	 * 
	 * Modifies the list's elements by setting their properties, attributes, CSS styles and/or CSS classes. You can either supply a 
	 * single name and value to set only one property, or you can provide an object that contains name/value pairs to describe more than one property.
	 * More complex operations can be accomplished by supplying functions as values. They will then be called for each element that will
	 * be set.
	 *
	 * The <var>name</var> parameter defines what kind of data you are setting. The following name schemes are supported:
	 * 
	 * <table>
	 * <tr><th>Name Schema</th><th>Example</th><th>Sets what?</th><th>Description</th></tr>
	 * <tr><td>name</td><td>innerHTML</td><td>Property</td><td>A name without prefix of '$' or '@' sets a property of the object.</td></tr>
	 * <tr><td>@name</td><td>@href</td><td>Attribute</td><td>Sets the HTML attribute using setAttribute(). In order to stay compatible with Internet Explorer 7 and earlier, 
	 *             you should not set the attributes '@class' and '@style'. Instead use '$' and '$$' as shown below.</td></tr>
	 * <tr><td>%name</td><td>%phone</td><td>Data-Attribute</td><td>Sets a data attribute using setAttribute(). Data attributes are
	 *         attributes whose names start with 'data-'. '%myattr' and '@data-myattr' are equivalent.</td></tr>
	 * <tr><td>$name</td><td>$fontSize</td><td>CSS Property</td><td>Sets a style using the element's <var>style</var> object.
	 *         The syntax for the CSS styles is camel-case (e.g. "$backgroundColor", not "$background-color"). </td></tr>
	 * <tr><td>$</td><td>$</td><td>CSS Classes</td><td>A simple <var>$</var> modifies the element's CSS classes using the object's <var>className</var> property. The value is a 
	 *             space-separated list of class names. If prefixed with '-' the class is removed, a '+' prefix adds the class and a class name without prefix toggles the class.
	 *             The name '$' can also be omitted if <var>set</var> is called with class names as only argument.</td></tr>
	 * <tr><td>$$</td><td>$$</td><td>Style</td><td>Sets the element's style attribute in a browser-independent way.</td></tr>
	 * <tr><td>$$show</td><td>$$show</td><td>Show/Hide</td><td>If <var>true</var> or a number not 0, it will make sure the element is visible by
	 *         making sure '$display' is not 'none' and by setting '$visibility' to 'visible'. Please see ##show() for details. If the value is <var>false</var> or 0, it
	 *         will be hidden by setting '$display' to 'none'.</td></tr>
	 * <tr><td>$$fade</td><td>$$fade</td><td>Fade Effect</td><td>The name '$$fade' sets the opacity of the element in a browser-independent way. The value must be a number
	 *              between 0 and 1. '$$fade' will also automatically control the element's 'visibility' style. If the value is 0,
	 *             the element's visibility will automatically be set to 'hidden'. If the value is larger, the visibility will be set to 
	 *             'visible'. '$$fade' only works with block elements.</td></tr>
	 * <tr><td>$$slide</td><td>$$slide</td><td>Slide Effect</td><td>The name '$$slide' allows a vertical slide-out or slide-in effect. The value must be a number
	 *              between 0 and 1 and will be used to set the element's '$height'. '$$slide' will also automatically control the element's 'visibility' 
	 *              style. If the value is 0, the element's visibility will automatically be set to 'hidden'. If the value is larger, 
	 *              the visibility will be set to 'visible'. '$$slide' only works with block elements and will not set the
	 *              element's margin or padding. If you need a margin or padding, you should wrap the elements in a simple &lt;div>.</td></tr>
	 * <tr><td>$$scrollX, $$scrollY</td><td>$$scrollY</td><td>Scroll Coordinates</td><td>The names '$$scrollX' and
	 *             '$$scrollY' can be used on <code>$(window)</code> to set the scroll coordinates of the document.
	 *             The coordinates are specified in pixels, but must not use a 'px' unit postfix.</td></tr>
	 * </table>
	 *
	 * @example Unchecking checkboxes:
	 * <pre>
	 * $('input.checkbox').set('checked', false);
	 * </pre>
	 * 
	 * @example Changing the <var>innerHTML</var> property of an element:
	 * <pre>
	 * $('#toc').set('innerHTML', 'Content');
	 * </pre>
	 * 
	 * @example Changing attributes:
	 * <pre>
	 * $('a.someLinks').set('@href', 'http://www.example.com/');
	 * </pre>
	 * 
	 * @example Removing attributes:
	 * <pre>
	 * $('a.someLinks').set('@title', null);
	 * </pre>
	 * 
	 * @example Changing styles:
	 * <pre>
	 * $('.bigText').set('$fontSize', 'x-large');
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
	 * @example Shortcut for CSS manipulation:
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
	 *                          '@title': 'Check this'});
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
	 *     return 'Chapter ' + index + ': ' + oldValue.toUpperCase(); 
	 * });
	 * </pre>
	 * 
	 * @param name the name of a single property or attribute to modify. Unprefixed names set properties, a '$' prefix sets CSS styles and
	 *        '@' sets attributes. Please see the table above for special properties and other options.
	 * @param value the value to set. If value is <var>null</var> and name specified an attribute, the attribute will be removed.
	 * If dollar ('$') has been passed as name, the value can contain space-separated CSS class names. If prefixed with a '+' the class will be added,
	 * with a '-' prefix the class will be removed. Without prefix, the class will be toggled.
	 * If <var>value</var> is a function, the <code>function(oldValue, index, obj)</code> will be invoked for each list element 
	 * to evaluate the new value: 
	 * <dl><dt>oldValue</dt><dd>The old value of the property to be changed, as returned by ##get().
	 * For the CSS style names, this is the computed style of the property </dd>
	 * <dt>index</dt><dd>The list index of the object owning the property</dd>
	 * <dt>obj</dt><dd>The list element owning the property.</dd>
	 * <dt class="returnValue">(callback return value)</dt><dd>The value to be set.</dd></dl>
	 * Functions are not supported by '$'.
	 * @param properties a Object as map containing names as keys and the values to set as map values. See above for the name and value syntax.
	 * @param cssClasses if <var>set()</var> is invoked with a string as single argument, the name "$" (CSS classes) is assumed and the argument is the
	 *                   value. See above for CSS syntax.
	 *                   Instead of a string, you can also specify a <code>function(oldValue, index, obj)</code> to modify the existing classes. 
	 * @return the list
	 * 
	 * @see ##get() retrieves values using the same property syntax.
	 * @see ##animate() animates values using the same property syntax.
	 * @see ##toggle() can toggle between two sets of values.
	 * @see ##dial() allows smooth transitions between two sets of values.
	 */
	 'set': function (name, value) {
		 var self = this;
		 if (value !== undef) {
			 var match = /^(\W*)(.*)/.exec(replace(replace(name, /^\$float$/, 'cssFloat'), /^%/,'@data-'));
			 var prefix = match[1];
	 
			 if (setter[prefix])
				 setter[prefix](this, match[2], value);
			 else if (name == '$$fade') {
				 // @condblock ie8compatibility 
				 self['set']({'$visibility': value ? 'visible' : 'hidden'})
				     ['set'](
				    	  IS_PRE_IE9 ? (value < 1 ? {'$filter': 'alpha(opacity = '+(100*value)+')', '$zoom': 1} : {'$filter': ''}) : // clear filter for opacity=1!!
				    	  {'$opacity': value}
 					);
				 // @condend ie8compatibility
				 // @cond !ie8compatibility this['set']({'$visibility': value ? 'visible' : 'hidden', '$opacity': value});
			 }
			 else if (name == '$$slide') {
				 self['set']({'$visibility': value ? 'visible' : 'hidden', '$overflow': 'hidden', 
						 	  '$height': /px/.test(value) ? value : function(oldValue, idx, element) { return getNaturalHeight($(element), value);}
				              });
			 }
			 else if (name == '$$show') {
				 if (value) 
					 self['set']({'$visibility': value ? 'visible' : 'hidden', '$display': ''}) // that value? part is only for gzip
			 		 	 ['set']({'$display': function(oldVal) {                                // set for 2nd time: now we get the stylesheet's $display
			 		 		 return oldVal == 'none' ? 'block' : oldVal;
			 			 }}); 
				 else 
					 self['set']({'$display': 'none'});
			 }
		 	 else if (name == '$$') {
				// @condblock ie8compatibility 
				if (IS_PRE_IE9)
					self['set']('$cssText', value);
				else
				// @condend
					self['set']('@style', value);
			 }
			 else
				 flexiEach(this, function(obj, c) { 
					 var newValue = isFunction(value) ? value($(obj)['get'](name), c, obj) : value;
					 if (prefix == '$') {
						 if (match[2])
							 obj['style'][match[2]] = newValue;
						 else {
							 flexiEach(newValue && newValue.split(/\s+/), function(clzz) { 
								 var cName = replace(clzz, /^[+-]/);
								 // @condblock ie9compatibility
								 var oldClassName = obj['className'] || '';
								 var className = replace(oldClassName, RegExp('(^|\\s+)' + cName + '(?=$|\\s)'));
								 if (/^\+/.test(clzz) || (cName==clzz && oldClassName == className)) // for + and toggle-add
									 className += ' ' + cName;
								 // @condblock !UTIL
								 obj['className'] = replace(className, /^\s+/g); 
								 // @condend
								 // @cond UTIL obj['className'] = trim(className); 
								 // @condend 
								 
								 //@cond !ie9compatibility if (/^\+/.test(clzz))
								 //@cond !ie9compatibility 	 obj['classList'].add(cName);
								 //@cond !ie9compatibility else if (/^-/.test(clzz))
								 //@cond !ie9compatibility 	 obj['classList'].remove(cName);
								 //@cond !ie9compatibility else
								 //@cond !ie9compatibility 	 obj['classList'].toggle(cName);
							 });
						 }
					 }
   				 	 else if (name == '$$scrollX')
			 			 obj['scroll'](newValue, $(obj)['get']('$$scrollY'));
   				 	 else if (name == '$$scrollY')
			 			 obj['scroll']($(obj)['get']('$$scrollX'), newValue);
					 else if (prefix == '@') {
						 if (newValue == _null)  
							 obj.removeAttribute(match[2]);
						 else
						 obj.setAttribute(match[2], newValue);
					 }
					 else
						 obj[match[2]] = newValue;
				 });
		 }
		 else if (isString(name) || isFunction(name))
			 self['set']('$', name);
		 else
			 eachObj(name, function(n,v) { self['set'](n, v); });
		 return self;
	 },

	/*$
	 * @id show
	 * @group ELEMENT
	 * @requires set
	 * @configurable default
	 * @name .show()
	 * @syntax list.show()
 	 * @module WEB
	 * Make the invisible element of the list visible. It does so by setting '$visibility' to 'visible' and making sure that 
	 * the '$display' style is not 'none'. Calling <var>show()</var> is the same as using ##set() to set '$$show' to 1.
	 * 
	 * First it will clear the element's direct '$display' style to remove any 'none' value that may be there. This helps
	 * if the element was hidden using the style attribute, or if it has been hidden using ##hide(). If the
	 * '$display' value is still null, it assumes that it has been hidden using a stylesheet and sets '$display' to 'none'.
	 * 
	 * Please note that because of the way <var>show()</var> works, it will not work correctly if you have hidden a non-block
	 * element like a table row using a stylesheet. In that case you can not use <var>show()</var> but should set '$display' manually using ##set().
	 *  
	 * Other properties that may hide elements, like '$opacity', are not modifed by <var>show()</var>.
	 *  
	 * @example Showing elements:
	 * <pre>
	 * $('.hidden').show();
	 * </pre> 
	 * 
	 * @return the current list
	 * 
	 * @see ##hide() hides elements.
	 * @see ##set() can do the same by setting '$$show' to 1, and is also still required for some non-block elements.
	 * @see ##animate() can be used with a '$$fade' or '$$slide' if you want to animate the element.
	 */
	 'show': function() {
		 return this['set']('$$show', 1);
	 },

	/*$
	 * @id hide
	 * @group ELEMENT
	 * @requires set
	 * @configurable default
	 * @name .hide()
	 * @syntax list.hide()
 	 * @module WEB
	 * Hides the elements of the list. It does so by writing 'none' into the '$display' style. This is the same as calling
	 * ##set() with the property name '$$show' and the value 0. 
	 * 
	 * Other properties that may hide elements, like '$visibility' or '$opacity', are not modifed by <var>hide()</var>.
	 *  
	 * @example Hiding elements:
	 * <pre>
	 * $('.visible').hide();
	 * </pre> 
	 * 
	 * @return the current list
	 * 
	 * @see ##show() makes elements visible.
	 * @see ##set() can do the same by setting '$$show' to 0.
	 * @see ##animate() can be used with a '$$fade' or '$$slide' if you want to animate the element.
	 */
	 'hide': function() {
		 return this['set']('$$show', 0);
	 },

	 
	/*$
	 * @id add
	 * @group ELEMENT
	 * @requires dollar each
	 * @configurable default
	 * @name .add()
	 * @syntax list.add(text)
	 * @syntax list.add(node)
	 * @syntax list.add(list)
	 * @syntax list.add(factoryFunction)
 	 * @module WEB
	 * Adds the given node(s) as children to the list's HTML elements. If a string has been given, it will be added as text node.
	 * DOM nodes will be added directly. If you pass a list, all its elements will be added using the rules above.
	 *
	 * When you pass a DOM node and the target list has more than one element, the original node will be added to the first list element,
	 * and ##clone#clones## to all following list elements.
	 * 
	 * ##EE(), ##HTML() and ##clone() are compatible with <var>add()</var> and can help you create new HTML nodes.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">Here is some text.&lt;br/>&lt;/div>
	 * </pre> 
	 * The next line appends a text node to the div:
	 * <pre>
	 * $('#comments').add('Some additional text.');
	 * </pre>
	 * This results in:
	 * <pre>
	 * &lt;div id="comments">Here is some text.&lt;br/>Some additional text.&lt;/div>
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
	 * $('#comments').add([
	 *      EE('br'), 
	 *     'Some text', 
	 *     EE('span', {'className': 'highlight'}, 'Some highlighted text')
	 * ]);
	 * </pre>
	 *
	 * @example If you need to customize the content, you can write a factory function:
	 * <pre>
	 * $('.chapter').add(function(parent, index) { return EE('h2', 'Chapter number ' + index); });
	 * </pre>
	 *
	 * @param text a string or number to add as text node
	 * @param node a DOM node to add to the list. If the list has more than one element, the given node will be added to the first element.
	 *             For all additional elements, the node will be cloned using ##clone().
	 * @param list a list containing text and/or nodes. May also contain nested lists with nodes or text..
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to create the nodes: 
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings and/or DOM nodes.
	 * If a function is returned, it will be invoked recursively with the same arguments.</dd></dl>
	 * @return the current list
	 * 
	 * @see ##fill() works like <var>add()</var>, but deletes all children before adding the new nodes.
	 * @see ##addFront() adds nodes as first child, not as last.
	 * @see ##addAfter() adds nodes not as children but as siblings.
	 * @see ##addBefore() also adds nodes not as children but as siblings.
	 * @see ##replace() replaces existing nodes.
	 */
	'add': function (children, addFunction) {
		return this['each'](function(e, index) {
			var lastAdded;
			function appendChildren(c) {
				if (isList(c))
					flexiEach(c, appendChildren);
				else if (isFunction(c))
					appendChildren(c(e, index));
				else if (c != _null) {   // must check null, as 0 is a valid parameter 
					var n = isNode(c) ? c : document.createTextNode(c);
					if (lastAdded)
						lastAdded['parentNode']['insertBefore'](n, lastAdded['nextSibling']);
					else if (addFunction)
						addFunction(n, e, e['parentNode']); 
					else
						e.appendChild(n);
					lastAdded = n;
				}
			}
			appendChildren(index &&!isFunction(children) ? clone(children) : children);
		});
	},

	
	/*$
	 * @id fill
	 * @group ELEMENT
	 * @requires dollar add remove each
	 * @configurable default
	 * @name .fill()
	 * @syntax list.fill()
	 * @syntax list.fill(text)
	 * @syntax list.fill(node)
	 * @syntax list.fill(list)
	 * @syntax list.fill(factoryFunction)
 	 * @module WEB
	 * Sets the content of the list's HTML elements, replacing old content. If a string has been given, it will be added as text node.
	 * DOM nodes will be added directly. If you pass a list, all its elements will be added using the rules above.
	 *
	 * When you pass a DOM node and the target list has more than one element, the original node will be added to the first list element,
	 * and ##clone#clones## to all following list elements.
	 * 
	 * ##EE(), ##HTML() and ##clone() are compatible with <var>fill()</var> and can help you create new HTML ndoes.
	 *
	 * Call <var>fill()</var> without arguments to remove all children from a node.
	 * 
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="status">Done&lt;/div>
	 * </pre> 
	 * <var>fill()</var> with a simple string replaces the element's content with the new text:
	 * <pre>
	 * $('#status').fill('Please Wait..');
	 * </pre>
	 * Results in:
	 * <pre>
	 * &lt;div id="status">Please Wait..&lt;/div>
	 * </pre> 
	 *
	 * @example Pass an element to replace the old content with the element:
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
	 * $('#myListContainer').fill([
	 *     EE('h2', 'My List'), 
	 *     EE('ol', [EE('li', 'First Item'), EE('li', 'Second Item'), EE('li', 'Third Item')])
	 * ]);
	 * </pre>
	 *
	 * @example You can write a factory function that re-creates the list for every instance:
	 * <pre>
	 * $('.listContainers').fill(function(e, index) { return [
	 *     EE('h2', 'List Number '+index), 
	 *     EE('ol', [EE('li', 'First Item'), 
	 *     EE('li', 'Second Item'), 
	 *     EE('li', 'Third Item')
	 * ])]});
	 * </pre>
	 *
	 * @example <var>fill()</var> without arguments deletes the content of the list elements:
	 * <pre>
	 * $('.listContainers').fill();
	 * </pre>
	 *
	 * @param text a string to set as text node of the list elements
	 * @param node a DOM node to add to the list. If the list has more than one element, the given node will be added to the first element.
	 *             For all additional elements, the node will be cloned using ##clone().
	 * @param list a list containing text and/or nodes. May also contain nested lists with nodes or text..
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to create the nodes: 
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings and/or DOM nodes.
	 * If a function is returned, it will be invoked recursively with the same arguments.</dd></dl>
	 * @return the current list
	 * 
	 * @see ##add() works like <var>fill()</var>, but does not delete children.
	 * @see ##addFront() adds nodes as first child, not as last.
	 * @see ##addAfter() adds nodes not as children but as siblings.
	 * @see ##addBefore() also adds nodes not as children but as siblings.
	 * @see ##replace() replaces existing nodes.
	 * @see ##ht() is a alternative for replacing element content with a HTML snippet.
	 */
	'fill': function (children) {
		return this['each'](function(e) { $(e['childNodes'])['remove'](); })['add'](children);
	},


	/*$
	 * @id addafter
	 * @group ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .addAfter()
	 * @syntax list.addAfter(text)
	 * @syntax list.addAfter(node)
	 * @syntax list.addAfter(list)
	 * @syntax list.addAfter(factoryFunction)
 	 * @module WEB
	 * Inserts the given text or element(s) as siblings after each HTML element in the list. 
	 * If a string has been given, it will be added as text node.
	 * DOM nodes will be added directly. If you pass a list, all its elements will be added using the rules above.
	 *
	 * When you pass a DOM node and the target list has more than one element, the original node will be added to the first list element,
	 * and ##clone#clones## to all following list elements.
	 * 
	 * ##EE(), ##HTML() and ##clone() are compatible with <var>addAfter()</var> and can help you create new HTML ndoes.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div>
	 *   &lt;div id="mainText">Here is some text&lt;/div>
	 * &lt;/div>
	 * </pre>   
	 * Use addAfter() with a simple string to add a text node.
	 * <pre>
	 * $('#mainText').addAfter('Disclaimer: bla bla bla');
	 * </pre>
	 * This results in the following HTML:
	 * <pre>
	 * &lt;div>
	 *   &lt;div id="mainText">Here is some text&lt;/div>
	 *   Disclaimer: bla bla bla
	 * &lt;/div>
	 * </pre>   
	 *
	 * @example You can also pass an element:
	 * <pre>
	 * $('#mainText').addAfter(EE('span', {'className': 'disclaimer'}, 'Disclaimer: bla bla bla'));
	 * </pre>
	 * With the previous example's HTML, this would create this:
	 * <pre>
	 * &lt;div>
	 *   &lt;div id="mainText">Disclaimer: bla bla bla&lt;/div>
	 *   &lt;span class="disclaimer">WARNING&lt;/span>
	 * &lt;/div>
	 * </pre> 
	 *
	 * @param text a string to add as text node to the list elements
	 * @param node a DOM node to add to the list. If the list has more than one element, the given node will be added to the first element.
	 *             For all additional elements, the node will be cloned using ##clone().
	 * @param list a list containing text and/or nodes. May also contain nested lists with nodes or text..
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to create the nodes:
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings and/or DOM nodes.
	 * If a function is returned, it will be invoked recursively with the same arguments.</dd></dl>
	 * @return the current list
	 *
	 * @see ##fill() replaces all children with new nodes.
	 * @see ##add() adds elements as last child.
	 * @see ##addFront() adds nodes as first child.
	 * @see ##addBefore() also adds nodes as next sibling but as preceding sibling.
	 * @see ##replace() replaces existing nodes.
	 */
	'addAfter': function (children) {
		return this['add'](children, function(newNode, refNode, parent) { parent['insertBefore'](newNode, refNode['nextSibling']); });
	},
	
	/*$
	 * @id addbefore
	 * @group ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .addBefore()
	 * @syntax list.addBefore(text)
	 * @syntax list.addBefore(node)
	 * @syntax list.addBefore(list)
	 * @syntax list.addBefore(factoryFunction)
 	 * @module WEB
	 * Inserts the given text or element(s) as siblings in front of each HTML element in the list. 
	 * If a string has been given, it will be added as text node.
	 * DOM nodes will be added directly. If you pass a list, all its elements will be added using the rules above.
	 *
	 * When you pass a DOM node and the target list has more than one element, the original node will be added to the first list element,
	 * and ##clone#clones## to all following list elements.
	 * 
	 * ##EE(), ##HTML() and ##clone() are compatible with <var>addBefore()</var> and can help you create new HTML ndoes.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div>
	 *   &lt;div id="mainText">Here is some text&lt;/div>
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
	 *   &lt;div id="mainText">Here is some text&lt;/div>
	 * &lt;/div>
	 * </pre>  
	 *
	 * @example You can also pass an Element Factory:
	 * <pre>
	 * $('#mainText').addBefore(EE('span', {'className': 'important'}, 'WARNING'));
	 * </pre>
	 * With the previous example's HTML, this would create this HTML:
	 * <pre>
	 * &lt;div>
	 *   &lt;span class="important">WARNING&lt;/span>
	 *   &lt;div id="mainText">Here is some text&lt;/div>
	 * &lt;/div>
	 * </pre> 
	 *
	 * @example Lists of elements and nodes are possible as well.
	 * <pre>
	 * $('#status').addBefore([EE('hr'), 'WARNING']);
	 * </pre>
	 *
	 * @param text a string to add as text node to the list elements
	 * @param node a DOM node to add to the list. If the list has more than one element, the given node will be added to the first element.
	 *             For all additional elements, the node will be cloned using ##clone().
	 * @param list a list containing text and/or nodes. May also contain nested lists with nodes or text..
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to create the nodes: 
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings and/or DOM nodes.
	 * If a function is returned, it will be invoked recursively with the same arguments.</dd></dl>
	 * @return the current list
	 *
	 * @see ##fill() replaces all children with new nodes.
	 * @see ##add() adds elements as last child.
	 * @see ##addFront() adds nodes as first child.
	 * @see ##addAfter() adds nodes as siblings after the list element(s).
	 * @see ##replace() replaces existing nodes.
	 */
	'addBefore': function (children) {
		return this['add'](children, function(newNode, refNode, parent) { parent['insertBefore'](newNode, refNode); });
	},
	
	
	/*$
	 * @id addfront
	 * @group ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .addFront()
	 * @syntax list.addFront(text)
	 * @syntax list.addFront(node)
	 * @syntax list.addFront(list)
	 * @syntax list.addFront(factoryFunction)
 	 * @module WEB
	 * Adds the given node(s) as children to the list's HTML elements. Unlike ##add(), the new nodes will be the first children and not the last.
	 * If a string has been given, it will be added as text node.
	 * DOM nodes will be added directly. If you pass a list, all its elements will be added using the rules above.
	 *
	 * When you pass a DOM node and the target list has more than one element, the original node will be added to the first list element,
	 * and ##clone#clones## to all following list elements.
	 *
	 * ##EE(), ##HTML() and ##clone() are compatible with <var>addFront()</var> and can help you create new HTML ndoes.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">Here is some text.&lt;br/>&lt;/div>
	 * </pre> 
	 * Add a text to the div:
	 * <pre>
	 * $('#comments').addFront('Some additional text. ');
	 * </pre>
	 * This results in:
	 * <pre>
	 * &lt;div id="comments">Some additional text. Here is some text.&lt;br/>&lt;/div>
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
	 * $('#comments').addFront([
	 *      EE('br'), 
	 *      'Some text', 
	 *      EE('span', {'className': 'highlight'}, 'Some highlighted text')
	 * ]);
	 * </pre>
	 *
	 * @param text a string to add as text node to the list elements
	 * @param node a DOM node to add to the list. If the list has more than one element, the given node will be added to the first element.
	 *             For all additional elements, the node will be cloned using ##clone().
	 * @param list a list containing text and/or nodes. May also contain nested lists with nodes or text..
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to create the nodes:
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings and/or DOM nodes.
	 * If a function is returned, it will be invoked recursively with the same arguments.</dd></dl>
	 * @return the current list
	 * 
 	 * @see ##fill() replaces all children with new nodes.
	 * @see ##add() adds elements as last child.
	 * @see ##addAfter() adds nodes not as children but as siblings.
	 * @see ##addBefore() also adds nodes not as children but as siblings.
	 * @see ##replace() replaces existing nodes.
	 */
	'addFront': function (children) {
		return this['add'](children, function(newNode, refNode) { refNode['insertBefore'](newNode, refNode['firstChild']); });
	},
	
	/*$
	 * @id replace
	 * @group ELEMENT
	 * @requires dollar add
	 * @configurable default
	 * @name .replace()
	 * @syntax list.replace(text)
	 * @syntax list.replace(node)
	 * @syntax list.replace(list)
	 * @syntax list.replace(factoryFunction)
 	 * @module WEB
	 * Replaces the list items with the the given node(s) in the DOM tree. 
	 * If a string has been given, it will be set as text node.
	 * DOM nodes will be added directly. If you pass a list, all its elements will be added using the rules above.
	 *
	 * When you pass a DOM node and the target list has more than one element, the original node will be added to the first list element,
	 * and ##clone#clones## to all following list elements.
	 * 
	 * ##EE(), ##HTML() and ##clone() are compatible with <var>replace()</var> and can help you create new HTML ndoes.
	 *
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">
	 *    &lt;div id="commentOne">My old comment.&lt;/div>
	 * &lt;/div>
	 * </pre> 
	 * This replaces the div 'commentOne':
	 * <pre>
	 * $('#commentOne').replace('Some new comment.');
	 * </pre>
	 * The resulting HTML is:
	 * <pre>
	 * &lt;div id="comments">
	 *    Some new comment.
	 * &lt;/div>
	 * </pre> 
	 * Please note that not only the text has changed, but the whole &lt;div> has been replaced. If you only want to replace the element's text content
	 * you should use ##fill() instead of <var>replace()</var>.
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
	 * @param node a DOM node to add to the list. If the list has more than one element, the given node will be added to the first element.
	 *             For all additional elements, the node will be cloned using ##clone().
	 * @param list a list containing text and/or nodes. May also contain nested lists with nodes or text..
	 * @param factoryFunction a <code>function(listItem, listIndex)</code> that will be invoked for each list element to determine its content: 
	 * <dl><dt>listItem</dt><dd>The list element that will receive the new children.</dd>
	 * <dt>listIndex</dt><dd>The index of the list element that will receive the new children.</dd>
	 * <dt class="returnValue">(callback return value)<dt><dd>The node(s) to be added to the list element.
	 * Can be either a string for a text node, an HTML element or a list containing strings and/or DOM nodes.
	 * If a function is returned, it will be invoked recursively with the same arguments.</dd></dl>
	 * @return the current list
	 * 
 	 * @see ##fill() replaces all children with new nodes.
	 * @see ##add() adds elements as last child.
	 * @see ##addFront() adds nodes as first child.
	 * @see ##addAfter() adds nodes not as children but as siblings.
	 * @see ##addBefore() also adds nodes not as children but as siblings.
	 */
	'replace': function (children) {
		return this['add'](children, function(newNode, refNode, parent) { parent['replaceChild'](newNode, refNode); });
	},

	/*$
	 * @id clone
	 * @group ELEMENT
	 * @requires each
	 * @configurable default
	 * @name .clone()
	 * @syntax list.clone()
 	 * @module WEB
	 * Clones all HTML nodes in the given list by creating a deep copy of them. Nested lists will be automatically flattened. 
	 * Everything else will be copied as-is into the new list.
	 *
	 * <var>clone()</var> uses the browser's <var>cloneNode()</var> function to clone HTML internally, but will remove the ids from
	 * all HTML top-level elements. This allows you to specify an element to clone by id without creating duplicate ids in the document.
	 * The ids of child elements will removed.
	 * 
	 * Please note that clone() does work with SVG, but will not remove ids from SVG.
	 * 
	 * Please note that event handlers will not be cloned.
	 * 
	 * @example Using the following HTML:
	 * <pre>
	 * &lt;div id="comments">
	 *    &lt;div id="comment1">My comment.&lt;/div>
	 * &lt;/div>
	 * </pre> 
	 * Creating a clone:
	 * <pre>
	 * var myClone = $('#comment1').clone();
	 * </pre>
	 * Adding it below the original:
	 * <pre>
	 * $('#comments').add(myClone);
	 * </pre> 
	 *
	 * @return the list containing copies of all supported items in the original list.
	 * 
	 * @see ##add() can add a cloned element to the HTML document.
	 */
	// @condblock !UTIL
	'clone':  function() {
		return new M(clone(this));
	},
	// @condend
	// @cond UTIL 'clone': listBindArray(clone),


	/*$
	 * @id animate
	 * @group ANIMATION
	 * @requires loop dollar dial get
	 * @configurable default
	 * @name .animate()
	 * @syntax list.animate(properties)
	 * @syntax list.animate(properties, durationMs)
	 * @syntax list.animate(properties, durationMs, linearity)
	 * @syntax list.animate(properties, durationMs, interpolationFunc)
 	 * @module WEB
	 * Animates the items of the list by modifying their properties, CSS styles and attributes. <var>animate()</var> can work with numbers, strings that contain exactly one
	 * number, and with colors in the CSS notations 'rgb(r,g,b)', '#rrggbb' or '#rgb'.
	 *
	 * When you invoke the function, it will first read all old values from the object and extract their numbers and colors. These start values will be compared to 
	 * the destination values that have been specified in the given properties. Then <var>animate()</var> will create a background task using ##$.loop() that updates the 
	 * specified properties in frequent intervals so that they transition to their destination values.
	 *
	 * The start values will be obtained using ##get(). It is recommended to set the start values using ##set() before you start the animation, even if this is not
	 * always required.
	 *
	 * You can define the kind of transition using the <var>linearity</var> parameter. If you omit it or pass 0, animate's default algorithm will cause a smooth transition
	 * from the start value to the end value. If you pass 1, the transition will be linear, with a sudden start and end of the animation. Any value between 0 and 1 
	 * is also allowed and will give you a transition that is 'somewhat smooth'. 
	 * 
	 * Instead of the <var>linearity</var> function you can provide your own interpolation <code>function(startValue, endValue, t)</code> which will be
	 * called every time an interpolated value is required. <var>startValue</var> and <var>endValue</var> define the start and end values. <var>t</var>
	 * is a value between 0 and 1 that specifies the current state of the transition. The function must return the <var>startValue</var> for 0 and 
	 * the <var>endValue</var> for 1. For values between 0 and 1, the function should return a transitional value.
	 *
	 * If the start value of a property is a string containing a number, <var>animate()</var> will always ignore all the surrounding text and use the destination value as a template 
	 * for the value to write. This can cause problems if you mix units in CSS. For example, if the start value is '10%' and you specify an end value of '20px', animate
	 * will do an animation from '10px' to '20px'. It is not able to convert units. 
	 *
	 * <var>animate()</var> does not only support strings with units, but any string containing exactly one number. This allows you, among other things, to work with 
	 * IE-specific CSS properties.
	 * For example, you can transition from a start value 'alpha(opacity = 0)' to 'alpha(opacity = 100)'. 
	 *
	 * When you animate colors, <var>animate()</var> is able to convert between the three notations rgb(r,g,b), #rrggbb or #rgb. You can use them interchangeably, but you can not 
	 * use color names such as 'red'.
	 *
	 * Instead of the end value, you can also specify a <code>function(oldValue, index, obj)</code> to calculate the actual end value. 
	 *
	 * To allow more complex animation, <var>animate()</var> returns a ##promiseClass#Promise## that is fulfilled when the animation has finished. You can also stop
	 * a running animation by calling the promise's ##stop() function. If you only use the Web module, <var>stop()</var> is only available in the promise returned by
	 * <var>animate()</var>. If you have the full package, the stop function will be propagated and can be called at any point of a promise chain.
	 *
	 * @example Move an element:
	 * <pre>
	 * $('#myMovingDiv').set({$left: '0px', $top: '0px'})                // start values
	 *                  .animate({$left: '50px', $top: '100px'}, 1000);  // animation
	 * </pre>
	 *
	 * @example Change the color of an element:
	 * <pre>
	 * $('#myBlushingDiv').set({$backgroundColor: '#000000'})
	 *                    .animate({$backgroundColor: '#ff0000'}, 1000);
	 * </pre>
	 * 
	 * @example Using a function to calulate the values for animation:
	 * <pre>
	 * $('#myMovingDiv').animate({$left: function(v) { return (parseFloat(v) + 100) + 'px'; }}, 1000);  
	 * </pre>
	 * 
	 * @example Fade-out effect:
	 * <pre>
	 * $('#myFadingDiv').animate({$$fade: 0}, 1000);
	 * </pre>
	 * 
 	 * @example Slide-in effect:
	 * <pre>
	 * $('#myInvisibleDiv').animate({$$show:1, $$slide: 1}, 1000);
	 * </pre>
	 *
	 *
	 * @example Stopping a simple animation. This requires only the Web module.
	 * <pre>
	 * var div = $('#myMovingDiv').set({$left: '0px', $top: '0px'});
	 * var p = div.animate({$left: '800px', $top: '0px'}, 5000, 0);
	 * $('#stopButton').on('click', p.stop);
	 * });
	 * </pre>
	 *
	 * @example Chained animation using ##promiseClass#Promise## callbacks. The element is first moved to the position 200/0, then to 200/200
	 *          and finally moves to 100/100.
	 *          A stop button allows you to interrupt the animation.<br/>
	 *          Please note that while chaining animations requires only the Web module,  
	 *          stopping a chained animation requires the full distribution with both Web and Util module. Only the complete Promises implementation 
	 *          supports this.
	 * <pre>
	 * var div = $('#myMovingDiv').set({$left: '0px', $top: '0px'});
	 * var p = div.animate({$left: '200px', $top: '0px'}, 600, 0)
	 *    .then(function() {
	 *           return div.animate({$left: '200px', $top: '200px'}, 800, 0);
	 *    }).then(function() {
	 *           return div.animate({$left: '100px', $top: '100px'}, 400);
	 *    });
	 *    
	 *  $('#stopButton').on('click', p.stop); // stopping requires Web+Util modules!
	 * });
	 * </pre>
	 *
	 *
	 * @param properties a property map describing the end values of the corresponding properties. The names can use the
	 *                   set() syntax ('@' prefix for attributes, '$' for styles, '$$fade' for fading,  '$$slide' for slide effects, 
	 *                   '$$scrollX' and '$$scrollY' for scroll coordinates). 
	 *                   Values must be either numbers, numbers with units (e.g. "2 px") or colors ('rgb(r,g,b)', '#rrggbb' or '#rgb') or
	 *                   a <code>function(oldValue, index, obj)</code>  to determine the new value. The function  will be invoked for each list element 
	 *                   to evaluate the new value: 
	 *                   <dl><dt>oldValue</dt><dd>The old value of the property to be changed, as returned by ##get().
	 *                   For the CSS style names, this is the computed style of the property </dd>
	 *                   <dt>index</dt><dd>The list index of the object owning the property</dd>
	 *                   <dt>obj</dt><dd>The list element owning the property.<dd>
	 *                   <dt class="returnValue">(callback return value)</dt><dd>The destination value to be set.</dd></dl> 
	 * @param durationMs optional the duration of the animation in milliseconds. Default: 500ms.
	 * @param linearity optional defines whether the animation should be linear (1), very smooth (0) or something in between. Default: 0.
	 * @param interpolationFunc optional an interpolation <code>function(startValue, endValue, t)</code> which will be
	 *             called every time an interpolated value is required:
	 *             <dl>
	 *             <dt>startValue</dt><dd>The start value of the transition.</dd>
	 *             <dt>endValue</dt><dd>The end value of the transition.</dd>
	 *             <dt>t</dt><dd>A value between 0 and 1 that specifies the state of the transition.</dd>
	 *             <dt class="returnValue">(callback return value)</dt><dd>The value at the time <var>t</var>.</dd>
	 *             </dl> 
	 * @return a ##promiseClass#Promise## object to monitor the animation's progress. 
	 *         It is fulfilled when the animation ended, and rejected if the animation had been stopped.
	 *         The fulfillment handler will be called as <code>function(list)</code>:
	 *         <dl><dt>list</dt><dd>A reference to the animated list.</dd></dl> 
	 *         The rejection handler is called as <code>function()</code> without arguments. 
	 *         The returned promise also has property 'stop', which is a function. Invoke the function without arguments to
	 *         interrupt a running animation. It will return the animations actual duration in ms. 
	 *         
	 * @see ##toggle() can be used to define animations between two states.
	 * @see ##$.loop() allows you to write more complex animations.
	 */	
	'animate': function (properties, duration, linearity) {
		var prom = promise(); 
		var self = this;
		var dials = collector(flexiEach, this, function(li, index) {
			var elList = $(li), dialStartProps, dialEndProps = {};
			eachObj(dialStartProps = elList.get(properties), function(name, start) {
				var dest = properties[name];
				dialEndProps[name] = isFunction(dest) ? dest(start, index, li) : 
					name == '$$slide' ? getNaturalHeight(elList, dest) : dest;
			});
			return elList['dial'](dialStartProps, dialEndProps, linearity);
		});

		var durationMs = duration || 500;
		var loopStop;

		// @condblock !promise
		prom['stop'] = function() { prom['fire'](false); return loopStop(); };
		// @condend
		// @cond promise prom['stop0'] = function() { prom['fire'](false); return loopStop(); };

		// start animation
		loopStop = $.loop(function(timePassedMs) {
			// @condblock !UTIL
			callList(dials, timePassedMs/durationMs);
			// @condend
			// @cond UTIL callList(dials, [timePassedMs/durationMs]);

			if (timePassedMs >= durationMs) {
				loopStop();
				prom['fire'](true, [self]);
			}
		});
		return prom;		
	},

	
	/*$
	 * @id dial
	 * @group ANIMATION
	 * @requires get set
	 * @configurable default
	 * @name .dial()
	 * @syntax list.dial(state1, state2)
	 * @syntax list.dial(state1, state2, linearity)
	 * @syntax list.dial(state1, state2, interpolationFunc)
	 * @module WEB
	 * 
	 * Creates a function allows you to set all list members to one of two states or any transitional state between them. 
	 * The states are specified using ##set() - compatible object maps containing the properties to set.
	 * Pass 0 to the function to set the first state for all list members, or 1 to set the second state.
	 * Any value between 0 and 1 will cause <var>dial()</var> to interpolate between the two states.
	 * Interpolation is supported for all numeric values, including those that have a string suffix (e.g. 'px' unit), 
	 * and for colors in all RGB notations (e.g. '#f00', '#f0d1ff' or 'rgb(23,0,100)').
	 *
	 * You can use the optional third parameter to define the kind of interpolation to use for values between 0 and 1.
	 * If 0, the dial uses a smooth, cubic interpolation. For 1 it uses linear interpolation. Values between 0 and 1
	 * will mix both algorithms. You can also specify your own interpolation function.
	 *
	 * @example Creates a dial function that changes the background color of the page.
	 * <pre>
	 * var light = $('body').dial({$backgroundColor: #000}, {$backgroundColor: #fff});
	 * light(0);     // set the first state (background color to #000)
	 * light(1);     // sets second state (background color to #fff).
	 * light(0.5);  // interpolates between two states, sets background color to #888.
	 * light(0.25);  // interpolates between two states, sets background color to #444.
	 * </pre>
	 * 
	 * @param state1 a property map in ##set() syntax describing the first state of the properties. The properties will be set for all elements of the list.
	 * @param state2 a property map describing the second state of the properties. Uses ##set() syntax. 
	 * @param linearity optional defines whether the animation should be linear (1), very smooth (0) or something in between. Default: 0. Ignored if durationMs is 0.
	 * @param interpolationFunc optional an interpolation <code>function(startValue, endValue, t)</code> which will be called every time
	 *       an interpolated value is required: 
	 *           <dl>
 	 *             <dt>startValue</dt><dd>The start value of the transition.</dd>
 	 *             <dt>endValue</dt><dd>The end value of the transition.</dd>
 	 *           <dt>t</dt><dd>A value between 0 and 1 that specifies the state of the transition.</dd>
 	 *             <dt class="returnValue">(callback return value)</dt><dd>The value at the time <var>t</var>.</dd>
 	 *             </dl> 		 
 	 * @return a dial function <code>function(newPosition)</code> that will set the state.
	 *             <dl>
	 *             <dt>newPosition</dt><dd>If 0 or lower, set the list members to the first state. 
	 *             If 1 or higher, sets them to the second state. For any value betweeen 0 and 1, the list members
	 *             will be set to interpolated values.</dd>
	 *             </dl>
	 *             
	 * @see ##toggle() is a related function that allows you to define two states and automatically animate between them.
	 */
	'dial': function (properties1, properties2, linf) {
		var self = this;
		var linearity = linf || 0;
		var interpolate = isFunction(linearity) ? linearity : function(startValue, endValue, t) {
			return t * (endValue - startValue) * (linearity + (1-linearity) * t * (3 - 2*t)) + startValue; 
		};

		function getColorComponent(colorCode, index) {
			return (/^#/.test(colorCode)) ?
				parseInt(colorCode.length > 6 ? colorCode.substr(index*2+1, 2) : ((colorCode=colorCode.charAt(index+1))+colorCode), 16)
				:
				extractNumber(colorCode.split(',')[index]);
		}
		return function(t) {
			eachObj(properties1, function(name, start) {
				var end=properties2[name], i = 0; 
				self['set'](name, t<=0?start:t>=1?end:
					 (/^#|rgb\(/.test(end)) ? // color in format '#rgb' or '#rrggbb' or 'rgb(r,g,b)'?
								('rgb('+ Math.round(interpolate(getColorComponent(start, i), getColorComponent(end, i++), t)) // expression repeated, gzip will do the rest
								+ ',' + Math.round(interpolate(getColorComponent(start, i), getColorComponent(end, i++), t))
								+ ',' + Math.round(interpolate(getColorComponent(start, i), getColorComponent(end, i++), t))
							    + ')')
							:
								replace(end, /-?[\d.]+/, toString(interpolate(extractNumber(start), extractNumber(end), t)))
				);
			});
		};
	},

	
	/*$
	 * @id toggle
	 * @group ANIMATION
	 * @requires animate set
	 * @configurable default
	 * @name .toggle()
	 * @syntax list.toggle(cssClasses)
	 * @syntax list.toggle(state1, state2)
	 * @syntax list.toggle(state1, state2, durationMs)
	 * @syntax list.toggle(state1, state2, durationMs, linearity)
	 * @syntax list.toggle(state1, state2, durationMs, interpolationFunction)
	 * @module WEB
	 * 
	 * Creates a function that switches between the two given states for the list. The states use the ##set() property syntax. You can also
	 * just pass a string of CSS classes, as you do with <var>set()</var>.
	 *
	 * If no duration is given, the returned function changes the state immediately using ##set(). If a duration has been passed, the returned function
	 * uses ##animate() to smoothly transition the state. If the returned function is invoked while an animation is running, it interrupts the 
	 * animation and returns to the other state.
	 *
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
	 * @example Takes the previous function, but adds it as an onclick event handler that toggles the color.
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
	 * @example Toggling CSS classes using the full syntax:
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
	 * @param cssClasses a string containing space-separated CSS class names to toggle. Classes are disabled in the first state
	 *                   and enabled in the second.
	 * @param state1 a property map in ##set() syntax describing the initial state of the properties. The properties will automatically be set when the
	 *                   <var>toggle()</var> function is created. The properties will be set for all elements of the list.
	 * @param state2 a property map describing the second state of the properties. Uses ##set() syntax, like the other state. 
	 * @param durationMs optional if set, the duration of the animation in milliseconds. By default, there is no animation and the 
	 * 					 properties will be changed immediately.
	 * @param linearity optional defines whether the animation should be linear (1), very smooth (0) or something in between. Default: 0. Ignored if durationMs is 0.
	 * @param interpolationFunc optional an interpolation <code>function(startValue, endValue, t)</code> for the animation which will be called every 
	 *     time an interpolated value is required: 
	 *           <dl>
 	 *             <dt>startValue</dt><dd>The start value of the transition.</dd>
 	 *             <dt>endValue</dt><dd>The end value of the transition.</dd>
 	 *           <dt>t</dt><dd>A value between 0 and 1 that specifies the state of the transition.</dd>
 	 *             <dt class="returnValue">(callback return value)</dt><dd>The value at the time <var>t</var>.</dd>
 	 *             </dl> 		 
 	 * @return a toggle function <code>function(newState)</code> that will toggle between the two states, or set a specific state.
	 *             <dl>
	 *             <dt>newState (optional)</dt><dd>If a boolean <var>true</var> or <var>false</var> is given, 
	 *             the toggle will set the first or second state respectively. If called with any other value, or without a value,
	 *             the function toggles to the other state.</dd>
	 *             </dl>
	 *             
	 * @see ##dial() is a similar function that allows you to smoothly interpolate between two states.
	 *
	 */
	'toggle': function(stateDesc1, stateDesc2, durationMs, linearity) {
		var self = this;
		var state = false;
		var promise;
		var stateDesc;

		if (stateDesc2) {
			self['set'](stateDesc1);
			return function(newState) {
					if (newState !== state) {
						stateDesc = (state = (newState===true||newState===false ? newState : !state)) ? stateDesc2 : stateDesc1;

						if (durationMs) 
							(promise = self['animate'](stateDesc, promise ? promise['stop']() : durationMs, linearity))['then'](function(){promise=_null;});
						else
							self['set'](stateDesc);
					}
				};
		}
		else
			return self['toggle'](replace(stateDesc1, /\b(?=\w)/g, '-'), replace(stateDesc1, /\b(?=\w)/g, '+'));
	},

	

	/*$
	 * @id values
	 * @group REQUEST
	 * @requires each
	 * @configurable default
	 * @name .values()
	 * @syntax list.values()
	 * @syntax list.values(dataMap)
	 * @module WEB
	 * Creates a name/value map from the given form. values() looks at the list's form elements and writes each element's name into the map,
	 * using the element name as key and the element's value as value. As there can be more than one value with the same name, 
	 * the map's values are arrays if there is more than one value with the same name in the form. If an element does not
	 * have a name, its id will be used. Elements without name and id will be ignored.
	 *
	 * values() will use all elements in the list that have a name, such as input, textarea and select elements. For form elements in the list, all child form
	 * elements will be serialized.
	 * 
	 * The map format returned by values() is exactly the format used by request().
	 * 
	 * Please note that when you include an input element more than once, for example by having the input itself and its form in the list, the
	 * value will be included twice in the list.
	 *
	 * @example Serialize a form and send it as request parameters:
	 * <pre>
	 * $.request('get', '/exampleService', $('#myForm').values(), resultHandler);
	 * </pre>
	 * 
	 * @example Serialize only some selected input fields:
	 * <pre>
	 * var data = $('#myText, input.myRadios').values();
	 * </pre>
	 * 
	 * @param dataMap optional an optional map to write the values into. If not given, a new empty map will be created
	 * @return a map containing name->value pairs, using strings as name and value. If there is more than one value with the same name,
	 *         <var>values()</var> creates an array containing all values. 
	 *       
	 * @see ##$.request() can submit form data serialized by <var>values()</var> as HTTP POST.
	 */
	'values': function(data) {
		var r = data || {};
		this['each'](function(el) {
			var n = el['name'] || el['id'], v = toString(el['value']);
			if (/form/i.test(el['tagName']))
				// @condblock ie9compatibility 
				for (var i = 0; i < el['elements'].length; i++) // can't call directly, as IE<=9's elements have a nodeType prop and isList does not work
					$(el['elements'][i])['values'](r); 
				// @condend
				// @cond !ie9compatibility $(el['elements'])['values'](r);
			else if (n && (!/ox|io/i.test(el['type']) || el['checked'])) { // ox|io => short for checkbox, radio
				r[n] = r[n] == _null ? v : collector(flexiEach, [r[n], v], nonOp);
			}
		});
		return r;
	},

	/*$
	 * @id offset
	 * @group SELECTORS
	 * @requires dollar
	 * @configurable default
	 * @name .offset()
	 * @syntax list.offset()
	 * Returns the pixel page coordinates of the list's first element. Page coordinates are the pixel coordinates within the document, 
	 * with 0/0 being the upper left corner, independent of the user's current view (which depends on the user's current scroll position and zoom level).
	 *
	 * @example Displays the position of the element with the id 'myElement' in the element 'resultElement':
	 * <pre>
	 * var pos = $('#myElement').offset();
	 * $('#resultElement').ht('#myElement's position is left={x} top={y}', pos);
	 * </pre>
	 *
	 * @param element the element whose coordinates should be determined
	 * @return an object containing pixel coordinates in two properties 'x' and 'y'
	 * 
	 * @see ##get() can be used to read more general properties of a list element.
	 */
	'offset': function() {
		var elem = this[0];
		var dest = {'x': 0, 'y': 0};
		while (elem) {
			dest['x'] += elem['offsetLeft'];
			dest['y'] += elem['offsetTop'];
			elem = elem['offsetParent'];
		}
		return dest;
	},

	/*$
	 * @id on
	 * @group EVENTS
	 * @requires dollar each
	 * @configurable default
	 * @name .on()
	 * @syntax list.on(names, eventHandler)
	 * @syntax list.on(selector, names, eventHandler)
	 * @syntax list.on(names, customFunc, args)
	 * @syntax list.on(selector, names, customFunc, args)
	 * @syntax list.on(names, eventHandler, bubbleSelector)
	 * @syntax list.on(names, customFunc, args, bubbleSelector)
	 * @module WEB
	 * Registers the function as event handler for all items in the list.
	 * 
	 * By default, Minified cancels event propagation and disables element's default behavior for all elements that have an event handler. 
	 * You can override this, either by prefixing the event name with a '|', or by prefixing them with '?' and returning a <var>true</var>  
	 * in the handler. Both will reinstate the original JavaScript behavior. 
	 * 
	 * Handlers are called with the original event object as first argument, the index of the source element in the 
	 * list as second argument and 'this' set to the source element of the event (e.g. the button that has been clicked). 
	 * 
	 * Instead of the event objects, you can also pass an array of arguments that will be passed instead of event object and index. 
	 *
	 * Optionally you can specify two a selector strings to qualify only certain events. The first one is a selector
	 * that allows you to select only specific children of the list elements. This is mostly useful for adding events to DOM trees
	 * generated using ##HTML() or ##EE().
	 * 
	 * The second type of selector is the bubble selector that allows you to receive only events that bubbled up from 
	 * elements matching the selector. The selector is executed in the context of the element you registered on to identify whether the
	 * original target of the event qualifies. If not, the handler is not called.
	 * 
	 * Minified always registers event handlers with event bubbling enabled. Event capture is not supported.
	 * 
	 * Event handlers can be unregistered using #off#$.off().
	 * 
	 * @example Adds a handler to all divs which paints the div background color to red when clicked. 
	 * <pre>
	 * $('div').on('click', function() {
	 *    this.style.backgroundColor = 'red';    // 'this' contains the element that caused the event
	 * });
	 * </pre>
	 *
	 * @example Registers a handler to call a method setStatus('running') using an inline function:
	 * <pre>
	 * $('#myButton').on('click', function() {
	 *    setStatus('running');
	 * });
	 * </pre>
	 * The previous example can bere written like this, using <var>on()</var>'s <var>args</var> parameter:
	 * <pre>
	 * $('#myButton').on('click', setStatus, ['running']);
	 * </pre>
	 *
	 * @example Adds two handlers on an input field. The event names are prefixed with '|' and thus keep their original behavior: 
	 * <pre>
	 * $('#myInput').on('|keypress |keydown', function() {
	 *    // do something
	 * });
	 * </pre>
	 * 
	 * @example Adds a click handler that will abort the operation by returning false, unless the user confirms it:
	 * <pre>
	 * $('#myLink').on('?click', function() {
	 *    return window.confirm('Really leave?');
	 * });
	 * </pre>
	 * 
	 * @example Adds a button and registers a click handler for it using a sub-selector.
	 * <pre>
	 * $('#myForm').add(HTML("&lt;li>&ltbutton>click me&lt/button>&lt/li>").on('button', 'click', myClickHandler));
	 * </pre>
	 * 
	 * @example Adds listeners for all clicks on a table's rows using the bubble selector 'tr'.
	 * <pre>
	 * $('#table').on('change', 'tr', function(event, index, selectedIndex) {
	 *    alert("Click on table row number: " + selectedIndex);
	 * }, 'tr');
	 * </pre>
	 * Please note that bubble selectors will even listen to events for
	 * table rows that have been added <strong>after you registered for the events</strong>.
	 * 
	 * @param selector optional a selector string for ##dollar#$()## to register the event only on those children of the list elements that
	 *                match the selector. 
	 *                Supports all valid parameters for <var>$()</var> except functions.            
	 * @param names the space-separated names of the events to register for, e.g. 'click'. Case-sensitive. The 'on' prefix in front of 
	 *             the name must not used. You can register the handler for more than one event by specifying several 
	 *             space-separated event names. If the name is prefixed
	 *             with '|' (pipe), the event will be passed through and the event's default actions will be executed by the browser. 
	 *             If the name is prefixed with '?', the event will only be passed through if the handler returns <var>true</var>.
	 * @param eventHandler the callback <code>function(event, index)</code> to invoke when the event has been triggered:
	 * 		  <dl>
 	 *             <dt>event</dt><dd>The original DOM event object.</dd>
 	 *             <dt>index</dt><dd>The index of the target object in the ##list#Minified list## .</dd>
 	 *             <dt class="this">this</dt><dd>A ##list#Minified list## containing the target element as only item (same as <var>event.target</var>).</dd>
 	 *             <dt class="returnValue">(callback return value)</dt><dd>The return value will only be used if the event name prefix was '?'.
 	 *             Then, a return value <var>false</var> will stop all further processing of the event and disable event bubbling.
 	 *             <var>true</var> will keep the event alive.</dd>
 	 *             </dl>
	 * @param customFunc a function to be called instead of a regular event handler with the arguments given in <var>args</var>.
	 *                   'this' will be a ##list#Minified list## containing the target element as only item (same element as <var>event.target</var>).
	 * @param args optional an array of arguments to pass to the custom callback function instead of the event objects. If omitted, the function is
	 *             called as event handler with the event object as argument.
	 * @param bubbleSelector optional a selector string for ##dollar#$()## to receive only events that bubbled up from an
	 *                element that matches this selector.
	 *                Supports all valid parameters for <var>$()</var> except functions. Analog to ##is(), 
	 *                the selector is optimized for the simple patterns '.classname', 'tagname' and 'tagname.classname'.                
	 * @return the list
	 * @see ##off() allows you to unregister an event handler.
	 * @see ##onClick() as a shortcut for 'click' events.
	 * @see ##onOver() to simplify mouseover/mouseout events.
	 * @see ##onFocus() as convenient way to register for focus events.
	 * @see ##onChange() to get notified when an input's content changes.
	 */
	'on': on,
	
	
	/*$
	 * @id onover
	 * @group EVENTS
	 * @requires on dollar up
	 * @configurable default
	 * @name .onOver()
	 * @syntax list.onOver(handler)
	 * @syntax list.onOver(selector, handler)
	 * @syntax list.onOver(handler, bubbleSelector)
	 * @module WEB
	 * Registers a function to be called whenever the mouse pointer enters or leaves one of the list's elements.
	 * The handler is called with a boolean parameter, <var>true</var> for entering and <var>false</var> for leaving,
	 * which allows you to use any ##toggle() function as handler.
	 * 
	 * @example Creates a toggle that animates the element on mouse over:
	 * <pre>
	 * $('#mouseSensitive').onOver($('#mouseSensitive').toggle({$color:'#000'}, {$color:'#f00'}, 500));
	 * </pre>
	 * 
	 * @param selector optional a selector string for ##dollar#$()## to register the event only on those children of the list elements that
	 *                match the selector. 
	 *                Supports all valid parameters for <var>$()</var> except functions.           
	 * @param toggle the callback <code>function(isOver, event)</code> to invoke when the event has been triggered:
	 * 		  <dl>
 	 *             <dt>isOver</dt><dd><var>true</var> if mouse is entering any element, <var>false</var> when leaving.</dd>
 	 *             <dt>event</dt><dd>The original event object given to ##on().</dd>
 	 *             <dt class="this">this</dt><dd>A ##list#Minified list## containing the target element that caused the event as only item.</dd>
 	 *             </dl>
	 * @return the list
	 * @see ##on() provides low-level event registration.
	 */
	'onOver': function(subSelect, toggle) {
		var self = this, curOverState = []; 
		if (isFunction(toggle))
			return this['on'](subSelect, '|mouseover |mouseout', function(ev, index) {
				// @condblock ie9compatibility 
				var relatedTarget = ev['relatedTarget'] || ev['toElement'];
				// @condend
				// @cond !ie9compatibility var relatedTarget = ev['relatedTarget'];
				var overState = ev['type'] != 'mouseout';
				if (curOverState[index] !== overState) {
					if (overState || (!relatedTarget) || (relatedTarget != self[index] && !$(relatedTarget)['up'](self[index]).length)) {
						curOverState[index] = overState;
						toggle.call(this, overState, ev);
					}
				}
			});
		else
			return this['onOver'](_null, subSelect);
	},
	
	/*$
	 * @id onfocus
	 * @group EVENTS
	 * @requires on dollar 
	 * @configurable default
	 * @name .onFocus()
	 * @syntax list.onFocus(handler)
	 * @syntax list.onFocus(selector, handler)
	 * @module WEB
	 * Registers a function to be called when a list element either gets the focus or the focus is removed (blur).
	 * The handler is called with a boolean parameter, <var>true</var> for entering and <var>false</var> for leaving,
	 * which allows you to use any ##toggle() function as handler.
	 * 
	 * @example Creates a toggle that changes the text color of the element on focus:
	 * <pre>
	 * $('#focusSensitive').onFocus($('#focusSensitive').toggle({$color:'#000'}, {$color:'#f00'}, 100));
	 * </pre>
	 * 
	 * @param selector optional a selector string for ##dollar#$()## to register the event only on those children of the list elements that
	 *                match the selector. 
	 *                Supports all valid parameters for <var>$()</var> except functions.           
	 * @param toggle the callback <code>function(hasFocus)</code> to invoke when the event has been triggered:
	 * 		  <dl>
 	 *             <dt>hasFocus</dt><dd><var>true</var> if an element gets the focus, <var>false</var> when an element looses it.</dd>
 	 *             <dt class="this">this</dt><dd>A ##list#Minified list## containing the target element that caused the event as only item.</dd>
 	 *             </dl>      
	 * @param bubbleSelector optional a selector string for ##dollar#$()## to receive only events that bubbled up from an
	 *                element that matches this selector.
	 *                Supports all valid parameters for <var>$()</var> except functions. Analog to ##is(), 
	 *                the selector is optimized for the simple patterns '.classname', 'tagname' and 'tagname.classname'.                
	 * @return the list
	 * @see ##on() provides low-level event registration.
	 */
	'onFocus': function(selector, handler, bubbleSelector) {
		if (isFunction(handler))
			return this['on'](selector, '|blur', handler, [false], bubbleSelector)
					   ['on'](selector, '|focus', handler, [true], bubbleSelector);
		else
			return this['onFocus'](_null, selector, handler);
	},

	/*$
	 * @id onchange
	 * @group EVENTS
	 * @requires on dollar each
	 * @configurable default
	 * @name .onChange()
	 * @syntax list.onChange(handler)
	 * @syntax list.onChange(selector, handler)
	 * @syntax list.onChange(handler, bubbleSelector)
	 * @syntax list.onChange(selector, handler, bubbleSelector)
	 * @module WEB
	 * Registers a handler to be called whenever content of the list's input fields changes. The handler is
	 * called in realtime and does not wait for the focus to change. Text fields, text areas, selects as well
	 * as checkboxes and radio buttons are supported. The handler is called with the new value as first argument.
	 * For selects the value is the first selected item, but the function will be called for every change.
	 * The value is boolean for checkbox/radio buttons and a string for all other types. 
	 * 
	 * Please note that the handler may be called on the user's first interaction even without an actual content change. After that, 
	 * the handler will only be called when the content actually changed.
	 * 
	 * On legacy IE platforms, <var>onChange</var> tries to report every change as soon as possible. When used with bubbling selector, 
	 * some text changes may not be reported before the input loses focus. This is because there is no reliable event to report text 
	 * changes that also supports bubbling. 
	 * 
	 * @example Creates a handler that writes the input's content into a text node:
	 * <pre>
	 * $('#myField').onChange(function(newValue, index, ev) { $('#target').fill(newValue); });
	 * </pre>
	 * 
	 * @param selector optional a selector string for ##dollar#$()## to register the event only on those children of the list elements that
	 *                match the selector. 
	 *                Supports all valid parameters for <var>$()</var> except functions.            
	 * @param handler the callback <code>function(newValue, index, ev)</code> to invoke when the event has been triggered:
	 * 		  <dl>
 	 *             <dt>newValue</dt><dd>For text fields and selects the new <var>value</var> string. 
 	 *              For checkboxes/radio buttons it is the boolean returned by <var>checked</var>.</dd>
 	 *             <dt>index</dt><dd>The index of the target element in the ##list#Minified list## .</dd>
 	 *             <dt class="this">this</dt><dd>A ##list#Minified list## containing the target element that caused the event as only item.</dd>
 	 *             </dl>
	 * @param bubbleSelector optional a selector string for ##dollar#$()## to receive only events that bubbled up from an
	 *                element that matches this selector.
	 *                Supports all valid parameters for <var>$()</var> except functions. Analog to ##is(), 
	 *                the selector is optimized for the simple patterns '.classname', 'tagname' and 'tagname.classname'.                
	 * @return the list
	 * @see ##on() provides low-level event registration.
	 */
	'onChange': function onChange(subSelect, handler, bubbleSelector) {
		if (isFunction(handler)) {
			// @condblock ie8compatibility
			return this['on'](subSelect, IS_PRE_IE9 ? '|propertychange |change |keyup |clicked' : '|input |change |clicked', function(ev, index) {
					var e = this[0];
					var v;
					if (IS_PRE_IE9 && /select/i.test(e['tagName']))
						v = e['options'][e['selectedIndex']]['text'];
					else
						v = /ox|io/i.test(e['type']) ? e['checked'] : e['value']; 
					if (v != e[MINIFIED_MAGIC_PREV]) {
						handler.call(this, e[MINIFIED_MAGIC_PREV] = v, index);
					}
				}, bubbleSelector);
			// @condend 

			// @cond !ie8compatibility return this['on'](subSelect, '|input |change |click',  function(ev, index) { // |change for select elements, |click for checkboxes...
			// @cond !ie8compatibility 		var e = this[0];
			// @cond !ie8compatibility      var v = /ox|io/i.test(e['type']) ? e['checked'] : e['value'];
			// @cond !ie8compatibility 	    if (e[MINIFIED_MAGIC_PREV] != v) {
			// @cond !ie8compatibility 	        handler.call(this, e[MINIFIED_MAGIC_PREV] = v, index);
			// @cond !ie8compatibility 		}
			// @cond !ie8compatibility 	}, bubbleSelector); 
		}
		else
			return this['onChange'](_null, subSelect, handler); 
			
	},
	
	/*$
	 * @id onclick
	 * @group EVENTS
	 * @requires on 
	 * @configurable default
	 * @name .onClick()
	 * @syntax list.onClick(handler)
	 * @syntax list.onClick(customFunc, args)
	 * @syntax list.onClick(selector, handler)
	 * @syntax list.onClick(selector, customFunc, args)
	 * @module WEB
	 * Registers a function to be called for 'click' events. This is only a convenience method and identical to calling
	 * ##on() with 'click' as event type.
	 * You can specify a sub-selector to register only for specific children of the list elements, and you can
	 * specify arguments to pass to the handler instead of the default event object.
	 * 
	 * Event handlers registered using <var>onClick()</var> can be unregistered using ##$.off().
	 * 
	 * @example Says hello if you click:
	 * <pre>
	 * $('#sayHello').onClick(function() { window.alert('Hello!'); });
	 * </pre>
	 * 
	 * @example Using arguments:
	 * <pre>
	 * function saySomething(what) { window.alert(what); }
	 * 
	 * $('#sayHello').onClick(saySomething, ['Hello!']);
	 * $('#sayBye').onClick(saySomething, ['Goodbye!']);
	 * </pre>
	 * 
 	 * @example Creates an event handler that toggles the color of the text on click:
	 * <pre>
	 * $('#changeColor').onClick($('#colorChanger').toggle({$color:'#000'}, {$color:'#f00'}, 100));
	 * </pre>
	 * @param selector optional a selector string for ##dollar#$()## to register the event only on those children of the list elements that
	 *                match the selector. 
	 *                Supports all valid parameters for <var>$()</var> except functions.            
	 * @param eventHandler the callback <code>function(event, index)</code> to invoke when the event has been triggered:
	 * 		  <dl>
 	 *             <dt>event</dt><dd>The original DOM event object.</dd>
 	 *             <dt>index</dt><dd>The index of the target object in the ##list#Minified list## .</dd>
 	 *             <dt class="this">this</dt><dd>A ##list#Minified list## containing the target element as only item (same element as <var>event.target</var>).</dd>
 	 *        </dl>
	 * @param customFunc a function to be called instead of a regular event handler with the arguments given in <var>args</var>.
	 *                   'this' will be a ##list#Minified list## containing the target element as only item (same element as <var>event.target</var>).
	 * @param args optional an array of arguments to pass to the custom callback function instead of the event objects. If omitted, the function is
	 *             called as event handler with the event object as argument.
	 * @param bubbleSelector optional a selector string for ##dollar#$()## to receive only events that bubbled up from an
	 *                element that matches this selector.
	 *                Supports all valid parameters for <var>$()</var> except functions. Analog to ##is(), 
	 *                the selector is optimized for the simple patterns '.classname', 'tagname' and 'tagname.classname'.                
	 * @return the list	 
	 * @see ##on() provides low-level event registration.
	 * @see ##off() can unregister <var>onClick</var> event handlers.
	 */
	'onClick': function(subSelect, handler, args, bubbleSelector) {
	     if (isFunction(handler))
	    	 return this['on'](subSelect, 'click', handler, args, bubbleSelector);
	     else
	    	 return this['onClick'](_null, subSelect, handler, args);
	},

	
	/*$
	 * @id trigger
	 * @group EVENTS
	 * @requires on each
	 * @configurable default
	 * @name .trigger()
	 * @syntax list.trigger(name)
	 * @syntax list.trigger(name, eventObject)
	 * @module WEB
	 * 
	 * Triggers event handlers registered with ##on().
	 * Any event that has been previously registered using ##on() can be invoked with <var>trigger()</var>. Please note that 
	 * it will not simulate the default behavior on the elements, such as a form submit when you click on a submit button. Event bubbling
	 * is supported, thus unless there's an event handler that cancels the event, the event will be triggered on all parent elements.
	 * 
	 * 
	 * @example Simulates a 'click' event on the button. 
	 * <pre>
	 * $('#myButton').trigger('click');
	 * </pre>
	 *
	 * @param name a single event name to trigger
	 * @param eventObj optional an object to pass to the event handler, provided the handler does not have custom arguments.
	 *                 Anything you pass here will be directly given to event handlers as event object, so you need to know what 
	 *                 they expect.
	 * @return the list
	 * @see ##on() registers events that can be triggered.
	 */
	'trigger': function (eventName, eventObj) {
		return this['each'](function(element, index) {
			// @condblock ie8compatibility 
			var stopBubble, el = element;
			while(el && !stopBubble) {
				flexiEach(
						IS_PRE_IE9 ? registeredEvents[el[MINIFIED_MAGIC_NODEID]] :
						el['M'], function(hDesc) {
							if (hDesc.eventType == eventName)
								stopBubble = stopBubble || !hDesc.handlerFunc(eventObj, element);
						});
				el = el['parentNode'];
			}
			//@condend
			// @cond !ie8compatibility var bubbleOn = true, el = element;
			// @cond !ie8compatibility while(el && bubbleOn) {
			// @cond !ie8compatibility 	eachObj(el['M'], function(id, f) {
			// @cond !ie8compatibility 		bubbleOn = bubbleOn && f(eventName, eventObj, element); 
			// @cond !ie8compatibility 	});
			// @cond !ie8compatibility 	el = el['parentNode'];
			// @cond !ie8compatibility }
		});
	}

 	/*$
 	 * @stop
 	 */
		// @cond !trigger dummyTrigger:0
		// @cond ALL ,
		///#/snippet webListFuncs
		
		
	}, function(n, v) {M.prototype[n]=v;});
	 

 	//// DOLLAR FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	eachObj({
	///#snippet webDollarFuncs
	/*$
	* @id request
	* @group REQUEST
	* @requires 
	* @configurable default
	* @name $.request()
	* @syntax $.request(method, url)
	* @syntax $.request(method, url, data)
	* @syntax $.request(method, url, data, settings)
	* @module WEB
	* Initiates a HTTP request to the given URL, using XMLHttpRequest. It returns a ##promiseClass#Promise## object that allows you to obtain the result.
	* 
	* @example Invokes a REST web service and parses the resulting document using JSON:
	* <pre>
	* $.request('get', 'http://service.example.com/weather', {zipcode: 90210})
	*    .then(function(txt) {
	*         var json = $.parseJSON(txt);
	*         $('#weatherResult').fill('Today's forecast is is: ' + json.today.forecast);
	*    })
	*    .error(function(status, statusText, responseText) {
	*         $('#weatherResult').fill('The weather service was not available.');
	*    });
	* </pre>
	* 
	* @example Sending a JSON object to a REST web service:
	* <pre>
	* var myRequest = {         // create a request object that can be serialized via JSON
	*      request: 'register',
	*      entries: [
	*        {name: 'Joe',
	*      	    job: 'Plumber'
	*        }
	*      ]};
	* 
	* function failureHandler() {
	*   $('#registrationResult').fill('Registration failed');
	* }
	*
	* $.request('post', 'http://service.example.com/directory', $.toJSON(myRequest))
	*     .then(function(txt) {
	*        if (txt == 'OK')
	*             $('#registrationResult').fill('Registration succeeded');
	*        else
	*              failureHandler();
	*        })
	*     .error(failureHandler);
	* </pre>
	* 
	* @example Using HTTP authentication and a custom XMLHttpRequest property.
	* <pre>var handler = $.request('get', 'http://service.example.com/userinfo', null, {xhr: {withCredentials: true}, user: 'me', pass: 'secret'});</pre>
	*
	* 
	* @param method the HTTP method, e.g. 'get', 'post' or 'head' (rule of thumb: use 'post' for requests that change data 
	*             on the server, and 'get' to request data). Not case sensitive.
	* @param url the server URL to request. May be a relative URL (relative to the document) or an absolute URL. Note that unless you do something 
	*             fancy on the server (keyword to google:  Access-Control-Allow-Origin), you can only call URLs on the server your script originates from.
	* @param data optional data to send in the request, either as POST/PUT body or as URL parameters. It can be either a plain object as map of 
	*             parameters (for all HTTP methods), a string (for all HTTP methods), a DOM document ('post' only) or a FormData object ('post' only). 
	*             If the method is 'post', it will be sent as body, otherwise parameters are appended to the URL. In order to send several parameters with the 
	*             same name, use an array of values in the map. Use null as value for a parameter without value.
	* @param settings optional a map of additional parameters. Supports the following properties (all optional):
	* <dl><dt>headers</dt><dd>a map of HTTP headers to add to the request. Note that you should use the proper capitalization for the
	*                header 'Content-Type', if you set it, because otherwise it may be overwritten.</dd>
	* <dt>xhr</dt><dd>a map of properties to set in the XMLHttpRequest object before the request is sent, for example <code>{withCredentials: true}</code>.</dd>
	* <dt>overrideMimeType</dt><dd>if set, the response will will be treated as if it had this MIME type.</code>.</dd>
	* <dt>user</dt><dd>username for HTTP authentication, together with the <var>pass</var> parameter</dd>
	* <dt>pass</dt><dd>password for HTTP authentication, together with the <var>user</var> parameter</dd>
	* </dl>
	* @return a ##promiseClass#Promise## containing the request's status. If the request has successfully completed with a HTTP status 2xx, 
	*         the promise's completion handler will be called as <code>function(text, xhr)</code>:
	*         <dl><dt>text</dt><dd>The response sent by the server as text.</dd>
	*         <dt>xhr</dt><dd>The XMLHttpRequest used for the request. This allows you to retrieve the response in different
	*         formats (e.g. <var>responseXml</var> for an XML document</var>), to retrieve headers and more.</dd></dl>
	*         The failure handler will be called as <code>function(statusCode, statusText, text)</code>:
	*         <dl><dt>statusCode</dt><dd>The HTTP status (never 200; 0 if no HTTP request took place).</dd>
	*         <dt>text</dt><dd>The response's body text, if there was any, or the exception as string if the browser threw one.</dd>
	*         <dt>xhr</dt><dd>The XMLHttpRequest used for the request. This allows you to retrieve the response in different
	*         formats (e.g. <var>responseXml</var> for an XML document</var>), to retrieve headers and more..</dd></dl>
	*         The returned promise supports ##stop(). Calling <var>stop()</var> will invoke the XHR's <var>abort()</var> method.
	*         The underlying XmlHttpRequest can also be obtained from the promise's <var>xhr</var> property.
	*         
	* @see ##values() serializes an HTML form in a format ready to be sent by <var>$.request</var>.
	* @see ##$.parseJSON() can be used to parse JSON responses.
	* @see ##$.toJSON() can create JSON messages.
	* @see ##_.format() can be useful for creating REST-like URLs, if you use JavaScript's built-in <var>escape()</var> function.
	*/
	'request': function (method, url, data, settings0) {
		var settings = settings0 || {}; 
		var xhr, callbackCalled = 0, prom = promise(), dataIsMap = data && (data['constructor'] == settings['constructor']);
		var usesBody = /post|put/i.test(method);
		
		try {
			// @condblock ie6compatibility
			prom['xhr'] = xhr = (_window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Msxml2.XMLHTTP.3.0"));
			// @condend
			// @cond !ie6compatibility prom['xhr'] = xhr = new XMLHttpRequest();

			// @condblock !promise
			prom['stop'] = function() { xhr['abort'](); };
			// @condend promise 
			// @cond promise prom['stop0'] = function() { xhr['abort'](); };
			// @condend

			if (dataIsMap) { // if data is parameter map...
				data = collector(eachObj, data, function processParam(paramName, paramValue) {
					return collector(flexiEach, paramValue, function(v) { 
						return encodeURIComponent(paramName) + ((v != _null) ?  '=' + encodeURIComponent(v) : '');
					});
				}).join('&');
			}
		
			if (data != _null && !usesBody) {
				url += '?' + data;
				data = _null;
			}

			xhr['open'](method, url, true, settings['user'], settings['pass']);
			if (dataIsMap && usesBody)
				xhr['setRequestHeader']('Content-Type', 'application/x-www-form-urlencoded');

			eachObj(settings['headers'], function(hdrName, hdrValue) {
				xhr['setRequestHeader'](hdrName, hdrValue);
			});
			eachObj(settings['xhr'], function(name, value) {
				xhr[name] = value;
			});
			
			if (settings['overrideMimeType'])
				xhr['overrideMimeType'](settings['overrideMimeType']);

			xhr['onreadystatechange'] = function() {
				if (xhr['readyState'] == 4 && !callbackCalled++) {
					if (xhr['status'] >= 200 && xhr['status'] < 300)
						prom['fire'](true, [xhr['responseText'], xhr]);
					else
						prom['fire'](false, [xhr['status'], xhr['responseText'], xhr]);
				}
			};
			
			xhr['send'](data);
		}
		catch (e) {
			if (!callbackCalled) 
				prom['fire'](false, [0, _null, toString(e)]);
		}
		
		return prom;
	},
	
	
	/*
	 * JSON Module. Uses browser built-ins or json.org implementation if available. Otherwise its own implementation,
	 * originally based on public domain implementation http://www.JSON.org/json2.js / http://www.JSON.org/js.html.
	 * Extremely simplified code, made variables local, removed all side-effects (especially new properties for String, Date and Number).
	 */
	

	/*$
	* @id tojson
	* @group JSON
	* @requires  
	* @configurable default
	* @name $.toJSON()
	* @syntax $.toJSON(value)
	* @module WEB
	* Converts the given value into a JSON string. The value may be a map-like object, an array or list, a string, number, boolean or null.
   	* If you build Minified without Internet Explorer compatibility, this is just an alias for <var>JSON.stringify</var>.
	*
	* The following types are supported by the built-in implementation:
	* <ul>
	*   <li>Objects (direct properties will be serialized)</li>
	*   <li>Arrays/Lists (with <var>length</var> property)</li>
	*   <li>Strings</li>
	*   <li>Numbers</li>
	*   <li>Boolean</li>
	*   <li>null</li>
	* </ul>
	* Any other types in your JSON tree, especially Dates, should be converted into Strings before being passed to <var>toJSON</var>.
	*
	* @example Converts an object into a JSON object:
	* <pre>
	* var myObj = {name: 'Fruits', roles: ['apple', 'banana', 'orange']};
	* var jsonString = $.toJSON(myObj);
	* </pre>
	* 
	* @param value the value (map-like object, array/list, string, number, boolean or null)
	* @return the JSON string
	* 
	* @see ##$.parseJON() parses JSON structures.
	*/
	// @condblock ie7compatibility
	'toJSON': function toJSON(value) {
		if (value == _null)
			return ""+value;                  //result: "null"; toString(value) is not possible, because it returns an empty string for null
		if (isString(value = value.valueOf()))
			return '"' + replace(value, /[\\\"\x00-\x1f\u2028\u2029]/g, ucode) + '"' ;
		if (isList(value)) 
			return '[' + collector(flexiEach, value, toJSON).join() + ']';
		if (isObject(value))
			return '{' + collector(eachObj, value, function(k, n) { return toJSON(k) + ':' + toJSON(n); }).join() + '}';
		return toString(value);
	},
	// @condend
	// @cond !ie7compatibility 'toJSON': JSON.stringify,
	
	/*$
	* @id parsejson
	* @group JSON
	* @requires 
	* @configurable default
	* @name $.parseJSON()
	* @syntax $.parseJSON(text)
	* @module WEB
	* Parses a string containing JSON and returns the de-serialized object.
	* 
	* In Minified builds without Internet Explorer 7 compatibility, the browser's built-in function 
	* <var>JSON.parse</var> is used for de-serialization.
 	*
	* Only if you have a legacy-build without IE7 support, and you are actually running on IE7 or earlier, 
	* Minified will actually use its own implementation. Because of subtle differences between the
	* browser implementation and Minified's own you need to test your code thoroughly in this constellation,
	* but but it is a recommended security practise to use the browser implementation whenever possible.
	*
	* @example Parsing a JSON string:
	* <pre>
	* var jsonString = "{name: 'Fruits', roles: ['apple', 'banana', 'orange']}";
	* var myObj = $.parseJSON(jsonString);
	* </pre>
	*
	* @param text the JSON string
	* @return the resulting JavaScript object. <var>Undefined</var> if not valid.
	* @see ##$.toJSON() converts JavaScript objects to JSON.
	*/
	// @condblock ie7compatibility
	'parseJSON': _window.JSON ? _window.JSON.parse : function (text) {
		var t = replace(text, /[\x00\xad\u0600-\uffff]/g, ucode); // encode unsafe characters
		if (/^[[\],:{}\s]*$/                  // test that, after getting rid of literals, only allowed characters can be found
				.test(replace(replace(t , /\\["\\\/bfnrtu]/g),             // remove all escapes
						/"[^"\\\n\r]*"|true|false|null|[\d.eE+-]+/g))      // remove all literals
				)
			return eval('(' + t + ')');
		// fall through if not valid
	},
	// @condend
	// @cond !ie7compatibility 'parseJSON': JSON.parse,
	
	/*$
	* @id ready
	* @group EVENTS
	* @requires ready_vars ready_init
	* @configurable default
	* @name $.ready()
	* @syntax $.ready(handler)
	* @module WEB
	* Registers a handler to be called as soon as the HTML has been fully loaded in the browser. Does not necessarily wait for images and other elements, 
	* only the main HTML document needs to be complete. On older browsers it is the same as <var>window.onload</var>. 
	* 
	* If you call <var>ready()</var> after the page is completed, the handler is scheduled for invocation in the event loop as soon as possible.
	*
	* A shortcut for <var>ready()</var> is to call ##dollar#$()## with the handler function. It does the same with fewer characters.
	*
	* @example Registers a handler that sets some text in an element:
	* <pre>
	* $.ready(function() {
	*   $('#someElement').fill('ready() called');
	* });
	* </pre>
	*
	* @param handler the <code>function()</code> to be called when the HTML is ready.
	* @see ##dollar#$()## calls <var>ready()</var> when invoked with a function, offering a more convenient syntax.
	*/
	'ready': ready,

   


	/*$
	* @id loop
	* @group ANIMATION
	* @requires animation_vars 
	* @configurable default
	* @name $.loop()
	* @syntax $.loop(paintCallback)
	* @module WEB
	* Runs an animation loop. The given callback method will be invoked repeatedly to create a new animation frame.
	* In modern browsers, <var>requestAnimationFrame</var> will be used to invoke the callback every time the browser is ready for a new 
	* animation frame. 
	* The exact frequency is determined by the browser and may vary depending on factors such as the time needed to 
	* render the current page, the screen's framerate and whether the page is currently visible to the user. 
	* In older browsers the callback function will be invoked approximately every 33 milliseconds.
	* 
	* An animation loop runs indefinitely. To stop it, you have two options:
	* <ul><li>Invoke the <var>stop()</var> function that <var>$.loop()</var> that will return.</li>
	* <li>The animation callback receives the same <var>stop()</var> function as second argument, so the callback can end the animation itself.</li>
	* </ul>
	*
	* @example Animates a div by moving along in a circle.
	* <pre>
	*   var myDiv = $$('#myAnimatedDiv');
	*   var rotationsPerMs = 1000;                           // one rotation per second
	*   var radius = 100;
	*   var d = 3000;                                        // duration in ms
	*   $.loop(function(t, stopFunc) {
	*     var a = 2 * Math.PI * Math.min(t, d) / rotationsPerMs; // angular position
	*     myDiv.style.left = (radius * Math.cos(a) + ' px';
	*     myDiv.style.top = (radius * Math.sin(a) + ' px';
	*     if (t > d)                                         // time is up: call stopFunc()!
	*       stopFunc();
	*   });
	* </pre>
	*
	* @param paintCallback a callback <code>function(timestamp, stopFunc)</code> that will be invoked repeatedly to prepare a frame. Parameters given to callback:
	* <dl>
	*            <dt>timestamp</dt><dd>The number of miliseconds since the animation's start (possibly as high-precision double, if the browser supports this).</dd>
	*            <dt>stop</dt><dd>Call this <code>function()</code> to stop the currently running animation.</dd>
	* </dl>
	* The callback's return value will be ignored.
	* @return a <code>function()</code> that stops the currently running animation. This is the same function that is also given to the callback.
	* 
	* @see ##animate() for simple, property-based animations.
	*/
	'loop': function(paintCallback) {
		var startTimestamp;
		var currentTime = 0;
		var id = idSequence++;
		var requestAnim = _window['requestAnimationFrame'] || function(f) { setTimeout(function() { f(+new Date()); }, 33); }; // 30 fps as fallback
		function raFunc(ts) {
			eachObj(animationHandlers, function(id, f) { f(ts); });
			if (animationHandlerCount) 
				requestAnim(raFunc);
		}; 
		function stop() {
			if (animationHandlers[id]) {
				delete animationHandlers[id];
				animationHandlerCount--;
			}
			return currentTime;
		} 
		animationHandlers[id] = function(ts) {
			startTimestamp = startTimestamp || ts;
			paintCallback(currentTime = ts - startTimestamp, stop);
		};

		if (!(animationHandlerCount++)) 
			requestAnim(raFunc);
		return stop; 
	},
	
	
	/*$
	 * @id off
	 * @group EVENTS
	 * @requires on
	 * @configurable default
	 * @name $.off()
	 * @syntax $.off(handler)
 	 * @module WEB
	 * Removes the given event handler. The call will be ignored if the given handler has not been registered using ##on(). 
	 * If the handler has been registered for more than one element or event, it will be removed from all instances.
	 * 
	 * Please note that you can not unregister event handlers registered using ##onOver() or ##onChange().
	 * 
	 * @example Adds a handler to an element:
	 * <pre>
	 * function myEventHandler() {
	 *    this.style.backgroundColor = 'red';        // 'this' contains the element that caused the event
	 * }
	 * $('#myElement').on('click', myEventHandler);  // add event handler
	 *
	 * window.setInterval(function() {               // after 5s, remove event handler
	 *    $.off(myEventHandler);
	 * }, 5000);
	 * </pre>
	 * 
	 * @param handler the handler to unregister, as given to ##on(). It must be a handler that has previously been registered using ##on().
	 *                If the handler is not registered as event handler, the function does nothing.
	 *                
	 * @see ##on() registers an event handler.
	 */
	'off': off
	
 	/*$
 	 * @stop
 	 */
	// @cond !off dummyOff:null
	// @cond ALL ,
	///#/snippet webDollarFuncs
	}, function(n, v) {$[n]=v;});

			
				
	//// GLOBAL INITIALIZATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	///#snippet webInit
	/*$
	 * @id ready_init
	 * @dependency
	 */
	// @condblock ie8compatibility
	if (IS_PRE_IE9) {
		function triggerDomReady() {
			callList(DOMREADY_HANDLER);
			DOMREADY_HANDLER = _null;
		}
		document['attachEvent']("onreadystatechange", function() {
			if (/^[ic]/.test(document['readyState']))
				triggerDomReady();
		});
		_window['attachEvent']("onload", triggerDomReady);
	}
	else
	// @condend
		document.addEventListener("DOMContentLoaded", function() {
			callList(DOMREADY_HANDLER);
			DOMREADY_HANDLER = _null;
		}, false);
	/*$
	 @stop
	 */

	
	
	// @condblock ie8compatibility
	// for old IEs, unregister all event handlers to avoid mem leaks
	_window.unload = function() {
		flexiEach(registeredEvents, detachHandlerList);
	};
	// @condend


   
	///#/snippet webInit

	
	return {
	
	
	///#snippet webExports

		/*$
		 * @id dollar
		 * @group SELECTORS
		 * @requires  
		 * @dependency yes
		 * @name $()
		 * @syntax $()
		 * @syntax $(selector)
		 * @syntax $(selector, context)
		 * @syntax $(selector, context, childOnly)
		 * @syntax $(list)
		 * @syntax $(list, context)
		 * @syntax $(list, context, childOnly)
		 * @syntax $(object)
		 * @syntax $(object, context)
		 * @syntax $(object, context, childOnly)
		 * @syntax $(domreadyFunction)
	 	 * @module WEB
		 * Creates a new ##list#Minified list##, or register a DOMReady-handler. 
		 * The most common usage is with a CSS-like selector. <var>$()</var> will then create a list containing all elements of the current HTML
		 * document that fulfill the filter conditions. Alternatively you can also specify a list of objects or a single object. 
		 * Nested lists will automatically be flattened, and nulls will automatically be removed from the resulting list.
		 * If you call <var>$()</var> without any arguments, it will return an empty list.
		 * 
		 * Additionally, you can specify a second argument to provide a context. Contexts only make sense if you selected 
		 * HTML nodes with the first parameter. Then the context limits the resulting list to include only those nodes 
		 * that are descendants of the context nodes. The context can be either a selector, a list or a single HTML node, and will be 
		 * processed like the first argument. A third arguments allows you to limit the list to 
		 * only those elements that are direct children of the context nodes (so a child of a child would be filtered out).
		 *
		 * The lists created by <var>$()</var> are the same type as the ##list#Minified lists## created by Util's #underscore#_() constructor and other
		 * Util methods. All Util methods work on lists created by <var>$()</var>. If you want to add your own methods to those lists,
		 * use ##M#MINI.M##.
		 * 
		 * As a special shortcut, if you pass a function to <var>$()</var>, it will be registered using #ready#$.ready() to be executed 
		 * when the DOM model is complete.
		 *
		 * @example A simple selector to find an element by id.
		 * <pre>
		 * var l0 = $('#myElementId');
		 * </pre>
		 * 	 
		 * @example You can pass an object reference to create a list containing only this element:
		 * <pre>
		 * var l1 = $(document.getElementById('myElementId')); 
		 * </pre>
		 *
		 * @example Lists and arrays will be copied:
		 * <pre>
		 * var l2 = $([elementA, elementB, elementC]); 
		 * </pre>
		 * 	 
		 * @example Lists will be automatically flattened and nulls removed. So this list <var>l3</var> has the same content as <var>l2</var>:
		 * <pre>
		 * var l3 = $([elementA, [elementB, null, elementC], null]); 
		 * </pre>
		 * 	 
		 * @example This is a simple selector to find all elements with the given class.
		 * <pre>
		 * var l4 = $('.myClass');
		 * </pre>
		 * 	 
		 * @example A selector to find all elements of the given type.
		 * <pre>
		 * var l5 = $('input'); // finds all input elements
		 * </pre>
		 * 	 
		 * @example A selector to find all elements with the given type and class.
		 * <pre>
		 * var l6 = $('input.myRadio'); // finds all input elements with class 'myRadio'
		 * </pre>
		 * 	 
		 * @example A selector to find all elements that are descendants of the given element.
		 * <pre>
		 * var l7 = $('#myForm input'); // finds all input elements contained in the element myForm
		 * </pre>
		 * 	 
		 * @example A selector to find all elements that have either a CSS class 'a' or class 'b':
		 * <pre>
		 * var l8 = $('.a, .b'); // finds all elements that have class a or class b
		 * </pre>
		 * 	 
		 * @example A selector that finds all elements that are descendants of the element myDivision, are inside an element with the
		 * class .myForm and are input elements:
		 * <pre>
		 * var l9 = $('#myDivision .myForm input'); 
		 * </pre>
		 * 	 
		 * @example Contexts can make it easier to specify ancestors:
		 * <pre>
		 * var l10 = $('.myRadio', '#formA, #formB, #formC'); 
		 * </pre>
		 * The result is identical to:
		 * <pre>
		 * var l10 = $('#formA .myRadio, #formB .myRadio, #formC .myRadio'); 
		 * </pre>
		 * 
		 * @example Using one of the list functions, ##set(), on the list, and setting the element's text color. '$' at the beginning of the property name sets a CSS value.
		 * <pre>
		 * $('#myElementId').set('$color', 'red');
		 * </pre>
		 *
		 * @example Most list methods return the list you invoked them on, allowing you to chain them:
		 * <pre>
		 * $('#myForm .myRadio').addClass('uncheckedRadio')
		 *                      .set('checked', true)
		 *                      .on('click', function() {
		 *                             $(this).set({@: 'uncheckedRadio');
		 *                      });
		 * </pre>
		 * 
		 * @example Using $() as a #ready#$.ready() shortcut:
		 * <pre>
		 * $(function() {
		 *   // in here you can safely work with the HTML document
		 * });
		 * </pre>
		 * 
		 * @param selector a simple, CSS-like selector for HTML elements. It supports '#id' (lookup by id), '.class' (lookup by class),
		 *             'element' (lookup by elements) and 'element.class' (combined class and element). Use commas to combine several selectors.
		 *             You can also join two or more selectors by space to find elements which are descendants of the previous selectors.
		 *             For example, use 'div' to find all div elements, '.header' to find all elements containing a class name called 'header', and
		 *             'a.popup' for all a elements with the class 'popup'. To find all elements with 'header' or 'footer' class names, 
		 *             write '.header, .footer'. To find all divs elements below the element with the id 'main', use '#main div'.
		 *             The selector "*" will return all elements.
		 * @param list a list to copy. It can be an array, another Minified list, a DOM nodelist or anything else that has a <var>length</var> property and
		 *             allows read access by index. A shallow copy of the list will be returned. Nulls will be automatically removed from the copy. Nested lists 
		 *             will be flattened, so the result only contains nodes.
		 * @param object an object to create a single-element list containing only the object. If the argument is null, an empty list will be returned.
		 * @param domreadyFunction a function to be registered using #ready#$.ready().
		 * @param context optional an optional selector, node or list of nodes which specifies one or more common ancestor nodes for the selection. The context can be specified as
		 *             a selector, a list or using a single object, just like the first argument.
		 *             The returned list will contain only descendants of the context nodes. All others will be filtered out. 
		 * @param childOnly optional if set, only direct children of the context nodes are included in the list. Children of children will be filtered out. If omitted or not 
		 *             true, all descendants of the context will be included. 
		 * @return the array-like ##list#Minified list## object containing the content specified by the selector. 
		 *             Please note that if the first argument was a list, the existing order will be kept. If the first argument was a simple selector, the nodes are in document order. 
		 *             If you combined several selectors using commas, only the individual results of the selectors will keep the document order, 
		 *             but will then be joined to form a single list. This list will
		 *             not be in document order anymore, unless you use a build without legacy IE support.
		 *             Duplicate nodes will be removed from selectors, but not from lists.
		 *             
		 * @see #underscore#_() is Util's alternative constructor for ##list#Minified lists##
		 * @see ##dollardollar#$$()## works like <var>$()</var>, but returns the resulting list's first element.
		 */
		'$': $,
			
		/*$
		 * @id dollardollar
		 * @group SELECTORS
		 * @requires 
		 * @configurable default
		 * @name $$()
		 * @syntax $(selector)
		 * @syntax $(selector, context)
		 * @syntax $(selector, context, childOnly)
		 * @shortcut $$() - It is recommended that you assign MINI.$$ to a variable $$.
	 	 * @module WEB
		 * Returns a DOM object containing the first match of the given selector, or <var>undefined</var> if no match was found. 
		 * <var>$$</var> allows you to easily access an element directly. It is the equivalent to writing <code>$(selector)[0]</code>.
		 *
		 * Please note that the function <var>$$</var> will not be automatically exported by Minified. You should always import it
		 * using the recommended import statement:
		 * <pre>
		 * var MINI = require('minified'), $ = MINI.$, $$ = MINI.$$, EE = MINI.EE;
		 * </pre>
		 * 
		 * @example Select the checkbox 'myCheckbox':
		 * <pre>
		 * $$('#myCheckbox').checked = true;
		 * </pre>
		 * 
		 * @param selector a simple, CSS-like selector for the element. Uses the same syntax as #dollar#$(). The most common
		 *                 parameter for this function is the id selector with the syntax "#id".
		 * @param context optional an optional selector, node or list of nodes which specifies one or more common ancestor nodes for the selection. The context can be specified as
		 *             a selector, a list or using a single object, just like the first argument.
		 *             The returned list will contain only descendants of the context nodes. All others will be filtered out. 
		 * @param childOnly optional if set, only direct children of the context nodes are included in the list. Children of children will be filtered out. If omitted or not 
		 *             true, all descendants of the context will be included. 
		 * @return a DOM object of the first match, or <var>undefined</var> if the selector did not return at least one match
		 * 
		 * @see ##dollar#$()## creates a list using the selector, instead of returning only the first result.
		 */
		'$$': $$,
	
			
		/*$
		 * @id ee
		 * @group ELEMENT
		 * @requires dollar set add
		 * @configurable default
		 * @name EE()
		 * @syntax EE(elementName)
		 * @syntax EE(elementName, properties)
		 * @syntax EE(elementName, children)
		 * @syntax EE(elementName, properties, children)
		 * @shortcut EE() - It is recommended that you assign MINI.EE to a variable EE.
	 	 * @module WEB
		 * Creates a new HTML Element, wrapped in a  ##list#Minified list##, optionally with attributes and children.
		 * Typically it will be used to insert elements into the DOM tree using ##add() or a similar function. 
		 *
		 * Please note that the function <var>EE</var> will not be automatically exported by Minified. You should always import it
		 * using the recommended import statement:
		 * <pre>
		 * var MINI = require('minified'), $ = MINI.$, $$ = MINI.$$, EE = MINI.EE;
		 * </pre>
		 * 
		 * @example Creating a simple &lt;span> element with some text:
		 * <pre>
		 * var mySpan = EE('span', 'Hello World'); 
		 * </pre>
		 * This is the result:
		 * <pre>
		 *  &lt;span>Hello World&lt;/span> 
		 * </pre>
		 * 
		 * @example Adding the '&lt;span>Hello World; &lt;span> element to all elements with the class '.greeting':
		 * <pre>
		 * $('.greeting').add(EE('span', 'Hello World')); 
		 * 
		 * @example Creating a &lt;span> element with style and some text:
		 * <pre>
		 * var span2 = EE('span', {'@title': 'Greetings'}, 'Hello World'); 
		 * </pre>
		 * The last line creates this:
		 * <pre>
		 *  &lt;span title="Greetings">Hello World&lt;/span> 
		 * </pre>
		 * 
		 * @example Creating a &lt;form> element with two text fields, labels and a submit button:
		 * <pre>var myForm = EE('form', {'@method': 'post'}, [
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
		 * @example If you only want to add an attribute under a certain condition, 
		 * a simple trick is to pass null as value if you do not need it:
		 * <pre>
		 * var myInput = EE('input', {
		 * 				'@id': 'myCheckbox', 
		 * 				'@type': 'checkbox', 
		 * 				'@checked': shouldBeChecked() ? 'checked' : null
		 * 			});
		 * </pre>
		 * 
		 * @example You can set styles directly using a $ prefix for the name:
		 * <pre>
		 * var myStylesSpan = EE('span', {$color: "red", $fontWeight: "bold"}, "I'm styled");
		 * </pre>
		 * 
		 * @example ##on() makes it very easy to attach event handlers to the new elements directly after creating them:
		 * <pre>
		 * $('#target').add(EE('input', {'@name': "myInput"}).on('change', inputChanged));
		 * });
		 * </pre>
		 * 
		 * @param elementName the element name to create (e.g. 'div')
		 * @param properties optional an object which contains a map of attributes and other values. Uses the ##set() syntax: 
		 * 					 Attribute values are prefixed with '@', data attributes with '%', CSS styles with '$' and 
		 *                   regular properties can be set without prefix.
		 *                   If the attribute value is null, the attribute will omitted (styles and properties can be set to null). 
		 *                   In order to stay compatible with Internet Explorer 7 and earlier, you should not set the 
		 *                   attributes '@class' and '@style'. Instead set the property 'className' instead of '@class' and set 
		 *                   styles using the '$' syntax.
		 * @param children optional  a node or a list of nodes to be added as children. Strings will be converted to text nodes. 
		 *                         Functions will be invoked and their return value will be used. Lists can be 
		 *                         nested and will then automatically be flattened. Null elements in lists will be ignored. 
		 *                         The syntax is exactly like ##add().
		 * @return the HTML Element wrapped in a Minified list
		 */
		'EE': EE,
		
		/*$
		 * @id M
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
		'M': M,
		
		/*$
		 * @id getter
		 * @requires get
		 * @name MINI.getter
		 * @syntax MINI.getter
		 * @module WEB
		 * 
		 * Exposes a map of prefix handlers used by ##get(). You can add support for a new prefix in <var>get()</var>
		 * by adding a function to this map. The prefix can be any string consisting solely of non-alphanumeric characters
		 * that's not already used by Minified. 
		 * 
		 * You must not replace <var>getters</var> by a new map, but must always modify the existing map.
		 * 
		 * The function's signature is <code>function(list, name)</code> where
		 * <dl><dt>list</dt><dd>Is the Minified list to get the value from. By convention you should always use only the first element. The list is
		 *                      non-empty and the first elememt can't be null or undefined (get() automatically returns <var>undefined</var> in 
		 *                      all other case).</dd>
		 *     <dt>name</dt><dd>The name of the property. That's the part AFTER the prefix.</dd>
		 *     <dt class="returnValue">(callback return value)</dt><dd>The value to return to the user.</dd></dl>
		 * 
		 * @example Adding a shortcut '||' for accessing border style properties:
		 * <pre>
		 * MINI.getter['||'] = function(list, name) {
		 * 	return list.get('$border' + name.replace(/^[a-z]/, function(a) { return a.toUpperCase()});
		 * };
		 * 
		 * var borderColor = $('#box').get('||color'); // same as '$borderColor'
		 * var borderLeftRadius = $('#box').get('||leftRadius'); // same as '$borderLeftRadius'
		 * </pre>
		 *
		 * @example Adding XLink attribute support to get(). This is useful if you work with SVG. The prefix is '>'.
		 * <pre>
		 * MINI.getter['>'] = function(list, name) {
		 * 	return list[0].getAttributeNS('http://www.w3.org/1999/xlink', name);
		 * };
		 * 
		 * var xlinkHref = $('#svgLink').get('>href');
		 * </pre>
		 */
		'getter': getter,
		
		/*$
		 * @id setter
		 * @requires set
		 * @name MINI.setter
		 * @syntax MINI.setter
		 * @module WEB
		 * 
		 * Exposes a map of prefix handlers used by ##set(). You can add support for a new prefix in <var>set()</var>
		 * by adding a function to this map. The prefix can be any string consisting solely of non-alphanumeric characters
		 * that's not already used by Minified. 
		 * 
		 * You must not replace <var>setters</var> by a new map, but must always modify the existing map.
		 * 
		 * The function's signature is <code>function(list, name, value)</code> where
		 * <dl><dt>list</dt><dd>Is the Minified list to use.</dd>
		 *     <dt>name</dt><dd>The name of the property. That's the part AFTER the prefix.</dd>
		 *     <dt>value</dt><dd>Either the value to set, or a callback function to create the value that you must call for each
		 *     value (see ##set() ).</dd>
		 *     </dl>
		 *
		 * If you provide complete ##get() and ##set() support for a prefix, you are also able to use it in other Minified
		 * function such as ##animate() and ##toggle().
		 * 
		 * @example Adding a shortcut '||' for accessing border style properties. As it's just calling ##set() for an existing
		 * property, it is not required to extra code for the callback.
		 * <pre>
		 * MINI.setter['||'] = function(list, name, value) {
		 * 	list.set('$border' + name.replace(/^[a-z]/, function(a) { return a.toUpperCase()}, value);
		 * };
		 * 
		 * $('#box').set('||color', 'red');   // same as set('$borderColor', 'red')
		 * $('#box').set('||leftRadius', 4);  // same as set('$borderLeftRadius', 4)
		 * </pre>
		 *
		 * @example Adding XLink attribute support to set(). This is useful if you work with SVG. The prefix is '>'.
		 * <pre>
		 * MINI.setter['>'] = function(list, name, value) {
		 * 	list.each(function(obj, index) {
		 * 		var v;
		 * 		if (_.isFunction(value))
		 * 			v = value(obj.getAttributeNS('http://www.w3.org/1999/xlink', name), index, obj);
		 * 		else 
		 * 			v = value;
		 *		
		 *		if (v == null)
		 *			obj.removeAttributeNS('http://www.w3.org/1999/xlink', name);
		 *		else
		 *			obj.setAttributeNS('http://www.w3.org/1999/xlink', name, v);
		 *	});
		 * };
		 * 
		 * $('#svgLink').set('>href', 'http://minifiedjs.com/');
		 * </pre>
		 */
		'setter': setter
		/*$
		 * @stop 
		 */
		///#/snippet webExports
		
	};

///#snippet commonAmdEnd
});
///#/snippet commonAmdEnd
		
		
///#snippet  webDocs

		
/*$
 * @id list
 * @name Minified Lists
 * @module WEB, UTIL
 * 
 * <i>Minified lists</i> are Array-like objects provided by Minified. Like a regular JavaScript array, 
 * they provide a <var>length</var> property and you can access their content using the index operator (<code>a[5]</code>). 
 * However, they do not provide the same methods as JavaScript's native array and are designed to be immutable, so
 * there is no direct way to add something to a Minified list. Instead Minified provides a number of functions and methods
 * that take a list and create a modified copy which, for example, may contain additional elements.
 *
 * Minified lists are typically created either using the Web module's #dollar#$()</a></code> function or with the Util module's
 * #underscore#_()</a></code> function, but many functions in the Util module also return a Minified list.
 * 
 * The Util module provides a function ##_.array() that converts a Minified list to a regular JavaScript array.
 */
		
/*$
 * @id promiseClass
 * @name Promise
 * @module WEB, UTIL
 * 
 * <i>Promises</i> are objects that represent the future result of an asynchronous operation. When you start such an operation, using #request#$.request(),
 * ##animate(), or ##wait(), you will get a Promise object that allows you to get the result as soon as the operation is finished.
 * 
 * Minified's full distribution ships with a <a href="http://promises-aplus.github.io/promises-spec/">Promises/A+</a>-compliant implementation of Promises that should
 * be able to interoperate with most other Promises implementations. Minified's Web module in stand-alone distribution comes with a limited implementation.
 * See below for details.
 * 
 * What may be somewhat surprising about this Promises specification is that the only standard-compliant way to access the result is to 
 * register callbacks. They will be invoked as soon as the operation is finished. 
 * If the operation already ended when you register the callbacks, the callback will then just be called from the event loop as soon
 * as possible (but never while the ##then() you register them with is still running).<br/>
 * This design forces you to handle the operation result asynchronously and disencourages 'bad' techniques such as polling.
 * 
 * The central method of a Promise, and indeed the only required function in Promises/A+, is ##then(). It allows you to register
 * two callback methods, one for success (called 'fulfillment' in Promises/A+ terminology) and one for failures (called 'rejection' in Promises/A+).
 * 
 * This example shows you how to use <var>then()</var>:
 * <pre>
 * $.request('get', 'http://example.com/weather?zip=90210')
 *  .then(function success(result) {
 *      alert('The weather is ' + result);
 *  }, function error(exception) {
 *  	alert('Something went wrong');
 *  });
 * </pre>
 * 
 * What makes Promises so special is that ##then() itself returns a new Promise, which is based on the Promise <var>then()</var> was called on, but can be
 * modified by the outcome of callbacks. Both arguments to <var>then()</var> are optional, and you can also write the code like this:
 * <pre>
 * $.request('get', 'http://example.com/weather?zip=90210')
 *  .then(function success(result) {
 *      alert('The weather is ' + result);
 *  })
 *  .then(null, function error(exception) {
 *  	alert('Something went wrong');
 *  });
 * </pre>
 * 
 * Because the first ##then() returns a new Promise based on the original Promise, the second <var>then()</var> will handle errors of the request just like 
 * the first one did. There is only one subtle difference in the second example: the error handler will not only be called if the request failed, 
 * but also when the request succeded but the success handler threw an exception. That's one of the two differences between the original Promise and 
 * the Promise returned by <var>then()</var>. Any exception thrown in a callback causes the new Promise to be in error state. 
 * 
 * Before I show you the second difference between the original Promise and the new Promise, let me make the example a bit more readable 
 * by using ##error(), which is not part of Promises/A+, but a simple extension by Minified. It just registers the failure callback without 
 * forcing you to specify <var>null</var> as first argument: 
 * <pre>
 * $.request('get', 'http://example.com/weather?zip=90210')
 *  .then(function success(result) {
 *      alert('The weather is ' + result);
 *  })
 *  .error(function error(exception) {  // error(callback) is equivalent to then(null, callback)
 *  	alert('Something went wrong');
 *  });
 * </pre>
 * 
 * A very powerful capability of Promises is that you can easily chain them. If a ##then() callback returns a value, the new Promise returned 
 * by <var>then()</var> will be marked as success (fulfilled) and this value is the result of the operation. If a callback returns a Promise, 
 * the new Promise will assume the state of the returned Promise. You can use the latter to create chains of asynchronous operations, 
 * but you still need only a single error handler for all of them and you do not need to nest functions to achieve this:
 * <pre>
 * $.request('get', 'http://example.com/zipcode?location=Beverly+Hills,+CA')
 *  .then(function(resultZip) {
 *      return $.request('get', 'http://example.com/weather', {zip: resultZip});
 *  })
 *  .then(function(resultWeather) {
 *      alert('The weather in Beverly Hills is ' + resultWeather);
 *  })
 *  .error(function(exception) {
 *  	alert('Something went wrong');
 *  });
 * </pre>
 *  
 * Only the full Minified distribution allows you to create promises yourself, using the ##promise() function. The Promises/A+ 
 * specification does not specify how to fulfill a promise, but in Minified's implementation every Promise object has a function <code>fire()</code>  
 * that needs to be called when the promise result is ready. It requires two arguments.
 * The first is a boolean, <var>true</var> for a successful operation and <var>false</var> for a failure. The second is an array or list containing the
 * arguments to call the corresponding ##then() handler with.
 * 
 * The following example is a function, similar to ##wait(), that returns a Promise which succeeds after the given amount 
 * of milliseconds has passed.
 * It then fulfills the promise with the number of milliseconds as argument. 
 * 
 * <pre>
 * function timeout(durationMs) {
 *		var p = _.promise();
 *		setTimeout(function() { p.fire(true, [durationMs]); }, durationMs);
 *		return p;
 * }
 * </pre>
 * Call it like this: 
 * <pre>
 * timeout(1000).then(function(ms) { window.alert(ms+ ' milliseconds have passed.'); });
 * </pre>
 * 
 * <h3>Limited Promises Implementation in Web module</h3>
 * If you use only the Web module, instead of the full implementation, the promises implementation is not fully Promises/A+ compliant. 
 * One major difference is that it does not allow you create promises yourself. The only way to get a promise in the Web module 
 * is from functions like ##animate() and ##request(). The other difference is that the interoperability with other promises frameworks 
 * is limited, even though it should be good enough most of the time.
 *
 * There are two things you may run into when you use Web's simplified implementation with a complete implementation:
 * <ol><li>The simplified implementation does not support recursive thenables. So when you register callbacks with ##then(), 
 * you can return a promise or a thenable, but only if that promise is not also returning a promise.</li>
 * <li>Many corner cases required by the Promises/A+ specification are not handled. When interoperating using 
 * reasonable implementations, you may never run into this, but Promises/A+ has detailed rules for things like ##then() 
 * methods implemented as dynamic getter and returning a new value on each invocation or throwing exceptions. If you need 
 * a water-proof implementation, you need to use the complete implementation in Minified's full package.</li></ol>
 */
/*$
 * @stop
 */
		

///#/snippet  webDocs
	

