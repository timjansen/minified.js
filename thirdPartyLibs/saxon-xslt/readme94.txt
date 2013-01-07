==============================

Saxon-HE 9.4 is the latest major release of the open-source edition of Saxon. 
It is available for both the Java and .NET platforms.

The current maintenance release is Saxon-HE 9.4.0.6.

The documentation for Saxon is at http://www.saxonica.com/documentation/
and includes a detailed list of changes for each release.

For the Java platform, download file SaxonHE9-4-0-6J.zip. Installation instructions are at
http://www.saxonica.com/documentation/about/installationjava.xml

For the .NET platform, download file SaxonHE9-4-0-6N-setup.exe. 
Installation instructions are at http://www.saxonica.com/documentation/about/installationdotnet.xml

The file saxon-resources9-4.zip contains documentation, sample files, test drivers and other miscellaneous resources. 
It is common to both platforms, and is not normally updated when new maintenance releases appear.

The file saxon9-4-0-6source.zip contains source code for both platforms; a new version is produced with each 
maintenance release. Source code with the latest patches can also be obtained from a Subversion repository
maintained at http://dev.saxonica.com/archive/opensource. The Subversion repository on the SourceForge
site is no longer maintained.

The following bugs are cleared in 9.4.0.6, issued 2012-10-05 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :


	1569	xsl:decimal-format import precedence
	1571	Conflicting xsl:decimal-format declarations
	1572	map:keys() fails with java.lang.ClassCastException: equals on StringValue is not allowed
	1573	Internal Saxon error using xsl:iterate
	1575	ArrayIndexOutOfBoundsException error when Bytecode generation is enabled
	1576	IllegalArgumentException when function-lookup() retrieves component access functions
	1577	NullPointerException when function-lookup() retrieves a Java extension function
	1578	IllegalState exception thrown when function-lookup() retrieves a compile-time functionm
	1579	ArrayIndexOutOfBounds Exception thrown when function-lookup() retrieves the name() function
	1580	NullPointerException when function-lookup() retrieves the uri-collection() function
	1581	Importing multiple schema documents for XML namespace
	1583	NullPointerException when cast to a built-in list type IDREFS using function literal
	1584	NullPointerException when line numbering switched on
	1585	NullPointerException when using xsl:mode on-no-match="text-only-copy" and streaming enabled
	1586	Attribute validation doesn't happen for parentless attributes with bytecode off
	1589	Internal error: invalid slot number for local variable, with a constant filter expression
	1593	Saxon .NET throws NoClassDefFoundError when bytecode generation is enabled
	1594	XSLT3.0: XSL:Copy with select attribute
	1596	Strange behaviour of xsl:sort with lang
	1597	A context item declaration is allowed only in XQuery 1.1
	1598	(Maybe) wrong handling of empty sequences in fn:min() and fn:max()
	1599	NullPointerException thrown when calling Java Extension function
	1600	Incorrect optimization of global variables in XSLT
	1601	Incorrect exit code reported in command-line com.saxonica.Validate
	1604	Documents read using the collection() function in XSLT are not whitespace-stripped
	1606	java.lang.UnsupportedOperationException: Cannot enumerate an infinite set
	1608	ClassCastException in XQuery
	1610	Imported/included stylesheet modules: well-formedness errors not reported to application
	1612	Poor error message "Cannot compare" from ValueComparison bytecode
	1614	Problem with typeswitch in XQuery?
	1616	Query wrongly reported to make no use of context item
	1618	XSLT Pattern of the form descendant::x is not rejected
	1621	After 25 warnings, schema validator stops reporting errors
	1622	saxon:assignable is not recognized
	1623	Variable inlining into body of saxon:assign does not work
	1624	Dynamic errors in global variables when tracing is enabled
	1625	ClassCastException thrown when constructing documents with treemodel: JDOM
	1626	ClassCastException thrown when constructing documents with treemodel: DOM4J
	1627	ClassCastException thrown when constructing documents with treemodel:XOM
	1631	Error: Function data should have been resolved at compile-time

The following bugs are cleared in 9.4.0.4, issued 2012-06-25 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

	1565	NullPointerException if xs:assert used in a schema without enabling XSD 1.1	
	1564	Incorrect NaN comparisons using bytecode generation	
	1558	FeatureKeys.STANDARD_ERROR_OUTPUT_FILE defined log-file is still locked when transform(...) is completed	
	1549	UnsupportedOperationException: StreamingCopy.copy()	
	1547	-outval:recover doesn't work	
	1546	incorrect XPST0081 if an attribute misc:as is present at xsl:param	
	1543	Wrong priority for pattern containing a trivial predicate	
	1541	xsl:number has dutch translation issues	
	1540	XSLT 2.0: "union" keyword not allowed as an alternative to "|" in a predicate of a pattern	
	1538	ArrayIndexOutOfBoundException with TinyTree	
	1537	Incorrect bytecode for conditional sort expression	
	1534	Setting omit-xml-declaration in a Saxon s9api pipeline does not produce a result with no xml declaration	
	1532	Function-lookup on context dependent function not supported	
	1528	NullPointerException if a literal sequence cannot be converted to the target type	
	1509	Serialization error SEPM0004 not always detected	
	1505	XSD 1.1 IllegalArgumentException - reference to imported element inside override	
	1504	XSD NPE on identity constraint - simple type with attribute	
	1497	Bug	Closed	Low	XSD 1.1 violation of ##definedSibling has slightly misleading error message	
	1493	XSD Error message for invalid Name refers to NCName instead	
	1492	XSD ClassCastException when restricting a list whose item type can't be found	
	1491	XSD 1.1 value "extension" not allowed in final attribute on simpleType	
	1489	XSD "Element declarations consistent" not checked in extensions	
	1488	XSD 1.1 "all" extends "all" and both are optional	
	1487	XSD 1.1 "all" extends "all" and minOccurs is different	
	1485	XSD 1.1 saxon:preprocess does not actually preprocess	
	1484	XSD 1.1 override always results in warning	
	1481	Memory "leak" caused by ThreadLocal converter cache	
	1479	NullPointerException if streaming code executed without Saxon-EE	
	1478	fn:serialize() crashes if document node supplied as second argument	
	1475	saxon:sort() fails to atomize result of supplied function	
	1472	Saxon says "cannot compare" (schema-aware mode) for an XPath expression	
	1467	NegativeArraySizeException when generating bytecode	
	1453	Failure to stream an expression that should be streamable	
	1452	XPathFactory.setFeature(X, false) sets feature to true	
	1451	datatypes.dtd not resolved by built-in entity resolver	
	1450	Poor diagnostics for streamability failure	
	1449	When streaming, NPE during analysis of field[@name]	
	1443	Whitespace normalization of anySimpleType	
	1442	NullPointer Exception in NamespaceConstructor	
	1441	Inadequate checks of XSD facet restrictions	
	1439	Bug	Closed	Low	ArrayIndexOutOfBoundsException when 'group by' and 'order by' used together	
	1438	XSD 1.1 allows any value of source URI in xs:appInfo and xs:documentation	
	1437	XSD 1.1 allows xs:all maxOccurs="0"	
	1436	Failed Modules with spaces in pathnames in .NET	
	1434	Failure in typeCheck of EquivalenceComparison	
	1433	Trace calls with no namespace context	
	1430	NullPointerException if current-grouping-key() called when there is no current grouping key	

