describe('minified-web-toggle-test.js', function() {
	
	describe('.toggle()', function() {
		it('toggles classes', function() {
			var s1 = EE('div')[0];
			var s2 = EE('div', {'className':'a b c d'})[0];
			var t = $([s1, s2]).toggle('b d');
			check(s1.className, '');
			check(s2.className, 'a c');
			t();
			check(s1.className, 'b d');
			check(s2.className, 'a c b d');
			t();
			check(s1.className, '');
			check(s2.className, 'a c');
			t(1);
			check(s1.className, 'b d');
			check(s2.className, 'a c b d');
			t(null);
			check(s1.className, '');
			check(s2.className, 'a c');
			t(false);
			check(s1.className, '');
			check(s2.className, 'a c');
			t(true);
			check(s1.className, 'b d');
			check(s2.className, 'a c b d');
			t(true);
			check(s1.className, 'b d');
			check(s2.className, 'a c b d');
			t();
			check(s1.className, '');
			check(s2.className, 'a c');
			t(true);
			check(s1.className, 'b d');
			check(s2.className, 'a c b d');
			t(false);
			check(s1.className, '');
			check(s2.className, 'a c');
			t();
			check(s1.className, 'b d');
			check(s2.className, 'a c b d');
		});
		it('toggles attributes and styles', function() {
			var s1 = EE('div', {'@title':'init', $display: 'none'})[0];
			var s2 = EE('div', {})[0];
			var t = $([s1, s2]).toggle({'@title': 'a', $display: 'none'}, {'@title': 'b', $display: 'block'});
			check(s1.getAttribute('title'), 'a');
			check(s2.getAttribute('title'), 'a');
			check(s1.style.display, 'none');
			check(s2.style.display, 'none');
			t();
			check(s1.getAttribute('title'), 'b');
			check(s2.getAttribute('title'), 'b');
			check(s1.style.display, 'block');
			check(s2.style.display, 'block');
			t();
			check(s1.getAttribute('title'), 'a');
			check(s2.getAttribute('title'), 'a');
			check(s1.style.display, 'none');
			check(s2.style.display, 'none');
			t(true);
			check(s1.getAttribute('title'), 'b');
			check(s2.getAttribute('title'), 'b');
			check(s1.style.display, 'block');
			check(s2.style.display, 'block');
			t(false);
			check(s1.getAttribute('title'), 'a');
			check(s2.getAttribute('title'), 'a');
			check(s1.style.display, 'none');
			check(s2.style.display, 'none');
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