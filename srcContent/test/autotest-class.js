window.miniTests.push.apply(window.miniTests, [
  	{
		name:'$().set("$", "-")',
		exec: function() {
			var s1 = EE('div', {'className': 'a b c d e'})[0];
			var m = $(s1);
			m.set('$', '-x');
			check(s1.className, 'a b c d e');
			m.set('$', '-a');
			check(s1.className, 'b c d e');
			m.set('$', '-e');
			check(s1.className, 'b c d');
			m.set('-c');
			check(s1.className, 'b d');
			m.set('-b');
			check(s1.className, 'd');
			m.set('-d');
			check(s1.className, '');
			m.set('-c');
			check(s1.className, '');
		}
	},
	{
		name:'$().set("$", "+")',
		exec: function() {
			var s1 = EE('div')[0];
			var s2 = EE('div', {'className':''})[0];
			var m = $([s1, s2]);
			m.set('$', '+a');
			check(s1.className, 'a');
			check(s2.className, 'a');
			m.set('$', '+a');
			check(s1.className, 'a');
			check(s2.className, 'a');
			m.set({$: '+b'});
			check(s1.className, 'a b');
			check(s2.className, 'a b');
			m.set('+a');
			check(s1.className, 'b a');
			check(s2.className, 'b a');
			m.set('+b');
			check(s1.className, 'a b');
			check(s2.className, 'a b');
			m.set('+c');
			check(s1.className, 'a b c');
			check(s2.className, 'a b c');
		}
	},
	{
		name:'$().set("$", "class")',
		exec: function() {
			var s1 = EE('div', {'className': 'a b c'})[0];
			var s2 = EE('div')[0];
			var m = $([s1, s2]);
			m.set('$', 'a');
			check(s1.className, 'b c');
			check(s2.className, 'a');
			m.set('$', 'b');
			check(s1.className, 'c');
			check(s2.className, 'a b');
			m.set('$', 'c');
			check(s1.className, '');
			check(s2.className, 'a b c');
			m.set('x');
			check(s1.className, 'x');
			check(s2.className, 'a b c x');
			m.set('x');
			check(s1.className, '');
			check(s2.className, 'a b c');
		}
	},
	{
		name:'$().set("$", mix)',
		exec: function() {
			var s1 = EE('div', {'className': 'a b c'})[0];
			var s2 = EE('div')[0];
			var m = $([s1, s2]);
			m.set('$', 'a b c');
			check(s1.className, '');
			check(s2.className, 'a b c');
			m.set({$: 'a d'});
			check(s1.className, 'a d');
			check(s2.className, 'b c d');
			m.set('a +d');
			check(s1.className, 'd');
			check(s2.className, 'b c a d');
			m.set('a +d -c');
			check(s1.className, 'a d');
			check(s2.className, 'b d');
		}
	}
]);
