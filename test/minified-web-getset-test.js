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
