/*
 * Minified.js - All that you for your web application, less than 4kb
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * 
 * Contains code based on https://github.com/douglascrockford/JSON-js (also Public Domain).
 */

/*
 * When you read this code, please keep in mind that it is optimized to produce small and gzip'able code
 * after being minimized using Closure (http://closure-compiler.appspot.com). Run-time performance and readability
 * should be acceptable, but are not a primary concern.
 */

// ==ClosureCompiler==
// @output_file_name minified.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==


window['MINI'] = (function() {
	var backslashB = '\\b';
	var undef;

	
	/**
	 * @id iecompatibility
	 * @module 1
	 * @configurable yes
	 * @name Backward-Compatibility for IE6/IE7 and similar browsers
	 */
	/**
	 * @id debug
	 * @module 1
	 * @configurable no
	 * @name Debugging Support
	 */
	function error(msg) {
		if (window.console) console.log(msg);
		throw Exception("MINI debug error: " + msg);
	}

	/**
	 * @id dollar
	 * @module 1
	 * @requires dollarraw addelementlistfuncsstart
	 * @configurable yes
	 * @name MINI()
	 * @syntax MINI(selector)
	 * @syntax MINI(selector, context)
	 * @shortcut $(selector) - Enabled by default, unless disabled with "Disable $ and EL" option
	 * Returns an array-like object containing all elements that fulfill the filter conditions. The returned object is guaranteed to
	 * have a property 'length', specifying the number of elements, and allows you to access elements with numbered properties, as in 
	 * regular arrays (e.g. list[2] for the second elements). It also provides you with a number of convenience functions.
	 * @param selector a simple, CSS-like selector for the elements. It supports '#id' (lookup by id), '.class' (lookup by class),
	 *             'element' (lookup by elements) and 'element.class' (combined class and element). Use commas to combine several selectors.
	 *             You can also separate two (or more) selectors by space to find elements which are descendants of the previous selectors.
     *             For example, use 'div' to find all div elements, '.header' to find all elements containing a class name called 'header', and
	 *             'a.popup' for all a elements with the class 'popup'. To find all elements with 'header' or 'footer' class names, 
	 *             write '.header, .footer'. To find all divs elements below the element with the id 'main', use '#main div'.
	 *             You can also use a DOM node as selector, it will be returned as a single-element list.  
	 *             If you pass a list, the list will be returned.
	 * @param context optional an optional selector, DOM node or list of DOM nodes which specifies one or more common root nodes for the selection
	 * @return the array-like object containing the content specified by the selector. Please note that duplicates (e.g. created using the
	 * *       comma-syntax or several context nodes) will not be removed. The array returned has several convenience functions listed below:
	 * @function listremove
	 * @function listremovechildren
	 * @function each
	 * @function filter
	 * @function listset
	 * @function listappend
	 * @function listprepend
	 * @function listanimate
	 * @function liston
	 * @function listoff
	 * @function listhasclass
	 * @function listaddclass
	 * @function listremoveclass
	 * @function listtoggleclass
	 */
	function MINI(selector, context) { 
		return addElementListFuncs(dollarRaw(selector, context));
	}
	
	//// 0. COMMON MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function isList(v) {
		return v && v.length != null && !v.substr && !v.data; // substr to test for string, data for Text node
	}
	function each(list, cb) {
		if (isList(list))
			for (var i = 0, len = list.length; i < len; i++)
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
	
    /**
     * @id tostring
     * @dependency yes
     */
	function toString(s) { // wrapper for Closure optimization
		return String(s!=null?s:'');
	}

    /**
     * @id getnamecomponents
     * @dependency yes
     * helper for set and get; if starts with $, rewrite as CSS style
     */
	function getNameComponents(name) {
		return (/^\$/.test(name) ? 'style.' + name.substr(1).replace('_', '-') : name).split('.');
	}

    /**
     * @id now
     * @dependency yes
     */
    function now() {
    	return new Date().getTime();
    }
    
    //// 1. SELECTOR MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @id dollarraw
     * @requires 
     * @dependency yes
     */
    function dollarRaw(selector, context) { 
		var doc = document, list = [];
		var parent, steps, dotPos, mainSelector, subSelectors;
		var elements, regexpFilter, prop, className, elementName, reg;

		if (!selector) 
		    return list;

		if (context != null) { // context set?
			if ((context = dollarRaw(context)).length != 1) { // if not exactly one node, iterate through all and concat
				each(context, function(ci) {
					each(dollarRaw(selector, ci), function(l) {
						list.push(l);
					});
				});
				return list; 
			}
			parent = context[0];
		}
		
		function filterElements(retList) {
			if (!parent)
				return retList;
			return filter(retList, function(node,a) {
				a = node;
				while (a) {
					if (a.parentNode === parent)
						return 1;
					a = a.parentNode;
				}
				// fall through to return undef
			});
		}
		if (selector.nodeType || selector === window) 
		    return filterElements([selector]); 
		if (isList(selector))
		    return filterElements(selector); 

		// @condblock iecompatibility
		if ((subSelectors = selector.split(/\s*,\s*/)).length>1) {
			each(subSelectors, function(ssi) {
				each(dollarRaw(ssi, parent), function(aj) {
					list.push(aj);
				});
			});
			return list; 
		}

		if ((steps = selector.split(/\s+/)).length > 1)
			return dollarRaw(steps.slice(1).join(' '), dollarRaw(steps[0], parent));

		if (/^#/.test(mainSelector = steps[0]))
			return (elements=doc.getElementById(mainSelector.substr(1))) ? filterElements([elements]) : []; 

		// @cond debug if (/\s/.test(mainSelector)) error("Selector has invalid format, please check for whitespace.");
		// @cond debug if (/[ :\[\]]/.test(mainSelector)) error("Only simple selectors with ids, classes and element names are allowed.");

		parent = parent || doc;
		
		if ((dotPos = mainSelector.indexOf('.')) < 0)
		    elementName = mainSelector;
		else {
			elementName = mainSelector.substr(0, dotPos);  // element name only set of dotPos > 0
			className = mainSelector.substr(dotPos+1);     
		}
	
		if (className && parent.getElementsByClassName) { // not all browsers support getElementsByClassName
			elements = parent.getElementsByClassName(className); 
			regexpFilter = elementName;
			prop = 'nodeName';
		} 
		else { // also fallback for getElementsByClassName (slow!)
			elements = parent.getElementsByTagName(elementName || '*'); 
			regexpFilter = className;
			prop = 'className';
		}
		
		if (regexpFilter) {
			reg = new RegExp(backslashB +  regexpFilter + backslashB, 'i'); 
			each(elements, function(l) {
				if(reg.test(l[prop])) 
					list.push(l); 
			});
			return list;
		}
		return elements;
		// @condend
		
		// @cond !iecompatibility return (parent || doc).querySelectorAll(mainSelector);
	};
	
	/**
	 * @stop
	 */
    
    /**
     * @id addelementlistfuncsstart
     * @requires addelementlistfuncend
     * @dependency yes
     */
	function addElementListFuncs(list) {
		function eachlist(callback) {
			return each(list, callback);
		};
		
		/**
		 * @id each
		 * @module 1
		 * @requires dollar
		 * @configurable yes
		 * @name list.each()
		 * @syntax each(callback)
		 * Invokes the given function once for each item in the list with the item as first parameter and the zero-based index as second.
		 * @param callback the callback to invoke.
		 * @return the list
		 */
		list['each'] = eachlist;
		
		/**
		 * @id filter
		 * @module 1
		 * @requires dollar
		 * @configurable yes
		 * @name list.filter()
		 * @syntax filter(filterFunc)
		 * Creates a new list that contains only those items approved by the given function. The function is called once for each item. 
		 * If it returns true, the item is in the returned list, otherwise it will be removed.
		 * This function also guarantees that the returned list is always based on an Array and thus can be used to convert a MINI()
		 * list to array.
		 * @param filterFunc optional the callback to invoke for each item with the item as only argument.  You can call this function
		 *        without arguments to create a new array.
		 * @return the new list, always guaranteed to be based on Array and a new object
		 */
		list['filter'] = function(filterFunc) {
		    return addElementListFuncs(filter(list, filterFunc));
		};
		
		/**
		 * @id find
		 * @module 1
		 * @requires dollar
		 * @configurable yes
		 * @name list.find()
		 * @syntax find(selector)
		 * Finds all children of the list's elements that match the given selector.
		 * @param selector the selector to use (see MINI())
		 * @return the new list containing matches
		 */
		list['find'] = function(selector) {
		    return MINI(selector, list);
		};
		
		/**
		 * @id listremove
		 * @module 1
		 * @requires dollar
		 * @configurable yes
		 * @name list.remove()
		 * @syntax remove()
		 * Removes all nodes of the list from the DOM tree.
		 */
		list['remove'] = function() {
			for (var j = list.length-1; j >= 0; j--) // go backward - NodeList may shrink when elements are removed!
				list[j].parentNode.removeChild(list[j]);
		};
		/**
		 * @id listremovechildren
		 * @module 1
		 * @requires dollar listremove
		 * @configurable yes
		 * @name list.removeChildren()
		 * @syntax removeChildren()
		 * Removes all child nodes from the list's elements, but does not remove the list nodes themselves.
		 * @return the list
		 */
		list['removeChildren'] = function() {
			return eachlist(function(li) {
				MINI(li.childNodes).remove();
			});
		};
		/**
		 * @id set
		 * @module 1
		 * @requires dollar getnamecomponents
		 * @configurable yes
		 * @name list.set()
		 * @syntax MINI(selector).set(name, value)
		 * @syntax MINI(selector).set(properties)
		 * @syntax MINI(selector).set(name, value, defaultFunction)
		 * @syntax MINI(selector).set(properties, undefined, defaultFunction)
		 * Modifies the list's DOM elements or objects by setting their properties and/or attributes. set() has also special support for 
		 * setting an element's CSS style. You can either supply a single name and value to set only one property, or you
		 * can provide a map of properties to set.
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
		 * $('input.checkbox').set('nextSibling.innerText', 'New Text');
		 * </pre>
		 * 
		 * @example Changing styles:
		 * <pre>
		 * $('.bigText').set('$font-size', 'x-large');
		 * </pre>
		 * 
		 * @example Changing attributes:
		 * <pre>
		 * $('a.someLinks').set('@href', 'http://www.example.com/');
		 * </pre>
		 * 
		 * @example Changing attribute of the parent node:
		 * <pre>
		 * $('a.someLinks').set('parentNode.@title', 'Links');
		 * </pre>
		 * 
		 * @example Using a map to change several properties:
		 * <pre>
		 * $('input.checkbox').set({checked: false,
		 *                          'nextSibling.innerText': 'New Text',
		 *                          'parentNode.@title': 'Check this'});
		 * </pre>
		 * 
		 * @example When specifying CSS styles in maps, use underscores instead of dashes in the names to avoid quoting:
		 * <pre>
		 * $('.importantText').set({$font_size: 'x-large',
		 *                          $color: 'black',
		 *                          $background_color: 'red'});
		 * </pre>
		 * 
		 * @example You can specify a function as value to modify a value instead of just setting it:
		 * <pre>
		 * $('h2').set('innerText', function(oldValue, index) { 
		 * 		return 'Chapter ' + index + ': ' + oldValue.toUpperCase(); 
		 * });
		 * </pre>
		 * 
		 * @param name the name of a single property or attribute to modify. If prefixed with '@', it is treated as a DOM element's attribute. 
		 *                     If it contains one or more dots ('.'), the set() will traverse the properties of those names.
		 *                     A dollar ('$') prefix is a shortcut for 'style.' and will also replace all '_' with '-' in the name.
		 * @param value the value to set. If it is a function, the function will be invoked for each list element to evaluate the value. 
		 * The function is called with with the old value as first argument and the index in the list as second.
		 * The third value is the function itself.
		 * @param properties a map containing names as keys and the values to set as map values. See above for the syntax.
		 * @param defaultFunction optional if set and no function is provided as value, this function will be invoked for each list element 
		 *                                 and property to determine the value. The function is called with with the old value as first 
		 *                                 argument and the index in the list as second. The third value is the new value specified
		 *                                 in the set() call.    
		 * @return the list
		 */
		function set(name, value, defaultFunction) {
			// @cond if (name == null) error("First argument must be set!");
			if (value === undef) 
				each(name, function(n,v) { list['set'](n, v, defaultFunction); });
			else {
				// @cond if (!/string/i.test(typeof name)) error('If second argument is given, the first one must be a string specifying the property name");
				var components = getNameComponents(name), len = components.length-1;
				var lastName = components[len];
				var isAttr = /^@/.test(lastName);
				var lastName1 = lastName.substr(1);
				var f = (typeof value == 'function') ? value : defaultFunction;
				eachlist( 
					function(obj, c) {
						for (var i = 0; i < len; i++)
							obj = obj[components[i]];
						if (isAttr)
							obj.setAttribute(lastName1, f ? f(obj.getAttribute(lastName1), c, value) : value);
						else
							obj[lastName] = f ? f(obj[lastName], c, value) : value;
					});
			}
			return list;
		};
		list['set'] = set;
		
		/**
		 * @id append
		 * @module 1
		 * @requires set
		 * @configurable yes
		 * @name append()
		 * @syntax MINI(selector).append(name, value)
		 * @syntax MINI(selector).append(properties)
		 */
		list['append'] = function (name, value) { return set(name, value, function(oldValue, idx, newValue) { return toString(oldValue) + newValue;});};

		/**
		 * @id prepend
		 * @module 1
		 * @requires set
		 * @configurable yes
		 * @name prepend()
		 * @syntax MINI(selector).prepend(name, value)
		 * @syntax MINI(selector).prepend(properties)
		 */
		list['prepend'] = function (name, value) { return set(name, value, function(oldValue, idx, newValue) { return newValue + toString(oldValue);});};

		/**
		 * @id listanimate
		 * @module 7
		 * @requires runanimation dollar getnamecomponents tostring
		 * @configurable yes
		 * @name list.animate()
		 * @syntax MINI(selector).animate(properties)
		 * @syntax MINI(selector).animate(properties, durationMs)
		 * @syntax MINI(selector).animate(properties, durationMs, linearity)
		 * @syntax MINI(selector).animate(properties, durationMs, linearity, callback)
		 * @shortcut $(selector).animate(properties, durationMs, linearity, callback) - Enabled by default, unless disabled with "Disable $ and EL" option
		 * Animates the objects or elements of the list by modifying their properties and attributes.
		 * @param list a list of objects
		 * @param properties a property map describing the end values of the corresponding properties. The names can use the
		 *                   MINI.set syntax ('@' prefix for attributes, '$' for styles). Values must be either numbers, numbers with
		 *                   units (e.g. "2 px") or colors ('rgb(r,g,b)', '#rrggbb' or '#rgb'). The properties will be set 
		 *                   for all elements of the list.
		 * @param durationMs optional the duration of the animation in milliseconds. Default: 500ms;
		 * @param linearity optional defines whether the animation should be linear (1), very smooth (0) or something between. Default: 0.
		 * @param callback optional if given, this function will be invoked the list as parameter when the animation finished
		 * @param delayMs optional if set, the animation will be delayed by the given time in milliseconds. Default: 0;
		 * @return the list
		 */
		list['animate'] = function (properties, durationMs, linearity, callback, delayMs) {
			// @cond debug if (!properties || typeof properties == 'string') error('First parameter must be a map of properties (e.g. "{top: 0, left: 0}") ');
			// @cond debug if (linearity < 0 || linearity > 1) error('Third parameter must be at least 0 and not larger than 1.');
			// @cond debug if (callback || typeof callback == 'function') error('Fourth is optional, but if set it must be a callback function.');
			// @cond debug var colorRegexp = /^(rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|#\w{3}|#\w{6})\s*$/i;
			function toNumWithoutUnit(v) {
				return parseFloat(toString(v).replace(/[^\d.-]/g, ''));
			}
			function replaceValue(originalValue, newNumber) {
				return toString(originalValue).replace(/-?[\d.]+/, newNumber);
			}
			if (delayMs)
				window.setTimeout(function(){list['animate'](properties, durationMs, linearity, callback);}, delayMs);
			else {
				durationMs = durationMs || 500;
				linearity = linearity || 0;
				var initState = []; // for each item contains a map {s:{}, e:{}, o} s/e are property name -> startValue of start/end. The item is in o.
				eachlist(function(li) {
					var p = {o:MINI(li), s:{}, e:{}, u:{}}; 
					each(properties, function(name) {
						var dest = properties[name];
						var components = getNameComponents(name), len=components.length-1, lastName = components[len];
						var a = li;
						for (var j = 0; j < len; j++) 
							a = a[components[j]];
						p.s[name] = ((/^@/.test(lastName)) ? a.getAttribute(lastName.substr(1)) : a[lastName]) || 0;
						p.e[name] = /^[+-]=/.test(dest) ?
							replaceValue(dest.substr(2), toNumWithoutUnit(p.s[name]) + toNumWithoutUnit(dest.replace(/\+?=/, ''))) 
							: dest;
						// @cond debug if (!colorRegexp.test(dest) && isNan(toNumWithoutUnit(dest))) error('End value of "'+name+'" is neither color nor number: ' + toString(dest));
						// @cond debug if (!colorRegexp.test(p.s[name]) && isNan(toNumWithoutUnit(p.s[name]))) error('Start value of "'+name+'" is neither color nor number: ' + toString(p.s[name]));
						// @cond debug if (colorRegexp.test(dest) && !colorRegexp.test(p.s[name])) error('End value of "'+name+'" looks like a color, but start value does not: ' + toString(p.s[name]));
						// @cond debug if (colorRegexp.test(p.s[name]) && !colorRegexp.test(dest)) error('Start value of "'+name+'" looks like a color, but end value does not: ' + toString(dest));
					});
					initState.push(p);
				});
			
				function getColorComponent(colorCode, index) {
					return (/^#/.test(colorCode)) ?
						parseInt(colorCode.length > 6 ? colorCode.substr(1+index*2, 2) : ((colorCode=colorCode.charAt(1+index))+colorCode), 16)
						:
						parseInt(colorCode.replace(/[^\d,]+/g, '').split(',')[index]);
				}
			
				runAnimation(function(timePassedMs, stop) {
					function interpolate(startValue, endValue) {
						var d = endValue - startValue;
						return startValue +  timePassedMs/durationMs * (linearity * d + (1-linearity) * timePassedMs/durationMs * (3*d - 2*d*timePassedMs/durationMs)); 
					}
					
					if (timePassedMs >= durationMs || timePassedMs < 0) {
						each(initState, function(isi) {
							isi.o.set(isi.e);
						});
						stop();
						if (callback) 
							callback(list);
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
				}
				return list;		
			};

		
		    /**
			 * @id liston
			 * @module 5
			 * @requires dollar
			 * @configurable yes
			 * @name list.on()
			 * @syntax MINI(selector).on(el, name, handler)
			 * @shortcut $(selector).on(el, name, handler) - Enabled by default, unless disabled with "Disable $ and EL" option
		     * Registers the given function as handler for the event with the given name. It is possible to register several
		     * handlers for a single event.
		     * 
		     * All handlers get a the original event object and minified's compatibility event object as arguments, and 'this' set to the source element
		     * of the event (e.g. the button that has been clicked). The original event object the is object given to the event or obtained 
		     * from 'window.event'. The compatibility event object has the following properties:
		     * <ul>
		     * <li><code>keyCode</code> - the key code, if it was a key press. Will return event.keyCode if set, otherwise event.which. This should work in practically all browsers. 
		     *                                              See http://unixpapa.com/js/key.html for key code tables.</li>
		     * <li><code>rightClick</code> - true if the right mouse button has been clicked, false otherwise. Works browser-independently.</li>
		     * <li><code>wheelDir</code> - for mouse wheel or scroll events, the direction (1 for up or -1 for down)</li>
		     * <li><code>pageX</code> - the page coordinate of the event
		     * <li><code>pageY</code> - the page coordinate of the event
		     * </ul>
		     * If the handler returns 'false', the event will not be propagated to other handlers.
		     * 
		     * @param name the name of the event, e.g. 'click'. Case-sensitive. The 'on' prefix in front of the name must not used.
		     * @param handler the function to invoke when the event has been triggered. The handler gets the original event object as
		     *                first parameter and the compatibility object as second. 'this' is the element that caused the event.
		     *                If the handler returns false, all processing of the event will be stopped.
		     * @return the list
		     */
			  list['on'] = function (name, handler) {
				    // @cond debug if (!(name && handler)) error("Both parameters to on() are required!"); 
				    // @cond debug if (/^on/i.test(name)) error("The event name looks invalid. Don't use an 'on' prefix (e.g. use 'click', not 'onclick'"); 
					return eachlist(function(el) {
						function newHandler(e) {
							e = e || window.event;
							var l = document.documentElement, b = document.body;
							
							// @cond debug try {
							if (handler.call(e.target, e, { 
									keyCode: e.keyCode || e.which, // http://unixpapa.com/js/key.html
									rightClick: e.which ? (e.which == 3) : (e.button == 2),
									pageX: l.scrollLeft + b.scrollLeft + e.clientX,
									pageY: l.scrollTop + b.scrollTop + e.clientY,
									wheelDir: (e.detail < 0 || e.wheelDelta > 0) ? 1 : -1
								}) === false) {
								if (e.preventDefault) // W3C DOM2 event cancelling
									e.preventDefault();
								if (e.stopPropagation) // cancel bubble for W3C DOM
									e.stopPropagation();
								e.returnValue = false; // cancel for IE
								e.cancelBubble = true; // cancel bubble for IE
							}
							// @cond debug } catch (ex) { error("Error in event handler \""+name+"\": "+ex); }
						};
						handler['MINI'] = newHandler; // MINIEventHandLer, for deleting the right function
						if (el.addEventListener)
							el.addEventListener(name, newHandler, true); // W3C DOM
						else 
							el.attachEvent('on'+name, newHandler);  // IE < 9 version
					});
				};
		
	    /**
		 * @id listoff
		 * @module 5
		 * @requires dollar liston
		 * @configurable yes
		 * @name list.off()
		 * @syntax MINI.off(element, name, handler)
	     * Removes the event handler. The call will be ignored if the given handler is not registered.
	     * @param name the name of the event (see on)
	     * @param handler the handler to unregister, as given to on()
	     * @return the list
	     */
		list['off'] = function (name, handler) {
			// @cond debug if (!name || !name.substr) error("No name given or name not a string.");
			// @cond debug if (!handler || !handler['MINI']) error("No handler given or handler invalid.");
			handler = handler['MINI'];
	    	return eachlist(function(el) {
				if (el.addEventListener)
					el.removeEventListener(name, handler, true); // W3C DOM
				else 
					el.detachEvent('on'+name, handler);  // IE < 9 version
	    	});
		};
		
	    /**
		 * @id listoffset
		 * @module 1
		 * @requires dollar
		 * @configurable yes
		 * @name list.offset()
		 * @syntax MINI(selector).offset()
		 * @shortcut $(selector).offset() - Enabled by default, unless disabled with "Disable $ and EL" option
	     * Returns the page coordinates of the list's first element.
	     * @param element the element
	     * @return an object containing pixel coordinates in two properties 'left' and 'top'
	     */
		list['offset'] = function() {
			var elem = list[0];
			var dest = {left: 0, top: 0};
			while (elem) {
				dest.left += elem.offsetLeft;
				dest.top += elem.offsetTop;
				elem = elem.offsetParent;
			}
			return dest;
	     };

	    /**
	     * @id createclassnameregexp
	     * @dependency yes
	     */
	    function createClassNameRegExp(className) {
	        return new RegExp(backslashB + className + backslashB);
	    }
	    
	    /**
	     * @id removeclassregexp
	     * @dependency yes
	     */
		function removeClassRegExp(el, reg) {
			return el.className.replace(reg, '').replace(/^\s+|\s+$/g, '').replace(/\s\s+/g, ' ');
		}
	    
	    /**
	     * @id listhasclass
	     * @module 1
	     * @requires dollar createclassnameregexp
	     * @configurable yes
		 * @name list.hasClass()
	     * @syntax hasClass(className)
	     * Checks whether any element in the list of nodes has a class with the given name. Returns the first node if found, or null if not found.
	     * @param className the name to find 
	     * @return the first element found with the class name, or null if not found
	     */
	    list['hasClass'] = function(className) {
	        var reg = createClassNameRegExp(className); 
	        for (var i = 0; i < list.length; i++)
	        	if (reg.test(list[i].className||''))
	           		return list[i];
	        // fall through if no match!
	    };

	    /**
	     * @id listremoveclass
	     * @module 1
	     * @requires dollar createclassnameregexp removeclassregexp
	     * @configurable yes
		 * @name list.removeClass()
	     * @syntax removeClass(className)
	     * Removes the given class from all elements of the list.
	     * @param className the name to remove
	     */
	    list['removeClass'] = function(className) {
	        var reg = createClassNameRegExp(className);
	        return eachlist(function(li) {
	        	li.className = removeClassRegExp(li, reg);
	        });
	    };

	    /**
	     * @id listaddclass
	     * @module 1
	     * @requires dollar listremoveclass
	     * @configurable yes
		 * @name list.addClass()
	     * @syntax addClass(className)
	     * Adds the given class name to all elements to the list.
	     * @param className the name to add
	     */
	    list['addClass'] = function(className) {
	        list['removeClass'](className);
	        return eachlist(function(li) {
	            if (li.className)
	                li.className += ' ' + className;
	            else
	                li.className = className;
	        });
	    };

	    /**
	     * @id listtoggleclass
	     * @module 1
	     * @requires dollar createclassnameregexp removeclassregexp
	     * @configurable yes
		 * @name list.toggleClass()
	     * @syntax toggleClass(className)
	     * Checks for all elements of the list whether they have the given class. If yes, it will be removed. Otherwise it will be added.
	     * @param className the name to toggle
	     */
	    list['toggleClass'] = function(className) {
	        var cn, reg = createClassNameRegExp(className);
	        return eachlist(function(li) {
	        	li.className = (cn = li.className) ? (reg.test(cn) ? removeClassRegExp(li, reg) : (cn + ' ' + className)) : className;
	        });
	    };
	    /**
	     * @id addelementlistfuncend
	     * @dependency yes
	     */
		return list;
	}
	
    /**
	 * @id el
	 * @module 1
	 * @requires dollarraw
	 * @configurable yes
	 * @name MINI.el()
	 * @syntax MINI.el(selector)
	 * @shortcut EL(selector) - Enabled by default, unless disabled with "Disable $ and EL" option
	 * Returns an DOM object containing the first match of the given selector, or undefined if no match.
	 * @param selector a simple, CSS-like selector for the element. Uses the syntax described in MINI. The most common
	 *                 parameter for this function is the id selector with the syntax "#id".
	 * @return a DOM object of the first match, or undefined if the selector did not return at least one match
	 */
    function EL(selector) {
		return dollarRaw(selector)[0];
	}
	MINI['el'] = EL;

   /**
     * @stop
     */
		
	//// 2. ELEMENT MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * @id element
	 * @module 2
	 * @requires el tostring
	 * @configurable yes
	 * @name element()
	 * @syntax MINI.element(name)
	 * @syntax MINI.element(name, attributes)
	 * @syntax MINI.element(name, attributes, children)
	 * Creates an element for insertion into the DOM, optionally with attributes and children. 
	 * Returns a DOM HTMLElement. This function is namespace-aware and will create XHTML nodes if called in an
	 * XHTML document.
	 * 
	 * @example Creating a simple &lt;span> element with some text:
	 * <pre>
	 * var mySpan = MINI.element('span', {}, 'Hello World'); 
	 * </pre>
	 * creates this:
	 * <pre>
	 *  &lt;span>Hello World&lt;/span> 
	 * </pre>
	 * @example Creating a &lt;span> element with style, some text, and append it to the element with the id 'greetingsDiv':
	 * <pre>
	 * var mySpan = MINI.element('span', {style: 'font-size: 100%;'}, 'Hello World'); 
	 * </pre>
	 * creates this:
	 * <pre>
	 *  &lt;span style="font-size: 100%;">Hello World&lt;/span> 
	 * </pre>
	 * @example Creating a &lt;form> element with two text fields, labels and a submit button:
	 * <pre>
	 * var myForm = MINI.element('form', {method: 'post'}, [
	 *     MINI.element('label', {'for': 'nameInput'}, 'Name:'),
	 *     MINI.element('input', {id: 'nameInput', type: 'input'}),
	 *     MINI.element('br'),
	 *     MINI.element('label', {'for': 'ageInput'}, 'Age:'),
	 *     MINI.element('input', {id: 'ageInput', type: 'input'}),
	 *     MINI.element('br'),
	 *     MINI.element('input', {type: 'submit, value: 'Join'})
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
	 * @example Null attributes often come handy when you don't always need a particular attribute:
	 * <pre>
	 * var myInput = MINI.element('input', {id: 'myCheckbox', type: 'checkbox', checked: shouldBeChecked() ? 'checked' : null});
	 * </pre>
	 * 
	 * @param e the element name (e.g. 'div') or an HTML element 
	 * @param attributes optional a map of attributes. The name is the attribute name, the value the attribute value. E.g. name is 'href' and value is 'http://www.google.com'.
	 *                   If the value is null, the attribute will not be created. 
	 * @param children optional if set an element or a list of elements as children to add. Strings will be converted as text nodes. Lists can be 
	 *                         nested and will then automatically be flattened. Null elements in lists will be ignored.
	 *                         If the element e already existed and the argument is set, they replace the existing children. 
	 *                         If the argument is not set, the original children will not be changed.
	 * @return the resulting DOM HTMLElement
	 */
	function element(e, attributes, children) {
		// @cond debug if (!e) error("element() requires the element name or an element as first argument.");
		// @cond debug if (!e.nodeType && /:/.test(e)) error("The element name can not create a colon (':'). In XML/XHTML documents, all elements are automatically in the document's namespace.");
		var nu =  document.documentElement.namespaceURI; // to check whether doc is XHTML
		e = e.nodeType ? e : nu ? document.createElementNS(nu, e) : document.createElement(e); 
		
		each(attributes, function(n, v) {
			if (v!=null)
				e.setAttribute(n, toString(v));
		});
		
		function appendChildren(c) {
			if (isList(c))
				each(c, function(ci) {
					appendChildren(ci);
				});
			else if (c != null)   // must check null, as 0 is a valid parameter
				e.appendChild(c.nodeType ? c : document.createTextNode(toString(c))); 
		}

		if (children != null) // must check null, as 0 is a valid parameter
			MINI(e).removeChildren();
		appendChildren(children);
		return e;
	};
	MINI['element'] = element;
	
    /**
     * @id elementmods
     * @dependency yes
     */
	each({
		/**
		 * @id elementadd
		 * @module 2
		 * @requires element elementmods
		 * @configurable yes
		 * @name elementAdd()
		 * @syntax MINI.elementAdd(parent, name)
		 * @syntax MINI.elementAdd(parent, name, attributes)
		 * @syntax MINI.elementAdd(parent, name, attributes, children)
		 */
		Add: function (e, parent) {
			parent.appendChild(e);
		},
		/**
		 * @id elementafter
		 * @module 2
		 * @requires element elementmods
		 * @configurable yes
		 * @name elementAfter()
		 * @syntax MINI.elementAfter(refNode, name)
		 * @syntax MINI.elementAfter(refNode, name, attributes)
		 * @syntax MINI.elementAfter(refNode, name, attributes, children)
		 */
		After: function (e, refNode, parentNode) {
			if (refNode = refNode.nextSibling)
				parentNode.insertBefore(e, refNode);
			else
				parentNode.appendChild(e);
		},
		/**
		 * @id elementbefore
		 * @module 2
		 * @requires element elementmods
		 * @configurable yes
		 * @name elementBefore()
		 * @syntax MINI.elementBefore(refNode, name)
		 * @syntax MINI.elementBefore(refNode, name, attributes)
		 * @syntax MINI.elementBefore(refNode, name, attributes, children)
		 */
		Before: function (e, refNode, parentNode) {
			parentNode.insertBefore(e, refNode);
		},
		/**
		 * @id elementreplace
		 * @module 2
		 * @requires element elementmods
		 * @configurable yes
		 * @name elementReplace()
		 * @syntax MINI.elementReplace(oldNode, name)
		 * @syntax MINI.elementReplace(oldNode, name, attributes)
		 * @syntax MINI.elementReplace(oldNode, name, attributes, children)
		 */
		Replace: function (e, oldNode, parentNode) {
			parentNode.replaceChild(e, oldNode);
		}}, 
	    /**
	     * @stop
	     */
		// @condblock elementmods
		function (name, func) {
			MINI['element'+name] = function(refNode, e, attributes, b) {
				// @cond debug if (!refNode) error("A valid node is required as first argument.");
				// @cond debug if (!e || (!e.substr || !e.nodeType))) error("A valid element name or node is required as second argument.");
				func(e = element(e, attributes, b), b = EL(refNode), b.parentNode);
				return e;
			};
		});
		// @condend
		
	
	//// 3. HTTP REQUEST MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * @id request
	 * @module 3
	 * @requires tostring
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
	MINI['request'] = function (method, url, data, onSuccess, onFailure, headers, username, password) {
		// @cond debug if (!method) error("request() requires a HTTP method as first argument.");
		// @cond debug if (!url) error("request() requires a url as second argument.");
		// @cond debug if (onSuccess && typeof onSuccess != 'function') error("request()'s fourth argument is optional, but if it is set, it must be a function.");
		// @cond debug if (onFailure && typeof onFailure != 'function') error("request()'s fifth argument is optional, but if it is set, it must be a function.");
		// @cond debug if (username && !password) error("If the user name is set (7th argument), you must also provide a password as 8th argument.");		method = method.toUpperCase();
		var xhr, s = [],
				body = data,
				ContentType = 'Content-Type',
				dataIsString = typeof data == 'string', callbackCalled = 0;
		try {
			xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Msxml2.XMLHTTP.3.0");
			
			if (data != null) {
				headers = headers || {};
				if (!dataIsString && !data.nodeType) { // if data is parameter map...
					function processParam(paramName, paramValue) {
						if (isList(paramValue))
							each(paramValue, function(v) {processParam(paramName, v);});
						else
							s.push(encodeURIComponent(paramName) + ((paramValue != null) ?  '=' + encodeURIComponent(paramValue) : ''));
					}
					each(data, processParam);
					body = s.join('&');
				}
				if (!/post/i.test(method)) {
					url += '?' + body;
					body = null;
				}
				else if (!data.nodeType && !headers[ContentType])
					headers[ContentType] = dataIsString ?  'text/plain; charset="UTF-8"' : 'application/x-www-form-urlencoded';
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
	};
	/**
	 * @stop
	 */  
	
	
	//// 4. JSON MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/*
	 * JSON Module. Uses browser built-ins or json.org implementation if available. Otherwise its own implementation,
	 * based on public domain implementation http://www.JSON.org/json2.js / http://www.JSON.org/js.html.
	 * Simplified code, made variables local, removed all side-effects (especially new properties for String, Date and Number).
	 */
    /**
	 * @id stringsubstitutions
	 * @dependency
     */
	// @condblock iecompatibility
    var STRING_SUBSTITUTIONS = {    // table of character substitutions
            '\t': '\\t',
            '\r': '\\r',
            '\n': '\\n',
            '"' : '\\"',
            '\\': '\\\\'
        };
    // @condend
    
    /**
	 * @id ucode
	 * @dependency
     */
    // @condblock iecompatibility
    function ucode(a) {
    	return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }
    // @condend

    /**
	 * @id tojson
	 * @module 4
	 * @requires tostring stringsubstitutions ucode
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
     * @param value the value (map-like object, array, string, number, date, boolean or null)
     * @return the JSON string
     */
    // @condblock iecompatibility
	MINI['toJSON'] = (JSON && JSON.stringify) || function toJSON(value) {
		var ctor, type;
		var partial = [];
		if (value && (ctor = value.constructor) == String || ctor == Number || ctor == Boolean)
			value = toString(value); 

		if ((type = typeof value) == 'string') {
			return '"' + value.replace(/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u206f\ufeff-\uffff]/g, 
				function (a) {
					return STRING_SUBSTITUTIONS[a] || ucode(a);
				}) + '"' ;
		}
		if (type == 'boolean' || type == 'number') // handle infinite numbers?
			return toString(value);
		if (!value)
			return 'null';
		
		if (isList(value)) {
			each(value, function(vi) { 
				partial.push(toJSON(vi)); 
			});
			return '[' + partial.join() + ']';
		}
		each(value, function(k, n) {
			partial.push(toJSON(k) + ':' + toJSON(n));
		});
		return '{' + partial.join() + '}';
    };
    // @condend
    // @cond !iecompatibility MINI['toJSON'] = (JSON && JSON.stringify);
    
    /**
	 * @id parsejson
	 * @module 4
	 * @requires tostring ucode
	 * @configurable yes
	 * @name parseJSON()
	 * @syntax MINI.parseJSON(text)
     * Parses a string containing JSON and returns the de-serialized object.
     * If JSON.parse is defined (built-in in some browsers), it will be used; otherwise MINI's own implementation.
     * @param text the JSON string
     * @return the resulting JavaScript object. Undefined if not valid.
     */
    // @condblock iecompatibility
    MINI['parseJSON'] = (JSON && JSON.parse) || function (text) {
       	text = toString(text).replace(/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u206f\ufeff-\uffff]/g, ucode);

        if (/^[\],:{}\s]*$/                  // dont remove, tests required for security reasons!
				.test(text.replace(/\\(["\\\/bfnrt]|u[\da-fA-F]{4})/g, '@')
						  .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(\.\d*)?([eE][+\-]?\d+)?/g, ']')
						  .replace(/(^|:|,)(\s*\[)+/g, ''))) 
        	return eval('(' + text + ')');
        // fall through if not valid
        // @cond debug error('Can not parse JSON string. Aborting for security reasons.');
    };
    // @condend
    // @cond !iecompatibility MINI['parseJSON'] = JSON && JSON.parse;
    /**
	 * @stop
	 */  
    
    
    //// 5. EVENT MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    /**
	 * @id ready
	 * @module 5
	 * @requires 
	 * @configurable yes
	 * @name ready()
	 * @syntax MINI.ready(handler)
     * Registers a handler to be called as soon as the HTML has been fully loaded (but not necessarily images and other elements).
     * On older browsers, it is the same as 'window.onload'. 
     * @param handler the function to be called when the HTML is ready
     */
    MINI['ready'] = function(handler) {
    	// @cond debug if (typeof handler != 'function') error("First argument must be a function");
    	if (DOMREADY_HANDLER) // if DOM ready, call immediately
			DOMREADY_HANDLER.push(handler);
		else
			window.setTimeout(handler, 0);
    };
    
    // Two-level implementation for domready events
    var DOMREADY_HANDLER = [];
    var DOMREADY_OLD_ONLOAD = window.onload;
    function triggerDomReady() {
    	each(DOMREADY_HANDLER, function(e) {e();});
    	DOMREADY_HANDLER = null;
    }

    window.onload = function() {
      triggerDomReady();
      if (DOMREADY_OLD_ONLOAD)
    	  DOMREADY_OLD_ONLOAD();
    };
    if (document.addEventListener)
    	document.addEventListener("DOMContentLoaded", triggerDomReady, false);
    
    
    /**
     * @stop
     */
    
    
    //// 6. COOKIE MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /**
	 * @id setcookie
	 * @module 6
	 * @requires now
	 * @configurable yes
	 * @name setCookie()
	 * @syntax MINI.setCookie(name, value)
	 * @syntax MINI.setCookie(name, value, dateOrDays)
	 * @syntax MINI.setCookie(name, value, dateOrDays, path)
	 * @syntax MINI.setCookie(name, value, dateOrDays, path, domain)
     * Creates a cookie with the given name and value, optional expiration date, path and domain. If there is an an existing cookie
     * of the same name, will be overwritten with the new value and settings.
     * 
     * @param name the name of the cookie. This should be ideally an alphanumeric name, as it will not be escaped by MINI and this
     *             guarantees compatibility with all systems.
     *             If it contains a '=', it is guaranteed not to work, because it breaks the cookie syntax. 
     * @param value the value of the cookie. All characters except alphanumeric and "*@-_+./" will be escaped using the 
     *              JavaScript escape() function and thus can be used, unless you set the optional dontEscape parameter.
     * @param dateOrDays optional specifies when the cookie expires. Can be either a Date object or a number that specifies the
     *                   amount of days. If not set, the cookie has a session lifetime, which means it will be deleted as soon as the
     *                   browser has been closes.
     * @param path optional if set, the cookie will be restricted to documents in the given certain path. Otherwise it is valid
     *                       for the whole domain. This is rarely needed.
     * @param domain optional if set, you use it to specify the domain (e.g. example.com) which can read the cookie. If you don't set it,
     *               the domain which hosts the current document is used. This parameter is rarely used, because there are only very
     *               few use cases in which this makes sense.
     * @param dontEscape optional if set, the cookie value is not escaped. Note that without escaping you can not use every possible
     *                    character (e.g. ";" will break the cookie), but it may be needed for interoperability with systems that need
     *                    some non-alphanumeric characters unescaped or use a different escaping algorithm.
     */
    function setCookie(name, value, dateOrDays, path, domain, dontEscape) {
		// @cond debug if (!name) error('Cookie name must be set!');
		// @cond debug if (/[^\w\d-_%]/.test(name)) error('Cookie name must not contain non-alphanumeric characters other than underscore and minus. Please escape them using encodeURIComponent().');
    	document.cookie = name + '=' + (dontEscape ? value : escape(value)) + 
    	    (dateOrDays ? (dateOrDays.getDay ? dateOrDays: new Date(now() + dateOrDays * 24 * 3600000)) : '') + 
    		'; path=' + (path ? escapeURI(path) : '/') + (domain ? ('; domain=' + escape(domain)) : '');
    }
    MINI['setCookie'] = setCookie;
    
    /**
	 * @id getcookie
	 * @module 6
	 * @requires
	 * @configurable yes
	 * @name getCookie()
	 * @syntax MINI.getCookie(name)
	 * @syntax MINI.getCookie(name, dontUnescape)
     * Tries to find the cookie with the given name and returns it.
     * @param name the name of the cookie. Should consist of alphanumeric characters, percentage, minus and underscore only, as it will not be escaped. 
     *             You may want to escape the name using encodeURIComponent() for all other characters.
     * @param dontUnescape optional if set and true, the value will be returned unescaped (use this only if the value has been encoded
     *                     in a special way, and not with the JavaScript encode() method)
     * @return the value of the cookie, or null if not found. Depending on the dontUnescape parameter, it may be unescape or not.
     */
    MINI['getCookie'] = function(name, dontUnescape) {
    	// @cond debug if (!name) error('Cookie name must be set!');
    	// @cond debug if (/[^\w\d-_%]/.test(name)) error('Cookie name must not contain non-alphanumeric characters other than underscore and minus. Please escape them using encodeURIComponent().');
    	var regexp, match = (regexp = RegExp('(^|;) *'+name+'=([^;]*)').exec(document.cookie)) && regexp[2];
    	return dontUnescape ? match : match && unescape(match);
    };

    /**
	 * @id deletecookie
	 * @module 6
	 * @requires
	 * @configurable yes
	 * @name deleteCookie()
	 * @syntax MINI.deleteCookie(name)
     * Deletes the cookie with the given name. If the cookie does not exist, it does nothing.
     * @param the cookie's name
     */
    MINI['deleteCookie'] = function(name) {
    	setCookie(name, '', -1);
    };
 
 	/**
 	 * @stop
 	 */
 

    //// 8. ANIMATION MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * @id animationhandlers
     * @dependency
     */
	var ANIMATION_HANDLERS = []; // global list of {c: <callback function>, t: <timestamp>, s:<stop function>} currenetly active
	var REQUEST_ANIMATION_FRAME = function(callback) {
		window.setTimeout(function() {callback();}, 33); // 30 fps as fallback
	};
	each(['msR', 'oR', 'webkitR', 'mozR', 'r'], function(n) { 
		REQUEST_ANIMATION_FRAME = window[n+'equestAnimationFrame'] || REQUEST_ANIMATION_FRAME;
	});

	/**
	 * @id runanimation
	 * @module 7
	 * @requires now animationhandlers
	 * @configurable yes
	 * @name runAnimation()
	 * @syntax MINI.runAnimation(paintCallback)
	 * @syntax MINI.runAnimation(paintCallback, element)
	 * Use this function to run an animation. The given callback is invoked as often as the browser is ready for a new animation frame.
	 * To stop a running animation, either invoke the function that is returned or the function given as second parameter to the callback.
	 * @param paintCallback a callback to invoke for painting. Parameters given to callback:
	 *            timestamp - number of miliseconds since start
	 *            stopFunc - call this method to stop the currently running animation
	 * @return a function that, when you invoke it, stops the currently running animation.
	 */
    function runAnimation(paintCallback) { 
        var entry = {c: paintCallback, t: now()};
        var i, j;
        var stopFunc = function() {
    		for (i = 0; i < ANIMATION_HANDLERS.length; i++) // don't use each here, list may be modified during run!!
    			if (ANIMATION_HANDLERS[i] === entry) 
    				ANIMATION_HANDLERS.splice(i--, 1);
        }; 
        entry.s = stopFunc;
        
        if (ANIMATION_HANDLERS.push(entry) < 2) { // if first handler.. 
			(function raFunc() {
				for (j = 0; j < ANIMATION_HANDLERS.length; j++) // don't use each here, list may be modified during run!!
					ANIMATION_HANDLERS[j].c(Math.max(0, now() - ANIMATION_HANDLERS[j].t), ANIMATION_HANDLERS[j].s); 
				if (ANIMATION_HANDLERS.length) // check len now, in case the callback invoked stopFunc() 
					REQUEST_ANIMATION_FRAME(raFunc); 
			})(); 
        } 
        return stopFunc; 
    };
    MINI['runAnimation'] = runAnimation;
    

	/**
	 @stop
	 */
	return MINI;
})();

/**
 * @id toplevelel
 * @module 8
 * @requires el 
 * @configurable yes
 * @name EL() (shortcut for MINI.el() )
 * @syntax EL(selector)
 * Shortcut for MINI.el().
 * @param selector the selector (see MINI.el())
 * @return the result element (see MINI.el())
 */
window['EL'] = MINI['el'];
/**
 * @id topleveldollar
 * @module 8
 * @requires dollar
 * @configurable yes
 * @name $() (shortcut for MINI() )
 * @syntax $(selector)
 * Shortcut for MINI().
 * @param selector the selector (see MINI())
 * @return the result list (see MINI())
 */
window['$'] = MINI;

/**
 * @stop 
 */

