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

window.miniTests.push.apply(window.miniTests, [
	{
		name:'$().on()',
		exec: function() {
			var p = $('#container2');
			var handler;
			var callNum = 0, lastIndex;
			var expect, error;
			var s, s2;
			p.add(s = EE('div', {$width: '30px', $height: '10px'})[0]);
			p.add(s2 = EE('div', {$width: '30px', $height: '10px'})[0]);
			$('div', p).on('click', handler = function(e, index) {
				callNum++;
				lastIndex = index;
				if (this != expect)
					error = 'Did not get called on expected event';
			});
			
			check(handler.M != null);
			check(handler.M.length, 2);
			
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
		}
	},
	{
		name:'$().on(selectors)',
		exec: function() {
			var p = $('#container2');
			var s, c1, c2, c3;
			var proofEek1 = 0, proofPropagation = 0; proofBoo = 0, proofClonk = 0;
			p.add(s = EE('div')[0]);
			$(s).add(c1 = EE('p','bla')[0]);
			$(s).add(c2 = EE('span', 'x')[0]);
			$(s).add(c3 = EE('span', {$: 'supiClass'} ,'x')[0]);
			
			$(s).on('|eek', 'span.supiClass', function(e, index) { if (e.success && index==0 && this===c3) proofEek1++; });
			$(s).on('eek', 'span.supiClass', function() { check(++proofPropagation, proofEek1, "Propagation failed."); });
			$(s).on('eek', 'span.supiClass', function() { fail('stopping propagation failed');});
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

			$(s).on('boo', 'span', function(e, index) { if (e.success && index==0 && this===c3) proofBoo++; });
			$(c3).trigger('boo', {success:1});
			check(proofBoo, 1, "boo triggered");

			$(s).on('clonk', 'span', function(e, index) { if (e.success && index==0 && (this===c3 || this == c2)) proofClonk++; });
			$(c3).trigger('clonk', {success:1});
			check(proofClonk, 1, "clonk triggered");
			$(c2).trigger('clonk', {success:1});
			check(proofClonk, 2, "clonk triggered again");
			$(c1).trigger('clonk', {success:1});
			check(proofClonk, 2, "clonk not triggered");
		}
	},
	{
		name:'$().on(selectors) live',
		exec: function() {
			var p = $('#container2');
			var s, c3, c4, c5;
			var proofTag = 0, proofClass = 0, proofComplexMatch = 0, proofComplexNonMatch = 0;
			p.add(s = EE('div')[0]);
			$(s).add(EE('p','bla')[0]);
			$(s).add(EE('span', 'x')[0]);
			$(s).add(c3 = EE('span', {$: 'supiClass'} ,'x')[0]);
			$(s).on('|eek', 'span', function(e, index) { if (e.success && index==0) proofTag++; });
			$(s).on('|eek', '.supiClass', function(e, index) { if (e.success && index==0) proofClass++; });
			$(s).on('|eek', 'a,.supiClass,form,.whatever', function(e, index) { if (e.success && index==0) proofComplexMatch++; });
			$(s).on('|eek', 'form,.whatever,#nada', function(e, index) { if (e.success && index==0) proofComplexNonMatch++; });
			
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
		}
	},
	{
		name:'$.off()',
		exec: function() {
			var p = $('#container2');
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
		}
	},
	{
		name:'$().trigger()',
		exec: function() {
			var p = $('#container2');
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
			
			$(s3).on('eek', function(e) { if (e.success) proofEek2++; return false; });
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
		}
	}
]);
