window.miniTests.push.apply(window.miniTests, [
	{
		name: "$().set(null)",
	 	exec: function() {
	 		var l = $('#container2').add(EE('span', {'@id':'hello'}, 'hello'));
	 		l.set(null);
			check(l[0].childNodes.length, 1);
			check(!l[0].className);
		}
	},
	{
		name: "$().set(name, value)",
	 	exec: function() {
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
		}
	},
	{
		name: "$().set(map)",
	 	exec: function() {
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
		}
	},

	{
		name: "$().set(name, function)",
	 	exec: function() {
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
	 		
		}
	},
	
	{
		name: "set() name check exception (debug)",
		debugFailure: "set name check did not work.",
		exec: function() {
			$('#container2').set();
		}
	},
	{
		name: "set() 2nd arg exception (debug)",
		debugFailure: "2nd arg check did not work.",
		exec: function() {
			$('#container2').set({a:1}, "foobar");
		}
	},

	
	{
		name: "$().get(property)",
	 	exec: function() {
			check($('#a').get('title'), 'tititi');
			check($('#a').get('id'), 'a');
			check($('#a').get('ddsffdsf'), null);
		}
	},

	{
		name: "$().get(attribute)",
	 	exec: function() {
			check($('#a').get('@title'), 'tititi');
			check($('#a').get('@id'), 'a');
			check($('#a').get('@ddsffdsf'), null);
		}
	},
	
	{
		name: "$().get(data-attribute)",
	 	exec: function() {
			check($('#a').get('%x'), 'bar');
			check($('#a').get('%yy'), 'foo');
		}
	},

	{
		name: "$().get(style)",
	 	exec: function() {
			check($('#a').get('$marginTop'), '5px');
			check($('#a_b').get('$marginTop'), '2px');
			contains(['0px', 'auto'], $('#c').get('$marginTop'));
		}
	},

	{
		name: "$().get(name, toNumber)",
	 	exec: function() {
			check($('#a').get('$marginTop', true), 5);
			check($('#a_b').get('$marginTop', true), 2);
			check($('#c').get('$marginTop', true) == 0 || isNaN($('#c').get('$marginTop', true)));
			check(isNaN($('#a').get('@id', true)));
		}
	}

]);
