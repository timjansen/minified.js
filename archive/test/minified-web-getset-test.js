describe('minified-web-getset-test.js', function() {
	beforeEach(function() {
		$('#container2').fill();
	});
	
	describe('.set()', function() {
		it('sets null', function() {
	 		var l = $('#container2').fill().add(EE('span', {'@id':'hello'}, 'hello'));
	 		l.set(null);
			check(l[0].childNodes.length, 1); 
			check(!l[0].className);
		});

		it('sets a single value', function() {
	 		$().set('a', 1); // test empty set
	 		
	 		var o = [{a:3, b: 'hello', style: {}, y: {v: 2, w: {}}}, {style: {}, x: {}, y: {w: {}}}];
	 		$(o).set('a', 33).set('b', 'greetings').set('c', 132).set('d', {a:1})
	 		 .set('$color', '#abc').set('$ab', 2);
	 		
	 		for (var i = 0; i < o.length; i++) {
	 			var b = o[i];
	 			check(b.a, 33);
	 			check(b.b, 'greetings');
	 			check(b.c, 132);
	 			check(b.d.a, 1);
	 			check(b.style.color, '#abc');
	 			check(b.style['ab'], 2);
	 		}
	 		
	 		$('#container2').add([EE('span', {'@id':'hello1', 'className':'hello'}, 'hello'),
	 		EE('span', {'@id':'hello2', 'className':'hello'}, 'hello')]);
	 		$('#container2 span').set('className', 'hi').set('@title', 'hello element');
	 		check(document.getElementById('hello1').getAttribute('class') == 'hi' || document.getElementById('hello1').getAttribute('className') == 'hi');
	 		check(document.getElementById('hello2').getAttribute('class') == 'hi' || document.getElementById('hello2').getAttribute('className') == 'hi');
	 		check(document.getElementById('hello1').getAttribute('title'), 'hello element');
	 		check(document.getElementById('hello2').getAttribute('title'), 'hello element');
	 		$('#hello2').add(EE('b', {'@id':'bello2'}, 'bello'));
	 		
	 		$('#hello1, #hello2').set('@title', null);
	 		check(!document.getElementById('hello1').getAttribute('title'));
	 		check(!document.getElementById('hello2').getAttribute('title'));
		});

		it('sets a map', function() {
	 		$().set({a: 1}); // test empty set
	 		
	 		var o = [{a:3, b: 'hello', style: {}, y: {v: 2, w: {}}}, {a:2, b: 'hi', style: {}, x: {}, y: {w: {}}}];
	 		$(o).set({a: 33, b: 'greetings', c: 132, d: {a:1},
	 			$color: '#abc', $ab: 2});
	 		
	 		for (var i = 0; i < o.length; i++) {
	 			var b = o[i];
	 			check(b.a, 33);
	 			check(b.b, 'greetings');
	 			check(b.c, 132);
	 			check(b.d.a, 1);
	 			check(b.style.color, '#abc');
	 			check(b.style['ab'], 2);
	 		}
	 		
	 		$('#container2').add(EE('span', {'@id':'hello1', 'className':'hello'}, 'hello'))
	 			.add(EE('span', {'@id':'hello2', 'className':'hello'}, 'hello'));
	 		$('#container2 span').set({'className': 'hi', '@title': 'hello element', '%xy': 'fooo'});
	 		check(document.getElementById('hello1').getAttribute('class') == 'hi' || document.getElementById('hello1').getAttribute('className') == 'hi');
	 		check(document.getElementById('hello2').getAttribute('class') == 'hi' || document.getElementById('hello2').getAttribute('className') == 'hi');
	 		check(document.getElementById('hello1').getAttribute('title'), 'hello element');
	 		check(document.getElementById('hello2').getAttribute('title'), 'hello element');
	 		check(document.getElementById('hello2').getAttribute('data-xy'), 'fooo');
			
		});

		it('sets with a function', function() {
	 		var undef;
	 		$().set('f', 1); // test empty set
	 		
	 		var cnt = 0;
	 		var ar = [{a:36}, {a:35}, {a:44}];

	 		$(ar).set('a', function(oldValue, index) {
	 			check(index, cnt++);
	 			check(oldValue, ar[index].a);
	 			return oldValue + 1;
	 		},  function(){});

	 		check(ar[0].a, 37);
	 		check(ar[1].a, 36);
	 		check(ar[2].a, 45);
	 		
	 		cnt = 0;
	 		$(ar).set('a', function(oldValue, index) {
	 			check(index, cnt++);
	 			check(oldValue, ar[index].a);
	 			return oldValue + 12;
	 		});
	 		check(ar[0].a, 49);
	 		check(ar[1].a, 48);
	 		check(ar[2].a, 57);
	 		
	 		cnt = 0;
	 		$(ar).set({a: function(oldValue, index) {
	 			check(index, cnt++);
	 			check(oldValue, ar[index].a);
	 			return oldValue - 40;
	 		}});
	 		check(ar[0].a, 9);
	 		check(ar[1].a, 8);
	 		check(ar[2].a, 17);
			
		});
	});


	describe('.get()', function() {
		it('gets properties', function() {
			check($('#a').get('title'), 'tititi');
			check($('#a').get('id'), 'a');
			check($('#a').get('ddsffdsf'), null);
		});
		it('gets attributes', function() {
			check($('#a').get('@title'), 'tititi');
			check($('#a').get('@id'), 'a');
			check($('#a').get('@ddsffdsf'), null);
		});
		it('gets data attributes', function() {
			check($('#a').get('%x'), 'bar');
			check($('#a').get('%yy'), 'foo');
		});
		it('gets styles', function() {
			check($('#a').get('$marginTop'), '5px');
			check($('#a_b').get('$marginTop'), '2px');
			contains(['0px', 'auto'], $('#c').get('$marginTop'));
		});
		it('converts to numbers', function() {
			check($('#a').get('$marginTop', true), 5);
			check($('#a_b').get('$marginTop', true), 2);
			check($('#c').get('$marginTop', true) == 0 || isNaN($('#c').get('$marginTop', true)));
			check(isNaN($('#a').get('@id', true)));
			check($({a: 'xxx5xxx9xxx'}).get('a', true), 5);
		});
	});

	describe('.dial()', function() {
		it('interpolates linearly', function() {
	 		var obj1 = {a: 0, b: 2};
	 		var obj2 = {a: 4, b: 9};
	 		var d = $([obj1, obj2]).dial({a:0, b:10, c: '5px', d: '#fff'}, {a:10, b:0, c: '15px', d: '#000'}, 1);
	 		d(0);
			check(obj1.a, 0);
			check(obj2.a, 0);
			check(obj1.b, 10);
			check(obj2.b, 10);
			check(obj1.c, '5px');
			check(obj2.c, '5px');
			check(obj1.d, '#fff');
			check(obj2.d, '#fff');
	 		d(1);
			check(obj1.a, 10);
			check(obj1.b, 0);
			check(obj2.c, '15px');
			check(obj2.d, '#000');
	 		d(0.5);
			check(obj1.a, 5);
			check(obj1.b, 5);
			check(obj2.c, '10px');
			check(obj2.d, 'rgb(128,128,128)');
	 		d(0.25);
			check(obj1.a, 2.5);
			check(obj1.b, 7.5);
			check(obj2.c, '7.5px');
			check(obj2.d, 'rgb(191,191,191)');
		});
		it('supports interpolation functions', function() {
	 		var obj1 = {a: 0, b: 2};
	 		var obj2 = {a: 4, b: 9};
	 		var d = $([obj1, obj2]).dial({a:0, b:10, c: '5px', d: '#fff'}, {a:10, b:0, c: '15px', d: '#000'}, 
	 				function(start, end, t) { return t < 1 ? start : end; });
	 		d(0);
			check(obj2.a, 0);
			check(obj2.b, 10);
			check(obj1.c, '5px');
			check(obj1.d, '#fff');
	 		d(1);
			check(obj1.a, 10);
			check(obj1.b, 0);
			check(obj2.c, '15px');
			check(obj2.d, '#000');
	 		d(0.5);
			check(obj1.a, 0);
			check(obj1.b, 10);
			check(obj2.c, '5px');
			check(obj2.d, 'rgb(255,255,255)');
	 		d(0.25);
			check(obj1.a, 0);			
		});
	});

	describe('.hide()', function() {
		it('hides', function() {
			$('#container2').add(EE('hr'));
			$('#container2 hr').hide();
			check($('#container2 hr').get('$display'), 'none');
		});
	});

	describe('.show()', function() {
		it('removes display==none from style', function() {
			$('#container2').add(EE('span', {$display: 'none'}, 'testtest'));
			$('#container2 span').show();
			check($('#container2 span').get('$display'), 'inline');
		});

		it('overwrites stylesheets with block', function() {
			$('#container2').add(EE('i', {$: 'hidden'}, 'xxxxx'));
			$('#container2 i').show();
			check($('#container2 i').get('$display'), 'block');
		});
	});

	describe('set $$show', function() {
		it('hides with $$show=0', function() {
			$('#container2').add(EE('hr'));
			$('#container2 hr').set('$$show', 0);
			check($('#container2 hr').get('$display'), 'none');
		});
		it('hides with $$show=false', function() {
			$('#container2').add(EE('hr'));
			$('#container2 hr').set('$$show', false);
			check($('#container2 hr').get('$display'), 'none');
		});

		it('removes display==none from style', function() {
			$('#container2').add(EE('span', {$display: 'none'}, 'testtest'));
			$('#container2 span').set('$$show', 0.1);
			check($('#container2 span').get('$display'), 'inline');
		});

		it('overwrites stylesheets with block', function() {
			$('#container2').add(EE('i', {$: 'hidden'}, 'xxxxx'));
			$('#container2 i').show('$$show', true);
			check($('#container2 i').get('$display'), 'block');
		});
	});

	describe('get $$show', function() {
		it('checks $display', function() {
			var e = EE('div', {$display: 'none'});
			$('#container2').add(e);
			check(e.get('$$show'), 0);
		});
		it('checks $visibility', function() {
			var e = EE('div', {$visibility: 'hidden'});
			$('#container2').add(e);
			check(e.get('$$show'), 0);
		});
		it('everything else is visible', function() {
			var e = EE('div', {$visibility: 'visible', $display: 'block'});
			$('#container2').add(e);
			check(e.get('$$show'), 1);
			e = EE('div');
			$('#container2').add(e);
			check(e.get('$$show'), 1);
		});
	});
	
	describe('get $$fade', function() {
		it('checks $display', function() {
			var e = EE('div', {$display: 'none'});
			$('#container2').add(e);
			check(e.get('$$fade'), 0);
		});
		it('checks $visibility', function() {
			var e = EE('div', {$visibility: 'hidden'});
			$('#container2').add(e);
			check(e.get('$$fade'), 0);
		});
		it('checks $opacity and $filter', function() {
			var e = EE('div', {$$fade: 0.75});
			$('#container2').add(e);
			check(e.get('$$fade'), 0.75);
		});
		it('defaults to 1', function() {
			var e = EE('div');
			$('#container2').add(e);
			check(e.get('$$fade'), 1);
		});
	});
	
	describe('set $$fade', function() {
		it('fades 0.72', function() {
			var e = EE('div', {$visibility: 'hidden'});
			$('#container2').add(e);
			e.set('$$fade', 0.72);

			check(Math.abs(e.get('$opacity', true) - 0.72) < 0.01 || Math.abs(e.get('$filter', true) - 72) < 0.1);
			check(e.get('$visibility'), 'visible');
		}); 

		it('fades 1', function() {
			var e = EE('div', {$visibility: 'visible'});
			$('#container2').add(e);
			e.set('$$fade', 1);
			check(e.get('$opacity', true) == 1 || isNaN(Math.abs(e.get('$filter', true)) ));
			check(e.get('$visibility'), 'visible');
		});

		it('fades 0', function() {
			var e = EE('div');
			$('#container2').add(e);
			e.set('$$fade', 0);
			check(e.get('$visibility'), 'hidden');
		});
	});
	
	describe('get $$slide', function() {
		it('checks $height', function() {
			var e = EE('div', {$height: '78px'});
			$('#container2').add(e);
			check(e.get('$$slide', true), '78');
		});
	});
	
	describe('MINI.getter', function() {
		it('just works', function() {
			var prefix = '&-#';
			var count = 0;
			var lastName = null;
			var list = $([{a:9, b: 7}]);
			MINI.getter[prefix] = function(list0, name) {
				check(list, list0, true);
				lastName = name;
				return count++;
			};
			
			check(list.get(prefix), 0);
			check(lastName, '');
			check(list.get(prefix+'rt$3'), 1);
			check(lastName, 'rt$3');
			check(list.get(prefix+'_3'), 2);
			check(lastName, '_3');
			check(list.get('a'), 9);
			check(count, 3);
			delete MINI.getter[prefix];
		});
	});
 
	describe('MINI.setter', function() {
		it('just works', function() {
			var prefix = '&-#';
			var count = 0;
			var lastName = null, lastValue = null;
			var list = $([{a:9, b: 7}]);
			MINI.setter[prefix] = function(list0, name, value) {
				check(list, list0, true);
				lastName = name;
				lastValue = value;
				count++;
			};
			
			list.set(prefix, 99);
			check(lastName, '');
			check(lastValue, 99);
			list.set(prefix+'rt$3', 'wew');
			check(lastName, 'rt$3');
			check(lastValue, 'wew');
	
			list.set(prefix+'3', 23);
			check(lastName, '3');
			list.set('a', 11);
			check(list[0].a, 11);
			check(count, 3);
			delete MINI.setter[prefix];
		});
	});
	
});
