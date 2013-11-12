Minified Change Log
====================

Beta 3.1 (2013-11-13)
---------------------
* Made $.ready() work when Minified is loaded after the DOM's initialization.


Beta 3 (2013-11-07)
--------------------
* Added Util module.
* New distribution minified.js, containing both Util and Web.
* Replaced ant-based build system with Grunt.
* Converted all tests to use Mocha.
* Packaged as Bower module.

Full distribution only:
* New method: ht() replaces node content with HTML template.
* New method: HTML() creates element factory from HTML template.

Web module:
* New method: offset() to get page coordinates of an element.
* New method: dial() returns a function that transitions elements between two states.
* New method: onChange() invokes an event handler when an input's content changes.
* New get()/set()/animate() properties: $$scrollX and $$scrollY.
* New argument startIndex for find().
* Changed on(): accepts sub-selectors. The bubble selector argument is now the last argument. The 'fThis' argument has been removed.
* Changed EE() and clone(): they return elements in a list, instead of element factories.
* Changed add(), fill(), addBefore()...: will clone elements if added to more than one parent.
* Changed filter(): removed value argument, only function possible.
* In on(), the handler's return value is always ignored, unless the event name is prefixed with '?'.
* In values(), the returned map values will always be arrays.
* In animate(), removed the '+=10px' syntax, added function(oldValue, index, obj) support instead.
* In animate(), removed animState param. stop() is now a property of the promise, time is returned by stop().
* In toggle(), removed the (undocumented) option of using functions as states; toggle funcs don't return promises anymore. 
* In setCookie(), removed the path and domain options.
* In only(), supports numeric argument to select element by index.
* Moved setCookie() and getCookie() to the complete distribution.

Bugfixes:
* Make $(window) work.
* Handle CSS classes containing dashes correctly.
* on() handler's 'this' now contains the element the handler is registered on, not the event source.
* corrected bubbling with live selectors



Beta 2 (2013-07-31)
--------------------
* Changed target size: the Minified Web version without legacy IE support will be <4kB, but the version with legacy support will be >4kB
* Worked on automatically preventing legacy IE event handler memory leaks. remove() will now unregister event handlers. In beta 1, you
  needed to do this manually.
* New method trav() to traverse properties
* New method select() to execute a selector in the list's context
* New method is() to check whether node matches selector.
* New method only() to filter for nodes that match a selector.
* New method onOver() for mouse over effects.
* New method trigger() to fire custom events.
* New method values() to read form data.
* New prefix '%' for get() and set(): used to access data attributes ('%myattr' is short for '@data-myattr')
* New property MINI.M exposes Minified's list class for extensions etc
* $() will now automatically remove duplicates when using selectors
* toggle() returns Promise for animated toggles; supports functions as state.
* on() got a new parameter 'selector' for delegated events
* Removed hasClass(). Use is() instead.
* Removed wait(). It will re-appear in the util module soon.
* Removed Promise.always(). It will re-appear in the util module soon.
* IE9 compatibility can be turned off in builder. This can save some bytes.

Beta 1 (2013-07-13)
--------------------
First release.

