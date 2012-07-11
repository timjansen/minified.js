/*
 * Minified.js - All that you need in a web application in less than 4kb
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
	var MINI = {};

	var backslashB = '\\b';

	//// 0. COMMON MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 	function throwError(num) {
		throw new Error('MINICode ' + num);
	}
	
	function toString(s) { // wrapper for Closure optimization
		return String(s);
	}
	
    function removeFromList(list, element) {
		for (var i = 0; i < list.length; i++)
			if (list[i] === element) 
				list.splice(i--, 1);
    }
    

	// helper for set and get; if starts with $, rewrite as CSS style
	function getNameComponents(name) {
		if (/^\$/.test(name))
			name = 'style.' + name.substring(1).replace(/(?:\w)_/, '-');
		return name.split('.');
	}

	
	/**
	 * @stop set
	 */    

	function isList(value) {
		var v = Object.prototype.toString.call(value);
		return v == '[object Array]' || v == '[object NodeList]';
	}
	 
    function now() {
    	return new Date().getTime();
    }
    
    //// 1. SELECTOR MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	


    function dollarRaw(selector, context) { 
		if (!selector) 
		    return [];
		var parent;
		var steps, dotPos, mainSelector, subSelectors, list;
		var elements, regexpFilter, prop, className, elementName;

		if (context = dollarRaw(context)) {
			if (context.length > 1) {
				var r = []; 
				for (var i = 0; i < context.length; i++) {
					var a = dollarRaw(selector, context[i]);
					for (var j = 0; j < a.length; j++)
						r.push(a[j]);
				}
				return r; 
			}
			parent = context[0]; 
		}
		
		function filterElements(list) {
			if (!parent)
				return list;
			var r = [], a; 
			for (var i = 0; i < list.length; i++) {
				a = list[i];
				while (a) 
					if (a.parentNode === parent) {
						r.push(list[i]);
						break;
					}
					else
						a = a.parentNode;
			}
			return r;
		}
		if (selector.nodeType || selector === window) 
		    return filterElements([selector]); 
		if (isList(selector))
		    return filterElements(selector); 
		if (typeof selector != 'string')
		    throwError(3);

		if ((subSelectors = selector.split(/\s*,\s*/)).length>1) {
			var r = []; 
			for (var i = 0; i < subSelectors.length; i++)  {
				var a = dollarRaw(subSelectors[i], parent);
				for (var j = 0; j < a.length; j++)
					r.push(a[j]);
			}
			return r; 
		}

		if ((steps = selector.split(/\s+/)).length > 1)
			return dollarRaw(steps.slice(1).join(' '), dollarRaw(steps[0], parent));

		if (/^#/.test(mainSelector = steps[0]))
			return filterElements([document.getElementById(mainSelector.substring(1))]); 

		if (/[ :]/.test(mainSelector)) 
		    throwError(1); 

		parent = parent || document.getElementsByTagName('html')[0];
		
		if ((dotPos = mainSelector.indexOf('.')) < 0)
		    elementName = mainSelector;
		else {
			elementName = mainSelector.substring(0, dotPos);  // element name only set of dotPos > 0
			className = mainSelector.substring(dotPos+1);     
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
		list = elements;
		if (regexpFilter) {
			list = [];
			var reg = new RegExp(backslashB +  regexpFilter + backslashB, 'i'); 
			for (var i=0; i < elements.length; i++)
				if(reg.test(elements[i][prop])) 
					list.push(elements[i]); 
		}
		
		return list;
	}; 
    
	function addElementListFuncs(list, undef) {
		/**
		 * @id listremove
		 * @module 1
		 * @requires dollar
		 * @public no
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
		 * @requires dollar
		 * @public no
		 * @syntax removeChildren()
		 * Removes all child nodes from the list's elements, but does not remove the list nodes themselves.
		 * @return the list
		 */
		list['removeChildren'] = function() {
			for (var i = list.length-1; i >= 0; i--) // go backward
				$(list[i].childNodes).remove();
			return list;
		};
		/**
		 * @id set
		 * @module 1
		 * @requires 
		 * @public yes
		 * @syntax MINI.$(selector).set(name, value)
		 * @syntax MINI.$(selector).set(properties)
		 * @shortcut $(selector).set(obj, properties) - Enabled by default, unless disabled with "Disable $ and EL" option
		 * Modifies the list's DOM elements or objects by setting their properties and/or attributes.
		 * @param name the name of a single property or attribute to modify. If prefixed with '@', it is treated as a DOM element's attribute. 
		 *                     If it contains one or more dots ('.'), the function will traverse the properties of those names.
		 *                     A hash ('#') prefix is a shortcut for 'style.' and will also replace all '_' with '-' in the name.
		 * @param value the value to set
		 * @param properties a map containing names as keys and the values to set as map values
		 * @return the list
		 */
		list['set'] = function (name, value) {
			if (value === undef) {
				for (var n in name) // property map given
					if (name.hasOwnProperty(n)) 
						list['set'](n, name[n]);
			}
			else {
				var components = (!/^@/.test(name)) && getNameComponents(name);
				for (var i = 0, obj, j; i < list.length; i++) {
					obj = list[i];
			    	if (components) {
						for (j = 0; j < components.length-1; j++)
							obj = obj[components[j]];
						obj[components[components.length-1]] = value;
					}
			    	else
						obj.setAttribute(name.substring(1), value);
				}
			}
			return list;
		};
		/**
		 @stop
		 */
		var REMOVE_UNIT = /[^0-9]+$/;

		/**
		 * @id listanimate
		 * @module 8
		 * @requires runanimation
		 * @public yes
		 * @syntax MINI.$(selector).animate(properties)
		 * @syntax MINI.$(selector).animate(properties, durationMs)
		 * @syntax MINI.$(selector).animate(properties, durationMs, linearity)
		 * @syntax MINI.$(selector).animate(properties, durationMs, linearity, callback)
		 * @shortcut $(selector).animate(properties, durationMs, linearity, callback) - Enabled by default, unless disabled with "Disable $ and EL" option
		 * Animates the objects or elements of the list by modifying their properties and attributes.
		 * @param list a list of objects
		 * @param properties a property map describing the end values of the corresponding properties. The names can use the
		 *                   MINI.set syntax ('@' prefix for attributes, '$' for styles). Values must be either numbers or numbers with
		 *                   units (e.g. "2 px"). Those properties will be set for all elements of the list.
		 * @param durationMs optional the duration of the animation in milliseconds. Default: 500ms;
		 * @param linearity optional defines whether the animation should be linear (1), very smooth (0) or something between. Default: 0.
		 * @param callback optional if given, this function will be invoked without parameters when the animation finished
		 * @param delayMs optional if set, the animation will be delayed by the given time in milliseconds. Default: 0;
		 * @return the list
		 */
		list['animate'] = function (properties, durationMs, linearity, callback, delayMs) {
			if (delayMs) {
				window.setTimeout(function(){list['animate'](properties, durationMs, linearity, callback);}, delayMs);
				return list;
			}
			durationMs = durationMs || 500;
			linearity = Math.max(0, Math.min(1, linearity || 0));
			var initState = []; // for each item contains property name -> startValue
			for (var i = 0; i < list.length; i++) {
				var p = {};
				for (var name in properties)
					if (/^@/.test(name))
						p[name] = list[i].getAttribute(name.substring(1)) || 0;
					else {
						var components = getNameComponents(name)
						var a = list[i];
						for (var j = 0; j < components.length-1; j++) 
							a = a[components[j]];
						p[name] = a[components[components.length-1]] || 0;
					}
				initState.push(p);
			}
	
			runAnimation(function(timePassedMs, stop) {
				if (timePassedMs >= durationMs || timePassedMs < 0) {
					list.set(properties);
					stop();
					if (callback) 
						callback();
				}
				else
					for (var i = 0; i < list.length; i++)
						for (var name in initState[i]) {
							var startValue = parseFloat(toString(initState[i][name]).replace(REMOVE_UNIT));
							var delta = parseFloat(toString(properties[name]).replace(REMOVE_UNIT)) - startValue;
							var c = delta/(durationMs*durationMs)*timePassedMs*timePassedMs;
							$(list[i]).set(name, 
									        (startValue + 
											 linearity * timePassedMs/durationMs * delta +   // linear equation
							 				 (1-linearity) * (3*c - 2*c/durationMs*timePassedMs)) +  // bilinear equation
							 				properties[name].replace(/^-?[0-9. ]+/, ' ')); // add unit
						}
						
			});
			return list;		
		};
		

	    /**
		 * @id listaddevent
		 * @module 5
		 * @requires 
		 * @public yes
		 * @syntax MINI.$(selector).addEvent(el, name, handler)
		 * @shortcut $(selector).addEvent(el, name, handler) - Enabled by default, unless disabled with "Disable $ and EL" option
	     * Registers the given function as handler for the event with the given name. It is possible to register several
	     * handlers for a single event.
	     * 
	     * All handlers get a event object as only argument (except 'domready' which has no argument). It has the following properties:
	     * <ul><li><code>original</code> - the original event object, as either given to the event or obtained from 'window.event', to give to direct access to the event</li>
	     * <li><code>src</code> - the source (HTML element) of the event</li>
	     * <li><code>keyCode</code> - the key code, if it was a key press. See http://unixpapa.com/js/key.html and other tables.</li>
	     * <li><code>button</code> - the mouse button pressed, for mouse events. Note that this is browser-dependent and <strong>not reliable</strong>. Better check rightClick.</li>
	     * <li><code>rightClick</code> - true if the right mouse button has been clicked, false otherwise. Works browser-independently.</li>
	     * <li><code>clientX</code> - for mouse events, the mouse position in the browser window showing document (so 0/0 is always the top left of the browser's window showing, even if the user scrolled)</li>
	     * <li><code>clientY</code> - see clientX</li>
	     * <li><code>screenX</code> - for mouse events, the mouse position on the physical screen</li>
	     * <li><code>screenY</code> - see screenX</li>
	     * <li><code>pageX</code> - for mouse events, the mouse position on the page (so 0/0 is the top left of the page, but when the user scrolled down not the top of the browser window)</li>
	     * <li><code>pageY</code> - see pageX</li>
		 * <li><code>wheelDir</code> - for mouse wheel or scroll events, the direction (1 for up or -1 for down)</li>
	     * </ul>
	     * If the handler returns 'false', the event will not be propagated to other handlers.
	     * 
	     * @param name the name of the event. Case-insensitive. The 'on' prefix in front of the name is not needed (but would be understood),
	     *             so write 'click' instead of 'onclick'.
	     * @param handler the function to invoke when the event has been triggered. The handler gets an event object as
	     *                parameter.
	     * @return the list
	     */
		list['addEvent'] = function (name, handler) {
	    	var nameUC = name.replace(/^on/, '').toUpperCase();
	    	var onName = 'on'+nameUC.toLowerCase();
	    	var MINIeventHandlerList = 'MEHL';
	    	
	    	for (var k = 0; k < list.length; k++) {
	    		var el = list[k];
	   	
		    	var oldHandler = el[onName];
		    	if (oldHandler && oldHandler[MINIeventHandlerList]) // already a MINI event handler set?
		    		oldHandler[MINIeventHandlerList].push(handler);
				else {
			    	var handlerList = [handler];
			    	var newHandler = function(e) {
			    		if (oldHandler)
			    			oldHandler(e);
			    		
			        	e = e || window.event;
			        	var l = document.documentElement, b = document.body;
			         	var evObj = { 
			        			original: e, 
			        			src: this,
			        			keyCode: e.keyCode || e.which, // http://unixpapa.com/js/key.html
			        			button: e.which || e.button,
			        			rightClick: e.which ? (e.which == 3) : (e.button ? (e.button == 2) : false),
			        			clientX: e.clientX,
			        			clientY: e.clientY,
			        			screenX: e.screenX,
			        			screenY: e.screenY,
			        			pageX: e.pageX,
			        			pageY: e.pageY
			        		};
			         	
			         	if (e.clientX || e.clientY){
			        		evObj.pageX = l.scrollLeft + b.scrollLeft + e.clientX;
			        		evObj.pageY = l.scrollTop + b.scrollTop + e.clientY;
			        	}
			        	else if (e.detail || e.wheelDelta)
			        		evObj.wheelDir = (e.detail < 0 || e.wheelDelta > 0) ? 1 : -1;
			    		
			    		var keepBubbling = true;
			    		var r;
			    		for (var i = 0; i < handlerList.length; i++)
			    			if ((r = handlerList[i](evObj)) != null) // must check null here
			    				keepBubbling = keepBubbling && r;
			    		
			    		if (!keepBubbling) {
			    			e.cancelBubble = true;
			    			if (e.stopPropagation) 
			    				e.stopPropagation();
			    		}
			    		return keepBubbling;
			    	};
			    	newHandler[MINIeventHandlerList] = handlerList;
			    	
			    	el[onName] = newHandler;
			    	if (el.captureEvents) 
			    		el.captureEvents(Event[nameUC]);
			    }
	    	}
		    return list;
		};

	    /**
		 * @id listremoveevent
		 * @module 5
		 * @requires 
		 * @public yes
		 * @syntax MINI.removeEvent(element, name, handler)
	     * Removes the event handler. The call will be ignored if the given handler is not registered.
	     * @param name the name of the event (see addEvent)
	     * @param handler the handler to unregister, as given to addEvent()
	     * @return the list
	     */
		list['removeEvent'] = function (name, handler) {
	    	var oldHandler;
	    	for (var i = 0; i < list.length; i++)
	    		if ((oldHandler = list[i]['on'+name.toLowerCase().replace(/^on/, '')]) && oldHandler.MINIeventHandlerList) 
	    			removeFromList(oldHandler.MINIeventHandlerList, handler);
	        return list;
		};
		
	    /**
		 * @id listgetpagecoordinates
		 * @module 6
		 * @requires
		 * @public yes
		 * @syntax MINI.$(selector).getPageCoordinates()
		 * @shortcut $(selector).getPageCoordinates() - Enabled by default, unless disabled with "Disable $ and EL" option
	     * Returns the page coordinates of the list's first element.
	     * @param element the element
	     * @return an object containing pixel coordinates in two properties 'left' and 'top'
	     */
	    list['getPageCoordinates'] = function() {
		    function getBodyCoordsInternal(elem, dest) {
		   		dest.left += elem.offsetLeft;
		    	dest.top += elem.offsetTop;
		    	
		    	var o = elem.offsetParent;
		    	return o ? getBodyCoordsInternal(o, dest) : dest;
		    }
	    	return list[0] && getBodyCoordsInternal(list[0], {left: 0, top: 0});
	    };

		 
	    function createClassNameRegExp(className) {
	        return new RegExp(backslashB + className + backslashB);
	    }
	    
		function removeClassRegExp(el, reg) {
			el.className = el.className.replace(reg, '').replace(/^\s+|\s+$/g, '').replace(/\s\s+/, ' ');
		}
	    
	    /**
	     * @id listhasclass
	     * @module 1
	     * @requires dollar
	     * @public no
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
	    };

	    /**
	     * @id listremoveclass
	     * @module 1
	     * @requires dollar
	     * @public no
	     * @syntax removeClass(className)
	     * Removes the given class from all elements of the list.
	     * @param className the name to remove
	     */
	    list['removeClass'] = function(className) {
	        var reg = createClassNameRegExp(className); 
	        for (var i = 0; i < list.length; i++)
	            removeClassRegExp(list[i], reg);
			return list;
	    };

	    /**
	     * @id listaddclass
	     * @module 1
	     * @requires dollar listremoveclass
	     * @public no
	     * @syntax addClass(className)
	     * Adds the given class name to all elements to the list.
	     * @param className the name to add
	     */
	    list['addClass'] = function(className) {
	        list['removeClass'](className);
	        for (var i = 0; i < list.length; i++)
	            if (list[i].className)
	                list[i].className += ' ' + className;
	            else
	                list[i].className = className;
			return list;
	    };

	    /**
	     * @id listtoggleclass
	     * @module 1
	     * @requires dollar
	     * @public no
	     * @syntax toggleClass(className)
	     * Checks for all elements of the list whether they have the given class. If yes, it will be removed. Otherwise it will be added.
	     * @param className the name to toggle
	     */
	    list['toggleClass'] = function(className) {
	        var reg = createClassNameRegExp(className);
	        var li;
	        for (var i = 0; i < list.length; i++)
	            if ((li = list[i]).className && reg.test(li.className))
	                removeClassRegExp(li, reg);
	            else if (li.className)
	                li.className += ' ' + className;
	            else
	                li.className = className;
	        return list;
	    };
		/**
		 * @stop listtoggleclass
		 */
		return list;
	}
	
	/**
	 * @id dollar
	 * @module 1
	 * @requires 
	 * @public yes
	 * @syntax MINI.$(selector)
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
	 * @function listset
	 * @function listanimate
	 * @function listaddevent
	 * @function listremoveevent
	 * @function listhasclass
	 * @function listaddclass
	 * @function listremoveclass
	 * @function listtoggleclass
	 */
	function $(selector, context) { 
		return addElementListFuncs(dollarRaw(selector, context));
	}
	MINI['$'] = $;

    /**
	 * @id el
	 * @module 1
	 * @requires dollar
	 * @public yes
	 * @syntax MINI.el(selector)
	 * @shortcut EL(selector) - Enabled by default, unless disabled with "Disable $ and EL" option
	 * Returns an DOM object containing the first match of the given selector, or undefined if no match.
	 * @param selector a simple, CSS-like selector for the element. Uses the syntax described in MINI.$. The most common
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
	 * @id text
	 * @module 2
	 * @requires el
	 * @public yes
	 * @syntax MINI.text(text)
	 * @syntax MINI.text(text, parent)
	 * Creates a text node for insertion into the DOM. It can optionally be appended to the end of 
	 * the specified element. Returns the text node.
	 * @param txt the text to add
	 * @param parent optional if set, the created text node will be added as last element of this DOM node. The DOM node can be speficied
	 *                        in any way accepted by MINI.el().
	 * @return the resulting DOM text node
	 */
	function text(txt, parent) {
		var node = document.createTextNode(toString(txt)); 
		if (parent)
			EL(parent).appendChild(node);
		return node;
	};
	MINI['text'] = text;
	
	/**
	 * @id element
	 * @module 2
	 * @requires el
	 * @public yes
	 * @syntax MINI.element(name)
	 * @syntax MINI.element(name, attributes)
	 * @syntax MINI.element(name, attributes, children)
	 * @syntax MINI.element(name, attributes, children, parent)
	 * Creates an element for insertion into the DOM, optionally with attributes and children. It can optionally be appended to the end of 
	 * the specified element. Returns a DOM HTMLElement. This function is namespace-aware and will create XHTML nodes if called in an
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
	 * var mySpan = MINI.element('span', {style: 'font-size: 100%;'}, 'Hello World', 'greetingsDiv'); 
	 * </pre>
	 * creates this:
	 * <pre>
	 *  &lt;span style="font-size: 100%;">Hello World&lt;/span> 
	 * </pre>
	 * @example Creating a &lt;form> element with two text fields, labels and a submit button:
	 * <pre>
	 * var mySpan = MINI.element('form', {method: 'post'}, [
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
	 * @param name the element name (e.g. 'div'). 
	 * @param attributes optional a map of attributes. The name is the attribute name, the value the attribute value. E.g. name is 'href' and value is 'http://www.google.com'.
	 * @param children optional either a single child element or an array of child elements (which may also be arrays). Elements can be either 
	 *                           DOM nodes, such as HTMLElements created by this function, strings (to create Text elements) or any other JavaScript objects, which will be converted to strings using toString()
	 *                           and then be used as Text element.
	 * @param parent optional if set, the created element will be added as last element of this DOM node. The DOM node can be specified in any
	 *                        way supported by Mini.el().
	 * @return the resulting DOM HTMLElement
	 */
	MINI['element'] = function (name, attributes, children, parent) {
		var nu =  document.documentElement.namespaceURI; // to check whether doc is XHTML
		var e = nu ? document.createElementNS(nu, name) : document.createElement(name); 
		
		for (var attrName in attributes) // works even if attributes is null or undef!?
			if (attributes.hasOwnProperty(attrName) && (attributes[attrName] != null))  // null check required here
				e.setAttribute(attrName, toString(attributes[attrName]));
			
		function appendChildren(c) {
			if (isList(c))
				for (var i = 0; i < c.length; i++)
					appendChildren(c[i]);
			else if (c != null) {  // must check null, as 0 is a valid parameter
				if (c.nodeType) 
					e.appendChild(c); 
				else 
					text(c, e);
			}
		}

		appendChildren(children);
		
		if (parent)
			EL(parent).appendChild(e);
		return e;
	};

    /**
     * @stop
     */
    

	
	//// 3. HTTP REQUEST MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * @id request
	 * @module 3
	 * @requires 
	 * @public yes
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
	 *             parameters (all HTTP methods), a string ('post' only) or a DOM document ('post' only). 
	 *             For other methods: a map of parameters for the request. If the method is 'post', it will be send as body.
	 * @param onSuccess optional this function will be called when the request has been finished successfully and had the HTTP status 200. Its first argument 
	 *                  is the text sent by the server.
	 *                  You can add an optional second argument, which will contain the XML sent by the server, if there was any.
	 * @param onFailure optional this function will be called if the request failed. The first argument is the HTTP status (never 200; 0 if no HTTP request took place), 
	 *                  the second a status text (or 'Err', if the browser threw one) and the third the returned text, if there was 
	 *                  any (otherwise the text is null).
	 * @param headers optional a map of HTTP headers to add to the request. Note that the you should use the proper capitalization of the
	 *                header 'Content-Type', if you set it, because otherwise it may be overwritten.
	 * @param username optional username to be used for HTTP authentication, together with the password parameter
	 * @param password optional password for HTTP authentication
	 * @return the XmlHTTPRequest object, after its send() method has been called. You may use this to gather additional information, such as the request's state.
	 */
	MINI['request'] = function (method, url, data, onSuccess, onFailure, headers, username, password) {
		method = method.toUpperCase();
		var xhr, callbackCalled = 0, body, contentType, hdrName;
	
		// simple function to encode HTTP parameters
		function encodeParams(params) {
			var paramName, s = [];
			for (paramName in params)
				if (params.hasOwnProperty(paramName))
					s.push(splitter + encodeURIComponent(paramName) + ((params[paramName] != null) ?  '=' + encodeURIComponent(params[paramName]) : ''));
			return s.join('&');
		}
		
		try {
			if (!XMLHttpRequest)
				xhr = new ActiveXObject("Msxml2.XMLHTTP.3.0");
			else 
				xhr = new XMLHttpRequest();
			
			if (method != 'POST' && data)
				url += '?' + encodeParams(data);
			
			xhr.open(method, url, true, username, password);
			
			if (method == 'POST' && data != null) {
				body = data;
				if (typeof data == 'string')
					contentType = 'text/plain; charset="UTF-8"';
				else if (!data.nodeType) {
					body = encodeParams(data);
					contentType = 'application/x-www-form-urlencoded';
				}
				if (contentType && !(headers && headers['Content-Type']))
					xhr.setRequestHeader('Content-Type', contentType);
			}
			
			for (hdrName in headers) // headers may be undefined. all JS engines should then do nothing (i hope)
				if (headers.hasOwnProperty(hdrName))
					xhr.setRequestHeader(hdrName, headers[hdrName]);
			
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
				onFailure(0, 'Err', toString(e));
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
    var STRING_SUBSTITUTIONS = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
    
	function quoteStringForJSON(string) {
        return '"' + string.replace(/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, 
        		function (a) {
                	return STRING_SUBSTITUTIONS[a] || '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            	}) + '"' ;
	}


    /**
	 * @id tojson
	 * @module 4
	 * @requires 
	 * @public yes
	 * @syntax MINI.toJSON(value)
     * Converts the given value into a JSON string. The value may be a map-like object, an array, a string, number, date, boolean or null.
     * If JSON.stringify is defined (built-in in some browsers), it will be used; otherwise MINI's own implementation.
     * @param value the value (map-like object, array, string, number, date, boolean or null)
     * @return the JSON string
     */
	MINI['toJSON'] = (JSON && JSON.stringify) || function toJSON(value) {
		var ctor, type, v, k, i, NULL='null';
		if (value && typeof value == 'object') {
			if ((ctor = value.constructor) == String || ctor == Number || ctor == Boolean)
				value = toString(value); 
			else if (ctor == Date) {
				function f(n) {
					return n < 10 ? '0' + n : n;
				}
				value = value.getUTCFullYear()   + '-' +
				     f(value.getUTCMonth() + 1) + '-' +
				     f(value.getUTCDate())      + 'T' +
				     f(value.getUTCHours())     + ':' +
				     f(value.getUTCMinutes())   + ':' +
				     f(value.getUTCSeconds())   + 'Z';
			}
		}
	
		if ((type = typeof value) == 'string')
			return quoteStringForJSON(value);
		if (type == 'boolean' || type == NULL || type == 'number') // handle infinite numbers?
			return toString(value);
		if (!value)
			return NULL;
		
		var partial = [];
		if (isList(value)) {
			for (i = 0; i < value.length; i ++)
				partial.push(toJSON(value[i]));
			return '[' + partial.join() + ']';
		}
		for (k in value) 
			if (value.hasOwnProperty(k) && ((v = toJSON(value[k])) != null))
				partial.push(quoteStringForJSON(k) + ':' + v);
		return '{' + partial.join() + '}';
    };
    
    /**
	 * @id parsejson
	 * @module 4
	 * @requires
	 * @public yes
	 * @syntax MINI.toJSON(value)
     * Parses a string containing JSON and returns the de-serialized object.
     * If JSON.parse is defined (built-in in some browsers), it will be used; otherwise MINI's own implementation.
     * @param text the JSON string
     * @return the resulting JavaScript object
     */
    MINI['parseJSON'] = (JSON && JSON.parse) || function (text) {
    	text = toString(text).replace(/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, 
    		function (a) {
    			return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    		});

        if (/^[\],:{}\s]*$/                  // dont remove, tests required for security reasons!
				.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
				.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
				.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) 
        	return eval('(' + text + ')');

        throwError(2);
    };
    /**
	 * @stop
	 */  
    
    
    //// 5. EVENT MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    /**
	 * @id ready
	 * @module 5
	 * @requires addevent
	 * @public yes
	 * @syntax MINI.ready(handler)
     * Registers a handler to be called as soon as the HTML has been fully loaded (but not necessarily images and other elements).
     * On older browsers, it is the same as 'window.onload'. 
     * @param handler the function to be called when the HTML is ready
     */
    MINI['ready'] = function(handler) {
		if (DOMREADY_CALLED) // if DOM ready, call immediately
			window.setTimeout(handler, 0);
		else
			DOMREADY_HANDLER.push(handler);
    };
    
    // Two-level implementation for domready events
    var DOMREADY_CALLED = 0;
    var DOMREADY_HANDLER = [];
    var DOMREADY_OLD_UNLOAD = window.onload;
    function triggerDomReady() {
    	var e;
    	if (!DOMREADY_CALLED++)
    		while (e = DOMREADY_HANDLER.shift())
    			e();
    }

    window.onload = function() {
      window.setTimeout(triggerDomReady, 0);
      if (DOMREADY_OLD_UNLOAD)
    	  DOMREADY_OLD_UNLOAD.call(this);
    }
    if (document.addEventListener)
    	document.addEventListener("DOMContentLoaded", triggerDomReady, false);
    
    
    /**
     * @stop
     */
    
    
    //// 6. COOKIE MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /**
	 * @id setcookie
	 * @module 6
	 * @requires
	 * @public yes
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
    	document.cookie = name + '=' + (dontEscape ? value : escape(value)) + 
    	    (dateOrDays ? ((dateOrDays instanceof Date) ? dateOrDays: new Date(now() + dateOrDays * 24 * 3600000)) : '') + 
    		'; path=' + (path ? escapeURI(path) : '/') + (domain ? ('; domain=' + escape(domain)) : '');
    }
    MINI['setCookie'] = setCookie;

    /**
	 * @id getcookie
	 * @module 6
	 * @requires
	 * @public yes
	 * @syntax MINI.getCookie(name)
	 * @syntax MINI.getCookie(name, dontUnescape)
     * Tries to find the cookie with the given name and returns it.
     * @param name the name of the cookie. Must not contain "=".
     * @param dontUnescape optional if set and true, the value will be returned unescaped (use this only if the value has been encoded
     *                     in a special way, and not with the JavaScript encode() method)
     * @return the value of the cookie, or null if not found. Depending on the dontUnescape parameter, it may be unescape or not.
     */
    MINI['getCookie'] = function(name, dontUnescape) {
    	var matcher = document.cookie.match('(^|;)\\s*' + 
    				  name.replace(/([$+*?\|.\\\[\]\(\)\{\}])/g, "\\$1") +  // save name
    				  '=([^;]*)(;|$)');
    	return matcher ? (dontUnescape ? matcher[2] : unescape(matcher[2])) : null;
    };

    /**
	 * @id deletecookie
	 * @module 6
	 * @requires
	 * @public yes
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
 

    
   	/**
 	 * @stop
 	 */
    
    //// 8. ANIMATION MODULE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
	var ANIMATION_HANDLERS = []; // global list of {c: <callback function>, t: <timestamp>, s:<stop function>} currenetly active

	/**
	 * @id runanimation
	 * @module 8
	 * @requires el
	 * @public yes
	 * @syntax MINI.runAnimation(paintCallback)
	 * @syntax MINI.runAnimation(paintCallback, element)
	 * Use this function to run an animation. The given callback is invoked as often as the browser is ready for a new animation frame.
	 * To stop a running animation, either invoke the function that is returned or the function given as second parameter to the callback.
	 * @param paintCallback a callback to invoke for painting. Parameters given to callback:
	 *            timestamp - number of miliseconds since start
	 *            stopFunc - call this method to stop the currently running animation
	 * @param element optional if not null, the HTMLElement that contains the animation. Can be speficied in any way accepted by MINI.el.
	 * @return a function that, when you invoke it, stops the currently running animation.
	 */
    function runAnimation(paintCallback, element) { 
        element = EL(element);
        var entry = {c: paintCallback, t: now()}; 
        var stopFunc = function() {
            removeFromList(ANIMATION_HANDLERS, entry); 
        }; 
        entry.s = stopFunc;
        
        if (ANIMATION_HANDLERS.push(entry) < 2) { // if first handler.. 
			var f;
			var requestAnim = function(callback) {
				window.setTimeout(function() {callback();}, 100/3); // 30 fps as fallback
			};
			for (var n in {'r':1, 'webkitR':1, 'mozR':1, 'oR':1, 'msR':1}) // quotes needed for Closure!
				if (f = window[n+'equestAnimationFrame'])
					requestAnim = f;
		
			(function raFunc() {
				var t = now();
				for (var i = 0; i < ANIMATION_HANDLERS.length; i++) 
				    ANIMATION_HANDLERS[i].c(Math.max(0, t - ANIMATION_HANDLERS[i].t), ANIMATION_HANDLERS[i].s); 
				if (ANIMATION_HANDLERS.length) // check len now, in case the callback invoked stopFunc() 
				    requestAnim(raFunc, element); 
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
 * @module 1
 * @requires el 
 * @public yes
 * @syntax EL(selector)
 * Shortcut for MINI.el().
 * @param selector the selector (see MINI.el())
 * @return the result element (see MINI.el())
 */
window['EL'] = MINI['el'];
/**
 * @id topleveldollar
 * @module 1
 * @requires dollar
 * @public yes
 * @syntax $(selector)
 * Shortcut for MINI.$().
 * @param selector the selector (see MINI.$())
 * @return the result list (see MINI.$())
 */
window['$'] = MINI['$'];
/**
 * @stop 
 */

