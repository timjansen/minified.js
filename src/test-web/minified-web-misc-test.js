describe('minified-web-misc-test.js', function() {
	
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
	
	describe('loop()', function() {
		it('runs', function(done) {
			var lastT = null;
			var count = 0;
			$.loop(function(t, stop) {
				try {
					count++;
					if (lastT && lastT >= t)
						done("t not increased. t=" + t + " lastT="+lastT+" count=" + count);
					else if (count > 2) {
						done();
						stop();
					}
				}
				catch (e) {
					done(e);
				}
				
			});
		});
		it('returns a stop func', function(done) {
			var count = 0;
			var stop = $.loop(function() {
				try {
					count++;
					if (count == 2) {
						stop();
						setTimeout(function() { done(); }, 100); // 100ms without invocation is ok
					}
					if (count > 2)
						done("count too high");
				}
				catch (e) {
					done(e);
				}
			});
		});
	});
	
	describe('request object assumptions', function() {
		// this tests some assumptions abount plain objects that have been made in $.request(). While $.request()
		// can not easily be tested with all its parameters, I test those assumptions to make sure they are
		// valid on all browsers.
		
		var ref = {};
		
		var s = "Test!";
		var n = 343;
		var el = document.createElement('div');
		var fd = window.FormData ? new window.FormData() : 5;
		var plain = {};

		check(!(s && s.constructor == ref.constructor));
		check(!(n && n.constructor == ref.constructor));
		check(!(el && el.constructor == ref.constructor));
		check(!(fd && fd.constructor == ref.constructor));
		check(plain && plain.constructor == ref.constructor);
	});
});