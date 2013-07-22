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
			p.add(s = EE('div', {$width: '30px', $height: '10px'})()[0]);
			p.add(s2 = EE('div', {$width: '30px', $height: '10px'})()[0]);
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
		name:'$.off()',
		exec: function() {
			var p = $('#container2');
			var handler;
			var callNum = 0;
			var expect = null, error = null;
			var s, s2;
			p.add(s = EE('div', {$width: '30px', $height: '10px'})()[0]);
			p.add(s2 = EE('div', {$width: '30px', $height: '10px'})()[0]);
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
			p.add(s = EE('div', {$width: '30px', $height: '10px'})()[0]);
			p.add(s2 = EE('div', {$width: '30px', $height: '10px'})()[0]);
			$(s).add(s3 = EE('div', {$width: '1px', $height: '10px'})()[0]);

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
