window.miniTests.push.apply(window.miniTests, [
	{
		name: "MINI().each()",
	 	exec: function() {
			var m = MINI("#a, #b, #c");
			var cnt = 0;
			m.each(function(item, index) {
				check(index == cnt++);
				contains(m, item, true);
			});
			check(cnt, 3);
		}
	},
	
	{
		name: "MINI().filter()",
	 	exec: function() {
			var m = MINI("#a, #b, #c").filter();
			containsAll(m, [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")], true);
			check(m.push);
			check(m instanceof Array);
		}
	},
	{
		name: "MINI().filter(func false)",
	 	exec: function() {
	 		var l = [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")];
			var m = MINI("#a, #b, #c").filter(function(item){contains(l, item);return false;});
			check(m.length, 0);
		}
	},
	{
		name: "MINI().filter(func true)",
	 	exec: function() {
	 		var l = [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")];
			var m = MINI("#a, #b, #c").filter(function(item){contains(l, item);return true;});
			check(m.length, 3);
			containsAll(m, l, true);
		}
	},
	{
		name: "MINI().filter(func interleave)",
	 	exec: function() {
	 		var cnt = 0;
	 		var l = [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")];
	 		var sw = false;
			var m = MINI("#a, #b, #c").filter(function(item, index){check(index, cnt++); contains(l, item); sw = !sw; return sw;});
			check(m.length, 2);
			containsAll(m, [document.getElementById("a"), document.getElementById("c")], true);
		}
	},

	{
		name: "MINI().remove(none)",
	 	exec: function() {
			MINI("#ddfgfdf").remove();
		}
	},
	{
		name: "MINI().remove()",
	 	exec: function() {
	 		MINI.element('span', {id:'hello'}, 'hello', '#container2');
			MINI("#hello").remove();
			check(MINI('#hello').length, 0);
		}
	},
	
	{
		name: "MINI().removeChildren(none)",
	 	exec: function() {
			MINI("#container2").removeChildren();
		}
	},
	{
		name: "MINI().removeChildren()",
	 	exec: function() {
	 		MINI.element('span', {id:'hello'}, 'hello', '#container2');
			var l = MINI("#container2").removeChildren().length;
			check(l, 1);
			check(MINI('#hello').length, 0);
			check(MINI('#container2').length, 1);
		}
	},
	
	
	{
		name: "MINI().set(name, value)",
	 	exec: function() {
	 		MINI().set('a', 1); // test empty set
	 		
	 		var o = [{a:3, b: 'hello', style: {}, y: {v: 2, w: {}}}, {style: {}, x: {}, y: {w: {}}}];
	 		MINI(o).set('a', 33).set('b', 'greetings').set('c', 132).set('d', {a:1})
	 		 .set('y.v', 23).set('y.w.a', 'xx')
	 		 .set('$color', '#abc').set('$a_b', 2);
	 		
	 		for (var i = 0; i < o.length; i++) {
	 			var b = o[i];
	 			check(b.a, 33);
	 			check(b.b, 'greetings');
	 			check(b.c, 132);
	 			check(b.d.a, 1);
	 			check(b.y.v, 23);
	 			check(b.y.w.a, 'xx');
	 			check(b.style.color, '#abc');
	 			check(b.style['a-b'], 2);
	 		}
	 		
	 		MINI.element('span', {'id':'hello1', 'class':'hello'}, 'hello', '#container2');
	 		MINI.element('span', {'id':'hello2', 'class':'hello'}, 'hello', '#container2');
	 		MINI('#container2 span').set('@class', 'hi').set('@title', 'hello element');
	 		check(document.getElementById('hello1').getAttribute('class'), 'hi');
	 		check(document.getElementById('hello2').getAttribute('class'), 'hi');
	 		check(document.getElementById('hello1').getAttribute('title'), 'hello element');
	 		check(document.getElementById('hello2').getAttribute('title'), 'hello element');
		}
	},
	{
		name: "MINI().set(map)",
	 	exec: function() {
	 		MINI().set({a: 1}); // test empty set
	 		
	 		var o = [{a:3, b: 'hello', style: {}, y: {v: 2, w: {}}}, {a:2, b: 'hi', style: {}, x: {}, y: {w: {}}}];
	 		MINI(o).set({a: 33, b: 'greetings', c: 132, d: {a:1},
	 			'y.v': 23, 'y.w.a': 'xx',
	 			$color: '#abc', $a_b: 2});
	 		
	 		for (var i = 0; i < o.length; i++) {
	 			var b = o[i];
	 			check(b.a, 33);
	 			check(b.b, 'greetings');
	 			check(b.c, 132);
	 			check(b.d.a, 1);
	 			check(b.y.v, 23);
	 			check(b.y.w.a, 'xx');
	 			check(b.style.color, '#abc');
	 			check(b.style['a-b'], 2);
	 		}
	 		
	 		MINI.element('span', {'id':'hello1', 'class':'hello'}, 'hello', '#container2');
	 		MINI.element('span', {'id':'hello2', 'class':'hello'}, 'hello', '#container2');
	 		MINI('#container2 span').set({'@class': 'hi', '@title': 'hello element'});
	 		check(document.getElementById('hello1').getAttribute('class'), 'hi');
	 		check(document.getElementById('hello2').getAttribute('class'), 'hi');
	 		check(document.getElementById('hello1').getAttribute('title'), 'hello element');
	 		check(document.getElementById('hello2').getAttribute('title'), 'hello element');
		}
	},

	{
		name: "MINI().set(function)",
	 	exec: function() {
	 		var undef;
	 		MINI().set('f', 1); // test empty set
	 		
	 		var cnt = 0;
	 		var ar = [{a:3}, {a:2}, {a:11}];

	 		MINI(ar).set('a', 33, function(item, oldValue, index, newValue) {
	 			check(index, cnt++);
	 			check(item === ar[index]);
	 			check(oldValue, ar[index].a);
	 			check(newValue, 33);
	 			return oldValue + newValue;
	 		});
	 		check(ar[0].a, 36);
	 		check(ar[1].a, 35);
	 		check(ar[2].a, 44);


	 		cnt = 0;
	 		MINI(ar).set('a', function(item, oldValue, index) {
	 			check(index, cnt++);
	 			check(item === ar[index]);
	 			check(oldValue, ar[index].a);
	 			return oldValue + 1;
	 		},  function(){});

	 		check(ar[0].a, 37);
	 		check(ar[1].a, 36);
	 		check(ar[2].a, 45);
	 		
	 		cnt = 0;
	 		MINI(ar).set('a', function(item, oldValue, index) {
	 			check(index, cnt++);
	 			check(item === ar[index]);
	 			check(oldValue, ar[index].a);
	 			return oldValue + 12;
	 		});
	 		check(ar[0].a, 49);
	 		check(ar[1].a, 48);
	 		check(ar[2].a, 57);
	 		
	 		cnt = 0;
	 		MINI(ar).set({a: function(item, oldValue, index) {
	 			check(index, cnt++);
	 			check(item === ar[index]);
	 			check(oldValue, ar[index].a);
	 			return oldValue - 40;
	 		}});
	 		check(ar[0].a, 9);
	 		check(ar[1].a, 8);
	 		check(ar[2].a, 17);
	 		
	 		cnt = 0;
	 		MINI(ar).set({a: 2}, undef, function(item, oldValue, index, newValue) {
	 			check(index, cnt++);
	 			check(item === ar[index]);
	 			check(oldValue, ar[index].a);
	 			check(newValue, 2);
	 			return oldValue + newValue;
	 		});
	 		check(ar[0].a, 11);
	 		check(ar[1].a, 10);
	 		check(ar[2].a, 19);
		}
	},
	
	{
		name: "MINI().append()",
	 	exec: function() {
	 		MINI().append('f', 1); // test empty set
	 		
	 		var ar = [{a:3}, {a:"d"}];
	 		MINI(ar).append('a', 'b').append('b', 'd').append('c', function() {return 'x';});
	 		check(ar[0].a, "3b");
	 		check(ar[1].a, "db");
	 		check(ar[0].b, "d");
	 		check(ar[1].b, "d");
	 		check(ar[0].c, "x");
	 		check(ar[1].c, "x");
	 		MINI(ar).append({a: 'w', b: 't'});
	 		check(ar[0].a, "3bw");
	 		check(ar[1].a, "dbw");
	 		check(ar[0].b, "dt");
	 		check(ar[1].b, "dt");
		}
	},
	
	{
		name: "MINI().prepend()",
	 	exec: function() {
	 		MINI().prepend('f', 1); // test empty set
	 		
	 		var ar = [{a:3}, {a:"d"}];
	 		MINI(ar).prepend('a', 'b').prepend('b', 'd').prepend('c', function() {return 'x';});
	 		check(ar[0].a, "b3");
	 		check(ar[1].a, "bd");
	 		check(ar[0].b, "d");
	 		check(ar[1].b, "d");
	 		check(ar[0].c, "x");
	 		check(ar[1].c, "x");
	 		MINI(ar).prepend({a: 'w', b: 't'});
	 		check(ar[0].a, "wb3");
	 		check(ar[1].a, "wbd");
	 		check(ar[0].b, "td");
	 		check(ar[1].b, "td");
		}
	},
	
	{
		name: "MINI().offset()",
	 	exec: function() {
	 		var r1 = MINI('#asdsd').offset();
	 		check(r1.top, 0);
	 		check(r1.left, 0);
	 		var r2 = MINI('#results').offset();
	 		check(r2.top > 0);
	 		check(r2.left > 0);
		}
	}
	

]);
