describe('minified-web-cookies-test.js', function() {
	
	describe('setCookie()/getCookie()', function() {
		it('just works', function() {
			if (!$.getCookie)
				return;
			
			check($.getCookie('w'), null);
			
			$.setCookie('a', 'b');
			check($.getCookie('a'), 'b');
			
			$.setCookie('xx', 'a===');
			check($.getCookie('xx'), 'a===');
			check($.getCookie('a'), 'b');
			
			$.setCookie('c', 'b');
			check($.getCookie('c'), 'b');
			check($.getCookie('xx'), 'a===');
			check($.getCookie('a'), 'b');
			
			$.setCookie('a', '', -1);
			check($.getCookie('c'), 'b');
			check($.getCookie('xx'), 'a===');

			$.setCookie('c', '', -1);
			check($.getCookie('xx'), 'a===');		});
	});
	
});