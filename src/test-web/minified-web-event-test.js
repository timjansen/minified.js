function createClick() {
	var event;
	if (document.createEvent) {
		event = document.createEvent("MouseEvents");
		event.initMouseEvent("click", true, true, window, 1, 10,10, 10,10, 0,0,0,0, 1, null);
	} 
	else {
	    event = document.createEventObject();
	    event.eventType = "click";
	}
	return event;
}

function triggerEvent(element, event) {
	if (document.createEvent)
	    element.dispatchEvent(event);
	else
		element.fireEvent("on" + event.eventType, event);
} 

describe('minified-web-event-test.js', function() {
	
	beforeEach(function() {
		$('#container2').fill();
	});
	
	describe('.on()', function() {
		it('works without selectors', function() {
			var p = $('#container2').fill();
			var handler;
			var callNum = 0, lastIndex = 0;
			var expect = null, error = null;
			var s, s2;
			
			p.add(s = EE('div', {$width: '30px', $height: '10px'})[0]);
			p.add(s2 = EE('div', {$width: '30px', $height: '10px'})[0]);
			$('div', p).on('click', handler = function(e, index) {
				callNum++;
				lastIndex = index;
				if (this != expect)
					error = 'Did not get called on expected element';
			});

			check(handler.M != null);
			check(handler.M.length, 2, 'Got handler');
			
			expect = s;
			triggerEvent(s, createClick());
			check(callNum, 1, "callNum");
			check(lastIndex, 0, "index");
			check(error, null);

			expect = s2;
			triggerEvent(s2, createClick());
			check(callNum, 2, "callNum");
			check(lastIndex, 1, "index");
			check(error, null);
		});
				
		it('works with sub-selectors', function() {
			var p = $('#container2').fill();
			var handler;
			var callNum = 0, lastIndex = 0;
			var expect = null, error = null;
			var s, s2;
			
			p.add(s = EE('div', {$width: '30px', $height: '10px'})[0]);
			p.add(s2 = EE('div', {$width: '30px', $height: '10px'})[0]);
			$(p).on('div', 'click', handler = function(e, index) {
				callNum++;
				lastIndex = index;
				if (this != expect)
					error = 'Did not get called on expected event';
			});

			check(handler.M != null);
			check(handler.M.length, 2, 'Got handler');
			
			expect = s;
			triggerEvent(s, createClick());
			check(callNum, 1, "callNum");
			check(lastIndex, 0, "index");
			check(error, null);

			expect = s2;
			triggerEvent(s2, createClick());
			check(callNum, 2, "callNum");
			check(lastIndex, 0, "index");
			check(error, null);
		});
		
		it('bubbles correctly', function() {
			var p = $('#container2');
			var callNum = 0;
			var error = null;
			var s, c;
			p.add(s = EE('div', {$width: '30px', $height: '10px'}, c = EE('span')[0])[0]);
			$('div', p).on('click', function(e, index) {
				callNum++;
				if (this == c)
					error = 'wrong this: set to triggered element, not to registered!';
				else if (this != s)
					error = 'wrong this: neither triggered no registered element!';
			});
			
			triggerEvent(c, createClick());
			check(callNum, 1, "callNum");
			check(error, null);
		});
		
		it('passes arguments and this correctly', function() {
			var p = $('#container2');
			var callNum = 0;
			var error = null;
			var s;
			p.add(s = EE('div', {$width: '30px', $height: '10px'})[0]);
			$('div', p).on('click', function(a, b, c) {
				callNum++;
				if (this != s)
					error = 'arg only: wrong this!';
				if (a != 1 || b != 2 || c != 3)
					error = 'arg only: arguments not passed';
			}, [1, 2, 3]);
			$('div', p).on('click', function(x) {
				callNum++;
				if (this != s)
					error = 'this and arg: wrong this!';
				if (x != "bar")
					error = 'this and arg: arguments not passed';
			}, ["bar"]);
			
			triggerEvent(s, createClick());
			check(error, null);
			check(callNum, 2, "callNum");
		});
		
		it('works with bubble', function() {
			var p = $('#container2');
			var s, c1, c2, c3;
			var proofEek1 = 0, proofPropagation = 0, proofBoo = 0, proofClonk = 0;
			p.add(s = EE('div')[0]);
			$(s).add(c1 = EE('p','bla')[0]);
			$(s).add(c2 = EE('span', 'x')[0]);
			$(s).add(c3 = EE('span', {$: 'supiClass'} ,'x')[0]);
			
			$(s).on('|eek', function(e, index) { 
				check(e.success, true, 'success set'); 
				check(index, 0, ' index set');
				check(this, c3, 'this set', true);
				proofEek1++; 
			}, 'span.supiClass');
			$(s).on('eek', function() { check(++proofPropagation, proofEek1, "Propagation failed."); }, 'span.supiClass');
			$(s).on('|eek', function() { fail('stopping propagation failed');}, 'span.supiClass');
			$(s).trigger('eek', {success:1});
			check(proofEek1, 0, "eek not triggered / selector does not match parent");
			$(c1).trigger('eek', {success:1});
			check(proofEek1, 0, "eek not triggered / selector does not match first child");
			$(c2).trigger('eek', {success:1});
			check(proofEek1, 0, "eek not triggered / selector does not match second child");
			$(c3).trigger('eek', {success:1});
			check(proofEek1, 1, "eek triggered");
			$(c3).trigger('eek', {success:1});
			check(proofEek1, 2, "eek triggered again");
			check(proofPropagation, proofEek1, "Propagation missing.");

			$(s).on('boo', function(e, index) { if (e.success && index==0 && this===c3) proofBoo++; }, 'span');
			$(c3).trigger('boo', {success:1});
			check(proofBoo, 1, "boo triggered");

			$(s).on('clonk', function(e, index) { if (e.success && index==0 && (this===c3 || this == c2)) proofClonk++; }, 'span');
			$(c3).trigger('clonk', {success:1});
			check(proofClonk, 1, "clonk triggered");
			$(c2).trigger('clonk', {success:1});
			check(proofClonk, 2, "clonk triggered again");
			$(c1).trigger('clonk', {success:1});
			check(proofClonk, 2, "clonk not triggered");
		});
		
		it('works with live selectors', function() {
			var p = $('#container2');
			var s, c3, c4, c5;
			var proofTag = 0, proofClass = 0, proofComplexMatch = 0, proofComplexNonMatch = 0;
			p.add(s = EE('div')[0]);
			$(s).add(EE('p','bla')[0]);
			$(s).add(EE('span', 'x')[0]);
			$(s).add(c3 = EE('span', {$: 'supiClass'} ,'x')[0]);
			$(s).on('|eek', function(e, index) { if (e.success && index==0) proofTag++; }, 'span');
			$(s).on('|eek', function(e, index) { if (e.success && index==0) proofClass++; }, '.supiClass');
			$(s).on('|eek', function(e, index) { if (e.success && index==0) proofComplexMatch++; }, 'a,.supiClass,form,.whatever');
			$(s).on('|eek', function(e, index) { if (e.success && index==0) proofComplexNonMatch++; }, 'form,.whatever,#nada');
			
			$(c3).trigger('eek', {success:1});
			check(proofTag, 1, "eek selector test / tag");
			check(proofClass, 1, "eek selector test / class");
			check(proofComplexMatch, 1, "eek selector test / complex");
			check(proofComplexNonMatch, 0, "eek selector test / complex non");

			$(s).add(c4 = EE('span','y')[0]);
			$(s).add(c5 = EE('span', {$: 'supiClass'} ,'z')[0]);

			$(c4).trigger('eek', {success:1});
			check(proofTag, 2, "live test, span only / tag");
			check(proofClass, 1, "live test, span only / class");
			check(proofComplexMatch, 1, "live test, span only / complex");
			check(proofComplexNonMatch, 0, "live test, span only / complex non");

			$(c5).trigger('eek', {success:1});
			check(proofTag, 3, "live test, span and class / tag");
			check(proofClass, 2, "live test, span and class / class");
			check(proofComplexMatch, 2, "live test, span and class / complex");
			check(proofComplexNonMatch, 0, "live test, span and class / complex non");
		});
		
		it('bubbles real events correctly with selectors', function() {
			if (isLegacyIE) // can't test in IE, custom events don't bubble
				return;
			
			var p = $('#container2');
			var s, c, g, error = null;
			var proof = 0;
			p.add(s = EE('div'));
			s.add(c = EE('p', {$: 'x'}, g = EE('span', 'bla')));

			s.on('click', function(e, index) { 
				if (index != 0)
					error = 'index not 0';
				else if (this === g[0])
					error = 'this set to triggered element, not registered element.';
				else if (this === s[0])
					error = 'this set to parent element.';
				else if (this !== c[0])
					error = 'this wrong';
				proof++; 
			}, 'p');
			triggerEvent(c[0], createClick());
			check(error, null);
			check(proof, 1, "click triggered without bubbling");

			triggerEvent(g[0], createClick());
			check(error, null);
			check(proof, 2, "click triggered with bubbling");

			triggerEvent(s[0], createClick());
			check(proof, 2, "capturing");
			
			var h;
			g.add(h = EE('b', 'bold'));
			triggerEvent(h[0], createClick());
			check(error, null);
			check(proof, 3, "double bubble");
		});
		
		it('bubbles triggered events correctly with selectors', function() {
			var p = $('#container2');
			var s, c, g, error = null;
			var proof = 0;
			p.add(s = EE('div'));
			s.add(c = EE('p', {$: 'x'}, g = EE('span', 'bla')));
	
			s.on('|eek', function(e, index) { 
				if (!e.success) 
					error = 'arg not set';
				else if (index != 0)
					error = 'index not 0';
				else if (this === g[0])
					error = 'this set to triggered element, not registered element.';
				else if (this === s[0])
					error = 'this set to parent element.';
				else if (this !== c[0])
					error = 'this wrong';
				proof++; 
			}, 'p');
			c.trigger('eek', {success:1});
			check(error, null);
			check(proof, 1, "eek triggered without bubbling");
	
			g.trigger('eek', {success:1});
			check(error, null);
			check(proof, 2, "eek triggered with bubbling");
	
			s.trigger('eek', {success:1});
			check(proof, 2, "capturing");
			
			var h;
			g.add(h = EE('b', 'bold'));
			h.trigger('eek', {success:1});
			check(error, null);
			check(proof, 3, "double bubble");
		});
	});

	
	describe('off()', function() {
		it('just works', function() {
			var p = $('#container2').fill();
			var handler;
			var callNum = 0;
			var expect = null, error = null;
			var s, s2;
			p.add(s = EE('div', {$width: '30px', $height: '10px'})[0]);
			p.add(s2 = EE('div', {$width: '30px', $height: '10px'})[0]);
			$('div', p).on('click', handler = function(e, index) {
				callNum++;
				if (this != expect)
					error = 'Did not get called on expected event';
			});
			check(handler.M.length, 2);
			check(error, null);
			
			triggerEvent(s, createClick());
			check(callNum, 1, "callNum");
			triggerEvent(s2, createClick());
			check(callNum, 2, "callNum");

			$.off(handler); 
			check(handler.M, null, "Handler.M nulled");
			
			callNum = 0;
			triggerEvent(s, createClick());
			triggerEvent(s2, createClick());
			check(callNum, 0, "after off");
		});
	});

	describe('.trigger()', function() {
		it('just works', function() {
			var p = $('#container2').fill();
			var s, s2, s3;
			var proofEek1 = 0, proofEek2 = 0;
			var proofBoo1 = 0, proofBoo2 = 0, proofBoo3 = 0, proofBoo4 = 0;
			p.add(s = EE('div', {$width: '30px', $height: '10px'})[0]);
			p.add(s2 = EE('div', {$width: '30px', $height: '10px'})[0]);
			$(s).add(s3 = EE('div', {$width: '1px', $height: '10px'})[0]);

			$(p).trigger('boo'); // nop
			
			$(s).on('|eek', function(e) { if (e.success) proofEek1++;});
			$(s).trigger('eek', {success:1});
			check(proofEek1, 1, "eek triggered");

			$(s3).trigger('eek', {success:1});
			check(proofEek1, 2, "eek bubbled");
			
			$(s3).on('?eek', function(e) { if (e.success) proofEek2++; return false; });
			$(s3).trigger('eek', {success:1});
			check(proofEek2, 1, "eek triggered again");
			check(proofEek1, 2, "event consumed");
			$(s3).trigger('eek', {success:1});
			check(proofEek2, 2, "again 2");
			check(proofEek1, 2, "event consumed again");
			
			$(s).on('|boo', function(e) { if (e.success) proofBoo1++; });
			$(s2).on('|boo', function(e) { if (e.success) proofBoo2++; });
			$(s3).on('|boo', function(e) { if (e.success) proofBoo3++; });
			$(s3).trigger('boo', {success:1});
			check(proofBoo1, 1, "got boo 1");
			check(proofBoo2, 0, "got no boo 2");
			check(proofBoo3, 1, "got boo 3");

			$(s).on('|boo', function(e) { if (e.success) proofBoo4++; }); // second handler on same element
			$([s, s2, s3]).trigger('boo', {success:1});
			check(proofBoo1, 3, "got dupe boo twice 1");
			check(proofBoo2, 1, "got dupe boo 2");
			check(proofBoo3, 2, "got dupe boo 3");
			check(proofBoo4, 2, "got dupe boo 4 all three times");

			check(proofEek1, 2, "final eek check");
			check(proofEek2, 2, "final eek check 2");
		});
	});

	/*
	describe('.fill()', function() {
		it('', function() {
			
		});
		it('', function() {
			
		});
		it('', function() {
			
		});
	});
	*/

});