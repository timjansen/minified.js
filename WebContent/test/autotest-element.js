window.miniTests.push.apply(window.miniTests, [
	{
		name:'MINI.el() / simple',
		exec: function() {
			var s = MINI.el('span');
			check(s.nodeType, 1);
			check(/^span$/i.test(s.tagName));
			check(s.childNodes.length, 0);
			check(s.parentElement, null);
			
			var s2 = MINI.elAppend(document.getElementById('container2'), 'span', {'@title': 'mytitle'});
			check(s2.nodeType, 1);
			check(/^span$/i.test(s2.tagName));
			check(s2.getAttribute('title'), 'mytitle');
			check(s2.childNodes.length, 0);
			check(s2.parentElement, document.getElementById('container2'), true);
		}
	},
	{
		name:'MINI.el() / full',
		exec: function() {
			var s3 = MINI.elAppend('#container2', 'div', {'@title': '5', '@class': 'a b', $marginTop: '2px'}, 'hello');
			check(s3.nodeType, 1);
			check(/^div$/i.test(s3.tagName));
			check(s3.getAttribute('title'), '5');
			check(s3.getAttribute('class') == 'a b' || s3.getAttribute('className') == 'a b');
			check(s3.style.marginTop, '2px');
			check(s3.parentNode, document.getElementById('container2'), true);
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
			var s4 = MINI.elAppend('#container2', 'div', ['hello' , MINI.el('b', null, 'user'), '!']);
			check(s4.nodeType, 1);
			check(/^div$/i.test(s4.tagName));
			check(s4.parentNode, document.getElementById('container2'), true);
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
		name:'MINI.el() / existing',
		exec: function() {
			var u0 = MINI.el('div', {'@title': 'foo'}, 'text');
			var u = MINI.el(u0, {'@title':'bar'}, 'othertext');
			check(u.childNodes.length, 1);
			check(u.childNodes[0].nodeType, 3);
			check(u.childNodes[0].data, 'othertext');
			check(u.getAttribute('title'), 'bar');
		}
	},
	{
		name:'MINI.el / adding',
		exec: function() {
			var s = MINI.elAppend('#container2', 'span');
			check(s.parentNode, $$('#container2'), true);
			check($$('#container2').childNodes.length, 1);
			
			var s2 = MINI.elAppend('#container2', 'span');
			check(s2.parentNode, $$('#container2', true));
			check($$('#container2').childNodes.length, 2);
			check($$('#container2').childNodes[0], s, true);
			check($$('#container2').childNodes[1], s2, true);
			
			var s3 = MINI.elAfter(s, 'span');
			check(s3.parentNode, $$('#container2', true));
			check($$('#container2').childNodes.length, 3);
			check($$('#container2').childNodes[0], s, true);
			check($$('#container2').childNodes[1], s3, true);
			check($$('#container2').childNodes[2], s2, true);
			
			var s4 = MINI.elAfter(s2, 'span');
			check(s4.parentNode, $$('#container2', true));
			check($$('#container2').childNodes.length, 4);
			check($$('#container2').childNodes[0], s, true);
			check($$('#container2').childNodes[1], s3, true);
			check($$('#container2').childNodes[2], s2, true);
			check($$('#container2').childNodes[3], s4, true);
			
			var s1 = MINI.elReplace(s3, 'span');
			check(s1.parentNode, $$('#container2', true));
			check($$('#container2').childNodes.length, 4);
			check($$('#container2').childNodes[0], s, true);
			check($$('#container2').childNodes[1], s1, true);
			check($$('#container2').childNodes[2], s2, true);
			check($$('#container2').childNodes[3], s4, true);
			
			var s0 = MINI.elBefore(s, 'span');
			check(s0.parentNode, $$('#container2', true));
			check($$('#container2').childNodes.length, 5);
			check($$('#container2').childNodes[0], s0, true);
			check($$('#container2').childNodes[1], s, true);
			check($$('#container2').childNodes[2], s1, true);
			check($$('#container2').childNodes[3], s2, true);
			check($$('#container2').childNodes[4], s4, true);
			
			$('#container2').empty();
			var t0 = MINI.elPrepend('#container2', 'span', "t0");
			check($$('#container2').childNodes.length, 1);
			check($$('#container2').childNodes[0], t0, true);
			var t1 = MINI.elPrepend('#container2', 'div', "t1");
			check($$('#container2').childNodes.length, 2);
			check($$('#container2').childNodes[0], t1, true);
			check($$('#container2').childNodes[1], t0, true);
			check($$('#container2').childNodes[0].childNodes.length, 1);
			check($$('#container2').childNodes[0].childNodes[0].nodeType, 3);
		}
	}
]);
