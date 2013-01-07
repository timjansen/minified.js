<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fn="http://www.w3.org/2005/xpath-functions"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
				xmlns:page="http://tjansen.de/minifiedPage"
				xmlns:i="http://tjansen.de/internal"
				xmlns="http://www.w3.org/1999/xhtml">
<xsl:output method="html" encoding="utf-8" indent="yes" />
<xsl:template match="/">
<xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html></xsl:text>
<html>
<head>
<meta charset="UTF-8" />
<title><xsl:value-of select="/page:page/page:title"/></title>
<style type="text/css">
body {margin: 0; font-family: Calibri, Thesis, Frutiger, Myriad, Verdana, sans-serif;}
#head, #foot, #main {margin: 0; width: 100%; padding: 0.2em;  vertical-align: middle;}
.container { margin: auto; width: 70em; }
#head .container { height: 2.4em; border-bottom: 1px solid #aaa; padding: 0; }
#head .container img { height: 2em; float: left; margin: 0.2em 0.5em;} 
#topMenu { text-align: right;}
#topMenu a { display: inline-block; height: 1.4em; padding: 0.5em 1em 0.5em; color: black; text-decoration: none; vertical-align: middle;}
#topMenu a:hover { color: white; background-color: #f80; }
#topMenu a.selected,  #topMenu a:hover.selected { color: white; background-color: black; }
#foot .container { height: 2.4em; border-top: 1px solid #aaa; padding: 0; }
#foot .container p { font-size: smaller; color: #bbb; margin: 0.5em; padding: 0; text-align: left; }
#foot .container A { color: #888; font-weight: bold; font-size: smaller; }
#main .container { padding: 1em; }
</style>
<script type="text/javascript" src="minified-src.js"></script>
</head>
<body>
<div id="head">
	<div class="container">
		<img src="img/minified.svg" />
		<div id="topMenu">
			<a class="{if (/page:page/page:section='home') then 'selected' else 'notSelected'}" href="/">Home</a>
			<a class="{if (/page:page/page:section='download') then 'selected' else 'notSelected'}" href="/download">Download</a>
			<a class="{if (/page:page/page:section='build') then 'selected' else 'notSelected'}" href="/build">Build</a>
			<a class="{if (/page:page/page:section='tutorial') then 'selected' else 'notSelected'}" href="/tutorials">Tutorials</a>
			<a class="{if (/page:page/page:section='reference') then 'selected' else 'notSelected'}" href="/api">Reference</a>
			<a class="{if (/page:page/page:section='about') then 'selected' else 'notSelected'}" href="/about">About</a>
		</div>
	</div>
</div>
<div id="main">
	<div class="container">
		<xsl:copy-of select="/page:page/page:main/node()"/>
	</div>
</div>
<div id="foot">
	<div class="container">
		<p>Please send feedback to <a href="mailto:tim@tjansen.de">tim@tjansen.de</a>.
		You may follow me on Twitter, <a href="https://twitter.com/timjansen">@timjansen</a>, but 
		don't expect too much.
		<a href="/impressum.html">Legal Notice / Impressum</a>.</p>
	</div>
</div>


</body>
</html>
</xsl:template>
</xsl:stylesheet>
