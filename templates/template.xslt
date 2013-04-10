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
<xsl:for-each select="/page:page/page:externalJs"><script type="text/javascript" src="{.}"></script></xsl:for-each>
<xsl:for-each select="/page:page/page:inlineJs"><script type="text/javascript"><xsl:value-of select="."></xsl:value-of></script></xsl:for-each>
</head>
<body>
<div id="head">
	<div class="container">
		<a href="/"><!--[if lte IE 8]><img src='/img/minified-small.png'><![endif]-->
		<!--[if gt IE 8]><img src='/img/minified.svg'><![endif]-->
		<!--[if !IE]> --><img src='/img/minified.svg'/><!-- <![endif]--></a>

		<div id="topMenu">
			<a class="{if (/page:page/page:section='home') then 'selected' else 'notSelected'}" href="/">Home</a>
			<a class="{if (/page:page/page:section='download') then 'selected' else 'notSelected'}" href="/download/">Download</a>
			<a class="{if (/page:page/page:section='build') then 'selected' else 'notSelected'}" href="/builder.html">Build</a>
			<a class="{if (/page:page/page:section='docs') then 'selected' else 'notSelected'}" href="/docs/">Documentation</a>
			<a class="{if (/page:page/page:section='reference') then 'selected' else 'notSelected'}" href="/reference/">API</a>
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
