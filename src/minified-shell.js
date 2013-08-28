/*
 * Minified.js - Combines Minified Web and Minified Util
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


///#include minified-web-src.js  commonAmdStart
///#include minified-web-src.js  webVars
///#include minified-util-src.js utilVars
///#include minified-util-src.js commonFunctions
///#include minified-web-src.js  webFunctions
	
	function flexiEach(list, cb) {
		if (isList(list))
			each(list, cb);
		else if (list != null)
			cb(list, 0);
		return list;
	}
	
	function defer(func, args) {
		delay(function() {call(func, args);}); // TODO try partial()
	}
	
	/*$
	 * @id promise
	 * @group REQUEST
	 * @name promise()
	 * @configurable default
	 * @syntax promise()
	 * @syntax promise(otherPromise1, otherPromise2, ...)
	 * @module WEB+UTIL
	 * 
	 * Creates a new ##promise#Promise, optionally assimilating other promises. If no other promise is given, a promise controlled
	 * directly by you is returned. The returned promise is a function that can be called directly to change the 
	 * promises state.
	 * 
	 * If if one promise is given, this promise assimilates the given promise as-is, and just forwards 
	 * fulfillment and rejection with the original values.
	 *
	 * If more than one promise are given, it will assimilate all of them with slightly different rules:
	 * <ul><li>the new promise is fulfilled if all assimilated promises have been fulfilled. The fulfillment values
	 *         of all assimilated promises are given to the handler as arguments. Note that the fulfillment values themselves are always 
	 *         arrays, as a promise can have several fulfillment values in Minified's implementation.</li>
	 * <li>when one of the promises is rejected, the new promise is rejected immediately. The rejection handler gets the 
	 *     promises rejection value (first argument is it got several) as first argument, an array of the result values 
	 *     of all promises as a second (that means one array of arguments for each promise), and the index of the failed 
	 *     promise as third.
	 * </li></ul>
	 * 
	 * @example A simple promise that is fulfilled after 1 second:
	 * <pre>var p = promise();
	 * setTimeout(function() {p(true, []);}, 1000);
	 * </pre>
	 * 
	 * @param otherPromise varargs one or more promises to assimilate
	 * @return a <code>function(state, args)</code> that should be called to set the state when the Promise's work is done:
     * <dl><dt>state</dt><dd><var>true</var> to set the Promise to fulfilled, <var>false</var> to set the state as rejected</dd>
     * <dt>args</dt><dd>An array of arguments to pass to the fulfillment or rejection handler (which one is called depends on
     * <var>state</var>).</dd></dl>
     * The function can be called several times, but only the first invocation modifies the Promise. All subsequent calls will
     * be ignored.
	 */
	function promise() {
		var state; // undefined/null = pending, true = fulfilled, false = rejected
		var deferred = [];   // this function calls the functions supplied by then()

		var assimilatedPromises = arguments;
		var assimilatedNum = assimilatedPromises.length;
		var numCompleted = 0; // number of completed, assimilated promises
		var values = []; // array containing the result arrays of all assimilated promises, or the result of the single promise
	    
		var set = function(newState, newValues) {
			if (state == null) {
				set['state'] = state = newState;
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
						values[index] = map(arguments, nonOp);
						if (++numCompleted == assimilatedNum)
							set(true, assimilatedNum < 2 ? values[index] : values);
					}
				}, 
				function rejectPromise(e) {
					values[index] = map(arguments, nonOp);
					set(false, assimilatedNum < 2 ? values[index] : [values[index][0], values, index]);
				});
			}
			catch (e) {
				set(false, [e, values, index]);
			}
		});

    	/*$
    	 * @id state
    	 * @group REQUEST
    	 * @name promise.state
    	 * @syntax promise.state
    	 * 
    	 * @module WEB, UTIL
    	 * Contains the current state of the promise. The property is only set when the Promise finished. 
    	 * It is set to <var>true</var> when the promise completed successfully, and to 
    	 * <var>false</var> when the promise failed.
    	 */   

		
    	/*$
    	 * @id then
    	 * @group REQUEST
    	 * @name promise.then()
    	 * @syntax promise.then()
    	 * @syntax promise.then(onSuccess)
    	 * @syntax promise.then(onSuccess, onError)
    	 * 
    	 * @module WEB, UTIL
    	 * Registers two callbacks that will be invoked when the ##promise#Promise##'s asynchronous operation finished 
    	 * successfully (<var>onSuccess</var>) or an error occurred (<var>onError</var>). The callbacks will be called after  
    	 * <var>then()</var> returned, from the browser's event loop.
    	 * Minified implements the Promises/A+ specification, allowing interoperability with other Promises frameworks. 
    	 * You can chain <var>then()</var> invocations, as <var>then()</var> returns another Promise object that you can attach to. 
    	 *
    	 * @example Simple handler for an HTTP request. Handles only success and ignores errors.
    	 * <pre>
    	 * $.request('get', '/weather.html')
    	 *     .then(function(txt) {
    	 *        alert('Got response!');
    	 *     });
    	 * </pre>
    	 *
    	 * @example Including an error handler.
    	 * <pre>
    	 * $.request('get', '/weather.html')
    	 *     .then(function(txt) {
    	 *        alert('Got response!');
    	 *     }, function(err) {
    	 *        alert('Error!');
    	 *     }));
    	 * </pre>
    	 *
    	 * @example Chained handler.
    	 * <pre>
    	 * $.request('get', '/weather.do')
    	 *     .then(function(txt) {
    	 *        showWeather(txt);
    	 *     }
    	 *     .then(function() {
    	 *        return $.request('get', '/traffic.do');
    	 *     }
    	 *     .then(function(txt) {
    	 *        showTraffic(txt);
    	 *     }
    	 *     .then(function() {
    	 *        alert('All result displayed');
    	 *     }, function() {
    	 *        alert('An error occurred');
    	 *     });
    	 * </pre>
    	 *
    	 * @param onSuccess optional a callback function to be called when the operation has been completed successfully. The exact arguments it receives depend on the operation.  
    	 *                           If the function returns a ##promise#Promise##, that Promise will be evaluated to determine the state of the promise returned by <var>then()</var>. If it returns any other value, the 
    	 *                           returned Promise will also succeed. If the function throws an error, the returned Promise will be in error state.
    	 *                           Pass <var>null</var> or <var>undefined</var> if you do not need the success handler. 
    	 * @param onError optional a callback function to be called when the operation failed. The exact arguments it receives depend on the operation. If the function returns a ##promise#Promise##, that promise will
    	 *                           be evaluated to determine the state of the Promise returned by <var>then()</var>. If it returns anything else, the returned Promise will 
    	 *                           have success status. If the function throws an error, the returned Promise will be in the error state.
    	 *                           You can pass <var>null</var> or <var>undefined</var> if you do not need the error handler. 
    	 * @return a new ##promise#Promise## object. If you specified a callback for success or error, the new Promises's state will be determined by that callback if it is called.
    	 *         If no callback has been provided and the original Promise changes to that state, the new Promise will change to that state as well.
    	 */   
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

    	/*$
    	 * @id always
    	 * @group REQUEST
    	 * @name promise.always()
    	 * @syntax promise.always(callback)
    	 * @configurable default
    	 * @module WEB+UTIL
    	 * Registers a callback that will always be called when the ##promise#Promise##'s operation ended, no matter whether the operation succeeded or not.
    	 * This is a convenience function that will call ##then() with the same function for both arguments. It shares all of its semantics.
    	 *
    	 * @example Simple handler for a HTTP request.
    	 * <pre>
    	 * $.request('get', '/weather.html')
    	 *     .always(function() {
    	 *        alert('Got response or error!');
    	 *     });
    	 * </pre>
    	 *
    	 * @param callback a function to be called when the operation has been finished, no matter what its result was. The exact arguments depend on the operation and may
    	 *                 vary depending on whether it succeeded or not. If the function returns a ##promise#Promise##, that Promise will
    	 *                 be evaluated to determine the state of the returned Promise. If provided and it returns regularly, the returned promise will 
    	 *                 have success status. If it throws an error, the returned Promise will be in the error state.
    	 * @return a new ##promise#Promise## object. Its state is determined by the callback.
    	 */
	   	set['always'] = function(func) { return then(func, func); };
	   	
    	/*$
    	 * @id error
    	 * @group REQUEST
    	 * @name promise.error()
    	 * @syntax promise.error(callback)
    	 * @configurable default
    	 * @module WEB, UTIL
    	 * Registers a callback that will be called when the operation failed.
    	 * This is a convenience function that will invoke ##then() with the only the second argument set.  It shares all of its semantics.
    	 *
    	 * @example Simple handler for a HTTP request.
    	 * <pre>
    	 * $.request('get', '/weather.html')
    	 *     .error(function() {
    	 *        alert('Got error!');
    	 *     });
    	 * </pre>
    	 *
    	 * @param callback a function to be called when the operation has failed. The exact arguments depend on the operation. If the function returns a ##promise#Promise##, that Promise will
    	 *                           be evaluated to determine the state of the returned Promise. If it returns regularly, the returned Promise will 
    	 *                           have success status. If it throws an error, the returned Promise will be in error state.
    	 * @return a new ##promise#Promise## object. Its state is determined by the callback.
    	 */  
	   	set['error'] = function(func) { return then(0, func); };
	   	/*$
	   	 * @stop
	   	 */
	   	// @condblock promise
	   	return set;
	}
	// @condend promise
	
 	/*$
	 * @id length
	 * @group SELECTORS
	 * @requires dollar
	 * @name .length
	 * @syntax length
   	 * @module WEB, UTIL
	 * 
	 * Contains the number of elements in the ##list#Minified list##.
	 * 
	 * @example With Web module:
	 * <pre>
	 * var list = $('input');
	 * var myValues = {};
	 * for (var i = 0; i &lt; list.length; i++)
	 *    myValues[list[i].name] = list[i].value;
	 * </pre>
	 * 
	 * @example With Util module:
	 * <pre>
	 * var list = _(1, 2, 3);
	 * var sum = 0;
	 * for (var i = 0; i &lt; list.length; i++)
	 *    sum += list[i];
	 * </pre>
	 */
	
	
	///#include minified-util-src.js utilM
	
	//// LIST FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	copyObj({
		///#remove
		a:0
		///#/remove

		///#include minified-util-src.js utilListFuncs
		,
		///#include minified-web-src.js webListFuncs

		///#remove
		b:0
		///#/remove

	}, M.prototype);
	
			
	//// DOLLAR FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///#include minified-web-src.js webDollarFuncs
	
	//// UNDERSCORE FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///#include minified-util-src.js utilUnderscoreFuncs
	
	////INITIALIZATION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///#include minified-web-src.js webInit

	copyObj({
	// @condblock promise
	'promise': promise,
	// @condend promise
	
	/*$
	 * @id delay
	 * @configurable default
	 * @requires
	 * @name $.delay()
	 * @syntax $.delay(durationMs, func)
	 * @syntax $.delay(durationMs, func, args)
	 * @module WEB+UTIL
	 * 
	 * Executes the function with the given delay, optionally passing arguments to it.
	 *
	 * @param durationMs the number of milliseconds to wait. If null or 0, the promise will be fulfilled as soon as the browser can run it
	 *                   from the event loop.
	 * @param func the function to call
	 * @param args optional an array or list of arguments to pass to the function
	 */
	'delay': function(durationMs, func, args) {
		delay(function() {call(func, args);}, durationMs); // TODO try partial()
	},

	/*$
	 * @id defer
	 * @configurable default
	 * @requires
	 * @name $.defer()
	 * @syntax $.defer(func)
	 * @syntax $.defer(func, args)
	 * @module WEB+UTIL
	 *	
	 * Executes the function from the browser event loop, as soon as the browser can. Typically that means that
	 * the function is called after less than 10 milliseconds.
	 *
	 * @param func the function to call
	 * @param args optional an array or list of arguments to pass to the function
	 */
	'defer': defer,

	
	/*$
	 * @id wait
	 * @configurable default
	 * @requires promise
	 * @name $.wait()
	 * @syntax $.wait()
	 * @syntax $.wait(durationMs)
	 * @syntax $.wait(durationMs, args)
	 * @module WEB+UTIL
	 *
	 * Creates a new promise that will be fulfilled as soon as the specified number of milliseconds have passed. This is mainly useful for animation,
	 * because it allows you to chain delays into your animation chain.
	 *
	 * @example Chained animation using ##promise#Promise## callbacks. The element is first moved to the position 200/0, then to 200/200, waits for 50ms 
	 *          and finally moves to 100/100.
	 * <pre>
	 * var div = $('#myMovingDiv').set({$left: '0px', $top: '0px'});
	 * div.animate({$left: '200px', $top: '0px'}, 600, 0)
	 *    .then(function() {
	 *           div.animate({$left: '200px', $top: '200px'}, 800, 0);
	 *    }).then(function() {
	 *    		 return _.wait(50);
	 *    }).then(function() {
	 *           div.animate({$left: '100px', $top: '100px'}, 400);
	 *    });
	 * });
	 * </pre>
	 *
	 *
	 * @param durationMs optional the number of milliseconds to wait. If omitted, the promise will be fulfilled as soon as the browser can run it
	 *                   from the event loop.
	 * @param args optional an array of arguments to pass to the promise handler
	 * @return a ##promise#Promise## object that will be fulfilled when the time is over. It will never fail. The promise argument is the 
	 *         <var>args</var> parameter as given to <var>wait()</var>.
	 */
	'wait': function(durationMs, args) {
		var p = promise();
		delay(function() {p(true, args);}, durationMs);
		return p;
	}
	
	/*$
	 * @stop
	 */
	// @cond !wait dummy:0

	}, _);

	
	return {
		///#include minified-util-src.js utilExports
		///#include minified-web-src.js webExports
	};

///#include minified-web-src.js  commonAmdEnd
///#include minified-web-src.js  webDocs
	
///#remove
	}
///#/remove
	