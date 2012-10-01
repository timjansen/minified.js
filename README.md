minified.js
============

Overview
----------
minified.js is a universal javascript library for HTML applications. It gives you a clean and simple API that provides you 
with everything that you need to work interact with the browser on an HTML page. 

While the purpose and scope of minified.js are comparable to jQuery and MooTools, its size is 
smaller by an order of magnitude. The compressed size under 9kb, and the gzip'd size is less than 4kb. 
You can make it even smaller if you don't require all modules of minified.js. The build tool allows you to remove 
everything that you don't need to reduce its size even more. 

Size Comparison
-----------------
<table>
<tr><th>Name</th><th>Minified Size</th><th>Minified and GZip'd</th></tr>
<tr><td>minified.js (standard)</td><td>8.7kb</td><td>3.9kb</td></tr>
<tr><td>minified.js (no IE6/7/8 compatibility)</td><td>7.3kb</td><td>3.2kb</td></tr>
<tr><td>jQuery 1.8.2</td><td>91kb</td><td>32.7kb</td></tr>
<tr><td>MooTools Core NoCompat 1.4.5</td><td>88kb</td><td>29kb</td></tr>
<tr><td>Zepto.js 1.0rc1</td><td>23kb</td><td>8.4kb</td></tr>
</table>

Feature Comparison
--------------------
The goal of minified.js is to provide everything you need on an HTML page to interact with the web browser. Everything else is out-of-scope. 
Specifically, it does not include polyfills, a class framework, helper for JavaScript core types or similar things. 
If you need them, <a href="http://microjs.com">microjs.com</a> is a great place to find them.
<table>
<tr><th>Feature</th><th>minified.js</th><th>jQuery</th><th>MooTools</th><th>Zepto.js</th></tr>
<tr><td>CSS Selector</td><td>yes (limited)</td><td>yes (CSS3 + extensions)</td><td>yes (CSS3 + extensions)</td><td>yes (CSS3)</td></tr>
<tr><td>CSS Style Changes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>CSS Class Changes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>Element Dimension</td><td>yes</td> <td>yes (HTML-strings only)</td> <td>yes</td> <td>yes (HTML-strings only)</td></tr>
<tr><td>Element Creation</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>DOM Manipulation</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>Wiring</td><td>yes</td> <td>no</td> <td>no</td> <td>no</td></tr>
<tr><td>Animation (numeric)</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes (using CSS transitions only)</td></tr>
<tr><td>Animation (color)</td><td>yes</td> <td>no</td> <td>yes</td> <td>yes (using CSS transitions only)</td></tr>
<tr><td>Events</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>DOMReady</td><td>yes</td><td>yes</td><td>yes</td> <td>yes</td></tr>
<tr><td>Ajax/XHR</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>JSON</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>Cookies</td><td>yes</td> <td>no</td> <td>yes</td> <td>no</td></tr>
<tr><td>Array Helpers (Iteration)</td> <td>no</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>Class Framework</td> <td>no</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>Online Builder</td> <td>yes (modules and functions)</td> <td>no</td> <td>yes (modules)</td> <td>no</td></tr>
<tr><td>Internet Explorer compatible</td> <td>yes</td> <td>yes</td> <td>yes</td> <td>no</td></tr>
</table>


What you can expect from minified.js
-------------------------------------
* General purpose functions to effectively write HTML-based web applications
* A very small footprint. It will always be smaller than 4kb.
* A clean and simple, easy to use API 
* A stable API that won't change


Background
------------
Maybe I am an old-fashioned guy, but the size of JavaScript libraries like jQuery and MooTools has always bothered me. 
Don't get me wrong, they are fantastic libraries and I really like to use them, but they contain about 90kb of code even after minification. 
This code needs to be parsed and executed on every page that you include them on.  For me, that just feels too large for what that they offer, 
and especially for what I need. And the 25-30kb size that they have after gzipping will can also cause a significant delay on low-bandwidth networks.

In the last years I worked on some personal projects (<a href="http://jarfiller.org">jarfiller.org</a> is the only one that has been published), 
and when I work on them, I usually strive for perfection. Every unnecessary kilobyte hurts.  So instead of using jQuery, I started writing my own 
little helper functions to replace jQuery functionality without the overhead. As I worked on several projects, I wrote more and more helper 
functions and started sharing them between projects until they became a library of their own.  By now they are so mature that I believe that this 
library, called minified.js, became a valid alternative to jQuery and MooTools at a fraction of the size.
