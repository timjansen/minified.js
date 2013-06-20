/*
 * Minified-app.js - Application framework
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * 
 * https://github.com/timjansen/minified.js
 */

/*
 * When you read this code, please keep in mind that it is optimized to produce small and gzip'able code
 * after being minimized with Closure (http://closure-compiler.appspot.com). Run-time performance and readability
 * should be acceptable, but are not a primary concern.
 */

// ==ClosureCompiler==
// @output_file_name minified-app.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==

 	/*$
 	 * @id minifieddefine
 	 */

define('minifiedApp', function() {
	//// GLOBAL VARIABLES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
 	/*$
 	 * @id window
 	 */
	/**
	 * @const
	 */
	var _this = this;

		
	/*$
	 * @id promise
	 * @module WEB+UTIL
	 */
	function promise() {
		var state; // undefined/null = pending, true = fulfilled, false = rejected
		var deferred = [];   // this function calls the functions supplied by then()

		var assimilatedPromises = arguments;
		var assimilatedNum = assimilatedPromises.length;
		var numCompleted = 0; // number of completed, assimilated promises
		var values = []; // array containing the result arrays of all assimilated promises
	    
		function set(newState, newValues) {
			if (state == null) {
				state = newState;
				values = isList(newValues) ? newValues : [newValues];
				defer(function() {
					each(deferred, function(f) {f();});
				});
			}		
		}

		// use promise varargs
		each(assimilatedPromises, function assimilate(promise, index) {
			try {
				promise['then'](function resolvePromise(v) {
					if (v && isFunction(v['then'])) {
						assimilate(v['then'], index);
					}
					else {
						values[index] = map(arguments, selfFunc);
						if (++numCompleted == assimilatedNum)
							set(true, assimilatedNum < 2 ? values[index] : values);
					}
				}, 
				function rejectPromise(e) {
					values[index] = map(arguments, selfFunc);
					set(false, assimilatedNum < 2 ? values[index] : [values[index][0], values, index]);
				});
			}
			catch (e) {
				set(false, [e, values, index]);
			}
		});
	    
	    set['then'] = function then(onFulfilled, onRejected) {
			var newPromise = promise();
			var callCallbacks = function() {
	    		try {
	    			var f = (state ? onFulfilled : onRejected);
	    			if (isFunction(f)) {
		   				var r = call(f, values);
		   				if (r && isFunction(r['then']))
		   					r['then'](function(value){newPromise(true,[value]);}, function(value){newPromise(false,[value]);});
		   				else
		   					newPromise(true, [r]);
		   			}
		   			else
		   				newPromise(state, values);
				}
				catch (e) {
					newPromise(false, [e]);
				}
			};
			if (state != null)
				defer(callCallbacks);
			else
				deferred.push(callCallbacks);    		
			return newPromise;
		};

	   	set['always'] = function(func) { return then(func, func); };
	   	set['error'] = function(func) { return then(0, func); };

		// Takes a list of promises and registers with them by calling their then(). If all given promises succeed, this promise succeeds
	   	// and their values are given to the fulfillment handler as array in the same order the promised were given to join().
		// If one promise fails, this promise fails. The rejected handler will be called with the index of the failed promise as 
	   	// first argument and an array containing all results as the second.
		// The array has one entry per promise, containing its success value, rejection value or undefined if not completed.
	   	return set;
	}
	
	var APP = {};
	
	
	function createSyncConfig(maxFailedValidation) {
		return {maxFailedValidation: maxFailedValidation || 1};
	}

	function Model(model, domCtx, syncConfig) {
		var self = this;
		self.ctxPrototype = {
			'model': model,
			'modelCtx': model,
			'path': '',
			'domCtx': domCtx,
			'index': 0,
			'indexStack': [], 
			'isActive': true,
			'config': syncConfig
		};
		self.listeners = {}; // path -> [func, func...]
		self.mappings = []; // array of arrays containing mapping funcs

	
		// delayedUpdatePath is not null if there's a pending async update (caused by a listener
		// calling update). It contains the string path of the update. '' for all.
		self.delayedUpdatePath = null;
		// self.updateRunning=undef; // true while update is running. allows preventing nested updates
	}

	function isSyncCfg(syncCfg) {
		return (syncCfg && syncCfg.maxFailedValidation != null) ? syncCfg : null;
	}

	function modelSync(model, domCtxOrSyncCfg, syncCfg) {
		var s = isSyncCfg(domCtxOrSyncCfg);
		return new Model(model, s ? null : domCtxOrSyncCfg, syncCfg || s  || createSyncConfig());
	}


	var PROP_REGEXP = /((?=[^.]|\.\.)+)\.(.*)/; // TODO: take the existing RE if possible
	
	function propComponents(path) {
		var r = [];
		var s = path;
		var match;
		while (match = PROP_REGEXP.exec(s)) {
			r.push(replace(match[1], /\.\./g, '.'));
			s = match[2];
		}
		r.push(replace(s, /\.\./g, '.'));
		return r;
	}

	function propMerge(pathComponents) {
		return UNDERSCORE(pathComponents)
			.map(function(s) { return replace(s, /\./g, '..'); })
			.join('.');
	}

	function propStartsWith(fullPath, partialPath) {
		return startsWith(fullPath, partialPath) && fullPath.substr(partialPath.length).test(/^($|(\.(\.\.)*([^.]|$)))/);
	}


	copyObj({
		'addListener': function(path, listenerFunc) {
			if (this.listeners[path])
				this.listeners[path].push(listenerFunc);
			else
				this.listeners[path] = [listenerFunc];
		}, 
	
		'addMapping': function(mapping) {
			this.mappings.push(collect(mapping, selfFunc));
		},
		
		'update': function(path, func) {
			var self = this;
			var p  = isFunction(path) ? '' : toString(path);
			var f = func ? func : isFunction(path) ? path : null;
			var model = this.ctxPrototype['model'];
			var r;
			if (f) {
				try {
					r = f(prop(model, path));
				}
				catch (e) {
					r = false;
				}
			}
			if (r === false)
				return r;

			function notifyListener(actualPath) {
				self.updateRunning = 1;
				eachObj(self.listeners, function(actualPath, listeners) {
					each(listeners, function(listener) {
						if (propStartsWith(actualPath, p))
							listener(prop(model, actualPath), p);
					});
				});
				
				each(self.mappings, function(mappingList) {
					var ctx = copyObj(self.ctxPrototype, {});
					each(mappingList, function(mapping) {
						mapping(ctx, actualPath);
					});
				});
				self.updateRunning = 0;
			}


			if (self.updateRunning) {
				if (self.delayedUpdatePath == null) {
					self.delayedUpdatePath = p;
					defer(function() {
						var up = self.delayedUpdatePath;
						self.delayedUpdatePath = null;
						notifyListener(up);
					});
				}
				else {
					var c1 = propComponents(self.delayedUpdatePath);
					var c2 = propComponents(p);
					var c = [];
					for (var i = 0; i < c1.length && i < c2.length; i++) {
						if (c1[i] != c2[i])
							break;
						c.push(c1[i]);
					}
					self.delayedUpdatePath = propMerge(c);
				}
					
				return;
			}

			notifyListener(p);
			return r;
		}
	}, Model.prototype);

		
		
	copyObj({
		// takes vararg of other promises to assimilate
		// if one promise is given, this promise assimilates the given promise as-is, and just forwards fulfillment and rejection with the original values.
		//
		// if more than one promise given, it will assimilate all of them with slightly different rules:
		//    - the new promise is fulfilled if all assimilated promises have been fulfilled. The fulfillment values
		//      of all assimilated promises are given to the handler as arguments. Note that the fulfillment values themselves are always arrays, as a promise can have several fulfillment values in
		//      the Minified implementation.
		//    - when one of the promises is rejected, the new promise is rejected immediately. The rejection handler gets the promises rejection value (first argument is it got several)
		//      as first argument, an array of the result values of all promises as a second (that means one array of arguments for each promise), and the index of the failed promise as third
		'promise': promise,
		
	}, APP);

	//// GLOBAL INITIALIZATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
	/*$
	 @stop
	 */
	return {
		/*$
		 * @id underscore
		 * @name _()
		 * @configurable default
		 * @module UTIL
		 */
		'APP': APP
	};
});

/*$
 * @stop 
 */



