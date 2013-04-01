window.miniTests.push.apply(window.miniTests, [
	{
		name:'setCookie/getCookie/deleteCookie',
		exec: function() {
			check(MINI.getCookie('w'), null);
			
			MINI.setCookie('a', 'b');
			check(MINI.getCookie('a'), 'b');
			
			MINI.setCookie('xx', 'a===');
			check(MINI.getCookie('xx'), 'a===');
			check(MINI.getCookie('a'), 'b');
			
			MINI.setCookie('c', 'b');
			check(MINI.getCookie('c'), 'b');
			check(MINI.getCookie('xx'), 'a===');
			check(MINI.getCookie('a'), 'b');
			
			MINI.setCookie('a', '', -1);
			check(MINI.getCookie('c'), 'b');
			check(MINI.getCookie('xx'), 'a===');

			MINI.setCookie('c', '', -1);
			check(MINI.getCookie('xx'), 'a===');
		}
	}]);