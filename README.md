Minified Web
=============

Overview
----------
Minified Web is a universal JavaScript library for HTML applications. It gives you a clean and simple API that provides you 
with everything that you need to work interact with the browser on an HTML page. 

While the purpose and scope of Minified Web are comparable to jQuery and MooTools, its size is 
smaller almost by an order of magnitude. The compressed size under 9kb, and the gzip'd size is less than 4kb. 
You can make it even smaller if you don't require all modules of Minified Web. The build tool allows you to remove 
everything that you don't need to reduce its size even more. 

Size Comparison
-----------------
<table>
<tr><th>Name</th><th>Legacy IE Support</th><th>Compiled Size</th><th>Compiled and GZip'd</th></tr>
<tr><td>minified-web.js</td><td>IE6 and higher</td><td>9.0kb</td><td>4090 bytes</td></tr>
<tr><td>minified-web.noie.js</td><td>no</td><td>7.6kb</td><td>3428 bytes</td></tr>
<tr><td>jQuery 1.10.0</td><td>IE6 and higher</td><td>91kb</td><td>32kb</td></tr>
<tr><td>jQuery 2.0.1</td><td>no</td><td>82kb</td><td>28kb</td></tr>
<tr><td>MooTools Core NoCompat 1.4.5</td><td>IE6 and higher</td><td>88kb</td><td>29kb</td></tr>
<tr><td>Zepto.js 1.0</td><td>no</td><td>27kb</td><td>9.7kb</td></tr>
</table>

Feature Comparison
--------------------
The goal of Minified Web is to provide everything you need on an HTML page to interact with the web browser. Everything else is out-of-scope. 
Specifically, it does not include polyfills, a class framework, helper for JavaScript core types or similar things. 
If you need them, <a href="http://microjs.com">microjs.com</a> is a great place to find them.
<table>
<tr><th>Feature</th><th>Minified</th><th>jQuery</th><th>MooTools</th><th>Zepto.js</th></tr>
<tr><td>CSS Selector</td><td>yes<div class="cmpExpl">CSS1 or browser engine</div></td><td>yes<div class="cmpExpl">CSS3 subset + extensions</div></td><td>yes<div class="cmpExpl">CSS3 subset + extensions</div></td><td>yes<div class="cmpExpl">browser engine</div></td></tr>
<tr><td>CSS Style Changes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>CSS Class Changes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>Element Creation</td><td>yes</td> <td>yes<div class="cmpExpl">HTML-strings only</div></td> <td>yes</td> <td>yes<div class="cmpExpl">HTML-strings only</div></td></tr>
<tr><td>Element Cloning</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>DOM Manipulation</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>Animation (numeric)</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes<div class="cmpExpl">CSS transitions only</div></td></tr>
<tr><td>Animation (color)</td><td>yes</td> <td>no</td> <td>yes</td> <td>yes<div class="cmpExpl">CSS transitions only</div></td></tr>
<tr><td>Events</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>DOMReady</td><td>yes</td><td>yes</td><td>yes</td> <td>yes</td></tr>
<tr><td>Ajax/XHR</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>Promises/A+-compatible</td><td>yes</td> <td>yes</td> <td>no</td> <td>no</td></tr>
<tr><td>JSON</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>Cookies</td><td>yes</td> <td>no</td> <td>yes</td> <td>no</td></tr>
<tr><td>Form Serialization</td><td>no</td> <td>yes</td> <td>no</td> <td>yes</td></tr>
<tr><td>Array Helpers (Iteration)</td> <td>no</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><td>AMD support</td> <td>yes</td> <td>yes</td> <td>no</td> <td>no</td></tr>
<tr><td>Online Builder</td> <td>yes<div class="cmpExpl">modules and functions</div></td> <td>no</td> <td>yes<div class="cmpExpl">modules</div></td> <td>no</td></tr>
<tr><td>Internet Explorer compatible</td> <td>yes</td> <td>yes<div class="cmpExpl">jQuery 1.x only</div></td> <td>yes</td> <td>no</td></tr>
</table>


What you can expect from Minified Web 
--------------------------------------
* General purpose functions to effectively write HTML-based web applications
* A very small footprint. It will always be smaller than 4kb.
* A clean and simple, easy to use API 
* A stable API that won't change

Licensing
-----------
Minified has been released into the Public Domain. You can use, copy, distribute and modify Minified
without any copyright restrictions. You may even release it under your name and call it yours, if that's your thing.


About Minified
---------------
Call me old-fashioned, but the size of JavaScript libraries like jQuery and MooTools has always bothered me. 
Don't get me wrong, they are fantastic libraries and I really like to use them, but they contain about 90kb of code even after minification. 
This code needs to be parsed and executed on every page that you include them on.  For me, that just feels too large for what that they offer, 
and especially for what I need. The 30kb size that they have after gzipping will can also cause a significant delay on low-bandwidth networks.

In the last years I worked on some personal projects (<a href="http://jarfiller.org">jarfiller.org</a> is the only one that has been published), 
and when I work on them, I usually strive for perfection. Every unnecessary kilobyte hurts.  So instead of using jQuery, I started writing my own 
little helper functions to replace jQuery functionality without the overhead. As I worked on several other projects, I wrote more and more helper 
functions and started sharing them between projects until they became a library of their own.  By now they are so mature that I believe that this 
library, called Minified, became a valid alternative to jQuery and MooTools at a fraction of the size.

What you see here is only the beginning, a 4kb module for building web sites. The plan is to have three modules, each under 4kb:
<ul><li><strong>Minified Web</strong> is a browser interaction library, comparable to jQuery or MooTools. It is available now.</li>
<li><strong>Minified Util</strong> offers utilities for lists and maps, functions, promises, string and number formatting, date handling and 
internationalization. Its scope and size can be compared to <a href="http://underscorejs.org/">Underscore</a>, but it omits the more 
obscure functional helpers and replaces them with date and string helpers. You can find an early version in the /src directory
on GitHub.</li>
<li><strong>Minified Apps</strong> will be a MVC-oriented library for single-page applications and complex multi-page apps.
The scope will be somewhat similar to Backbone or Angular.js, but with a Plain-Old-JSON-Object (POJO) principles and a template/binding
concept that is closely tied to the page's DOM and is predestinated for <a href="http://www.w3.org/TR/components-intro/#template-section">HTML5 templates.
It is built upon the other two modules. A preview should be available by the end of 2013.</li>
</ul>

Thank you for checking out Minified.
			Tim Jansen
