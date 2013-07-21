/*
 * Minified-app.js - Application framework
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 * To the extent possible under law, Tim Jansen has waived all copyright and related or neighboring rights to Minified.
 * Please see http://creativecommons.org/publicdomain/zero/1.0/.
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



///////////////////////////
//// WARNING - this file is currently not much more than a collection of code snippets. 
////           It is months away from a usable version.
///////////////////////////



 	/*$
 	 * @id minifieddefine
 	 */

define('minifiedApp', function() {
	//// GLOBAL VARIABLES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * @const
	 */
	var _this = this;

	
	var request = $['request'];	

	// reads / writes property in name.name.name syntax. Supports setter/getter functions
	function prop(object, path, value) {
		var match = /^(([^.]|\.\.)+)\.([^.].*)/.exec(path);
		if (match) {
			var name = replace(match[1], /\.\./g, '.');
			var val = object[name];
			return prop(isFunction(val) ? val() : val, match[3], value);
		}
		else {
			var name = replace(path, /\.\./g, '.');
			var val = object[name];
			if (value === undef)
				return isFunction(val) ? val() : val;
			else if (isFunction(val))
				return val(value);
			else
				return object[name] = value;
		}
	}
	
	// copies all elements of from into to, merging into existing structures.
	// <var>to</var> is optional. Writes result in <var>to</var> if it is a non-value object.
	// Returns the copy, which may be to if it was an object
	function copyModel(from, to) {
		if (isValue(from))
			return isDate(from) ? dateClone(from) : from;

		var toIsFunc = isFunction(to);
		var oldTo = toIsFunc ? to() : to;
		var result;
		if (!from || equals(from, oldTo))
			return from;
		else if (isList(from)) {
			result = map(from, function(v, idx) { 
				return oldTo && equals(oldTo[idx], v) ? oldTo[idx] : copyTree(v);
			});
			if ((oldTo ? oldTo : from)['_'])
				result = UNDERSCORE(result);
		}
		else {
			var target = oldTo || {};
			each(target, function(key) {
				if (from[key] == null || (isFunction(from[key]) && from[key]() == null)) {
					if (isFunction(target[key]))
						target[key](null);
					else
						delete target[key];
				}
			});
			each(from, function(key, value) {
				var isFunc = isFunction(target[key]);
				var oldValue = isFunc ? target[key]() : target[key];
				if (!equals(value, oldValue)) {
					if (isFunc)
						target[key](copyTree(value));
					else
						target[key] = copyTree(value);
				}
			});
		}
			
		if (toIsFunc)
			to(result);
		return result;
	}

	
	
	/*$
	 * @id promise
	 * @module WEB+UTIL
	 	// takes vararg of other promises to assimilate
		// if one promise is given, this promise assimilates the given promise as-is, and just forwards fulfillment and rejection with the original values.
		//
		// if more than one promise given, it will assimilate all of them with slightly different rules:
		//    - the new promise is fulfilled if all assimilated promises have been fulfilled. The fulfillment values
		//      of all assimilated promises are given to the handler as arguments. Note that the fulfillment values themselves are always arrays, as a promise can have several fulfillment values in
		//      the Minified implementation.
		//    - when one of the promises is rejected, the new promise is rejected immediately. The rejection handler gets the promises rejection value (first argument is it got several)
		//      as first argument, an array of the result values of all promises as a second (that means one array of arguments for each promise), and the index of the failed promise as third

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
			
	// public
	function createSyncConfig(maxFailedValidation) {
		return {maxFailedValidation: maxFailedValidation || 1};
	}

	// private
	function Controller(model, viewCtx, syncConfig) {
		var self = this;
		self.ctxPrototype = {
			'model': model,      // ref to model data's root 
			'modelCtx': model,   // ref to model's current position
			'path': '',          // current path of the model
			'viewCtx': viewCtx,  // DOM reference to current HTML element
			'indexStack': [],    // stack containing all indexes, with the most recent at position 0
			'index': 0,          // most recent index
			'group': null,       // name of current group, or null if no group
			'isActive': true,
			'config': syncConfig
		};
		self.listeners = {}; // path -> [func, func...]
		self.bindings = []; // array of arrays containing binding funcs

	
		// delayedUpdatePath is not null if there's a pending async update (caused by a listener
		// calling update). It contains the string path of the update. '' for all.
		self.delayedUpdatePath = null;
		// self.updateRunning=undef; // true while update is running. allows preventing nested updates
	}

	// private
	function isSyncCfg(syncCfg) {
		return (syncCfg && syncCfg['maxFailedValidation'] != null) ? syncCfg : null;
	}

	// public
	// registers a model tree. Returns Controller object.
	function controller(model, viewCtxOrSyncCfg, syncCfg) {
		var s = isSyncCfg(viewCtxOrSyncCfg);
		return new Model(model, s ? null : viewCtxOrSyncCfg, syncCfg || s  || createSyncConfig());
	}

	// private
	function readJson(txt) {
		return $['parseJSON'](replace(txt, /^while(1);/));
	}

	var PROP_REGEXP = /((?=[^.]|\.\.)+)\.(.*)/; // TODO: take the existing RE if possible
	
	// private
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

	// private
	function propMerge(pathComponents) {
		return UNDERSCORE(pathComponents)
			.map(function(s) { return replace(s, /\./g, '..'); })
			.join('.');
	}

	// private
	function propStartsWith(fullPath, partialPath) {
		return startsWith(fullPath, partialPath) && fullPath.substr(partialPath.length).test(/^($|(\.(\.\.)*([^.]|$)))/);
	}

	copyObj({
		// adds a listener to be notified about changes in the model
		// NOTE: ideally listeners *should*not* modify the model or call update(). If they do, the listeners and binding
		//              will not be informed immediately, but via the event loop
		//
		// listeners are called as function(value, updatePath):
		// - value: the object at the requested path
		// - updatedPath: the exact path that has changed (may be a subpath
		'addListener': function(path, listenerFunc) {
			var p, f;
			if (isFunction(path)) {
				f = path;
				p = '';
			}
			else {
				p = path; 
				f = listenerFunc;
			}
			
			if (this.listeners[p])
				this.listeners[p].push(f);
			else
				this.listeners[p] = [f];
		}, 
	
		// adds one or more bindings that will be invoked each time the model is updated. 
		//
		// Usually you create a binding by calling SYNC() or similar functions to create them.
		//
		// A binding is an object with the following properties:
		// - init: optional, a function(modelCtx, ctx, Controller) that will be called when the binding has been added to the model
		// 	- ctx is the BindingContext
		//
		// - update: required, a function(modelCtx, ctx, Controller, updatePath) that will be called when the relevant part of the model has been updated
		// 	- ctx is the BindingContext
		// 	- updatePath is the string of the last sync.update() invocation relative to modelCtx, or null
		//
		// - read: optional, a function(indexStack, group, ctx) to make the binding sync back and write into the model. Calling update() is not required.
		// 	- group is the name of the group to read. If not null, the binding should only read  if it belongs to that group. Otherwise
		//          read() should do nothing.
		// 	- ctx is the BindingContext
		//    
		// - inactive: optional, boolean. If true, update() is also called when the context is set to not active. 
		//             By default, the function is only called when active (thus outside of the false-list of a COND). 
		//             This is required for SHOW/HIDE.
		//
		//
		'addBinding': function(binding) {
			var self = this;
			var bindingList = collect(binding, selfFunc);
			var ctx = copyObj(self.ctxPrototype, {});

			this.bindings.push(bindingList);
			
			each(bindingList, function(binding) {
				binding['init'](ctx['modelCtx'], ctx, self);
			});
		},
		
		// notifies MINI that the model has been updated manually. Will validate changes, and listeners and bindings will be notified
		// The optional function(obj) allows several changes with single update. return false or throw exception to suppress update.
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
				
				each(self.bindings, function(bindingList) {
					var ctx = copyObj(self.ctxPrototype, {});
					each(bindingList, function(binding) {
						if (ctx['isActive'] || binding['inactive'])
							binding['update'](ctx['modelCtx'], ctx, self, actualPath);
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
		},
		
		// like prop(model, path)
		'get': function(path) {
			return prop(this.ctxPrototype['model'], path != null ? path : '');
		},
		
		// Reads old value (prop), compares to new value. If not equal according to _.equals, 
		// sets new value and calls update().
		'set': function(path, value) {
			if (!equals(prop(this.ctxPrototype['model'], path), value)) {
				prop(this.ctxPrototype['model'], path, value);
				this['update'](path);
			}
		},
		
		// Requests all bindings to read their data and store it in the model. The idea behind this is you do not synchronize
		// to the model in real-time, you can use this function when the user submits the form.
		// The function calls read() on all bindings associated with the model, and then update() without path.
		// Optionally the bindings can be limited to the given group.
		// Special syntax groupName[index] if group was used more than once.
		// Then calls sync.update()
		'read': function(indexStackOrCtx, groupName) {
			var indexStack = (indexStackOrCtx && indexStackOrCtx['indexStack']) ? indexStackOrCtx['indexStack'] : indexStackOrCtx;
			var actualGroup = groupName || (indexStackOrCtx && indexStackOrCtx['group']);
			
			each(self.bindings, function(bindingList) {
				var ctx = copyObj(self.ctxPrototype, {});
				each(bindingList, function(binding) {
					binding['read'](indexStack, actualGroup, ctx);
				});
			});
			this['update']();
		},
		
		// Does a POST request to the URL, sending the JSON located at requestModelCtx, and writes the resulting JSON into 
		// the location given by responseModelCtx. 
		//
		// Extra Features:
		// - Returns request()'s promises, for full control over the HTTP request
		// - includes CSRF protection-support for the response (ignores while(1); at beginning)
		'postPull': function(url, requestModelCtx, responseModelCtx) {
			return this['pull']('post', url, $['toJSON'](requestModelCtx), responseModelCtx);
		},
		
		// Does a POST request to the URL, sending the JSON located at requestModelCtx.
		//
		// Returns request()'s promise.
		'post': function(url, requestModelCtx)	{
			return request('post', url, $['toJSON'](requestModelCtx));			
		},
		
		// Does a POST/GET request to the URL, using the get request in $.request() format, writing into the JSON located at responseModelCtx. 
		//
		// Returns request()'s promise.
		'pull': function(method, url, data, responseModelCtx) {
			return request(method, url, data)
				.then(function(text) {
					copyModel(readJson(text), responseModelCtx);
					return text;
				});
		},
		
		// Stores the given modelCtx in local storage, stringified as JSON.
		// Returns true if successful (no exception, no IE6-7)
		'storeLocal': function(key, srcModelCtx) {
			// TODO
		},
		
		// Reads the given modelCtx in local storage, stringified as JSON.
		// Returns true if successful (no exception, data found, no IE6-7)
		'fetchLocal': function(key, destModelCtx) {
			// TODO
		}
		

	}, Controller.prototype);

	function numberBinding(format) {
		return {'render': function(s) {
			return formatValue(format, s);
		}, 'parse': function(s) {
			return parseNumber(format, s);
		}};
	}
	function dateBinding(format) {
		return {'render': function(s) {
			return formatValue(format, s);
		}, 'parse': function(s) {
			return parseDate(format, s);
		}};
	}
	function stringBinding(regExp) {
		return {'render': nonOp, 'parse': function(s) {
			var r = replace(s, isString(regExp) ? (new RegExp(regExo)) : regExp);
			return r != s && !r;
		}};
	}
	var asIsBinding = {'render':nonOp, 'parse': nonOp};
	
	APP['bindings'] = {
			'number': numberBinding,
			'date': dateBinding,
			'string': stringBinding,
			
			'FIELD' : function(fieldSelector, valuePath, translator, parserFailToggleList) {
				var toggleList = (isFunction(translator) || isList(translator)) ? translator : parserFailToggleList;
				var tl = isString(translator) ? (/[09_#]/.test(translator) ? numberBinding(translator) : dateBinding(translator)) : 
					(translator instanceof RegExp ? stringBinding(translator) : asIsBinding);
				return {
					'init': function(modelCtx, ctx, controller) {
						var field = $(fieldSelector, ctx['viewCtx'])['sub'](0, 1);
						
					},
					'update': function(modelCtx, ctx, controller, updatePath){
						
					}
				};				
			}
	};
		
	function getCheckedValue(inputElement) {
		 return inputElement.checked ? inputElement.value : null;
	}
	
	copyObj({
		'onChange': function(handler) {
			var oldValues = [];
			function register(eventNames, property, index) {
				oldValues[index] = el[property];
				$(el)['on'](eventNames, function() {
					var newValue = el[eventNames]; 
					if (newValue != oldValues[index]) {
						handler(newValue, index);
						oldValues[index] = newValue;
					}
				});
			}
			each(this, function(el, index) {
				if (/kbox|dio/i.test(el['type']))
					register('|click', 'checked', index);
				else 
					register('|input |change |keyup', 'value', index);
			});
		},

		'onOver': function(toggle) {
			var curState = [];
			this['on']('|mouseover |mouseout', function(ev, index) {
				var newState = /ov/.test(ev.type);
				if (ev['target'] == ev['currentTarget'] && curState[index] !== newState) {
					curState[index] = newState;
					toggle.call(this, newState, index);
				}
			});
		},
		
		'onAction': function(handler) {
			this['on']('click submit', handler, []);
		},

		
		'dial': function(states, initState, durationMs, linearity) {
			var self = this;
			var animState = {};
			var state, prevState, prevPrevState;
				
			if (isString(initState))
				state = initState;
			else { // re-map arguments if initState not set
				linearity = durationMs;
				durationMs = initState; 
			}
			
			if (state)
				self['set'](states[state]);

			return function(newState) {
				if (newState === state) 
					return;
				prevPrevState = prevState;
				prevState = state;
				state = newState;

				if (durationMs) 
					self['animate'](states[state], animState['stop'] && prevPrevState == newState? (animState['stop']() || animState['time']) : durationMs, linearity, animState);
				else
					self['set'](states[state]); 
			};
		}
	}, M);

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












