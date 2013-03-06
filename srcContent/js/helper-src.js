// Simple list of helper functions


function hhToString(s) { 
	return s!=null ? ''+s : '';
}
function hhTrim(s) { 
	return hhToString(s).replace(/^\s+|\s+$/, '');
}
function hhIsType(s,o) {
	return typeof s == o;
}
function hhIsString(s) {
	return hhIsType(s, 'string');
}
function hhIsFunction(f) {
	return hhIsType(f, 'function');
}
function hhIsObject(f) {
	return hhIsType(f, 'object');
}
function hhIsList(v) {
	return v && v.length != null && !hhIsString(v) && !hhIsFunction(v);
}
function hhEach(list, cb) {
	if (hhIsList(list))
		for (var i = 0; i < list.length; i++)
			cb(list[i], i);
	else
		for (var n in list)
			if (list.hasOwnProperty(n))
				cb(n, list[n]);
	return list;
}
function hhFilter(list, filterFunc) {
	var r = []; 
	hhEach(list, function(node,index) {
		if (!filterFunc||filterFunc(node,index))
			r.push(node);
	});
	return r;
}
function hhFilterMap(map, filterFunc) {
	var r = {}; 
	hhEach(map, function(name, value) {
		if (!filterFunc||filterFunc(name, value))
			map[name] = value;
	});
	return r;
}
function hhCollect(list, collectFunc, result) {
	result = result || [];
	hhEach(list, function(item, index) {
		if (hhIsList(item = collectFunc(item, index))) // extreme variable reusing: item is now the callback result
			each(item, function(rr) { result.push(rr); });
		else if (item != null)
			result.push(item);
	});
	return result;
}
function hhCopy(from, to) {
	hhEach(from, function(name, value) {
		to[name] = value;
	});
	return to;
}
function hhKeys(map) {
	return hhCollect(map, function(value, name) {
		return name;
	});
}	

function hhToList(a) {
	return hhIsList(a) ? a : [a];

}

function hhDefer(callback) {
	if (typeof process != 'undefined' && process.nextTick)
		process.nextTick(callback);
	else
		window.setTimeout(callback, 0);
}

function hhCall(functionList, args, fThis) {
	hhEach(hhToList(functionList), function(f) { f.apply(fThis, hhToList(args)); });
}

function hhPromise() {
	var state; // undefined/null = pending, true = fulfilled, false = rejected
    var values = [];     // an array of values as arguments for the then() handlers
    var deferred = [];   // this function calls the functions supplied by then()

    function set(newState, newValues) {
  		if (state == null) {
    		state = newState;
    		values = hhToList(newValues);
    		hhDefer(function() {
				hhCall(deferred);
			});
		}		
    }

    set['then'] = function then(onFulfilled, onRejected) {
		var newPromise = hhPromise();
		var callCallbacks = function() {
    		try {
    			var f = (state ? onFulfilled : onRejected);
    			if (hhIsFunction(f)) {
	   				var r = f.apply(null, values);
	   				if (r && hhIsFunction(r['then']))
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
			hhDefer(callCallbacks);
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
	set['join'] = function() {
			var args = arguments;
			var numCompleted = 0;
			var values = [];
			var aborted = false;
			hhEach(args, function(promise, index) {
				promise.then(function(v) {
					values[index] = v;
					if (++numCompleted == args.length && !aborted)
						set(true, [values]);
				}, function(e) {
					values[index] = v;
					set(false, [index, values]);
					aborted = true;
				});
			});
		};
   	return set;
}

//simple template function. Input is tpl. valueMap is a map of replacements in the form name->value. 
function hhTemplate(tpl, valueMap) {
	var t = tpl;
	hhEach(valueMap, function(name, value) {
		t = t.replace(new RegExp(name, 'g'), value.replace(/(\$)/g, '$1$1')); 
	});
	return t;
}
