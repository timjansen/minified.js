/*
 * Minified-extras-full-src.js - Extra functions not contained in Web or Util modules. 
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 * To the extent possible under law, Tim Jansen has waived all copyright and related or neighboring rights to Minified.
 * Please see http://creativecommons.org/publicdomain/zero/1.0/.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 * https://github.com/timjansen/minified.js
 */
// ==ClosureCompiler==
// @output_file_name minified.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==

// 
// WARNING! Note that this file only contains snippets to be included by minified-shell.js. It does not
// make any sense if used stand-alone.


function dummy() {

	///#snippet extrasFunctions
	function flexiEach(list, cb) {
		if (isList(list))
			each(list, cb);
		else if (list != _null)
			cb(list, 0);
		return list;
	}
	
	function Promise() {
        this['state'] = null; 
        this['values'] = []; 
        this['parent'] = null; 
	}


	/*$
	 * @id promise
	 * @name _.promise()
	 * @syntax _.promise()
	 * @syntax _.promise(otherPromises...)
	 * @module WEB+UTIL
	 * 
	 * Creates a new ##promiseClass#Promise##, optionally assimilating other promises. If no other promise is given, 
	 * a fresh new promise is returned. 
	 *
	 * The returned promise provides the methods ##fulfill() and ##reject() that can be called directly to change the promise's state,
	 * as well as the more powerful ##fire().
	 * 
	 * If one promise is given as parameter, the new promise assimilates the given promise as-is, and just forwards 
	 * fulfillment and rejection with the original values.
	 *
	 * If more than one promise are given, it will assimilate all of them with slightly different rules:
	 * <ul><li>the new promise is fulfilled if all assimilated promises have been fulfilled. The fulfillment values
	 *         of all assimilated promises are given to the handler as arguments. Note that the fulfillment values themselves are always 
	 *         arrays, as a promise can have several fulfillment values in Minified's implementation.</li>
	 * <li>when one of the promises is rejected, the new promise is rejected immediately. The rejection handler gets the 
	 *     promises rejection value (first argument if it got several) as first argument, an array of the result values 
	 *     of all promises as a second (that means one array of arguments for each promise), and the index of the failed 
	 *     promise as third.
	 * </li></ul>
	 * 
	 * @example A simple promise that is fulfilled after 1 second, using Minified's invocation syntax:
	 * <pre>var p = _.promise();
	 * setTimeout(function() { 
	 *     p.fire(true); 
	 * }, 1000);
	 * </pre>
	 *
	 * @example Request three files in parallel. When all three have been downloaded, concatenate them into a single string.
     * <pre>
     * var files = _('fileA.txt', 'fileA.txt', 'fileC.txt');
     * var content;
     * _.promise(files.map(function(file) {
     *      return $.request('get', '/txts/' + file);
     * })).then(function(fileRslt1, fileRslt2, fileRslt3) {
     *      content = _(fileRslt1, fileRslt2, fileRslt3).map( function(result) { return result[0]; }).join('');
     * }).error(function(status, response, xhr, url) {
     *    alert('failed to load file '+url);
     * });
     * </pre>
	 * 
	 * @param otherPromises one or more promises to assimilate (varargs). You can also pass lists of promises.
	 * @return the new promise.
	 */
	function promise() {
		var deferred = [];   // this function calls the functions supplied by then()

		var assimilatedPromises = arguments;
		var assimilatedNum = assimilatedPromises.length;
		var numCompleted = 0; // number of completed, assimilated promises
		var rejectionHandlerNum = 0;

		var obj = new Promise();

		obj['errHandled'] = function() {
			rejectionHandlerNum++;
			if (obj['parent'])
				obj['parent']['errHandled']();
		};

		/*$
		 * @id fire
		 * @name promise.fire()
		 * @syntax _.fire(newState)
		 * @syntax _.fire(newState, values)
		 * @module WEB+UTIL
		 * 
		 * Changes the state of the promise into either fulfilled or rejected. This will also notify all ##then() handlers. If the promise
		 * already has a state, the call will be ignored.
		 *
		 * <var>fire()</var> can be invoked as a function without context ('this'). Every promise has its own instance.
		 * 
		 * @example A simple promise that is fulfilled after 1 second, using Minified's invocation syntax:
		 * <pre>var p = _.promise();
		 * setTimeout(function() { 
		 *     p.fire(true, []); 
		 * }, 1000);
		 * </pre>
		 *
		 * @example Call <var>fire()</var> without a context:
		 * <pre>var p = _.promise(function(resolve, reject) {
         *     setTimeout(resolve.fire, 1000);
		 * });
		 * </pre>
		 *
		 * @param newState <var>true</var> to set the Promise to fulfilled, <var>false</var> to set the state as rejected. If you pass <var>null</var> or
		 * <var>undefined</var>, the promise's state does not change.
		 * @param values optional an array of values to pass to ##then() handlers as arguments. You can also pass a non-list argument, which will then 
		 *               be passed as only argument.
		 * @return the promise 
		 */
		var fire = obj['fire'] = function(newState, newValues) {
			if (obj['state'] == null && newState != null) {
				obj['state'] = !!newState;
				obj['values'] = isList(newValues) ? newValues : [newValues];
				setTimeout(function() {
					each(deferred, function(f) {f();});
				}, 0);
			}
			return obj;
		};

		// use promise varargs
		each(assimilatedPromises, function assimilate(promise, index) {
			try {
		        if (promise['then'])
                    promise['then'](function(v) {
                        var then;
                        if ((isObject(v) || isFunction(v)) && isFunction(then = v['then']))
                            assimilate(v, index);
                        else {
                            obj['values'][index] = array(arguments);
                            if (++numCompleted == assimilatedNum)
                                fire(true, assimilatedNum < 2 ? obj['values'][index] : obj['values']);
                        }
                    }, 
                    function(e) {
                        obj['values'][index] = array(arguments);
                        fire(false, assimilatedNum < 2 ? obj['values'][index] : [obj['values'][index][0], obj['values'], index]);
                    });
				else
					promise(function() {fire(true, array(arguments));}, function() {fire(false, array(arguments)); });
			}
			catch (e) {
				fire(false, [e, obj['values'], index]);
			}
		});

		/*$
		 * @id stop
		 * @name promise.stop()
		 * @syntax promise.stop()
		 * @module WEB+UTIL
		 * Stops an ongoing operation, if supported. Currently the only promises supporting this are those returned by ##request(), ##animate(), ##wait() and
		 * ##asyncEach(). 
		 * stop() invocation will be propagated over promises returned by ##then() and promises assimilated by ##promise(). You only need to invoke stop
		 * with the last promise, and all dependent promises will automatically stop as well. 
		 * 
		 *  <var>stop()</var> can be invoked as a function without context ('this'). Every promise has its own instance.
		 *
		 * @return In some cases, the <var>stop()</var> can return a value. This is currently only done by ##animate() and ##wait(), which will return the actual duration.
		 *         ##asyncEach()'s promise will also return any value it got from the promise that it stopped.
		 *
		 * @example Animation chain that can be stopped.
		 * <pre>
		 * var div = $('#myMovingDiv').set({$left: '0px', $top: '0px'});
		 * var prom = div.animate({$left: '200px', $top: '0px'}, 600, 0)
		 *    .then(function() {
		 *           return _.promise(div.animate({$left: '200px', $top: '200px'}, 800, 0), 
		 *                            div.animate({$backgroundColor: '#f00'}, 200));
		 *    }).then(function() {
		 *           return div.animate({$left: '100px', $top: '100px'}, 400);
		 *    });
		 *    
		 * $('#stopButton').on('click', prom.stop);
		 * </pre>
		 */   
		obj['stop'] = function() {
			each(assimilatedPromises, function(promise) {
				if (promise['stop'])
					promise['stop']();
			});

			return obj['stop0'] && call(obj['stop0']);
		};
		
		/*$
		 * @id then
		 * @name promise.then()
		 * @syntax promise.then()
		 * @syntax promise.then(onSuccess)
		 * @syntax promise.then(onSuccess, onError)
		 * 
		 * @module WEB
		 * Registers two callbacks that will be invoked when the ##promise#Promise##'s asynchronous operation finished 
		 * successfully (<var>onSuccess</var>) or an error occurred (<var>onError</var>). The callbacks will be called after  
		 * <var>then()</var> returned, from the browser's event loop.
		 * You can chain <var>then()</var> invocations, as <var>then()</var> returns another Promise object that you can attach to. 
         *
		 * The full distribution of Minified implements the Promises/A+ specification, allowing interoperability with other Promises frameworks. 
		 *
		 * <strong>Note:</strong> If you use the Web module, you will get a simplified Promises implementation that cuts some corners. The most notable
		 * difference is that when a <code>then()</code> handler throws an exception, this will not be caught and the promise returned by 
		 * <code>then</code> will not be automatically rejected.
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
		var then = obj['then'] = function (onFulfilled, onRejected) {
			var promise2 = promise();
			var callCallbacks = function() {
				try {
					var f = (obj['state'] ? onFulfilled : onRejected);
					if (isFunction(f)) {
                        (function resolve(x) {
                            try {
                                var then, cbCalled = 0;
                                if ((isObject(x) || isFunction(x)) && isFunction(then = x['then'])) {
										if (x === promise2)
											throw new TypeError();
										then.call(x, function(x) { if (!cbCalled++) resolve(x); }, function(value) { if (!cbCalled++) promise2['fire'](false, [value]);});
										promise2['stop0'] = x['stop'];
                                }
                                else
                                    promise2['fire'](true, [x]);
                            }
                            catch(e) {
                                if (!(cbCalled++)) {
                                    promise2['fire'](false, [e]);
                                    if (!rejectionHandlerNum)
										throw e;
                                }
                            }
                        })(call(f, undef, obj['values']));
                    }
                    else
                        promise2['fire'](obj['state'], obj['values']);
				}
				catch (e) {
					promise2['fire'](false, [e]);
					if (!rejectionHandlerNum)
						throw e;
				} 
			};
			if (isFunction(onRejected))
				obj['errHandled']();
			promise2['stop0'] = obj['stop'];
			promise2['parent'] = obj;
			if (obj['state'] != null)
				setTimeout(callCallbacks, 0);
			else
				deferred.push(callCallbacks);
			return promise2;
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
        obj['always'] = function(func) { return then(func, func); };

		/*$
		 * @id error
		 * @group REQUEST
		 * @name promise.error()
		 * @syntax promise.error(callback)
		 * @configurable default
		 * @module WEB, UTIL
		 * Registers a callback that will be called when the operation failed.
		 * This method name is deprecated. Please use ##catch().
		 */  
		/*$
		 * @id catch
		 * @group REQUEST
		 * @name promise.catch()
		 * @syntax promise.catch(callback)
		 * @configurable default
		 * @module WEB, UTIL
		 * Registers a callback that will be called when the operation failed.
		 * This is a convenience function that will invoke ##then() with only the second argument set.  It shares all of its semantics.
		 *
		 * This method used to be called ##error(), and the old name will still work. It has been renamed for ES6 backward compatibility.
		 *
		 * @example Simple handler for a HTTP request.
		 * <pre>
		 * $.request('get', '/weather.html')
		 *     .catch(function() {
		 *        alert('Got error!');
		 *     });
		 * </pre>
		 *
		 * @param callback a function to be called when the operation has failed. The exact arguments depend on the operation. If the function returns a ##promise#Promise##, that Promise will
		 *                           be evaluated to determine the state of the returned Promise. If it returns regularly, the returned Promise will 
		 *                           have success status. If it throws an error, the returned Promise will be in error state.
		 * @return a new ##promise#Promise## object. Its state is determined by the callback.
		 */  
        obj['catch'] = obj['error'] = function(func) { return then(0, func); };

        return obj;
    }



	///#/snippet extrasFunctions

	
	///#snippet extrasDocs
    /*$
	 * @id length
	 * @group SELECTORS
	 * @requires dollar
	 * @name list.length
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
	/*$
	 * @stop 
	 */
	///#/snippet extrasDocs

	

	var dummy = {
			
	///#snippet extrasListFuncs
			
		/*$ 
		 * @id per
		 * @group LIST 
		 * @requires
		 * @configurable default 
		 * @name .per() 
		 * @syntax list.per(callback) 
		 * @syntax list.per(subSelector, callback) 
		 * @module UTIL
		 * Invokes the handler function for each list element with a single-element list containing only this element. It is very similar to
		 * ##each(), but instead of giving the element itself it wraps the element in a ##list#Minified list##. Additionally, you can specify 
		 * a sub-selector to iterate over the descendants matches by the selector instead of the list elements. 
		 *
		 * @example Create a mouseover toggle for a list:
		 * <pre>$('.toggler').per(function(el, i) {
		 *     el.onOver(el.toggle('myeffect'));
		 * });</pre>
		 * 
		 * @example Create click handlers for elements in a list:
		 * <pre>$('#list').add(HTML('{{each}}&lt;li>{{this.name}} &lt;a class="del" href="#">Delete&lt;/a>&lt;/li>{{each}}', items)
		 *                .per('.del', function(el, index) {
		 *                   el.on('click', deleteItemByName, [items[index].name]);
		 *                }));</pre>
		 *
		 * @param subSelector optional a selector as valid as first argument for #dollar#$(), to identify the descendants to iterate over.
		 * @param callback The callback <code>function(itemList, index)</code> to invoke for each list element. 
		 *                 <dl><dt>item</dt><dd>The current list element wrapped in a Minfified list.</dd>
		 *                 <dt>index</dt><dd>The second the zero-based index of the current element.</dd>
		 *                 <dt class="this">this</dt><dd>The list that is being iterated. If a sub-selector
		 *                 is being used, it is the list that resulted from using the sub-selector.</dd></dl>
		 *                 The callback's return value will be ignored.
		 * @return the list. Even if you specified a sub-selector, it will always return the original list.
		 */
		'per': function(subSelector, handler) {
			if (isFunction(subSelector))
				for (var len = this.length, i = 0; i < len; i++)
					subSelector.call(this, new M(_null, this[i]), i);
			else
				$(subSelector, this)['per'](handler);
			return this;
		},
				
		/*$
		 * @id ht
		 * @group ELEMENT
		 * @requires set template
		 * @configurable default
		 * @name .ht()
		 * @syntax list.ht(templateString, object...)
		 * @syntax list.ht(templateFunction, object...)
		 * @syntax list.ht(idSelector, object...)
		 * @module WEB+UTIL
		 * Replaces the content of the list elements with the HTML generated using the given template. The template uses
		 * ##template() syntax and HTML-escaped its output using ##escapeHtml(). 
		 * 
		 * @example When you have a HTML snippet like this:
		 * <pre>
		 * &lt;div id="price">&lt;/div>
		 * </pre> 
		 * Then you can format the price value like this:
		 * <pre>
		 * var price = 14.9;
		 * $('#price').ht('&lt;b>${{::0.00}}&lt;/b>', price);
		 * </pre>
		 * Results in:
		 * <pre>
		 * &lt;div id="price">&lt;b>$14.90&lt;/b>&lt;/div>
		 * </pre> 
		 *
		 * @example Render a list of names:
		 * <pre>
		 * var names = [ {first: 'James', last: 'Sullivan'}, 
		 *               {first: 'Michael', last: 'Wazowski'} ];
		 * $('#list').ht('&lt;h2>{{listName}}&lt;/h2>'+
		 *               '&lt;ul>{{each n: names}}&lt;li>{{n.first}} {{n.last}}&lt;/li>{{/each}}&lt;/ul>', 
		 *               {listName: 'Guys', names: names});
		 * </pre>
		 * The code creates this:
		 * <pre>
		 * &lt;h2>Guys&lt;/h2>
		 * &lt;ul>&lt;li>James Sullivan&lt;li>&lt;li>Michael Wazowski&lt;/li>&lt;/ul>
		 * </pre> 
		 * 
		 * @example You can store templates in &lt;script&gt; tags. First you need to create a &lt;script&gt; tag with a type not
		 *          supported by the browser and put your template in there, like this:
		 * <pre>&lt;script id="myTimeTpl" type="minified-template"&gt;The time is {{HH:mm:ss}}.&lt;/script&gt;</pre>
		 * Then you can specify the tag's id directly to access it:
		 * <pre>$('#timeDisplay').ht('#myTimeTpl', new Date());</pre>
		 *
		 * @param templateString the template using ##template() syntax. Please note, because this is a template, you should
		 *                     avoid creating the template itself dynamically, as compiling templates is expensive and
		 *                     Minified will cache only a limited number of templates. Exception: If the template string does not use
		 *                     any template functionality (no {{}}), it does not need to be compiled and won't be cached.<br/>
		 *                     The template will use ##escapeHtml() as escape function, so all template substitutions will be HTML-escaped,
		 *                     unless you use triple curly-braces.
		 * @param templateFunction instead of a HTML template, <var>ht()</var> can also use a template function, e.g. one
		 *                         created by ##template(). It will be invoked with the object as only argument.
		 * @param idSelector if you pass an ID CSS selector in the form "#myScript", Minified will recognize this and use the content 
		 *                   of the specified &lt;script> element as template. This allows you to put your template into 
		 *                   a &lt;script&gt; tag with a non-JavaScript type (see example). Any string that starts with '#' and does not
		 *                   contain any spaces is used as selector.
		 * @param object optional one or more objects to pass to the template. If object is not set, the template is called with <var>undefined</var>
		 *                        as object. If exactly one object is given, it is passed directly to the template. If you specify more than one 
		 *                        object, they are ##merge#merged##.
		 * @return the current list
		 * 
		 * @see ##HTML() creates only the nodes and can be used with ##add() and other methods to add the nodes to the DOM, giving you more flexibility than <var>ht()</var>.
		 */
		'ht': function(htmlTemplate, object) {
			var o = arguments.length > 2 ? merge(sub(arguments, 1)) : object;
			return this['set']('innerHTML', isFunction(htmlTemplate) ? htmlTemplate(o) : 
				                            /{{/.test(htmlTemplate) ? formatHtml(htmlTemplate, o) : 
				                            /^#\S+$/.test(htmlTemplate) ? formatHtml($$(htmlTemplate)['text'], o) : htmlTemplate);
		 }
		/*$
		 * @stop
		 */
		// @cond !ht dummyHt:0
	///#/snippet extrasListFuncs
		
		
	};

	
	copyObj({
		///#snippet extrasUnderscoreFuncs
		// @condblock promise
		'promise': promise
		// @condend promise

		/*$
		 * @stop
		 */
		// @cond !promise dummyPromise:0

		///#/snippet extrasUnderscoreFuncs

		}, _);

	
	copyObj({
		///#snippet extrasDollarFuncs

		/*$
		 * @id setcookie
		 * @group COOKIE
		 * @configurable default
		 * @name $.setCookie()
		 * @syntax $.setCookie(name, value)
		 * @syntax $.setCookie(name, value, dateOrDays)
		 * @module WEB+UTIL
		 * Creates, updates or deletes a cookie. If there is an an existing cookie
		 * of the same name, will be overwritten with the new value and settings.
		 * 
		 * To delete a cookie, overwrite it with an expiration date in the past. The easiest way to do this is to 
		 * use <code>-1</code> as third argument.
		 *
		 * @example Reads the existing cookie 'numberOfVisits', increases the number and stores it:
		 * <pre>
		 * var visits = $.getCookie('numberOfVisits');
		 * $.setCookie('numberOfVisits', 
		 *                      visits ? (parseInt(visits) + 1) : 1,   // if cookie not set, start with 1
		 *                      365);                                  // store for 365 days
		 * </pre>
		 * 
		 * @example Deletes the cookie 'numberOfVisits':
		 * <pre>
		 * $.setCookie('numberOfVisits', '', -1);
		 * </pre>
		 * 
		 * @param name the name of the cookie. This should ideally be an alphanumeric name, as it will not be escaped by Minified and this
		 *             guarantees compatibility with all systems.
		 *             If it contains a '=', it is guaranteed not to work, because it breaks the cookie syntax. 
		 * @param value the value of the cookie. All characters can be used. Non-Alphanumeric other than "*@-_+./" will be escaped using the 
		 *              JavaScript <var>escape()</var> function, unless you set the optional <var>dontEscape</var> parameter.
		 * @param dateOrDays optional specifies when the cookie expires. Can be either a Date object or a number that specifies the
		 *                   amount of days. If not set, the cookie has a session lifetime, which means it will be deleted as soon as the
		 *                   browser has been closed. If the number negative or the date in the past, the cookie will be deleted.
		 * @param dontEscape optional if set, the cookie value is not escaped. Note that without escaping you can not use every possible
		 *                    character (e.g. ";" will break the cookie), but it may be needed for interoperability with systems that need
		 *                    some non-alphanumeric characters unescaped or use a different escaping algorithm.
		 * @see ##$.getCookie() reads a cookie.

		 */
		'setCookie': function(name, value, dateOrDays, dontEscape) {
			document.cookie = name + '=' + (dontEscape ? value : escape(value)) + 
				(dateOrDays ? ('; expires='+(isObject(dateOrDays) ? dateOrDays : new Date((+new Date()) + dateOrDays * 8.64E7)).toUTCString()) : '');
		},
		
		/*$
		 * @id getcookie
		 * @group COOKIE
		 * @requires
		 * @configurable default
		 * @name $.getCookie()
		 * @syntax $.getCookie(name)
		 * @syntax $.getCookie(name, dontUnescape)
		 * @module WEB+UTIL
		 * Returns the cookie with the given name. 
		 *
		 * @example Reads the existing cookie 'numberOfVisits' and displays the number in the element 'myCounter':
		 * <pre>
		 * var visits = $.getCookie('numberOfVisits');
		 * if (!visits)    // check whether cookie set. Null if not
		 *     $('#myCounter').set('innerHML', 'Your first visit.');
		 * else
		 *     $('#myCounter').set('innerHTML', 'Visit No ' + visits);
		 * </pre>
		 *  
		 * @param name the name of the cookie. Should consist of alphanumeric characters, percentage, minus and underscore only, as it will not be escaped. 
		 *             You may want to escape the name using <var>encodeURIComponent()</var> if it contains any other characters.
		 * @param dontUnescape optional if set and true, the value will be returned unescaped. Use this parameter only if the value has been encoded
		 *                     in a special way and not with the standard JavaScript <var>encode()</var> method.
		 * @return the value of the cookie, or <var>null</var> if not found. Unless <var>dontUnescape</var> has been set, the value has been unescaped
		 *         using JavaScript's <code>unescape()</code> function.
		 *
		 * @see ##$.setCookie() sets a cookie.
		 */
		'getCookie': function(name, dontUnescape) {
			var regexp, match = (regexp = new RegExp('(^|;)\\s*'+name+'=([^;]*)').exec(document.cookie)) && regexp[2];
			return dontUnescape ? match : match && unescape(match);
		},
		
		/*$
		 * @id wait
		 * @group EVENTS
		 * @configurable default
		 * @requires promise
		 * @name $.wait()
		 * @syntax $.wait()
		 * @syntax $.wait(durationMs)
		 * @syntax $.wait(durationMs, args)
		 * @module WEB+UTIL
		 *
		 * Creates a new  ##promise#Promise## that will be fulfilled as soon as the specified number of milliseconds have passed. This is mainly useful for animation,
		 * because it allows you to chain delays into your animation chain.
		 * 
		 * The operation can be interrupted by calling the promise's ##stop() function.
		 *
		 * @example Chained animation using Promise callbacks. The element is first moved to the position 200/0, then to 200/200, waits for 50ms 
		 *          and finally moves to 100/100.
		 * <pre>
		 * var div = $('#myMovingDiv').set({$left: '0px', $top: '0px'});
		 * div.animate({$left: '200px', $top: '0px'}, 600, 0)
		 *    .then(function() {
		 *           div.animate({$left: '200px', $top: '200px'}, 800, 0);
		 *    }).then(function() {
		 *    	     return _.wait(50);
		 *    }).then(function() {
		 *           div.animate({$left: '100px', $top: '100px'}, 400);
		 *    });
		 * });
		 * </pre>
		 *
		 *
		 * @param durationMs optional the number of milliseconds to wait. If omitted, the promise will be fulfilled as soon as the browser can run it
		 *                   from the event loop.
		 * @param args optional an array or list of arguments to pass to the promise handler
		 * @return a ##promise#Promise## object that will be fulfilled when the time is over, or fail when the promise's ##stop() has been called. 
		 *         The promise argument of a fulfilled promise is the <var>args</var> parameter as given to <var>wait()</var>. The returned promise supports ##stop()
		 *         to interrupt the promise.
		 */
		'wait': function(durationMs, args) {
			var p = promise();
			var id = setTimeout(function() { 
				p['fire'](true, args); 
			}, durationMs);
			p['stop0'] = function() { p['fire'](false); clearTimeout(id); };
			return p;
		}
		
		/*$
		 * @stop
		 */
		// @cond !wait dummyWait:0

		///#/snippet extrasDollarFuncs

		}, $);


	
	return {
		
	///#snippet extrasExports

		/*$
		 * @id html
		 * @group ELEMENT
		 * @requires template ht
		 * @configurable default
		 * @name HTML()
		 * @syntax HTML(templateString, object...)
		 * @syntax HTML(templateFunction, object...)
		 * @syntax HTML(idSelector, object...)
		 * @module WEB
		 * Creates a ##list#list## of HTML nodes from the given HTML template. The list is compatible with ##add(), ##fill() and related methods.
		 * The template uses the ##template() syntax with ##escapeHtml() escaping for values.
		 * 
		 * Please note that the function <var>HTML</var> will not be automatically exported by Minified. You should always import it
		 * using the recommended import statement:
		 * <pre>
		 * var MINI = require('minified'), $ = MINI.$, $$ = MINI.$$, EE = MINI.EE, <strong>HTML = MINI.HTML</strong>;
		 * </pre>
		 * 
		 * @example Creating a HTML element showing a number:
		 * <pre>
		 * &lt;div id="price">-&lt;/div>
		 * </pre> 
		 * Then the price can be set like this:
		 * <pre>
		 * var price = 14.9;
		 * $('#price').fill(HTML('&lt;b>${{::0.99}}&lt;/b>', price));
		 * </pre>
		 * Results in:
		 * <pre>
		 * &lt;div id="price">&lt;b>$14.90&lt;/b>&lt;/div>
		 * </pre> 
		 *
		 * @example Adding elements to an existing list:
		 * <pre>
		 * var names = [ {first: 'James', last: 'Sullivan'}, 
		 *               {first: 'Michael', last: 'Wazowski'} ];
		 * $('#list').add(HTML('{{each}}&lt;li>{{this.first}} {{this.last}}&lt;/li>{{/each}}', names);
		 * </pre>
		 * The code adds this to #list:
		 * <pre>
		 * &lt;li>James Sullivan&lt;li>&lt;li>Michael Wazowski&lt;/li>
		 * </pre> 
		 * 
		 * @example You can store templates in &lt;script&gt; tags. First you need to create a &lt;script&gt; tag with a type not
		 *          supported by the browser and put your template in there, like this:
		 * <pre>&lt;script id="myTimeTpl" type="minified-template"&gt;The time is {{HH:mm:ss}}.&lt;/script&gt;</pre>
		 * Then you can specify the tag's id directly to access it:
		 * <pre>$('#timeDisplay').fill(HTML('#myTimeTpl', new Date()));</pre>
		 *
		 * @param templateString the template using ##template() syntax. Please note, because this is a template, you should
		 *                     avoid creating the template itself dynamically, as compiling templates is expensive and
		 *                     Minified will cache only a limited number of templates. Exception: If the template string does not use
		 *                     any template functionality (no {{}}), it does not need to be compiled and won't be cached.
		 *                     The template will use ##escapeHtml() as escape function, so all template substitutions will be HTML-escaped,
		 *                     unless you use triple curly-braces.
		 * @param templateFunction instead of a HTML template <var>HTML()</var> also accepts a template function, e.g. one
		 *                         created by ##template(). It will be invoked with the object as only argument.
		 * @param idSelector if you pass an ID CSS selector in the form "#myScript", Minified will recognize this and use the content 
		 *                   of the specified &lt;script> element as template. This allows you to put your template into 
		 *                   a &lt;script&gt; tag with a non-JavaScript type (see example). Any string that starts with '#' and does not
		 *                   contain any spaces is used as selector.
		 * @param object optional one or more objects to pass to the template. If object is not set, the template is called with <var>undefined</var>
		 *                        as object. If exactly one object is given, it is passed directly to the template. If you specify more than one 
		 *                        object, they are ##merge#merged##.
		 * @return the list containing the new HTML nodes
		 *  
		 * @see ##ht() is a shortcut for <code>fill(HTML())</code>.
		 * @see ##EE() is a different way of creating HTML nodes.
		 */
		'HTML': function () {
			var div = EE('div');
		    return  _(call(div['ht'], div, arguments)[0].childNodes);
		},
		/*$
		 * @stop
		 */
		
		///#/snippet extrasExports
		dummyStop:0
		};
	
}
	