The following bugs are cleared in 9.4.0.3, issued 2012-02-28 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

    1422    NullPointerException when inline function in XSLT refers to XSLT local variables
    1421    XQuery error in Saxon-EE 9.4.0.1N: failure to close output file under opt:10
    1420    XPath evaluation against DOM broken for child nodes in empty namespace
    1419    NullPointer Exception in NamespaceConstructor
    1418    NullPointerException when using bad FunctionLiteral in XSLT
    1417    ArrayIndexOutOfBoundsException when 'group by' and 'order by' used together
    1416    Failed Modules with spaces in pathnames in .NET
    1415    Failure in typeCheck of EquivalenceComparison
    1414    Failure to retrieve part of SVG DTD
    1411    Streaming: NPE in FleetingNode getting name of node
    172     Setting ModuleURIResolver from Initializer
    171     xsl:template match="node()" mode="#all"
    170     SchemaURIResolver not called by xs:import
    169     position variable incorrectly removed in ForClause
    168     Tracing of FLWOR expressions
    167     ClassLoader for generated bytecode
    166     Incorrect optimization of xsl:value-of
    165	    NPE when using new option -threads
    164	    Invalid method Code length exception for bytecode	

An incorrect build of 9.4.0.3 was uploaded on 2012-02-27; it was incorrect in that it did not incorporate all
the above fixes. This build was replaced in-situ on 2012-02-28. The two builds have the same version number, but
can be distinguished by the result of Version.getReleaseDate().

The following bugs are cleared in 9.4.0.2, issued 2012-01-20 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under their old SourceForge numbers:

 3476703 	xs:openContent / xs:any / @maxOccurs 
 3476096 	Failing function not properly named in error Message 
 3474854 	Update Expressions: Not Inlining of variable in FLWOR 
 3474341 	NPE after copying extension function call 
 3473810 	Unicode surrogate pairs 	
 3473561 	AssertionError for shared append expression 
 3473555 	XPath setAllowUndeclaredVariables()
 3473031 	NPE after reporting XSLT compilation errors 
 3471840 	IllegalArgumentException in StringToUntypedAtomicCompiler 
 3469783 	Saxon EE 9.4.0.1 - ASM library version conflict 
 3469431 	Tracing of FLWOR expressions 
 3469423 	Saxon 9.4 Dependency on JDK 1.6. 
 3469332 	Location info for FLWOR clauses 
 3468905 	Type-checking for higher-order functions 
 3468419 	Dependencies on JAXP XMLStreamWriter 
 3467644 	Window clause following for clause 	
 3467607 	Tumbling windows implicitly closed 
 3467590 	FLWOR window clause: variables at end of sequence 
 3467555 	Overlapping windows 
 3467539 	NPE after Block.copy()
 3467006 	Optimization of FLWOR expressions 
 3466144 	Only one window notified at end of sequence 
 3466143 	Tail calls and FLWOR expressions 
 3466125 	Tail calls and FLWOR expressions 
 3464429 	position variable incorrectly removed in ForClause 
 3463028 	XQuery 3.0 window clause: left paren after 'when'
 3462928 	Cannot cast CompiledExpression to VariableReference 
 3462497 	Inadequate XQuery tracing 
 3462473 	xsl:template entry missing in -T output 
 3462470 	XSLT Trace output displays text nodes wrongly 
 3460053 	With bytecode generation, no stack trace produced
 3459776 	Validation adding namespaced attribute using SCM
 3459503 	Failing to display byte code for certain inner classes 
 3459500 	Bytecode generation failure of filter expression

In addition there are two changes in the way the product is built in 9.4.0.2:

(a) on .NET, the version of IKVM used is 0.46.0.2. This clears a bug in
bytecode verification that affected Saxon.

(b) in Saxon-EE, the classes making up the ASM bytecode library are now renamed
into com.saxonica packages. This avoids conflicts when Saxon is used with an
application that has a dependency on a different version of the ASM library.



The first release in this series, 9.4.0.1, was issued on 9 December 2011. Release 9.4.0.1 fixes all bugs logged in the 
SourceForge bug tracker dated earlier than 9 December 2011.
