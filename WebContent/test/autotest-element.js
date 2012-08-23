window.miniTests.push.apply(window.miniTests, [
	{
		name:'MINI.el() / simple',
		exec: function() {
			var sl = MINI.el('span');
			check(sl.length, 1);
			var s = sl[0];
			check(s.nodeType, 1);
			check(/^span$/i.test(s.tagName));
			check(s.childNodes.length, 0);
			check(s.parentElement, null);
			
			var sl2 = MINI.el('span', {'@title': 'mytitle'});
			check(sl2.length, 1);
			var s2 = sl2[0];
			check(s2.nodeType, 1);
			check(/^span$/i.test(s2.tagName));
			check(s2.getAttribute('title'), 'mytitle');
			check(s2.childNodes.length, 0);
		}
	},
	{
		name:'MINI.el() / full',
		exec: function() {
			var sl3 = MINI.el('div', {'@title': '5', '@class': 'a b', $marginTop: '2px'}, 'hello');
			check(sl3.length, 1);
			var s3 = sl3[0];
			check(s3.nodeType, 1);
			check(/^div$/i.test(s3.tagName));
			check(s3.getAttribute('title'), '5');
			check(s3.getAttribute('class') == 'a b' || s3.getAttribute('className') == 'a b');
			check(s3.style.marginTop, '2px');
			check(s3.childNodes.length, 1);
			var t = s3.childNodes[0];
			check(t.nodeType, 3);
			check(t.data, 'hello');
			check(t.parentNode, s3, true);
		}
	},
	{
		name:'MINI.el() / complex',
		exec: function() {
			var sl4 = MINI.el('div', ['hello' , MINI.el('b', null, 'user'), '!']);
			var s4 = sl4[0];
			check(s4.nodeType, 1);
			check(/^div$/i.test(s4.tagName));
			check(s4.childNodes.length, 3);
			var t2 = s4.childNodes[0];
			check(t2.nodeType, 3);
			check(t2.data, 'hello');
			check(t2.parentNode, s4, true);
			var s5 = s4.childNodes[1];
			check(s5.nodeType, 1);
			check(/^b$/i.test(s5.tagName));
			check(s5.parentNode, s4, true);
			check(s5.childNodes.length, 1);
			var t3 = s4.childNodes[2];
			check(t3.nodeType, 3);
			check(t3.data, '!');
			check(t3.parentNode, s4, true);
			var t4 = s5.childNodes[0];
			check(t4.nodeType, 3);
			check(t4.data, 'user');
			check(t4.parentNode, s5, true);
		}
	},
	{
		name:'MINI().add()',
		exec: function() {
			var sl = MINI.el('span');
			sl.add('test');
			check(sl[0].childNodes.length, 1);
			check(sl[0].firstChild.nodeType, 3);
			check(sl[0].firstChild.data, 'test');
			
			sl.add(MINI.el('br'));
			check(sl[0].childNodes.length, 2);
			check(sl[0].childNodes[1].nodeType, 1);
			check(/^br$/i.test(sl[0].childNodes[1].tagName));
			
			sl.add(['foo', MINI.el('span', 'bar')]);
			check(sl[0].childNodes.length, 4);
			check(sl[0].childNodes[2].nodeType, 3);
			check(sl[0].childNodes[3].nodeType, 1);
			check(/^span$/i.test(sl[0].childNodes[3].tagName));
		}
	},
	{
		name:'MINI().add() / function',
		exec: function() {
			var sl = MINI.el('span');
			sl.add(function(obj, index) {
				check(obj, sl[0], true);
				check(index, 0);
				return 'test';
			});
			check(sl[0].childNodes.length, 1);
			check(sl[0].firstChild.nodeType, 3);
			check(sl[0].firstChild.data, 'test');
			
			sl.add(function(obj, index) {
				check(obj, sl[0], true);
				check(index, 0);
				return [MINI.el('br'), MINI.el('br'), 'bar'];
			});
			check(sl[0].childNodes.length, 4);
			check(sl[0].childNodes[3].nodeType, 3);
		}
	},
	{
		name:'MINI().fill()',
		exec: function() {
			var sl = MINI.el('span');
			sl.fill(MINI.el('br'));
			check(sl[0].childNodes.length, 1);
			check(sl[0].childNodes[0].nodeType, 1);
			check(/^br$/i.test(sl[0].childNodes[0].tagName));
			
			sl.fill(['foo', MINI.el('br'), 'bar']);
			check(sl[0].childNodes.length, 3);
			check(sl[0].childNodes[0].data, 'foo');
			check(sl[0].childNodes[2].data, 'bar');
		}
	},
	{
		name:'MINI().replace()',
		exec: function() {
			var sl = MINI.el('span');
			sl.fill(['foo', MINI.el('br'), 'bar']);
			$(sl[0].childNodes[2]).replace(MINI.el('br'));
			check(sl[0].childNodes.length, 3);
			check(/^br$/i.test(sl[0].childNodes[2].tagName));
			
			$(sl[0].childNodes[2]).replace(['foo', MINI.el('br')]);
			check(sl[0].childNodes.length, 4);
			check(sl[0].childNodes[2].data, 'foo');
			check(/^br$/i.test(sl[0].childNodes[3].tagName));
		}
	},
	{
		name:'MINI().addFront()',
		exec: function() {
			var sl = MINI.el('span');
			sl.fill([MINI.el('br'), 'bar']);
			sl.addFront('foo');
			check(sl[0].childNodes.length, 3);
			check(sl[0].childNodes[0].data, 'foo');
			check(sl[0].childNodes[2].data, 'bar');
			check(/^br$/i.test(sl[0].childNodes[1].tagName));
		}
	},
	{
		name:'MINI().addAfter()',
		exec: function() {
			var sl = MINI.el('span');
			sl.fill([MINI.el('br'), 'bar']);
			$(sl[0].childNodes[0]).addAfter('foo');
			check(sl[0].childNodes.length, 3);
			check(sl[0].childNodes[1].data, 'foo');
			check(sl[0].childNodes[2].data, 'bar');
			check(/^br$/i.test(sl[0].childNodes[0].tagName));
			
			$(sl[0].childNodes[2]).addAfter('test');
			check(sl[0].childNodes.length, 4);
			check(sl[0].childNodes[3].data, 'test');
		}
	},
	{
		name:'MINI().addBefore()',
		exec: function() {
			var sl = MINI.el('span');
			sl.fill([MINI.el('br'), 'bar']);
			$(sl[0].childNodes[0]).addBefore('foo');
			check(sl[0].childNodes.length, 3);
			check(sl[0].childNodes[0].data, 'foo');
			check(sl[0].childNodes[2].data, 'bar');
			check(/^br$/i.test(sl[0].childNodes[1].tagName));
			
			$(sl[0].childNodes[2]).addAfter(MINI.el('br'));
			check(sl[0].childNodes.length, 4);
			check(/^br$/i.test(sl[0].childNodes[3].tagName));
		}
	}
]);
