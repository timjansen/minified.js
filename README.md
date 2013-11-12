Minified Web
=============

Quick Links: <a href="http://minifiedjs.com/">minifiedjs.com</a> - <a href="http://minifiedjs.com/api/">API</a> - <a href="http://minifiedjs.com/docs/">Docs</a>
Latest version: <a href="http://minifiedjs.com/docs/beta3.html">beta 3</a> (<a href="CHANGES.md">changelog</a>)

Overview
----------
Minified.js is a client-side JavaScript library with low footprint (&lt;8kB) and a large feature set. 
It offers jQuery-like features (DOM manipulation, animation, events, HTTP requests) and utility 
functions (collections, date&amp;number formatting, date arithmtic, templates) with a simple, coherent API.
  	

Size Comparison
-----------------
For beta 3:
<table>
<tr><th>Name</th><th>Legacy IE Support</th><th>Compiled Size</th><th>Compiled and GZip'd</th></tr>
<tr><th>Minified</th><td>no</td><td>19.1kb</td><td><strong>8075bytes</strong></td></tr>
<tr><th>...with IE6-8 support</th><td>no</td><td>20.8kb</td><td>8828 bytes</td></tr>
<tr><th>...Web Module only</th><td>yes</td><td>9.3kb</td><td><strong>4075 bytes</strong></td></tr>
<tr><th>...Web Module with IE6-8 support</th><td>yes</td><td>11.1kb</td><td>4881 bytes</td></tr>
<tr><th>jQuery 1.10.2</th><td>yes</td><td>91kb</td><td>32kb</td></tr>
<tr><th>jQuery 2.0.3</th><td>no</td><td>82kb</td><td>29kb</td></tr>
<tr><th>MooTools Core NoCompat 1.4.5</th><td>yes</td><td>88kb</td><td>29kb</td></tr>
<tr><th>Zepto.js 1.0</th><td>no</td><td>27kb</td><td>9.7kb</td></tr>
</table>



Feature Comparison
--------------------
The goal of Minified is to provide all the basics that you may need on an HTML page. 
<table>
<tr><th>Feature</th><th>Minified</th><th>Minified Web</th><th>jQuery</th><th>MooTools</th><th>Zepto.js</th></tr>
<tr><th>CSS Selector</th><td>yes<div class="cmpExpl">CSS1 or browser engine</div></td><td>yes<div class="cmpExpl">CSS1 or browser engine</div></td><td>yes<div class="cmpExpl">CSS3 subset + extensions</div></td><td>yes<div class="cmpExpl">CSS3 subset + extensions</div></td><td>yes<div class="cmpExpl">browser engine</div></td></tr>
<tr><th>CSS Style Changes</th><td>yes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><th>CSS Class Changes</th><td>yes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><th>Element Creation</th><td>yes</td><td>yes</td> <td>yes<div class="cmpExpl">HTML-strings only</div></td> <td>yes</td> <td>yes<div class="cmpExpl">HTML-strings only</div></td></tr>
<tr><th>Element Cloning</th><td>yes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><th>DOM Manipulation</th><td>yes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><th>Animation (numeric)</th><td>yes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes<div class="cmpExpl">CSS transitions only</div></td></tr>
<tr><th>Animation (color)</th><td>yes</td><td>yes</td> <td>no</td> <td>yes</td> <td>yes<div class="cmpExpl">CSS transitions only</div></td></tr>
<tr><th>Events</th><td>yes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><th>DOMReady</th><td>yes</td><td>yes</td><td>yes</td><td>yes</td> <td>yes</td></tr>
<tr><th>Ajax/XHR</th><td>yes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><th>Promises/A+-compatible</th><td>yes</td><td>yes</td> <td>yes</td> <td>no</td> <td>no</td></tr>
<tr><th>JSON</th><td>yes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><th>Cookies</th><td>yes</td><td>yes</td> <td>no</td> <td>yes</td> <td>no</td></tr>
<tr><th>Form Serialization</th><td>yes</td><td>yes</td> <td>yes</td> <td>no</td> <td>yes</td></tr>
<tr><th>Collection Helpers</th> <td>yes</td><td>no</td> <td>yes</td> <td>yes</td> <td>yes</td></tr>
<tr><th>AMD support</th> <td>yes</td><td>yes</td> <td>yes</td> <td>no</td> <td>no</td></tr>
<tr><th>Templates</th> <td>yes</td><td>no</td> <td>no</td> <td>no</td> <td>no</td></tr>
<tr><th>Number Formatting</th> <td>yes</td><td>no</td> <td>no</td> <td>no</td> <td>no</td></tr>
<tr><th>Date Formatting</th> <td>yes</td><td>no</td> <td>no</td> <td>no</td> <td>no</td></tr>
<tr><th>Date Arithmetic</th> <td>yes</td><td>no</td> <td>no</td> <td>no</td> <td>no</td></tr>
<tr><th>Online Builder</th> <td>yes<div class="cmpExpl">modules and functions</div></td><td>yes<div class="cmpExpl">modules and functions</div></td> <td>no</td> <td>yes<div class="cmpExpl">modules</div></td> <td>no</td></tr>
<tr><th>Internet Explorer 6-8 compatible</th> <td>yes<div class="cmpExpl">IE-support optional</div></td><td>yes<div class="cmpExpl">IE-support optional</div></td> <td>yes<div class="cmpExpl">jQuery 1.x only</div></td> <td>yes</td> <td>no</td></tr>
</table>


What you can expect from Minified Web 
--------------------------------------
* General purpose functions to effectively write HTML-based web applications
* A very small footprint. The complete distribution will always be smaller than 8kB, and the Web module under 4kb.
* A clean and simple, easy to use API.
* A stable API that won't change.


Building
---------
To build Minified, you need to install Node.js and Grunt. Then enter the Minified directory and install the dependencies:
> npm install

To build the whole project including the site, use
> grunt all

If you only want to compile the code, use 
> grunt code


Licensing
-----------
Public Domain. Use, modify and distribute it any way you like. No attribution required.
To the extent possible under law, Tim Jansen has waived all copyright and related or neighboring rights to Minified.
Please see http://creativecommons.org/publicdomain/zero/1.0/


About Minified
---------------
Call me old-fashioned, but the size of JavaScript libraries like jQuery and MooTools has always bothered me. 
Don't get me wrong, they are fantastic libraries and I really like to use them, but they contain about 90kb of code even after minification. 
This code needs to be parsed and executed on every page that you include them on.  For me, that just feels too large for what that they offer, 
and especially for what I need. The 30kb size that they have after gzipping will can also cause a significant delay on low-bandwidth networks.

In the last years I worked on some personal projects (<a href="http://timjansen.github.io/jarfiller/">jarfiller.org</a> is the only one that has been published), 
and when I work on them, I usually strive for perfection. Every unnecessary kilobyte hurts.  So instead of using jQuery, I started writing my own 
little helper functions to replace jQuery functionality without the overhead. As I worked on several other projects, I wrote more and more helper 
functions and started sharing them between projects until they became a library of their own.  By now they are so mature that I believe that this 
library, called Minified, became a valid alternative to jQuery and MooTools at a fraction of the size.

Thank you for checking out Minified.
			Tim Jansen
