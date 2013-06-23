<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fn="http://www.w3.org/2005/xpath-functions"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
				xmlns:page="http://tjansen.de/minifiedPage"
				xmlns:i="http://tjansen.de/internal"
				xmlns="http://www.w3.org/1999/xhtml">
<xsl:output method="html" encoding="utf-8" indent="no" />
<xsl:template match="/">
<xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html></xsl:text>
<html>
<head>
<meta charset="UTF-8" />
<title><xsl:value-of select="/page:page/page:title"/></title>
<xsl:if test="count(/page:page/page:externalCss)=0"><link rel="stylesheet" type="text/css" href="/css/minimum.css"/></xsl:if>
<xsl:for-each select="/page:page/page:externalCss"><link rel="stylesheet" type="text/css" href="{.}"/></xsl:for-each>
<xsl:for-each select="/page:page/page:inlineCss"><style type="text/css"><xsl:value-of select="."></xsl:value-of></style></xsl:for-each>
<xsl:for-each select="/page:page/page:asyncJs"><script type="text/javascript" src="{.}" async="async"></script></xsl:for-each>
<xsl:for-each select="/page:page/page:externalJs"><script type="text/javascript" src="{.}"></script></xsl:for-each>
<xsl:for-each select="/page:page/page:inlineJs"><script type="text/javascript"><xsl:value-of select="."></xsl:value-of></script></xsl:for-each>
<!--  TEMP SPLASH SCREEN START -->
<script src="/minified-web.js"></script>
<script type="text/javascript">
var MINI = require('minified'), $ = MINI.$, $$ = MINI.$$, EE = MINI.EE;

$(function() {
	if (!$.getCookie('y'))
		$('body').add(EE('div', {'@id': 'cover', $position: 'fixed', $left: 0, $top: 0, $width:'100%', $height: '100%', $backgroundColor: 'white'}, 
			EE('div', {$position: 'absolute', $left: '50%', $top: '50%', $marginLeft: '-15em', $marginTop: '-4em', $width: '30em', $height: '8em', $padding: '1em', $border: '1px solid #bbb', $textAlign: 'center'}, [
				EE('h1', {$marginTop: 0}, 'Psssst!'), 
				EE('p', 'Minified is still a secret. Please don\'t tell anyone.'),
				EE('button', {}, 'Alrighty', function(l) {
					$(l).on('click', function() {
						$.setCookie('y', 1);
						$('#cover').animate({$$fade: 0}).then(function() {$('#cover').remove();});
					});
				})
			])
		));
});
</script>
<!--  TEMP SPLASH SCREEN END -->
</head>
<body>
<div id="head">
	<div class="container">
		
		<a href="/"><xsl:value-of select="&quot;&lt;!--[if lte IE 8]>&lt;img src='/img/minified-small.png' alt='Minified'>&lt;![endif]-->
		&lt;!--[if gt IE 8]>&lt;img src='/img/minified.svg' alt='Minified'>&lt;![endif]-->
		&lt;!--[if !IE]> -->&lt;img src='/img/minified.svg' alt='Minified'/>&lt;!-- &lt;![endif]-->&quot;" disable-output-escaping="yes"/></a>

		<div id="topMenu">
			<a class="{if (/page:page/page:section='home') then 'selected' else 'notSelected'}" href="/">Home</a>
			<a class="{if (/page:page/page:section='download') then 'selected' else 'notSelected'}" href="/download/">Download</a>
			<a class="{if (/page:page/page:section='build') then 'selected' else 'notSelected'}" href="/builder/">Build</a>
			<a class="{if (/page:page/page:section='docs') then 'selected' else 'notSelected'}" href="/docs/">Documentation</a>
			<a class="{if (/page:page/page:section='reference') then 'selected' else 'notSelected'}" href="/api/">API</a>
			<a class="{if (/page:page/page:section='about') then 'selected' else 'notSelected'}" href="/about/">About</a>
		</div>
	</div>
</div>
<div id="main">
	<div class="container">
		<xsl:value-of select="/page:page/page:main" disable-output-escaping="yes"/>
	</div>
</div>
<div id="foot">
	<div class="container">
		<p>Please send feedback to <a href="mailto:tim@tjansen.de">tim@tjansen.de</a>. For updates visit the 
		<a href="https://plus.google.com/100950045026999226880/posts">Google+ page</a>.
		<a href="/impressum.html">Legal Notice / Impressum</a>.</p>
	</div>
</div>


</body>
</html>
</xsl:template>
</xsl:stylesheet>
