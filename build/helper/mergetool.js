/**
 * JavaScript preprocessor that merges JavaScript files.
 * 
 * Syntax:
 * In input file, there can be statements 
 *    ///#include filename snippetname
 * To include a snippet from a file (relative to bath path).
 * 
 * Snippets in the input file can be removed using
 *    ///#remove
 *      .. block to remove ..
 *    ///#/remove
 *    
 * The included files must declare snippets like this:
 *    ///#snippet snippetname
 *     ... code to include ...
 *    ///#/snippet 
 */

var _ = require('minified-headless');


function merge(src, readFile) {
	var inRemove = false;
	var fileCache = {}; // fileName -> snippetName -> [lineArray]
	var match;
	
	return _.collect(src.split('\n'), function(line) {
		if (inRemove) {
			if (/^\s*\/\/+\s*#\/remove\b/.test(line))
				inRemove = false;
			return null;
		}
		else if (/^\s*\/\/+\s*#remove\b/.test(line)) {
			inRemove = true;
			return null;
		}
		else if (match = /^\s*\/\/+\s*#include\s+([\w._-]+)\s+(\w+)\b/.exec(line))
			return findSnippet(match[1], match[2], fileCache, readFile);
		else
			return line;
	
	}).join('\n');
}

function parseIncludeFile(src) {
	var snippets = {}; // snippetName -> [lineArray]
	var inSnippet = null; // currentSnippet name or null
	var currentSnippet = [];
	var match;
	
	_.each(src.split('\n'), function(line) {
		if (inSnippet) {
			currentSnippet.push(line);
			
			if (match = /^\s*\/\/+\s*#\/snippet\b(\s*(\w+)\b)?/.exec(line)) {
				if (match[2] && match[2] != inSnippet)
					throw "Snippet end \""+match[2]+"\" does not match \""+inSnippet+"\".";
				snippets[inSnippet] = currentSnippet;
				
				inSnippet = null;
				currentSnippet = [];
			}
		}
		else if (match = /^\s*\/\/+\s*#snippet\s+(\w+)\b/.exec(line)) {
			inSnippet = match[1];
			currentSnippet.push(line);
		}
	});
	
	return snippets;
}

function findSnippet(fileName, snippetName, fileCache, readFile) {
	if (!fileCache[fileName]) {
		var src = readFile(fileName);
		if (src == null)
			throw "Can not find file "+fileName;
		fileCache[fileName] = parseIncludeFile(src);
	}

	var snippet = fileCache[fileName][snippetName];
	if (!snippet)
		throw "Can not find snippet "+snippetName+" in file "+fileName;
	return snippet;
}

module.exports.merge = merge;
