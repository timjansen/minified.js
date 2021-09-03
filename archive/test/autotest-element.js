window.miniTests.push.apply(window.miniTests, [
	{
		name:'EE() / simple',
		exec: function() {
			var sl = EE('span')();
			check(sl.length, 1, "First len test");
			var s = sl[0];
			check(s.nodeType, 1, "First node type test");
			check(/^span$/i.test(s.tagName));
			check(s.childNodes.length, 0);
			check(s.parentElement, null);
			
			var sl2 = EE('span', {'@title': 'mytitle'})();
			check(sl2.length, 1, "Second len test");
			var s2 = sl2[0];
			check(s2.nodeType, 1, "Second node type test");
			check(/^span$/i.test(s2.tagName));
			check(s2.getAttribute('title'), 'mytitle');
			check(s2.childNodes.length, 0);
		}
	},
	{
		name:'EE() / full',
		exec: function() {
			var sl3 = EE('div', {'@title': '5', 'className': 'a b', $marginTop: '2px'}, 'hello')();
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
		name:'EE() / onCreate',
		exec: function() {
			var cap = null;
			var sl3 = EE('div', {'@title': '5', 'className': 'a b', $marginTop: '2px'}, 'hello', function(e) {
				cap = e;
			});
			var s1 = sl3();
			check(cap, s1);
			var s2 = sl3();
			check(cap, s2);
		}
	},
	{
		name:'EE() / complex',
		exec: function() {
			var sl4 = EE('div', ['hello' , EE('b', null, 'user'), '!'])();
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
		name:'$().add()',
		exec: function() {
			var sl = EE('span')();
			sl.add('test');
			check(sl[0].childNodes.length, 1);
			check(sl[0].firstChild.nodeType, 3);
			check(sl[0].firstChild.data, 'test');
			
			sl.add(EE('br'));
			check(sl[0].childNodes.length, 2);
			check(sl[0].childNodes[1].nodeType, 1);
			check(/^br$/i.test(sl[0].childNodes[1].tagName));
			
			sl.add(['foo', EE('span', 'bar')]);
			check(sl[0].childNodes.length, 4);
			check(sl[0].childNodes[2].nodeType, 3);
			check(sl[0].childNodes[3].nodeType, 1);
			check(/^span$/i.test(sl[0].childNodes[3].tagName));
			
			sl.add(null);
			check(sl[0].childNodes.length, 4);
		}
	},
	{
		name:'$().add() / function',
		exec: function() {
			var sl = EE('span')();
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
				return [EE('br'), EE('br'), 'bar'];
			});
			check(sl[0].childNodes.length, 4);
			check(sl[0].childNodes[3].nodeType, 3);
		}
	},
	{
		name:'$().fill()',
		exec: function() {
			var sl = EE('span')();
			sl.fill(EE('br'));
			check(sl[0].childNodes.length, 1);
			check(sl[0].childNodes[0].nodeType, 1);
			check(/^br$/i.test(sl[0].childNodes[0].tagName));
			
			sl.fill(['foo', EE('br'), 'bar']);
			check(sl[0].childNodes.length, 3);
			check(sl[0].childNodes[0].data, 'foo');
			check(sl[0].childNodes[2].data, 'bar');
		}
	},
	{
		name:'$().replace()',
		exec: function() {
			var sl = EE('span')();
			sl.fill(['foo', EE('br'), 'bar']);
			$(sl[0].childNodes[2]).replace(EE('br'));
			check(sl[0].childNodes.length, 3);
			check(/^br$/i.test(sl[0].childNodes[2].tagName));
			
			$(sl[0].childNodes[2]).replace(['foo', EE('br')]);
			check(sl[0].childNodes.length, 4);
			check(sl[0].childNodes[2].data, 'foo');
			check(/^br$/i.test(sl[0].childNodes[3].tagName));
		}
	},
	{
		name:'$().addFront()',
		exec: function() {
			var sl = EE('span')();
			sl.fill([EE('br'), 'bar']);
			sl.addFront('foo');
			check(sl[0].childNodes.length, 3);
			check(sl[0].childNodes[0].data, 'foo');
			check(sl[0].childNodes[2].data, 'bar');
			check(/^br$/i.test(sl[0].childNodes[1].tagName));
		}
	},
	{
		name:'$().addAfter()',
		exec: function() {
			var sl = EE('span')();
			sl.fill([EE('br'), 'bar']);
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
		name:'$().addBefore()',
		exec: function() {
			var sl = EE('span')();
			sl.fill([EE('br'), 'bar']);
			$(sl[0].childNodes[0]).addBefore('foo');
			check(sl[0].childNodes.length, 3);
			check(sl[0].childNodes[0].data, 'foo');
			check(sl[0].childNodes[2].data, 'bar');
			check(/^br$/i.test(sl[0].childNodes[1].tagName));
			
			$(sl[0].childNodes[2]).addAfter(EE('br'));
			check(sl[0].childNodes.length, 4);
			check(/^br$/i.test(sl[0].childNodes[3].tagName));
		}
	},
	{
		name:'$().fill() / multi',
		exec: function() {
			var sl = $([EE('span')(), EE('span')(), EE('span')()]);
			sl.fill('foo');
			check(sl[0].childNodes.length, 1);
			check(sl[1].childNodes.length, 1);
			check(sl[2].childNodes.length, 1);
			sl.fill(EE('br'));
			check(sl[0].childNodes.length, 1);
			check(sl[1].childNodes.length, 1);
			check(sl[2].childNodes.length, 1);
			sl.fill([EE('br'), 'bar']);
			check(sl[0].childNodes.length, 2);
			check(sl[1].childNodes.length, 2);
			check(sl[2].childNodes.length, 2);
			sl.fill(function() { return [EE('br'), 'bar']; });
			check(sl[0].childNodes.length, 2);
			check(sl[1].childNodes.length, 2);
			check(sl[2].childNodes.length, 2);
		}
	},
	{
		name:'$().clone()',
		exec: function() {
			var sl = $('#cloneTest .cloneMe').clone();
			check(sl.length, 1);
			$('#container2').fill(sl);
			check($$('#container2 .cloneMe').innerHTML.toLowerCase(), $$('#cloneTest .cloneMe').innerHTML.toLowerCase());
		}
	},
	{
		name:'$().clone() / id',
		exec: function() {
			var sl = $('#cloneId').clone();
			check(sl.length, 1);
			$('#container2').fill(sl);
			check(/id=/.test($$('#container2').innerHTML), false, 'Clone() id removal');
			check(/nonono/.test($$('#container2').innerHTML), true, 'Clone() id / content');
		}
	}
]);
