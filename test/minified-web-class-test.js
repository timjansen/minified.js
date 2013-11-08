describe('minified-web-class-test.js', function() {
	
	beforeEach(function() {
		$('#container2').fill();
	});
	
	describe('.set() (class functions)', function() {
		it('removes classes', function() {
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
		});
		
		it('add classes', function() {
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
		});
		
		it('toggles classes', function() {
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
		});

		it('respects dashes', function() {
			var s1 = EE('div', {'className': 'a-b-c a-b b-c a b c'})[0];
			var s2 = EE('div')[0];
			var m = $([s1, s2]);
			m.set('$', '-a -b -c');
			check(s1.className, 'a-b-c a-b b-c');
			check(s2.className, '');
			m.set('$', '+a +b +c');
			check(s1.className, 'a-b-c a-b b-c a b c');
			check(s2.className, 'a b c');
			m.set('$', '-a-b -b-c');
			check(s1.className, 'a-b-c a b c');
			check(s2.className, 'a b c');
			m.set('$', '+a-b +b-c');
			check(s1.className, 'a-b-c a b c a-b b-c');
			check(s2.className, 'a b c a-b b-c');
			m.set('-a-b-c');
			check(s1.className, 'a b c a-b b-c');
			check(s2.className, 'a b c a-b b-c');
			m.set('+a-b-c');
			check(s1.className, 'a b c a-b b-c a-b-c');
			check(s2.className, 'a b c a-b b-c a-b-c');
		});
		
		it('just works', function() {
			var s1 = EE('div', {'className': 'a b c x-y'})[0];
			var s2 = EE('div')[0];
			var m = $([s1, s2]);
			m.set('$', 'a b c x-y');
			check(s1.className, '');
			check(s2.className, 'a b c x-y');
			m.set({$: 'a d'});
			check(s1.className, 'a d');
			check(s2.className, 'b c x-y d');
			m.set('a +d x-y');
			check(s1.className, 'd x-y');
			check(s2.className, 'b c a d');
			m.set('a +d -c');
			check(s1.className, 'x-y a d');
			check(s2.className, 'b d');
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