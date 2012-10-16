/*
 * Minified.js - Complete library for JavaScript interaction in less than 4kb
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * 
 * Contains code based on https://github.com/douglascrockford/JSON-js (also Public Domain).
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
 * - @configurable the block can be selected in the GUI. If the value is 'yes', it is a enabled by default.
 * - @dependency if set, the block is only used as a dependency
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

(function(_window, _document) {
	//// GLOBAL VARIABLES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var BACKSLASHB = '\\b';
	var undef;
	
    /**
	 * @id ready_vars
	 * @dependency
     */
    var DOMREADY_HANDLER = [];
    var DOMREADY_OLD_ONLOAD = _window.onload;

    /**
     * @id animation_vars
     * @dependency
     */
	var ANIMATION_HANDLERS = []; // global list of {c: <callback function>, t: <timestamp>, s:<stop function>} currently active
	var REQUEST_ANIMATION_FRAME = collect(['msR', 'webkitR', 'mozR', 'r'], function(n) { return _window[n+'equestAnimationFrame']; })[0] || function(callback) {
		delay(33, callback); // 30 fps as fallback
	};
	
	
	/**
	 * @id ie8compatibility
	 * @requires ie7compatibility 
	 * @module 9
	 * @configurable yes
	 * @doc no
	 * @name Backward-Compatibility for IE8 and similar browsers
	 * The only difference for Minified between IE8 and IE9 is the lack of support for the CSS opacity attribute in IE8.
	 */
	// @condblock ready_vars
	 var IS_PRE_IE9 = !!_document.all && !DOMREADY_HANDLER.map;
	// @condend
	 // @cond !ready_vars var IS_PRE_IE9 = !!_document.all && ![].map;
	/**
	 * @id ie7compatibility
	 * @requires ie8compatibility 
	 * @module 9
	 * @configurable yes
	 * @doc no
	 * @name Backward-Compatibility for IE7 and similar browsers
	 * The difference between IE7 and IE8 compatibility that IE7 provides neither native selector support (querySelectorAll) nor native JSON.
	 * Disabling IE6 and IE7 will not only make Minified smaller, but give you full CSS selectors and complete JSON support. 
	 */
    // @condblock ucode
	var STRING_SUBSTITUTIONS = {    // table of character substitutions
            '\t': '\\t',
            '\r': '\\r',
            '\n': '\\n',
            '"' : '\\"',
            '\\': '\\\\'
        };
    // @condend

	/**
	 * @id ie6compatibility
	 * @requires ie7compatibility 
	 * @module 9
	 * @configurable yes
	 * @doc no
	 * @name Backward-Compatibility for IE6 and similar browsers
	 * The only difference for Minified between IE6 and IE7 is the lack of a native XmlHttpRequest in IE6 which makes the library a tiny 
	 * little bit larger.
	 */

	/**
	 * @id fadeslide
	 * @requires animate set 
	 * @module 7
	 * @configurable yes
	 * @doc no
	 * @name Support for $$fade and $$slide
	 */
	/**
	 * @stop
	 */

	//// GLOBAL FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function toString(s) { // wrapper for Closure optimization
		return s!=null ? ''+s : '';
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
	function isNode(n) {
		return n.nodeType;
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
			if (!filterFunc||filterFunc(node,index))
				r.push(node);
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
	function replace(s, regexp, sub) {
		return toString(s).replace(regexp, sub||'');
	}
	function delay(delayMs, f) {
		var id = delayMs ? _window.setTimeout(f, delayMs) : f();
 		return function() { if(delayMs) _window.clearTimeout(id); };
	}
	function toNumWithoutUnit(v) {
		return parseFloat(replace(v, /[^\d.-]/g));
	}
	
	function getNaturalHeight(element) {
		var elstyle = element.style;
		var oldStyles = {$position: elstyle.position, $visibility: elstyle.visibility, $display: elstyle.display};
		$(element).set({$position: 'absolute', $visibility: 'hidden', $display: 'block', $height: null});
		var h = element.offsetHeight;
		$(element).set(oldStyles);
		return h;
	}

	// careful: only works with simple names (no camel case / hyphens)
	function getEffectiveStyle(element, name) {
		var s = element.style[name];
		if (s != null)
			return s;
		// @condblock ie8compatibility 
		else if (!_window.getComputedStyle)
			return element.currentStyle[name];
		// @condend
		else 
			return _window.getComputedStyle(element).getPropertyValue(name);
	}

    function now() {
    	return new Date().getTime();
    }

    // for ready()
    function triggerDomReady() {
    	each(DOMREADY_HANDLER, function(e) {e();});
    	DOMREADY_HANDLER = null;
    }
    
    function ready(handler) {
    	// @cond debug if (typeof handler != 'function') error("First argument must be a function");
    	if (DOMREADY_HANDLER) // if DOM ready, call immediately
			DOMREADY_HANDLER.push(handler);
		else
			delay(1, handler);
    }
    
    /**
	 * @id ucode
	 * @dependency
     */
    // @condblock ie7compatibility
    function ucode(a) {
        return STRING_SUBSTITUTIONS[a] ||  ('\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4));
    }
    // @condend

    
	/**
	 * @id dollar
	 * @module 1
	 * @requires dollarraw addelementlistfuncsstart
	 * @dependency yes
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
	
	/**
	 * @id debug
	 * @module 9
	 * @configurable no
	 * @doc no
	 * @name Debugging Support
	 */
	function error(msg) {
		if (_window.console) console.log(msg);
		throw Exception("MINI debug error: " + msg);
	}
    // @cond debug MINI['debug'] = true;
	
  
    /**
     * @id dollarraw
     * @requires 
     * @dependency yes
     */
    function dollarRaw(selector, context, childOnly) { 
		var parent, steps, dotPos, subSelectors;
		var elements, regexpFilter, useGEbC, className, elementName, reg;

		function filterElements(list) {
			var retList = collect(list, function(l){return l;}); // flatten list, remove nulls
			if (!parent)
				return retList;
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
	
    
    /**
     * @id addelementlistfuncsstart
     * @requires addelementlistfuncend
     * @dependency yes
     */
	function M(list) {
		for (var i = 0; i < list.length; i++)
			this[i] = list[i];

		this['length'] = list.length;
		
		/**
		 * @id listraw
		 * @module 1
		 * @requires dollar
		 * @name list.raw
		 * @syntax raw
		 * Returns the creation object of this list, either an Array, a NodeList or another MINI list. 
		 * This is mostly useful after calling filter(), as only then it is guaranteed to be an Array.
		 * @example
		 * <pre>
		 * $($('.myElement').filter().raw.slice(1, 3)).addClass('secondOrThird'); 
		 * </pre>
		 */
		this['raw'] = list;
		
		/**
		 * @id listlength
		 * @module 1
		 * @requires dollar
		 * @name list.length
		 * @syntax length
		 * Contains the number of elements in the list.
		 * 
		 * @example
		 * <pre>
		 * var list = $('input');
		 * var myValues = {};
		 * for (var i = 0; i < list.length; i++)
		 *    myValues[list[i].ame] = list[i].value;
		 * </pre>
		 */
		// empty, always defined above
		

	    /**
	     * @id addelementlistfuncend
	     * @dependency yes
	     */
	}
	
	//// LIST FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	each({
    /**
     * @id each
     * @module 1
     * @requires dollar
     * @configurable yes
     * @name list.each()
     * @syntax each(callback)
     * Invokes the given function once for each item in the list. The function will be calles with the item as first parameter and the zero-based index as second.
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
		each(this.raw, callback); // use list, as a real Array may be faster
		return this;
	},
	
	/**
	 * @id filter
	 * @module 1
	 * @requires dollar
	 * @configurable yes
	 * @name list.filter()
	 * @syntax filter(filterFunc)
	 * Creates a new list that contains only those items approved by the given function. The function is called once for each item. 
	 * If it returns true, the item is in the returned list, otherwise it will be removed.
	 * This function also guarantees that the returned list is always based on an Array and thus its raw property has access to all
	 * Array functions.
	 *
	 * @example Creates a list of all unchecked checkboxes.
	 * <pre>
	 * var list = $('input').filter(function(item) {
	 *     return item.getAttribute('type') == 'checkbox' && item.checked;
	 * });
	 * </pre>
	 * 
	 * @example Converts a list to an Array-based list and uses the function Array.slice() to select only the second and third elements. Note that the Array returned by slice()
	 *               is a new Array object and does not contain addClass(), so the new Array must be converted to a MINI list using $() first.
	 * <pre>
	 * $($('.myElement').filter().raw.slice(1, 3)).addClass('secondOrThird'); 
	 * </pre>
	 *
	 * @param filterFunc optional the callback function(item, index) to invoke for each item with the item as first argument and the 0-based index as second argument.  
	 *        If the function returns false for an item, it is not included in the resulting list. If you omit the callback (or use null), filter() returns a new Array-based list that is a shallow copy
	 *        of the original.
	 * @return the new list, always guaranteed to be based on Array and always a new instance
	 */
	'filter': function(filterFunc) {
	    return new M(filter(this.raw, filterFunc));
	},
	
	/** 
     * @id collect 
     * @module 1 
     * @requires dollar 
     * @configurable yes 
     * @name list.collect() 
     * @syntax collect(collectFunc) 
     * @syntax collect(collectFunc, resultList) 
     * Creates a new list from the current list using given callback function. 
     * The callback is invoked once for each element of the current 
     * list. The callback results will be appended either to the given resultList, or to 
     * a new array. The callback can return 
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
     * @param resultList optional if given, an array to append the elements to. collect() will use push() to add them. 
     * If omitted, a new array-based list will be created. 
     * @return the new list. If resultList has been omitted, the result is guaranteed to be based 
     * on Array and always a new instance 
     */ 
	'collect': function(collectFunc, resultList) { 
    	 return new M(collect(this.raw, collectFunc, resultList)); 
     },
	
     /** 
      * @id sub
      * @module 1 
      * @requires filter 
      * @configurable yes 
      * @name list.sub() 
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
 		var s = startIndex < 0 ? this.length+startIndex : startIndex;
 		var e = endIndex == null ? this.length : endIndex >= 0 ? endIndex : this.length+endIndex;
 		return this.filter(function(o, index) { return index >= s && index < e; });
 	},
 	
     
    /** 
     * @id find 
     * @module 1 
     * @requires
     * @configurable yes 
     * @name list.find() 
     * @syntax find(findFunc) 
     * Allows you to find a specific value in the list. To do this, find() calls the given function for each list element until the function returns a value that is not null or undefined.
     * This value will be returned.
     *
     * @example Goes through the elements to find the first div that has the class 'myClass', and returns this element:
     * <pre> 
     * var myClassElement = $('div').find(function(e) { if (/\bmyClass\b/.test(e.className)) return true; });
     * </pre> 
     * 
     * @param findFunc the callback function(item) that will be invoked for every list item until it returns a non-null value.
     * @return the true value returned by the callback function, or undefined it it never returned a valid value.
     */ 
	'find': function(findFunc) {
		var list = this, r;
		for (var i = 0; i < list.length; i++)
			if ((r = findFunc(list[i], i)) != null)
				return r;
	},
	
    /** 
     * @id hasclass 
     * @module 1 
     * @requires find
     * @configurable yes 
     * @name list.hasClass() 
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
		var regexp = new RegExp(BACKSLASHB +  name + BACKSLASHB)
		return this.find(function(e) { return regexp.test(e.className) ? e : null; });
	},
	
	/**
	 * @id listremove
	 * @module 1
	 * @requires dollar each
	 * @configurable yes
	 * @name list.remove()
	 * @syntax remove()
	 * Removes all nodes of the list from the DOM tree.
	 * 
	 * @example Removes the element with the id 'myContainer', including all children, from the DOM tree.
	 * <pre>
	 * $('#myContainer').remove(); 
	 * </pre>
	 */
     'remove': function() {
    	this.each(function(obj) {obj.parentNode.removeChild(obj);});
     },
	
    

	/**
	 * @id set
	 * @module 1
	 * @requires dollar each
	 * @configurable yes
	 * @name list.set()
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
	 * @param defaultFunction optional if set and no function is provided as value, this function will be invoked for each list element 
	 *                                 and property to determine the value. The function is called with with the old value as first 
	 *                                 argument and the index in the list as second. The third value is the new value specified
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
    			 self.set({$visibility: (v = toNumWithoutUnit(value)) > 0 ? 'visible' : 'hidden', $display: 'block'})
    			     .set((name == '$$fade')  ? (
    			 // @condblock ie8compatibility 
    			    	  IS_PRE_IE9 ? {$filter: 'alpha(opacity = '+(100*v)+')', $zoom: 1} :
    			 // @condend
    			    	  {$opacity: v})
    			        :
    			        {$height: /px$/.test(value) ? value : function(oldValue, idx, element) { return v * (v && getNaturalHeight(element))  + 'px';},
    			         $overflow: 'hidden'}
 					);
    		 }
    		 else
    			// @condend
    			 self.each(function(obj, c) {
    				 var f = isFunction(value) ? value : defaultFunction;
    				 var nameClean = replace(name, /^[@$]/);
    				 var isAttr = /^@/.test(name);
    				 var className = obj.className || '';
    				 var newObj = /^\$/.test(name) ? obj.style : obj;
    				 var newValue = f ? f(name == '$' ? className : isAttr ? newObj.getAttribute(nameClean) : newObj[nameClean], c, obj, value) : value;
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
    				 else if (!isAttr)
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
 	
	/**
	 * @id append
	 * @module 1
	 * @requires set
	 * @configurable yes
	 * @name append()
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

	/**
	 * @id prepend
	 * @module 1
	 * @requires set
	 * @configurable yes
	 * @name prepend()
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

	
	/**
	 * @id listadd
	 * @module 2
	 * @requires dollar each
	 * @configurable yes
	 * @name list.add()
	 * @syntax MINI(selector).add(text)
	 * @syntax MINI(selector).add(callbackFunction)
	 * @syntax MINI(selector).add(elementContent)
	 * Adds the given node(s) as content to the list elements as additional nodes. If a string has been given, it will be added as text node to all elements.
	 * If you pass an element or a list, it will be added <strong>only to the first element of the list</strong>. In order to add elements
	 * to several list items, you need to pass a factory function(element, index) thats creates new instances for each item. 
	 * The function will be invoked for each element and may return either a string for a text node, a simple HTML element or a list containing both. 
	 *
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
	 * @example If you need to add an element or a list to more than one element, you need to provide a factory function:
	 * <pre>
	 * $('.chapter').add(function(e, index) { return EE('div', 'Scroll down for the next chapter.'); });
	 * </pre>
	 *
	 * @param text a text to add as text node of the list elements
	 * @param callbackFunction a function that will be invoked for each list element to determine its content. The function can return either a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements.
	 * @param elementContent content to add <strong>only to the first element</strong> of the list. The content can be a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements.
	 * @return the current list
	 */
	'add': function (children, addFunction) {
		return this.each(function(e, index) {
			var lastAdded;
			(function appendChildren(c) {
				if (isList(c))
					each(c, appendChildren);
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
			})(isFunction(children) ? children(e, index) : (children == null || isNode(children) || isList(children)) && index ? null : children);
		});
	},

	
	/**
	 * @id listfill
	 * @module 2
	 * @requires dollar each
	 * @configurable yes
	 * @name list.fill()
	 * @syntax MINI(selector).fill()
	 * @syntax MINI(selector).fill(text)
	 * @syntax MINI(selector).fill(callbackFunction)
	 * @syntax MINI(selector).fill(elementContent)
	 * Sets the content of the list elements, replacing old content. If a string has been given, it will be added as text node to all elements.
	 * If you pass an element or a list, it will be added <strong>only to the first element of the list</strong>. In order to add elements
	 * to several list items, you need to pass a factory function(element, index) thats creates new instances for each item. 
	 * The function will be invoked for each element and may return either a string for a text node, a simple HTML element or a list containing both. 
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
	 * @example Pass an element to replace the old content with that. Note that an element can only be added to the first match:
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
	 * @example If you need to add your list to more than one element, you must add a factory function that re-creates
	 *              the list for every instance:
	 * <pre>
	 * $('.listContainers').fill(function(e, index) { return [EE('h2', 'List Number '+index), EE('ol', [EE('li', 'First Item'), EE('li', 'Second Item'), EE('li', 'Third Item')])]});
	 * </pre>
	 *
	 * @example fill() without arguments deletes the content of the list elements:
	 * <pre>
	 * $('.listContainers').fill();
	 * </pre>
	 *
	 * @param text a text to set as text node of the list elements
	 * @param callbackFunction a factory function(element, index) that will be invoked for each list element to determine its content. The function can return either a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements. As parameters it receives the current list element and its 0-based index.
	 * @param elementContent content to add <strong>only to the first element</strong> of the list. The content can be a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements. Note that if you use a HTML node or an array here, it will only be added once to
	 *              this list's first match.
	 * @return the current list
	 */
	'fill': function (children) {
		return this.each(function(e) { MINI(e.childNodes).remove(); }).add(children);
	},

	/**
	 * @id listaddbefore
	 * @module 2
	 * @requires dollar
	 * @configurable yes
	 * @name list.addBefore()
	 * @syntax MINI(selector).addBefore(text)
	 * @syntax MINI(selector).addBefore(callbackFunction)
	 * @syntax MINI(selector).addBefore(elementContent)
	 * Inserts the given text or element(s) as sibling in front of each element of this list. If a string has been given, it will be added as text node.
	 * If you pass an element or a list, it will be inserted <strong>only in front of the first element of the list</strong>. In order to add elements
	 * to several list items, you need to pass a factory function(element, index) thats creates new instances for each item. 
	 * The function will be invoked for each element and may return either a string for a text node, a simple HTML element or a list containing both. 
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
	 * @example You can also pass an element, but note that a node can only be added once to the first list item, even if the list has more than one item:
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
	 * @example Lists of elements and nodes are possible as well. Like nodes, it will only be added to the first list item.
	 * <pre>
	 * $('#status').addBefore([EE('hr'), 'WARNING']);
	 * </pre>
	 *
	 * @example If you need to add your list to more than one list item, you must add a factory function that re-creates
	 *              the list for every instance:
	 * <pre>
	 * $('.textSnippets').addBefore(function(e, index) { return [EE('hr'), 'WARNING']; });
	 * </pre>
	 *
	 * @param text a text to insert as text node in front of the list elements
	 * @param callbackFunction a factory function(element, index) that will be invoked for each list element to determine its content. The function can return either a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements. As parameters it receives the current list element and its 0-based index.
	 * @param elementContent content to insert in front of <strong>the first element</strong> of the list. The content can be a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements. Note that if you use a HTML node or an array here, it will only be added once to
	 *              this list's first match.
	 * @return the current list
	 */
	'addBefore': function (children) {
		return this.add(children, function(newNode, refNode, parent) { parent.insertBefore(newNode, refNode); });
	},
	
	/**
	 * @id listaddafter
	 * @module 2
	 * @requires dollar
	 * @configurable yes
	 * @name list.addAfter()
	 * @syntax MINI(selector).addAfter(text)
	 * @syntax MINI(selector).addAfter(callbackFunction)
	 * @syntax MINI(selector).addAfter(elementContent)
	 * Inserts the given text or element(s) as sibling after each element of this list. If a string has been given, it will be added as text node.
	 * If you pass an element or a list, it will be inserted <strong>only after of the first element of the list</strong>. In order to add elements
	 * to several list items, you need to pass a factory function(element, index) thats creates new instances for each item. 
	 * The function will be invoked for each element and may return either a string for a text node, a simple HTML element or a list containing both. 
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
	 * @example You can also pass an element, but note that a node can only be added once to the first list item, even if the list has more than one item:
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
	 * @example Lists of elements and nodes are possible as well. Like nodes, it will only be added to the first list item.
	 * <pre>
	 * $('#status').addAfter([EE('hr'), 'Disclaimer']);
	 * </pre>
	 *
	 * @example If you need to add your list to more than one list item, you must add a factory function that re-creates
	 *              the list for every instance:
	 * <pre>
	 * $('.textSnippets').addAfter(function(e, index) { return [EE('hr'), 'Disclaimer']; });
	 * </pre>
	 *
	 * @param text a text to insert as sibling text node after of the list elements
	 * @param callbackFunction a factory function(element, index) that will be invoked for each list element to determine its content. The function can return either a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements. As parameters it receives the current list element and its 0-based index.
	 * @param elementContent content to insert <strong>only after the first element</strong> of the list. The content can be a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements. Note that if you use a HTML node or an array here, it will only be added once to
	 *              this list's first match.
	 * @return the current list
	 */
	'addAfter': function (children) {
		return this.add(children, function(newNode, refNode, parent) { parent.insertBefore(newNode, refNode.nextSibling); });
	},
	
	/**
	 * @id listaddfront
	 * @module 2
	 * @requires dollar
	 * @configurable yes
	 * @name list.addFront()
	 * @syntax MINI(selector).addFront(text)
	 * @syntax MINI(selector).addFront(callbackFunction)
	 * @syntax MINI(selector).addFront(elementContent)
	 * Adds the given node(s) as content to the list elements as additional nodes. Unlike add(), the new nodes will be the first children of the list items.
	 * If a string has been given, it will be added as text node to all elements.
	 * If you pass an element or a list, it will be added <strong>only to the first element of the list</strong>. In order to add elements
	 * to several list items, you need to pass a factory function(element, index) thats creates new instances for each item. 
	 * The function will be invoked for each element and may return either a string for a text node, a simple HTML element or a list containing both. 
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
	 * @example If you need to add an element or a list to more than one element, you need to provide a factory function:
	 * <pre>
	 * $('.chapter').addFront(function(e, index) { return EE('div', 'Scroll down for the next chapter.'); });
	 * </pre>
	 *
	 * @param text a text to add as text node of the list elements
	 * @param callbackFunction a function that will be invoked for each list element to determine its content. The function can return either a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements.
	 * @param elementContent content to add <strong>only to the first element</strong> of the list. The content can be a string for a text node,
	 *              an HTML element or a list containing strings and/or HTML elements.
	 * @return the current list
	 */
	'addFront': function (children) {
		return this.add(children, function(newNode, refNode) { refNode.insertBefore(newNode, refNode.firstChild); });
	},
	
	/**
	 * @id listreplace
	 * @module 2
	 * @requires dollar
	 * @configurable yes
	 * @name list.replace()
	 * @syntax MINI(selector).replace(text)
	 * @syntax MINI(selector).replace(callbackFunction)
	 * @syntax MINI(selector).replace(elementContent)
	 * Replaces the list items with the the given node(s) in the DOM tree. 
	 * If a string has been given, each list item will be replaced with a new text node containing the string.
	 * If you pass an element or a list, it will replace <strong>only the first element of the list</strong>. In order to replace 
	 * several list items with content more complex than a string, you need to pass a factory function(element, index) thats creates new instances for each item. 
	 * The function will be invoked for each element and may return either a string for a text node, a simple HTML element or a list containing both. 
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
	 * The following JavaScript will replace <strong>only the first &lt;li> element</strong>:
	 * <pre>
	 * $('#myList li').replace(EE('li', 'My extra point'));
	 * </pre>
	 * This results in
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>My extra point&lt;/li>
	 *   &lt;li>Second list entry&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 *
	 * @example If you need to replace several elements at once, you need to provide a factory function
	 * <pre>
	 * $('#myList li').replace(function(e, index) { return EE('li', 'My extra point'); });
	 * </pre>
	 * With the previous HTML would result in:
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>My extra point&lt;/li>
	 *   &lt;li>My extra point&lt;/li>
	 * &lt;/ul>
	 * </pre>
	 *
	 * @example Use a list to add several elements at once:
	 * <pre>
	 * $('#myList li').replace(function(e, index) { return [EE('li', 'Extra point 1'), EE('li', 'Extra point 2')]; });
	 * </pre>
	 * Now every original &lt;li> element is replaced with two elements:
	 * <pre>
	 * &lt;ul id="myList">
	 *   &lt;li>Extra point 1&lt;/li>
	 *   &lt;li>Extra point 2&lt;/li>
	 *   &lt;li>Extra point 1&lt;/li>
	 *   &lt;li>Extra point 2&lt;/li>
	 * &lt;/ul>
	 * </pre>
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

	
	/**
	 * @id animate
	 * @module 7
	 * @requires loop dollar each set
	 * @configurable yes
	 * @name list.animate()
	 * @syntax MINI(selector).animate(properties)
	 * @syntax MINI(selector).animate(properties, durationMs)
	 * @syntax MINI(selector).animate(properties, durationMs, linearity)
	 * @syntax MINI(selector).animate(properties, durationMs, linearity, callback)
	 * @shortcut $(selector).animate(properties, durationMs, linearity, callback) - Enabled by default, but can be disabled in the builder.
	 * Animates the items of the list by modifying their properties, CSS styles and attributes. animate() can work with numbers, strings that contain exactly one
	 * number and which may also contain units or other text, and with colors in the CSS notations 'rgb(r,g,b)', '#rrggbb' or '#rgb'.
	 *
	 * When you invoke the function, it will first read all old values from the object and extract their numbers and colors. These start values will be compared to 
	 * the destination values that have been specified in the given properties. Then animate() will create a background task using MINI.loop() that will update the 
	 * specified properties in frequent intervals so that they transition to their destination values.
	 *
	 * The start values will be read using the elements' style properties. Therefore it is important that you either set the start values directly in the elements'
	 * style attribute, or set them yourself before you start the animation. Styles inherited from CSS definitions will not provide correct start values!
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
	 * To allow more complex animation, animate() allows you to add a callback which will be called when the animation has finished. You can also specify a delay
	 * to create timelines.
	 *
	 * @example Move an element. Note that you need to set the initial value for styles, unless they have been explicitly set
	 * for the HTML element using the style attribute before or you set it earlier with an earlier set() or animate() invocation.
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
	 * @example Fade-out effect. Note that $$fade does not require an initial value, it will automatically determine the element's initial visibility.
	 * <pre>
	 * $('#myFadingDiv').animate({$$fade: 0}, 1000);
	 * </pre>
	 * 
 	 * @example Slide-in effect. Note that $$slide does not require an initial value, it will automatically determine the element's initial visibility.
	 * <pre>
	 * $('#myInvisibleDiv').animate({$$slide: 1}, 1000);
	 * </pre>
	 *
	 * @example Chained animation using callbacks. The element is first moved to the position 200/0, then to 200/200, and finally to 100/100.
	 * <pre>
	 * $('#myMovingDiv').set({$left: '0px', $top: '0px'})
	 *                  .animate({$left: '200px', $top: '0px'}, 600, 0, function(list) {
	 *         list.animate({$left: '200px', $top: '200px'}, 800, 0, function(list) {
	 *                list.animate({$left: '100px', $top: '100px'}, 400);
	 *         });
	 * });
	 * </pre>
	 *
	 * @example Does same as the previous example, but implemented using delays:
	 * <pre>
	 * $('#myMovingDiv').set({$left: '0px', $top: '0px'})
	 *                  .animate({$left: '200px', $top: '0px'}, 600)
	 *                  .animate({$left: '200px', $top: '200px'}, 800, 0, null, 600)
	 *                  .animate({$left: '100px', $top: '100px'}, 400), 0, null, 600+800);
	 * </pre>
	 *
	 * @example Three block race to the position 500px with delayed start:
	 * <pre>
	 * $('#racingDiv1').set({$left: '0px'}).animate({$left: '500px'}, 750, 0, null, 250); // waits 250ms, then needs 750ms
	 * $('#racingDiv2').set({$left: '0px'}).animate({$left: '500px'}, 900, 1);            // starts immediately, linear motion, then needs 900ms
	 * $('#racingDiv3').set({$left: '0px'}).animate({$left: '500px'}, 500, 0, null, 300); // waits 200ms, then needs 500ms
	 * </pre>
	 *
	 * @param properties a property map describing the end values of the corresponding properties. The names can use the
	 *                   set() syntax ('@' prefix for attributes, '$' for styles, '$$fade' for fading and '$$slide' for slide effects). 
	 *                   Values must be either numbers, numbers with units (e.g. "2 px") or colors ('rgb(r,g,b)', '#rrggbb' or '#rgb'). 
	 *                   The properties will be set for all elements of the list.
	 * @param durationMs optional the duration of the animation in milliseconds. Default: 500ms.
	 * @param linearity optional defines whether the animation should be linear (1), very smooth (0) or something in between. Default: 0.
	 * @param callback optional if given, this function(list) will be invoked the list as parameter when the animation finished
	 * @param delayMs optional if set, the animation will be delayed by the given time in milliseconds. Default: 0.
	 * @param state optional if set, the animation will write information about is state in this object. As soon as the animation starts (after the delay),
	 *                       it will write a MINI.loop() stop() function in the property state.stop and set state.time to the milliseconds that have
	 *                       passed from the start until the last invocation of the animation loop, describing the progress of the animation. When the function
	 *                       has a delay, state.time will return 0 during the delay.
	 *                       If the animation finished, it will write null to state.time. state.stop will remain unmodified after the animation end. 
	 * @return the list
	 */
	'animate': function (properties, durationMs, linearity, callback, delayMs, state) {
		// @cond debug if (!properties || typeof properties == 'string') error('First parameter must be a map of properties (e.g. "{top: 0, left: 0}") ');
		// @cond debug if (linearity < 0 || linearity > 1) error('Third parameter must be at least 0 and not larger than 1.');
		// @cond debug if (callback || typeof callback == 'function') error('Fourth is optional, but if set it must be a callback function.');
		// @cond debug var colorRegexp = /^(rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|#\w{3}|#\w{6})\s*$/i;
		function replaceValue(originalValue, newNumber) {
			return replace(originalValue, /-?[\d.]+/, newNumber);
		}
		var self = this;
		var initState = []; // for each item contains a map {s:{}, e:{}, o} s/e are property name -> startValue of start/end. The item is in o.
		var delayStop, loopStop;
		state = state || {};
		state['time'] = 0;
		state['stop'] = function() { if (delayStop) delayStop(); if (loopStop) loopStop(); };
		delayStop = delay(delayMs, function() {
			durationMs = durationMs || 500;
			linearity = linearity || 0;
			
			// find start values
			self.each(function(li) {
				var p = {o:MINI(li), s:{}, e:{}}; 
				each(properties, function(name) {
					var start, dest = properties[name], listyle = li.style;
					var nameClean = replace(name, /^[@$]/);
					// @condblock fadeslide
					var isHidden = getEffectiveStyle(li, 'visibility') == 'hidden' || getEffectiveStyle(li, 'display') == 'none';
					if (name == '$$fade') {
						start = isNaN(start = isHidden ? 0 :
					// @condblock ie8compatibility
							          IS_PRE_IE9 ? toNumWithoutUnit(listyle.filter)/100 :
					// @condend
							          parseFloat(listyle.opacity) 
							         ) ? 1 : start;
					}
					else if (name == '$$slide') {
						start = (isHidden ? 0 : li.offsetHeight) + 'px';
						dest = dest*getNaturalHeight(li) + 'px';
					}
					else {
						// @condend
						start = /^@/.test(name)? li.getAttribute(nameClean) : (/^\$/.test(name) ? listyle : li)[nameClean] || 0;
						// @cond debug if (!colorRegexp.test(dest) && isNan(toNumWithoutUnit(dest))) error('End value of "'+name+'" is neither color nor number: ' + toString(dest));
						// @cond debug if (!colorRegexp.test(p.s[name]) && isNan(toNumWithoutUnit(p.s[name]))) error('Start value of "'+name+'" is neither color nor number: ' + toString(p.s[name]));
						// @cond debug if (colorRegexp.test(dest) && !colorRegexp.test(p.s[name])) error('End value of "'+name+'" looks like a color, but start value does not: ' + toString(p.s[name]));
						// @cond debug if (colorRegexp.test(p.s[name]) && !colorRegexp.test(dest)) error('Start value of "'+name+'" looks like a color, but end value does not: ' + toString(dest));
					// @condblock fadeslide
					}
					// @condend
					p.s[name] = start;
					p.e[name] = /^[+-]=/.test(dest) ?
							replaceValue(dest.substr(2), toNumWithoutUnit(start) + toNumWithoutUnit(replace(dest, /\+?=/))) 
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
					if (callback) 
						callback(self);
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
								newValue = replaceValue(end, interpolate(toNumWithoutUnit(start), toNumWithoutUnit(end)));
							isi.o.set(name, newValue);
						});
					});
				});
			});
			return self;		
		},
		
		/**
		 * @id toggle
		 * @module 7
		 * @requires animate set
		 * @configurable yes
		 * @name list.toggle()
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
		 * @example There is a shortcut for toggling CSS classes. Just list them unprefixed, space-separated in a string:
		 * <pre>
		 * var t = $('#myElement').toggle('myClass1 myClass2');
		 * </pre>
		 * 
		 * @param cssClasses a string containing space-separated CSS class names that will be toggled. For the initial state, the classes will be
		 *                   removed. For the second state, the classes will be added.
		 * @param state1 a property map describing the initial state of the properties. The properties will automatically be set when the
		 *                   toggle() function is created. The property names use the set() syntax ('@' prefix for attributes, '$' for styles). 
		 *                   For animation, values must be either numbers, numbers with
		 *                   units (e.g. "2 px") or colors ('rgb(r,g,b)', '#rrggbb' or '#rgb'). The properties will be set 
		 *                   for all elements of the list.
		 * @param state2 a property map describing the second state of the properties. Uses set() syntax, like the other state. 
		 * @param durationMs optional if set, the duration of the animation in milliseconds. By default, there is no animation and the set will be changed
		 *                   immediately.
		 * @param linearity optional defines whether the animation should be linear (1), very smooth (0) or something in between. Default: 0. Ignored if durationMs is 0.
		 * @param delayMs optional defines an optional delay before the animation starts. Default: 0. Ignored if durationMs is 0.
		 * @return a function(newState) that will change from the first to the second state and vice versa if called without argument or with
		 *         newState set to null. If the argument is a boolean false or true, the first or second state will be set respectively. 
		 *         If the argument is not boolean or the function is called without arguments, the function toggles between both states. 
		 */
		'toggle': function(state1, state2, durationMs, linearity, delayMs) {
			var animState = {};
			var state = false, stop, regexg = /\b(?=\w)/g;
			var self = this;

			return isString(state1) && !state2 ?
				self.toggle(replace(state1, regexg, '-'), replace(state1, regexg, '+')) :			
				self.set(state1) && 
			    function(newState) {
					if (newState === state) 
						return;
					state = isType(newState, 'boolean') ? newState : !state;
	
					if (stop) 
						stop();
					stop = delay(delayMs, function() {
						if (durationMs) 
							self.animate(state ? state2 : state1, animState.stop ? (animState.stop() || animState.time) : durationMs, linearity, null, 0, animState);
						else
							self.set(state ? state2 : state1); 
						stop=null; 
					});
				};
		},

		/**
		 * @id wire
		 * @module 7
		 * @requires toggle liston each set
		 * @configurable yes
		 * @name list.wire()
		 * @syntax MINI(selector).wire(events, toggles)
		 * @shortcut $(selector).wire(events, toggles) - Enabled by default, but can be disabled in the builder.
		 * 
		 * Sets up events that will trigger the given toggles.
		 *
 	     * The first arguments sets up which kind of events will trigger the toggles in what way. There are two ways to specify the events:
 	     * <ul>
 	     * <li>A simple string in the form "eventtype +eventtype -eventtype" adds the space-separated event handlers for each list member. Non-prefixed
 	     *     event types toggle. If prefixed with + or -, they will put the toggles in the first or second state.
 	     * <li>A map allows you to add events to more than one element. They map key specifies the selector to find the element. The map value specifies the
 	     *     events in the form described above.
 	     * </ul>
 	     * 
 	     * The second argument describes the toggles that are controlled by the events. If you pass a simple toggle function or a list of toggle function,
 	     * they will be simply called. You can also specify an array of parameters to the toggle() function to create new toggles for each list member.
 	     * The most powerful form of argument is a map containing selectors as first and toggle() arrays as values. This will set up new toggles for each
 	     * list member.
 	     * 
 	     * The selectors given in the event and toggle maps are always executed in the context of the current list elements, unless they start with a '#'. In
 	     * the latter case, they will be executes in the document context. If you pass a 0 (or any other value evaluating to false), the value applies to the list
 	     * member itself.
		 *
		 * @example Wires the list members to change the text color of the element 'colorChanger' on click:
		 * <pre>
		 * var tog = $('#colorChanger').toggle({$color: 'red'}, {$color: 'blue'});
		 * $('.clicky').wire('click', tog);
		 * </pre>
		 * 
		 * @example Wires the list members to change their own text color on click:
		 * <pre>
		 * $('.clicky').wire('click', [{$color: 'red'}, {$color: 'blue'}]);
		 * </pre>
		 * 
		 * @example Wires the list members to change their own text color to blue on mouseover and red otherwise:
		 * <pre>
		 * $('.mouseovers').wire('-mouseout +mouseover', [{$color: 'red'}, {$color: 'blue'}]);
		 * </pre>
		 * 
		 * @example Same mouse over effect as in the previous example, but wires element '#allBlueButton' to change the color of all elements to blue on click:
		 * <pre>
		 * $('.mouseovers').wire({'': '-mouseout +mouseover', '#allBlueButton': '+click'} 
		 *                   [{$color: 'red'}, {$color: 'blue'}]);
		 * </pre>
		 * 
		 * @example Wires a dropdown menu.
		 * <pre>
		 * $('.dropdown').wire({'.head': 'click', '.closeButton': '-click'} , [{$: '-shown'}, {$: '+shown'}]);
		 * </pre>
		 * 
		 * @param events 
		 * @param toggles
		 * @return the list
		 */
	    'wire': function(events, toggles) {
	    	return this.each(function(li) {
	    		function select(selector) {
	    			return MINI(selector||li, (selector && !/^#/.test(selector))?li:undef);
	    		}
	    		function toggleFunc(selector, args) { 
	    			return isFunction(args) ? [toggles] :
						isString(args) ? [select(selector).toggle(args)] :
						isList(args) ? (isFunction(args[0]) ? args : [M.prototype.toggle.apply(select(selector), args)]) :
						collect(args, toggleFunc);
	    		}
	    		var e, toggleList = toggleFunc(null, toggles);
	    		
	    		each(isString(events) ? {'':events} : events, function(selector, eventSpec) {
	    			each(eventSpec.split(/\s+/), function(event) {
	    				select(selector).on(e = replace(event, /^[+-]/), function(v) {each(toggleList, function(toggle) {toggle(v);});}, [/^\+/.test(event) || (event==e && undef)]);
	    			});
	    		});
	    	});
	    },
	
		/**
		 * @id liston
		 * @module 5
		 * @requires dollar each
		 * @configurable yes
		 * @name list.on()
		 * @syntax MINI(selector).on(el, name, handler)
		 * @syntax MINI(selector).on(el, name, handler, args)
		 * @syntax MINI(selector).on(el, name, handler, args, fThis)
		 * @shortcut $(selector).on(el, name, handler) - Enabled by default, but can be disabled in the builder.
		 * Registers the function as event handler for all items in the list.
		 * 
		 * By default, handlers get a the original event object and minified's compatibility event object as arguments, and 'this' set to the source element
		 * of the event (e.g. the button that has been clicked). The original event object the is object given to the event or obtained 
		 * from 'window.event'. The compatibility event object has the following properties:
		 * <ul>
		 * <li><code>key</code> - the key code, if it was a key press. Will return event.keyCode if set, otherwise event.which. This should work in practically all browsers. 
		 *                                              See http://unixpapa.com/js/key.html for key code tables.</li>
		 * <li><code>right</code> - true if the right mouse button has been clicked, false otherwise. Works browser-independently.</li>
		 * <li><code>pageX</code> - the page coordinate of the event
		 * <li><code>pageY</code> - the page coordinate of the event
		 * </ul>
		 * Unless the handler returns 'true', the event will not be propagated to other handlers.
		 * 
		 * Instead of the event objects, you can also pass an array of arguments and a new value for 'this' to the event handler. When you pass arguments, the
		 * handler's return value is always ignored and the event will always be cancelled.
		 * 
		 * @example Adds a simple click handler to a button. Event objects are ignored.
		 * <pre>
		 * $('#myButton').on('click', function() {
		 *    window.alert('Button clicked!');
		 * });
		 * </pre>
		 *
		 * @example Adds a handler to all divs that paints their background color to red when clicked.
		 * <pre>
		 * $('div').on('click', function() {
		 *    this.style.backgroundColor = 'red';    // 'this' contains the element that caused the event
		 * });
		 * </pre>
		 *
		 * @example Adds an handler for mousedown events to a canvas:
		 * <pre>
		 * var ctx = $$('#myCanvas').getContext('2d');                      // get a canvas context
		 * $('#myCanvas').on('mousedown', function(evt, extraInfo) {        // add handler for mouse down events
		 *     if (extraInfo.right)                                         // right mouse button paints white, all other black
		 *         ctx.fillStyle = "white";
		 *     else
		 *         ctx.fillStyle = "black";
		 *     ctx.fillRect(evt.clientX, evt.clientY, 1, 1);                // paints a pixel at the cursor position
		 * });
		 * </pre>
		 *
		 * @param name the name of the event, e.g. 'click'. Case-sensitive. The 'on' prefix in front of the name must not used.
		 * @param handler the function(event, extraEvent) to invoke when the event has been triggered. If no arguments have been given, 
		 *                the handler gets the original event object as first parameter and the compatibility object as second. 
		 *                'this' is always the element that caused the event.
		 *                Unless the handler returns true, all further processing of the event will be stopped. 
		 *                Minified will not use directly add this handler to the element, but create a wrapper that will eventually invoke it. The wrapper 
		 *                is added to the handler in a property called '_M'.
		 * @param args optional if set an array of arguments to pass to the handler function instead of the event objects
		 * @param fThis an optional value for 'this' in the handler, as alternative to the event target
		 * @return the list
		 */
		'on': function (name, handler, args, fThis) {
			// @cond debug if (!(name && handler)) error("Both parameters to on() are required!"); 
			// @cond debug if (/^on/i.test(name)) error("The event name looks invalid. Don't use an 'on' prefix (e.g. use 'click', not 'onclick'"); 
			return this.each(function(el) {
				handler['_M'] = handler['_M'] || function(e) {
					var l = _document.documentElement, b = _document.body;
					e = e || _window.event;
					// @cond debug try {
					if (!handler.apply(fThis || e.target, args || [e, { 
							'key': e.keyCode || e.which, // http://unixpapa.com/js/key.html
							'right': e.which ? (e.which == 3) : (e.button == 2),
							'pageX': l.scrollLeft + b.scrollLeft + e.clientX,
							'pageY': l.scrollTop + b.scrollTop + e.clientY
					}]) && !args) {
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
				// @condblock ie8compatibility 
				if (el.addEventListener)
				// @condend
					el.addEventListener(name, handler['_M'], true); // W3C DOM
				// @condblock ie8compatibility 
				else 
					el.attachEvent('on'+name, handler['_M']);  // IE < 9 version
				// @condend
			});
		},
		
	/**
	 * @id listoff
	 * @module 5
	 * @requires dollar liston each
	 * @configurable yes
	 * @name list.off()
	 * @syntax MINI.off(element, name, handler)
	 * Removes the event handler. The call will be ignored if the given handler has not registered using on().
	 * 
	 * @example Adds a handler to an element
	 * <pre>
	 * function myEventHandler() {
	 *    this.style.backgroundColor = 'red';    // 'this' contains the element that caused the event
	 * }
	 * $('#myElement').on('click', myEventHandler);     // add event handler
	 *
	 * window.setInterval(function() {                      // after 5s, remove event handler
	 *    $('#myElement').off('click', myEventHandler);
	 * }, 5000);
	 * </pre>
	 * 
	 * @param name the name of the event (see on)
	 * @param handler the handler to unregister, as given to on(). It must be a handler that has previously been registered using
	 *                on().
     * @return the list
     */
	'off': function (name, handler) {
		// @cond debug if (!name || !name.substr) error("No name given or name not a string.");
		// @cond debug if (!handler || !handler['MINI']) error("No handler given or handler invalid.");
	   	return this.each(function(el) {
			// @condblock ie8compatibility 
			if (el.addEventListener)
				// @condend
				el.removeEventListener(name, handler['_M'], true); // W3C DOM
			// @condblock ie8compatibility 
			else 
				el.detachEvent('on'+name, handler['_M']);  // IE < 9 version
			// @condend
	   	});
	},
	
    /**
	 * @id serialize
	 * @module 3
	 * @requires each
	 * @configurable yes
	 * @name list.serialize()
	 * @syntax MINI().serialize()
	 * @syntax MINI().serialize(dataMap)
	 * Creates a name/value map from the given form. serialize() looks at the list's form elements and writes each element's name into the map,
	 * using the element name as key and the element's value as value. If there is more than one value with the same name, the map will contain an array
	 * of values. Form element without value will be written with 'null' as value. Form elements without name will be ignored.
	 *
	 * Serialize() will use all elements in the list that have a name, such as input, textarea and select elements. For form elements in the list, all child form
	 * elements will be serialized.
	 * 
	 * The map format returned by serialize() is exactly the format used by request().
	 * 
	 * Please note that when you include an input element more than once, for example by having the input itself and its form in the list, the
	 * value will be included twice in the list.
	 *
	 * @example Serialize a form and send it as request parameters:
	 * <pre>
	 * MINI.request('get', '/exampleService', $('#myForm').serialize(), resultHandler);
	 * </pre>
	 * 
	 * @example Serialize only some selected input fields:
	 * <pre>
	 * var data = $('#myText, input.myRadios').serialize();
	 * </pre>
	 * 
	 * @param dataMap optional an optional map to write the values into. If not given, a new empty map will be created
	 * @return a map containing name->value pairs as strings. If there is more than one value with the same name,
	 *         map value is an array of strings
	 */
	'serialize': function(data) {
		var r = data || {};
		this.each(function(el) {
			var n = el.name, v = toString(el.value), t = el.tagName, y = el.type, o=r[n];
			if (/form/i.test(t))
				MINI(el.elements).serialize(r);
			else if (n && (!/kbox|dio/i.test(y) || el.checked)) { // short for checkbox, radio
					if (isList(o))
						o.push(v);
					else
						r[n] = (o == null) ? v : [o, v];
			}
		});
		return r;
	},
	
	/**
	 * @id listoffset
	 * @module 1
	 * @requires dollar
	 * @configurable yes
	 * @name list.offset()
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
 	/**
 	 * @stop
 	 */
	}, function(n, v) {M.prototype[n]=v;});
     

 	//// MINI FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	each({
    /**
	 * @id dollardollar
	 * @module 1
	 * @requires dollarraw
	 * @configurable yes
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

		
	/**
	 * @id el
	 * @module 2
	 * @requires dollardollar set
	 * @configurable yes
	 * @name el()
	 * @syntax MINI.el(name)
	 * @syntax MINI.el(name, attributes)
	 * @syntax MINI.el(name, children)
	 * @syntax MINI.el(name, attributes, children)
	 * @shortcul EE(name, attributes, children)
	 * Creates a new HTML element, optionally with attributes and children, and returns a list containing the DOM HTMLElement.
	 * Typically the return value is inserted into the DOM tree using add() or a similar function. 
	 *
	 * By default, Minified creates a shortcut called EE for this function.
	 *
	 * The function is namespace-aware and will create XHTML nodes if called in an XHTML document.
	 * 
	 * @example Creating a simple &lt;span> element with some text:
	 * <pre>
	 * var mySpan = EE('span', 'Hello World'); 
	 * </pre>
	 * creates this:
	 * <pre>
	 *  &lt;span>Hello World&lt;/span> 
	 * </pre>
	 * @example Creating a &lt;span> element with style, some text, and append it to the element with the id 'greetingsDiv':
	 * <pre>
	 * $('greetingsDiv').add(EE('span', {'@title': 'Greetings'}, 'Hello World')); 
	 * </pre>
	 * creates this:
	 * <pre>
	 *  &lt;span title="Greetings">Hello World&lt;/span> 
	 * </pre>
	 * 
	 * @example The function always returns a MINI list with a single element. You can directly use it, for example,
	 *          to add an event handler.
	 * <pre>
	 * var myDiv =EE('div', 'Hello World');
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
	 * @example Modify an existing element by specifying it instead of the name. Attributes will be added,
	 *          if children are specified the old ones will be replaced.
	 * <pre>
	 * EE(myOldSpan, {'@title':'Some text', $color: "red"}, "The new text");
	 * </pre>
	 * 
	 * @param e the element name to create (e.g. 'div')
	 * @param attributes optional an object which contains a map of attributes and other values. The syntax is exactly like set(): Attribute values are prefixed with '@',
	 *                   CSS styles with '$' and regular properties can be set without prefix.
	 *                   If the attribute value is null, the attribute will omitted (styles and properties can be set to null). 
	 *                   In order to stay compatible with Internet Explorer 7 and earlier, you should not set the attributes '@class' and '@style'. Instead
	 *                   set the property 'className' instead of '@class' and set styles using the '$' syntax.
	 * @param children optional  an element or a list of elements to add as children. Strings will be converted as text nodes. Lists can be 
	 *                         nested and will then automatically be flattened. Null elements in lists will be ignored. 
	 *                         The syntax is exactly like fill().
	 * @return a list containing the DOM HTMLElement that has been created or modified as only element
	 */
	'el': function(e, attributes, children) {
		// @cond debug if (!e) error("el() requires the element name."); 
		// @cond debug if (/:/.test(e)) error("The element name can not create a colon (':'). In XML/XHTML documents, all elements are automatically in the document's namespace.");
		var nu = _document.documentElement.namespaceURI; // to check whether doc is XHTML
		var list = MINI(e = isNode(e) ? e : nu ? _document.createElementNS(nu, e) : _document.createElement(e));
		return  (isList(attributes) || !isObject(attributes)) ? list.add(attributes) : list.set(attributes).add(children); 
	},
		
	
	/**
	* @id request
	* @module 3
	* @configurable yes
	* @name request()
	* @syntax MINI.request(method, url)
	* @syntax MINI.request(method, url, data)
	* @syntax MINI.request(method, url, data, onSuccess)
	* @syntax MINI.request(method, url, data, onSuccess, onFailure)
	* @syntax MINI.request(method, url, data, onSuccess, onFailure, headers)
	* @syntax MINI.request(method, url, data, onSuccess, onFailure, headers, username, password)
	* Initiates a HTTP request (using XmlHTTPRequest) to the given URL. When the request finished, either the onSuccess or the onFailure function
	* will be invoked.
	* 
	* @example Invoke a REST web service and parse the resulting document using JSON:
	* <pre>
	* MINI.request('get', 'http://service.example.com/weather', {zipcode: 90210}, function(txt) {
	*     var json = MINI.parseJSON(txt);
	*     $('#weatherResult').fill('Today's forecast is is: ' + json.today.forecast);
	* }, function() {
	*     $('#weatherResult').fill('The weather service was not available.');
	* });
	* </pre>
	* 
	* @example Send a JSON object to a REST web service:
	* <pre>
	* var myRequest = {         // create a request object that can be serialized via JSON
	*      request: 'register',
	*      entries: [
	* {name: 'Joe',
	*      	job: 'Plumber'
	* }]};
	* 
	* function failureHandler() {
	*   $('#registrationResult').fill('Registration failed');
	* }
	*
	* MINI.request('post', 'http://service.example.com/directory', 
	*     MINI.toJSON(myRequest), function(txt) {
	*       if (txt == 'OK')
	*            $('#registrationResult').fill('Registration succeeded');
	*       else
	*            failureHandler();
	* }, failureHandler);
	* </pre>
	* 
	* @param method the HTTP method, e.g. 'get', 'post' or 'head' (rule of thumb: use 'post' for requests that change data on the server, and 'get' to only request data). Not case sensitive.
	* @param url the server URL to request. May be a relative URL (relative to the document) or an absolute URL. Note that unless you do something 
	*             fancy on the server (keyword to google:  Access-Control-Allow-Origin), you can only call URLs on the server your script originates from.
	* @param data optional data to send in the request, either as POST body or as URL parameters. It can be either a map of 
	*             parameters (all HTTP methods), a string (all methods) or a DOM document ('post' only). If the method is 'post', it will be 
	*             sent as body, otherwise appended to the URL. In order to send several parameters with the same name, use an array of values
	*             in the map. Use null as value for a parameter without value.
	* @param onSuccess optional this function will be called when the request has been finished successfully and had the HTTP status 200. Its first argument 
	*                  is the text sent by the server.
	*                  You can add an optional second argument, which will contain the XML sent by the server, if there was any.
	* @param onFailure optional this function will be called if the request failed. The first argument is the HTTP status (never 200; 0 if no HTTP request took place), 
	*                  the second a status text (or null, if the browser threw an exception) and the third the returned text, if there was 
	*                  any (the exception as string if the browser threw it).
	* @param headers optional a map of HTTP headers to add to the request. Note that the you should use the proper capitalization of the
	*                header 'Content-Type', if you set it, because otherwise it may be overwritten.
	* @param username optional username to be used for HTTP authentication, together with the password parameter
	* @param password optional password for HTTP authentication
	* @return the XmlHTTPRequest object, after its send() method has been called. You may use this to gather additional information, such as the request's state.
	*/
	'request': function (method, url, data, onSuccess, onFailure, headers, username, password) {
		// @cond debug if (!method) error("request() requires a HTTP method as first argument.");
		// @cond debug if (!url) error("request() requires a url as second argument.");
		// @cond debug if (onSuccess && typeof onSuccess != 'function') error("request()'s fourth argument is optional, but if it is set, it must be a function.");
		// @cond debug if (onFailure && typeof onFailure != 'function') error("request()'s fifth argument is optional, but if it is set, it must be a function.");
		// @cond debug if (username && !password) error("If the user name is set (7th argument), you must also provide a password as 8th argument.");		method = method.toUpperCase();
		var xhr,
				body = data,
				ContentType = 'Content-Type',
				callbackCalled = 0;
		try {
			//@condblock ie6compatibility
			xhr = _window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Msxml2.XMLHTTP.3.0");
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
						if (onSuccess)
							onSuccess(xhr.responseText, xhr.responseXML);
					}
					else if (onFailure)
						onFailure(xhr.status, xhr.statusText, xhr.responseText);
				}
			};
			
			xhr.send(body);
			return xhr;
		}
		catch (e) {
			if (onFailure && !callbackCalled) 
				onFailure(0, null, toString(e));
		}
	},
	
	
	/*
	 * JSON Module. Uses browser built-ins or json.org implementation if available. Otherwise its own implementation,
	 * originally based on public domain implementation http://www.JSON.org/json2.js / http://www.JSON.org/js.html.
	 * Extremely simplified code, made variables local, removed all side-effects (especially new properties for String, Date and Number).
	 */
    

	/**
    * @id tojson
    * @module 4
    * @requires ucode 
    * @configurable yes
    * @name toJSON()
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
    'toJSON': _window.JSON ? _window.JSON.stringify : function toJSON(value) {
		if (value == null)
			return ""+value; //result: "null"; toString(value) is not possible, because it returns an empty string for null
		if (isString(value = value.valueOf))
			return '"' + replace(value, /[\\\"\x00-\x1f\x22\x5c]/g, ucode) + '"' ;
		if (isList(value)) 
			return '[' + collect(value, function(vi) { return toJSON(vi); }).join() + ']';
		if (isObject(value))
			return '{' + collect(value, function(k, n) { return toJSON(k) + ':' + toJSON(n); }).join() + '}';
		return toString(value);
	},
    // @condend
    // @cond !ie7compatibility 'toJSON': json && json.stringify,
    
	/**
	* @id parsejson
	* @module 4
	* @requires ucode
	* @configurable yes
	* @name parseJSON()
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
    'parseJSON': _window.JSON ? _window.JSON.parse : function (text) {
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
    // @cond !ie7compatibility 'parseJSON': json && json.parse,
    
	/**
    * @id ready
    * @module 5
    * @requires ready_vars ready_init
    * @configurable yes
    * @name ready()
    * @syntax MINI.ready(handler)
    * Registers a handler to be called as soon as the HTML has been fully loaded (but not necessarily images and other elements).
    * On older browsers, it is the same as 'window.onload'. 
    *
    * @example Register an handler that sets some text in an element:
    * <pre>
    * MINI.ready(function() {
    *   $$('#someElement').innerHTML = 'ready() called';
    * });
    * </pre>
    *
    * @param handler the function to be called when the HTML is ready
    */
    'ready': ready,

   
	/**
     * @id setcookie
     * @module 6
     * @configurable yes
     * @name setCookie()
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
    	    (dateOrDays ? ('; expires='+(isObject(dateOrDays) ? dateOrDays : new Date(now() + dateOrDays * 86400000)).toUTCString()) : '') + 
    		'; path=' + (path ? escapeURI(path) : '/') + (domain ? ('; domain=' + escape(domain)) : '');
    },
    
    /**
     * @id getcookie
     * @module 6
     * @requires
     * @configurable yes
     * @name getCookie()
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
    	var regexp, match = (regexp = new RegExp('(^|;) *'+name+'=([^;]*)').exec(_document.cookie)) && regexp[2];
    	return dontUnescape ? match : match && unescape(match);
    },

	/**
	* @id loop
	* @module 7
	* @requires animation_vars 
	* @configurable yes
	* @name loop()
	* @syntax MINI.loop(paintCallback)
	* @syntax MINI.loop(paintCallback, element)
	* Use this function to run an animation loop. In modern browser that support requestAnimationFrame, the given callback is invoked as often 
	* as the browser is ready for a new animation frame. The frequency is determined by the browser and may vary depending on factors such as the time needed to render the current page.
	* the screen's framerate and whether the page is currently shown to the user (page is the current tab, browser window not minimized etc). 
	* In older browsers, the callback function will be invoked every 33 milliseconds.
	* To stop a running animation loop, either invoke the function that is returned or the function given as second parameter to the callback.
	*
	* @example A animates a div by moving it in a circle.
	* <pre>
	*   var myDiv = $$('#myAnimatedDiv');
	*   var rotationsPerMs = 1000;               // one rotation per second
	*   var maxRadius = 100;
	*   var d = 3000;                                 // duration in ms
	*   MINI.loop(function(t, stopFunc) {
	*     if (t > d) {                                   // time is up: call stopFunc()!
	*       stopFunc();
	*       return;
	*     }
	* 
	*     var a = 2 * Math.PI * t / d;                          // angular position
	*     var r = maxRadius*sin(t / d * Math.PI);           // radius changes from 0 to 1 back to 0 during the animatio
	*     myDiv.style.left = (r * Math.cos(a) + ' px';
	*     myDiv.style.top = (r * Math.sin(a) + ' px';
	*   });
	* </pre>
	*
	* @param paintCallback a callback function(timestamp, stopFunc) to invoke for painting. Parameters given to callback:
	* <ul>
	*            <li>timestamp - number of miliseconds since animation start</li>
	*            <li>stopFunc - call this function() to stop the currently running animation</li>
	* </ul>
	* @return a function() that, when you invoke it, stops the currently running animation.
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
    }
 	/**
 	 * @stop
 	 */

	}, function(n, v) {MINI[n]=v;});

	//// GLOBAL INITIALIZATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /**
	 * @id ready_init
	 * @dependency
     */
    // @condblock ie8compatibility
    _window.onload = function() {
    	triggerDomReady();
        if (DOMREADY_OLD_ONLOAD)
        	DOMREADY_OLD_ONLOAD();
    };
    if (_document.addEventListener)
    // @condend
    	_document.addEventListener("DOMContentLoaded", triggerDomReady, false);
	/**
	 @stop
	 */

	//// GLOBAL SYMBOLS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @id topleveldollar
     * @module 8
     * @requires dollar
     * @doc no
     * @configurable yes
     * @name $() (shortcut for MINI() )
     * @syntax $(selector)
     * Shortcut for MINI().
     * @example MINI() and $() are interchangeable:
     * <pre>
     * $('.myClass').set('$display', 'none');
     * </pre>
     * @param selector the selector (see MINI())
     * @return the result list (see MINI())
     */
    _window['$'] =
    /**
   	 @stop
   	 */
    _window['MINI'] = MINI; 
    /**
     * @id topleveldollardollar
     * @module 8
     * @requires dollardollar topleveldollar
     * @doc no
     * @configurable yes
     * @name $$() (shortcut for MINI.$$() )
     * @syntax $$(selector)
     * Shortcut for MINI.$$().
     * @example MINI.$$() and $$() are interchangeable:
     * <pre>
     * $$('#myCheckbox').checked = false;
     * </pre>
     * @param selector the selector (see MINI.$$())
     * @return the resulting element (see MINI.$$())
     */
    _window['$$'] = MINI.$$;

    /**
     * @id toplevelee
     * @module 8
     * @requires el topleveldollar
     * @doc no
     * @configurable yes
     * @name EE() (shortcut for MINI.el() )
     * @syntax EE(selector)
     * Shortcut for MINI.el().
     * @example MINI.el() and EL() are interchangeable:
     * <pre>
     * $('#myDiv').add(EE('span', 'This is a text'));
     * </pre>
     * @param selector the selector (see MINI.$$())
     * @return the resulting element (see MINI.$$())
     */
    _window['EE'] = MINI.el;
	/**
	 @stop
	 */
})(window, document);


/**
 * @stop 
 */



