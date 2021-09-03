
if (!isPhantomJS)
describe('minified-web-promises-test.js', function() {
	
	describe('.animate()', function() {
		it('just works', function(done) {
			var s;
			$(playground).add(s = EE('span', {'@title': 0, $marginTop: '20px', $backgroundColor: '#000'})[0]);
			check(s.getAttribute('title'), 0);
			check((s.style.backgroundColor == '#000') || (s.style.backgroundColor == '#000000') || (s.style.backgroundColor == 'rgb(0, 0, 0)'));

			$(s).animate({'@title': 50 , $marginTop: '2px',  $backgroundColor: '#ff0'}, 300, 0).then(function() {
				try {
					check(s.getAttribute('title'), 50);
					check((s.style.backgroundColor == '#ff0') || (s.style.backgroundColor == '#ffff00') || (s.style.backgroundColor == 'rgb(255, 255, 0)'));
					done();
				}
				catch (e) {
					done(e);
				}
			});
		});
	});

	describe('request()', function() {
		it('requests', function(done) {
			var s = $.request('get', '/test/test.txt', null);
			s.then(function(txt, xhr) {
				try {
					check(txt.indexOf('Used for testing') > 0);
					check(isLegacyIE || !!xhr.send); // validate it's XHR (not in old IE's, they can't handle this)
					done();
				}
				catch (e) {
					done(e);
				}
			}, function() {
				done('onFailure called, but should not be called');
			});
			check(!!s);
			check(!!s.xhr);
			check(isLegacyIE || !!s.xhr.send);
		});
		
		it('handles 404', function(done) {
			var s = $.request('get', '/doesnotexist.txt', null)
			.then(function(txt) {
				setSuccess(false, 'onSuccess called, but should be 404');

			}, function(status, txt, xhr) {
				try {
					check(status,  404);
					check(isLegacyIE || !!xhr.send); // validate it's XHR
					done();
				}
				catch (e) {
					done(e);
				}
			});
			check(!!s);
		});
	});
		
	describe('promise()', function() {
		it('can be nested', function(done) {
			if (!_)
				return done();
			
			var s = $.request('get', '/test/test.txt', null)
			.then(function(txt) {
				try {
					check(txt.indexOf('Used for testing') > 0);
				}
				catch (e) {
					done(e);
				}
			})
			.then(function(txt) {
				var p = _.promise();
				p.fire(true, ["123"]);
				return p;
			})
			.then(function(txt) {
				check(txt, "123");
				var p = _.promise();
				p.fire(false, ["xxx"]);
				return p;
			})
			.then(function(value) {
				done('then should be skipped after error');
			})
			.error(function(value) {
				try {
					check(value, "xxx");
				}
				catch(e) {
					done(e);
				}
				return 23;
			})
			.always(function(value) {
				try {
					check(value, 23);
					done();
				}
				catch (e) {
					done(e);
				}
			});
			check(!!s);
		});
		
		
		it('supports ES6 syntax for resolve', function(done) {
			if (!_)
				return done();
			
			_.promise(function(resolve, reject) {
				setTimeout(function() { resolve(99, 2, 11); }, 2);
			})
			.then(function(a, b, c) {
				try {
					check(a, 99);
					check(b, 2);
					check(c, 11);
					done();
				}
				catch (e) {
					done(e);
				}
			});
		});

		
		it('supports ES6 syntax for reject', function(done) {
			if (!_)
				return done();
			
			_.promise(function(resolve, reject) {
				reject('x', 2);
			})
			.then(0, function(a, b, c) {
				try {
					check(a, 'x');
					check(b, 2);
					done();
				}
				catch (e) {
					done(e);
				}
			});
		});

		
	    it('combines promises', function(done) {
	    	this.timeout(2000);
			if (!_)
				return done();
			
			var completed = 0;
			function incComp() { completed++; }
			_.promise($.wait(10).then(incComp), 
			          $.wait(100).then(incComp), 
			          $.wait(500).then(incComp))
			 .then(function() {
				 if (completed == 3)
					 done();
				 else
					 done('Completed before all three promises were done.');
			 });
	    });
	});
	
	
	describe('wait()', function() {
		it('just works', function(done) {
			this.timeout(500);
			if (!_)
				return done();
			$.wait(50, [1, 2, 3])
			 .then(function(a, b, c, d) {
				 if (a == 1 && b == 2 && c == 3 && !d)
					 done();
				 else
					 done('wrong args.');
			 });
		});
	});

});