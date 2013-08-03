Minified Change Log
====================


Ongoing
--------------------
* New method: offset() to get page coordinates of an element
* Changed filter(): removed value argument, only function possible
* In values(), the returned map values will always be arrays.



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

