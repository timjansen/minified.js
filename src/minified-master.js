/*
 * Minified.js - Lightweight Client-Side JavaScript Library (full package)
 * Version: @@@VERSION@@@
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 * To the extent possible under law, Tim Jansen has waived all copyright and related or neighboring rights to Minified.
 * Please see http://creativecommons.org/publicdomain/zero/1.0/.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * 
 * Contains code based on https://github.com/douglascrockford/JSON-js (also Public Domain).
 *
 * https://github.com/timjansen/minified.js
 */
// ==ClosureCompiler==
// @output_file_name minified.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==

///#remove
function dummy() {
///#/remove

	/*$
	 * @id ALL
	 * @doc no
	 * @required
	 * This id allows identifying whether both Web and Util are available.
	 */
	

///#include minified-web-full-src.js  commonAmdStart
///#include minified-web-full-src.js  webVars
///#include minified-util-full-src.js utilVars
///#include minified-util-full-src.js commonFunctions
///#include minified-web-full-src.js  webFunctions
	
///#include minified-extras-full-src.js extrasFunctions
///#include minified-extras-full-src.js extrasDocs
	
///#include minified-util-full-src.js utilM
	
	
	//// LIST FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	copyObj({
		///#include minified-util-full-src.js utilListFuncs
		///#include minified-web-full-src.js webListFuncs
		///#include minified-extras-full-src.js extrasListFuncs
	}, M.prototype);
	
			
	//// DOLLAR FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	copyObj({
		///#include minified-web-full-src.js webDollarFuncs
		///#include minified-extras-full-src.js extrasDollarFuncs
	}, $);
	

	//// UNDERSCORE FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	copyObj({
		///#include minified-util-full-src.js utilUnderscoreFuncs
		///#include minified-extras-full-src.js extrasUnderscoreFuncs
	}, _);
	

	////INITIALIZATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///#include minified-web-full-src.js webInit


	return {
		///#include minified-extras-full-src.js extrasExports
		///#include minified-util-full-src.js utilExports
		///#include minified-web-full-src.js webExports
	};

///#include minified-web-full-src.js  commonAmdEnd
///#include minified-web-full-src.js  webDocs
	
///#remove
	}
///#/remove
	