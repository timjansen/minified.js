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
		name:'MINI.on()',
		exec: function() {
			var p = $('#container2');
			var handler;
			var callNum = 0;
			var expect, error;
			var s, s2;
			p.add(s = MINI.el('div', {$width: '30px', $height: '10px'})[0]);
			p.add(s2 = MINI.el('div', {$width: '30px', $height: '10px'})[0]);
			$('div', p).on('click', handler = function(e, xe) {
				callNum++;
				if (this != expect)
					error = 'Did not get called on expected event';
			});
			
			check(handler._M != null);
			
			expect = s;
			triggerEvent(s, createClick());
			check(callNum, 1);
			check(error, null);

			expect = s2;
			triggerEvent(s2, createClick());
			check(callNum, 2);
			check(error, null);
		}
	},
	{
		name:'MINI.off()',
		exec: function() {
			var p = $('#container2');
			var handler;
			var callNum = 0;
			var expect = null, error = null;
			var s, s2;
			p.add(s = MINI.el('div', {$width: '30px', $height: '10px'})[0]);
			p.add(s2 = MINI.el('div', {$width: '30px', $height: '10px'})[0]);
			$('div', p).on('click', handler = function(e, xe) {
				callNum++;
				if (this != expect)
					error = 'Did not get called on expected event';
			});
			
			$(s).off('click', handler); 
			
			triggerEvent(s, createClick());
			check(callNum, 0);

			expect = s2;
			triggerEvent(s2, createClick());
			check(callNum, 1);
			check(error, null);
			
			$(s2).off('click', handler); 
			triggerEvent(s2, createClick());
			check(callNum, 1);
		}
	}
]);
