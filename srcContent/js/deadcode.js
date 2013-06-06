// Graveyard for functions that have been removed from minified-src.js


		
hhEach({	
    /*$
	 * @id values
	 * @module REQUEST
	 * @requires each
	 * @configurable default
	 * @name .values()
	 * @syntax MINI().values()
	 * @syntax MINI().values(dataMap)
	 * Creates a name/value map from the given form. values() looks at the list's form elements and writes each element's name into the map,
	 * using the element name as key and the element's value as value. If there is more than one value with the same name, the map will contain an array
	 * of values. Form element without value will be written with 'null' as value. Form elements without name will be ignored.
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
	 * MINI.request('get', '/exampleService', $('#myForm').values(), resultHandler);
	 * </pre>
	 * 
	 * @example Serialize only some selected input fields:
	 * <pre>
	 * var data = $('#myText, input.myRadios').values();
	 * </pre>
	 * 
	 * @param dataMap optional an optional map to write the values into. If not given, a new empty map will be created
	 * @return a map containing name->value pairs as strings. If there is more than one value with the same name,
	 *         map value is an array of strings
	 */
	'values': function(data) {
		var r = data || {};
		this['each'](function(el) {
			var n = el.name, v = toString(el.value), o=r[n];
			if (/form/i.test(el.tagName))
				MINI(el.elements)['values'](r);
			else if (n && (!/kbox|dio/i.test(el.type) || el.checked)) { // short for checkbox, radio
					if (isList(o))
						o.push(v);
					else
						r[n] = (o == null) ? v : [o, v];
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
	 * @syntax $(selector).offset()
	 * Returns the pixel page coordinates of the list's first element. Page coordinates are the pixel coordinates within the document, 
	 * with 0/0 being the upper left corner, independent of the user's current view (which depends on the user's current scroll position and zoom level).
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
     },
	
	
	/**
	 * @id wire
	 * @module ANIMATION
	 * @requires toggle on each set
	 * @configurable default
	 * @name .wire()
	 * @syntax MINI(selector).wire(events, toggles)
	 * @shortcut $(selector).wire(events, toggles) - Enabled by default, but can be disabled in the builder.
	 * 
	 * Sets up events that will trigger the given toggles.
	 *
     * The first arguments sets up which kind of events will trigger the toggles in what way. There are two ways to specify the events:
     * <ul>
     * <li>A simple string in the form "eventtype +eventtype -eventtype" adds the space-separated event handlers for each list member. Non-prefixed
     *     event types toggle. If prefixed with + or -, they will put the toggles in the first or second state.</li>
     * <li>A map allows you to add events to more than one element. They map key specifies the selector to find the element. The map value specifies the
     *     events in the form described above.</li>
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
	 * @example Wires the list members to change their own text color on click. This example also animates the color transition:
	 * <pre>
	 * $('.clicky').wire('click', [{$color: '#f00'}, {$color: '#00f'}, 750]);
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
	 * @example Wires a dropdown menu. Its toggle modifies the CSS class of the 'dropdown.
	 * <pre>
	 * $('.dropdown').wire({'.head': 'click', '.closeButton': '-click'} , [{$: '-shown'}, {$: '+shown'}]);
	 * </pre>
	 * 
	 * @example wire() also supports single strings as argument for the toggle to modify only CSS classes. The following
	 *          example does the same as the preceding one.
	 * <pre>
	 * $('.dropdown').wire({'.head': 'click', '.closeButton': '-click'} , 'shown');
	 * </pre>
	 
	 * @example The second argument to wire() can contain a map just like the first.
	 * <pre>
	 * $('.twoCols').wire({'#swapCols': 'click'} , 
	 *                    {
	 *                        '.col1': [{$left: '0px'}, {$left: '300px'}, 500] // swap positions on click
	 *                        '.col2': [{$left: '300px'}, {$left: '0px'}, 500]
	 *                    });
	 * </pre>
	 * 
	 * @param events either a simple string if the list element is the only element to wire. Then it contains a space-separated list of event names (e.g. 'click', 'mouseover').
	 *               By default the event toggles, unless it is prefixed with a '-' or '+'. If prefixed, the event will set the toggle to the first state for '-' or the
	 *               or the second state for '+'.
	 *               Alternatively, events can contain a map of selectors as keys which describe the triggering element and values that describe the events using the string
	 *               syntax shown above. Selectors are executed in the list element's context, unless they start with a '#'.
	 * @param toggles describes the toggle functions that will be triggered by the events. This parameter can be a single toggle function, a list of toggle functions,
	 *                a list of parameters for toggle() which will be used to create a new toggle, a string that will be used as single parameter for toggle(),
	 *                or a map whose keys are selector describing the elements to toggle and whose values describe the toggle using any of the previous ways to
	 *                define a toggle.
	 * @return the list
	 */
    'wire': function(events, toggles) {
    	return each(this, function(li) {
    		function select(selector) {
    			return $(selector||li, (selector && !/^#/.test(selector))?li:undef);
    		}
    		function toggleFunc(selector, args) { 
    			return isFunction(args) ? [toggles] :
					isString(args) ? [select(selector).toggle(args)] :
					isList(args) ? (isFunction(args[0]) ? args : [M.prototype.toggle.apply(select(selector), args)]) :
					collect(args, toggleFunc);
    		}
    		var e, toggleList = toggleFunc(null, toggles);

    		eachObj(isString(events) ? {'':events} : events, function(selector, eventSpec) {
    			each(eventSpec.split(/\s+/), function(event) {
    				select(selector).on(e = replace(event, /^[+-]/), function(v) {each(toggleList, function(toggle) {toggle(v);});}, [/^\+/.test(event) || (event==e && undef)]);
    			});
    		});
    	});
    },
    
    
    // toggle variant allowing unlimited states
	'toggle': function(states, durationMs, linearity) {
		var self = this;
		var animState = {};
		var state = 0, regexg = /\b(?=\w)/g;

		if (isString(states))
			return self['toggle']([replace(a, regexg, '-'), replace(a, regexg, '+')]);
		else {
			return self['set'](states[0]) && 
			    function(newState) {
					if (newState === state) 
						return;
					state = isNumber(newState) ? newState : (state+1)%states.length;
	
					if (durationMs) 
						self['animate'](states[state], animState['stop'] ? (animState['stop']() || animState['time']) : durationMs, linearity, animState);
					else
						self['set'](states[state]); 
				};
		}
	},
}, function(n, v) {$.prototype[n]=v;});
	
hhEach({	

}, function(n, v) {MINI[n]=v;});

