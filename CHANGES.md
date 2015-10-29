Minified Change Log
====================

1.2 (in progress, on-going)
* #59: use HTTP body for PUT in $.request
* #64: provide Promise.error() via Promise.catch() for ES6 compatibility  
* #65: overrideMimeType support for $.request()


1.1 (2015-08-05)
-------------
* broke the 4kb/8kb barrier
* New implementation for promise(), backported from Nia, with better error handling. Unhandled exceptions are re-thrown to the event loop. 
  INCOMPATIBILITY: the promise is not a function anymore, but an object. Use fire() to reject/fulfill. (#54)
* Changed promise implementation in web module. 
  INCOMPATIBILITY: if your then() handler throws an exception, it will be reported to the event loop, but the returned promise will not be rejected anymore. (#54)
* $.request() will accept all 2xx status codes as success (#51)
* Avoid using 'this' instead of 'window' (#56)
* Fixed format() and parseDate() for timezones that are not full hours.


1.0 (2014-07-27)
-----------------
* Avoid crashes when text nodes are used as selector context.


Beta 6.2 (2014-06-22)
--------------------
* added ctx parameter to iterator functions each(), eachObj(), map(), mapObj(), collect(), collectObj(), filter(), filterObj().
* fixed bubble selectors in on(): they cancelled the event even for non-maching elements



Beta 6 (2014-06-06)
--------------------
* added merge()
* MINI.getter and MINI.setter allow you to add new prefixes to set()/get()
* _.promise() supports ES6-style promise resolution
* HTML() and ht() support more than one object as parameter. Objects will be merged automatically.
* #36: added 'xhr' property to $.request()'s promise that contains the raw promise
* added stop() support to $.request()
* added parentNum parameter to up()
* values() uses ids if a form element has no name
* support for bubble selectors in onChange() and onClick()
* $$() now supports the same context and childrenOnly arguments as $()
* onChange() will now work with select elements
* copyObj() can be used to duplicate objects, and will copy inherited values.
* extend() no longer ignores null values and will now copy inherited values.
* changed signatures of request's promise handlers: the success handler is called with the XHR object instead of 
  'responseXml' property as second argument. The failure handler has no 'statusText' anymore (who needs that?).
  Instead it gets the XHR object as last argument.


Beta 5 (2014-03-28)
--------------------
* added up()
* added next()
* added not()
* added isEmpty()
* added onClick()
* added show() and hide()
* added define() (or, rather, documented it)
* added stop() for all promises, to propagate animation cancellation
* added $$show property for set() and get()
* removed delay() and defer(), as they just duplicated setTimeout()
* clone() will now use the browser's cloneNode(). It will only remove the element from the top-level element, but not from any children.
* $$slide and $$fade's behaviour has slightly changed (will not modify $display anymore), please see the API docs.
* formatValue() supports any character as group separator
* updated Minified's promise implementation to the latest Promises/A+ spec (full package only)
* a promise's state can now be obtained by invoking it as a function without arguments (see promise(), full package only). promise.state has been removed.
* set() and get() will automatically convert $float to $cssFloat
* reverse() can be used to reverse strings
* $.request() will only process plain objects as form data or URL parameters anymore. Everything else will be passed to XHR, allowing you to 
  use $.request e.g. with FormData.


Beta 4.2 (2013-12-26)
---------------------
* fixed issue with delay(), wait(), setCookie() and getCookie(). They were in the wrong namespace, _ instead of $.
* added version numbers in all source files.


Beta 4 (2014-12-17)
-------------------
* added onFocus()
* added per()
* added reduce()
* on() will set 'this' to a Minified list containing the event source, instead of the event source itself.
* $.request()'s headers, username and password parameters have been moved into an object as 4th argument. 
  You can now also set XMLHttpRequest properties.
* onOver()'s callback does not support the index argument anymore.
* HTML() and ht() can now retrieve their template from an element, such as a script tag.
* all iterator function will now get the object they are iterating in 'this'


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

