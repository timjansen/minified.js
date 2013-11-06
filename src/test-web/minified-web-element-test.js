describe('minified-web-element-test.js', function() {
	
	beforeEach(function() {
		$('#container2').fill();
	});
	
	describe('EE()', function() {
		it('creates elements', function() {
			var sl = EE('span');
			check(sl.length, 1, "First len test");
			var s = sl[0];
			check(s.nodeType, 1, "First node type test");
			check(/^span$/i.test(s.tagName));
			check(s.childNodes.length, 0);
			check(s.parentElement, null);
			
			var sl2 = EE('span', {'@title': 'mytitle'});
			check(sl2.length, 1, "Second len test");
			var s2 = sl2[0];
			check(s2.nodeType, 1, "Second node type test");
			check(/^span$/i.test(s2.tagName));
			check(s2.getAttribute('title'), 'mytitle');
			check(s2.childNodes.length, 0);
		});
			
		it('creates attributes and adds children', function() {
			var sl3 = EE('div', {'@title': '5', 'className': 'a b', $marginTop: '2px'}, 'hello');
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
		});

		it('adds children', function() {
			var sl4 = EE('div', ['hello' , EE('b', null, 'user'), '!']);
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
		});

	});
	
	describe('.add()', function() {
		
		it('adds elements, text and lists, but no nulls', function() {
			var sl = EE('span');
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
		});
		
		it('supports element factories', function() {
			var sl = EE('span');
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
		});
	});
	
	
	describe('.fill()', function() {
		it('fills', function() {
			var sl = EE('span');
			sl.fill(EE('br'));
			check(sl[0].childNodes.length, 1);
			check(sl[0].childNodes[0].nodeType, 1);
			check(/^br$/i.test(sl[0].childNodes[0].tagName));
			
			sl.fill(['foo', EE('br'), 'bar']);
			check(sl[0].childNodes.length, 3);
			check(sl[0].childNodes[0].data, 'foo');
			check(sl[0].childNodes[2].data, 'bar');
		});
		it('fills all list members', function() {
			var sl = $([EE('span'), EE('span'), EE('span')]);
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
			sl.fill([EE('br'), 'bar']);
			check(sl[0].childNodes.length, 2);
			check(sl[1].childNodes.length, 2);
			check(sl[2].childNodes.length, 2);
			sl.fill([[['x']], EE('div', [EE('br')]), 'bar']);
			check(sl[0].childNodes.length, 3);
			check(sl[1].childNodes.length, 3);
			check(sl[2].childNodes.length, 3);
			
		});
	});
	

	describe('.replace()', function() {
		it('replaces', function() {
			var sl = EE('span');
			sl.fill(['foo', EE('br'), 'bar']);
			$(sl[0].childNodes[2]).replace(EE('br'));
			check(sl[0].childNodes.length, 3);
			check(/^br$/i.test(sl[0].childNodes[2].tagName));
			
			$(sl[0].childNodes[2]).replace(['foo', EE('br')]);
			check(sl[0].childNodes.length, 4);
			check(sl[0].childNodes[2].data, 'foo');
			check(/^br$/i.test(sl[0].childNodes[3].tagName));
		});
	});
	

	
	describe('.addFront()', function() {
		it('adds to front', function() {
			var sl = EE('span');
			sl.fill([EE('br'), 'bar']);
			sl.addFront('foo');
			check(sl[0].childNodes.length, 3);
			check(sl[0].childNodes[0].data, 'foo');
			check(sl[0].childNodes[2].data, 'bar');
			check(/^br$/i.test(sl[0].childNodes[1].tagName));
		});
	});
	

	
	describe('.addAfter()', function() {
		it('adds after', function() {
			var sl = EE('span');
			sl.fill([EE('br'), 'bar']);
			$(sl[0].childNodes[0]).addAfter('foo');
			check(sl[0].childNodes.length, 3);
			check(sl[0].childNodes[1].data, 'foo');
			check(sl[0].childNodes[2].data, 'bar');
			check(/^br$/i.test(sl[0].childNodes[0].tagName));
			
			$(sl[0].childNodes[2]).addAfter('test');
			check(sl[0].childNodes.length, 4);
			check(sl[0].childNodes[3].data, 'test');
		});
	});

	
	
	describe('.addBefore()', function() {
		it('adds before', function() {
			var sl = EE('span');
			sl.fill([EE('br'), 'bar']);
			$(sl[0].childNodes[0]).addBefore('foo');
			check(sl[0].childNodes.length, 3);
			check(sl[0].childNodes[0].data, 'foo');
			check(sl[0].childNodes[2].data, 'bar');
			check(/^br$/i.test(sl[0].childNodes[1].tagName));
			
			$(sl[0].childNodes[2]).addAfter(EE('br'));
			check(sl[0].childNodes.length, 4);
			check(/^br$/i.test(sl[0].childNodes[3].tagName));
		});
	});

	describe('.clone()', function() {
		it('clones', function() {
			var sl = $('#cloneTest .cloneMe').clone();
			check(sl.length, 1);
			$('#container2').fill(sl);
			check($$('#container2 .cloneMe').innerHTML.toLowerCase(), $$('#cloneTest .cloneMe').innerHTML.toLowerCase());
		});
		it('removes id from clone', function() {
			var sl = $('#cloneId').clone();
			check(sl.length, 1);
			$('#container2').fill(sl);
			check(/cloneId/i.test($$('#container2').innerHTML), false, 'Clone() id removal');
			check(/nonono/.test($$('#container2').innerHTML), true, 'Clone() id / content');
		});
	});

	describe('_.template()', function() {
		it('just works', function() {
			if (!_)
				return;
			
			check(_.template('{{a}}+{{b}}={{a+b}}')({a:1, b:3}), '1+3=4');
		});
	});

	describe('.ht()', function() {
		it('just works', function() {
			if (!_)
				return;
			
			var sl = $([EE('span'), EE('span')]);
			sl.ht('{{a}}+{{b}}={{a+b}}', {a:1, b:3});
			check(sl[0].innerHTML, '1+3=4');
			check(sl[1].innerHTML, '1+3=4');

			sl.ht('<b>{{a}}{{b}}</b>', {a:1, b:3});
			check(/<b>13<\/b>/i.test(sl[1].innerHTML), true, 'check inner html');
			sl.ht('<b>{{a}}{{b}}</b>', {a:1, b:3}); // use caching..
			check(/<b>13<\/b>/i.test(sl[1].innerHTML), true, 'check inner html again');

			sl.ht('abc');
			check(sl[0].innerHTML, 'abc');
		});
	});
	
	describe('HTML()', function() {
		it('just works', function() {
			if (!_)
				return;
			
			var sl = HTML('{{a}}+{{b}}={{a+b}}', {a:1, b:3});
			check(sl.length, 1);
			check(sl[0].data, '1+3=4');

			sl = HTML('<b>{{a}}{{b}}</b>', {a:1, b:3});
			check(sl.length, 1);
			check(sl[0].tagName.toLowerCase(), 'b');
			check(sl[0].innerHTML, '13', 'check inner html');

			sl = HTML('<b>{{a}}{{b}}</b>xx<i>eek</i>', {a:1, b:3});
			check(sl.length, 3);
			check(sl[0].tagName.toLowerCase(), 'b');
			check(sl[0].innerHTML, '13', 'check inner html elem 1');
			check(sl[1].data, 'xx');
			check(sl[2].tagName.toLowerCase(), 'i');
			check(sl[2].innerHTML, 'eek', 'check inner html elem 2');

			
			sl = HTML('abc');
			check(sl[0].data, 'abc');
			check(sl.length, 1);
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