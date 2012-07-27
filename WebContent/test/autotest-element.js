window.miniTests.push.apply(window.miniTests, [
	{
		name:'MINI.text()',
		exec: function() {
			var t = MINI.text('test');
			check(t.nodeType, 3);
			check(t.data, 'test');
			check(t.parentElement, null);
	
			var t2 = MINI.text('toast', document.getElementById('container2'));
			check(t2.nodeType, 3);
			check(t2.data, 'toast');
			check(t2.parentElement, document.getElementById('container2'), true);
	
			var t3 = MINI.text('tat', '#container2');
			check(t3.parentElement, document.getElementById('container2'), true);
		}
	},
	{
		name:'MINI.element()',
		exec: function() {
			var s = MINI.element('span');
			check(s.nodeType, 1);
			check(/^span$/i.test(s.tagName));
			check(s.childNodes.length, 0);
			check(s.parentElement, null);
			
			var s2 = MINI.element('span', {title: 'mytitle'}, null, document.getElementById('container2'));
			check(s2.nodeType, 1);
			check(/^span$/i.test(s2.tagName));
			check(s2.getAttribute('title'), 'mytitle');
			check(s2.childNodes.length, 0);
			check(s2.parentElement, document.getElementById('container2'), true);
	
			var s3 = MINI.element('div', {title: '5', 'class': 'a b'}, 'hello', '#container2');
			check(s3.nodeType, 1);
			check(/^div$/i.test(s3.tagName));
			check(s3.getAttribute('title'), '5');
			check(s3.getAttribute('class'), 'a b');
			check(s3.parentElement, document.getElementById('container2'), true);
			check(s3.childNodes.length, 1);
			var t = s3.childNodes[0];
			check(t.nodeType, 3);
			check(t.data, 'hello');
			check(t.parentElement, s3, true);
	
			var s4 = MINI.element('div', {}, ['hello' , MINI.element('b', null, 'user'), '!'], '#container2');
			check(s4.nodeType, 1);
			check(/^div$/i.test(s3.tagName));
			check(s4.parentElement, document.getElementById('container2'), true);
			check(s4.childNodes.length, 3);
			var t2 = s4.childNodes[0];
			check(t2.nodeType, 3);
			check(t2.data, 'hello');
			check(t2.parentElement, s4, true);
			var s5 = s4.childNodes[1];
			check(s5.nodeType, 1);
			check(/^b$/i.test(s5.tagName));
			check(s5.parentElement, s4, true);
			check(s5.childNodes.length, 1);
			var t3 = s4.childNodes[2];
			check(t3.nodeType, 3);
			check(t3.data, '!');
			check(t3.parentElement, s4, true);
			var t4 = s5.childNodes[0];
			check(t4.nodeType, 3);
			check(t4.data, 'user');
			check(t4.parentElement, s5, true);
		}
	}
]);
