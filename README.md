Minified 
=========

Quick Links: <a href="http://minifiedjs.com/">minifiedjs.com</a> - <a href="http://minifiedjs.com/api/">API</a> - <a href="http://minifiedjs.com/docs/">Docs</a>
Latest version: <a href="http://minifiedjs.com/blog/2015/08/release11.html">1.1</a> (<a href="CHANGES.md">changelog</a>)

Overview
----------
Minified.js is a client-side JavaScript library that's both powerful and small. It offers jQuery-like features (DOM manipulation, animation, 
events, HTTP requests) and utility functions (collections, date&amp;number formatting, date arithmetic, templates) with a single, consistent API.
  	

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
<tr><th>Animation (numeric)</th><td>yes</td><td>yes</td> <td>yes</td> <td>yes</td> <td>no<div class="cmpExpl">extra module, CSS only</div></td></tr>
<tr><th>Animation (color)</th><td>yes</td><td>yes</td> <td>no</td> <td>yes</td> <td>no<div class="cmpExpl">extra module, CSS only</div></td></tr>
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
Minified is Public Domain. Use, modify and distribute it any way you like. No attribution required.
To the extent possible under law, Tim Jansen has waived all copyright and related or neighboring rights to Minified, as published in the
/src and /dist directories of this repository.
See http://creativecommons.org/publicdomain/zero/1.0/ for details.

Please note that some third-party content of the Minified web site, especially in the /srcContent directory, has been published under different open source licenses. 


Thank you for checking out Minified.
			Tim Jansen
