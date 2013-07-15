Minified Change Log
====================


Beta 1 (2013-07-13)
--------------------
First release.

Ongoing Development
--------------------
* Changed target size: the Minified Web version without legacy IE support will be <4kB, but the version with legacy support will be >4kB
* Worked on automatically preventing legacy IE event handler memory leaks. remove() will now unregister event handlers. In beta 1, you
  needed to do this manually.
* Added 'selected' parameter to on()
* New method trigger() to fire custom events.
* New method values() to read form data.
