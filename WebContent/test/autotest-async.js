function checkFunc(setSuccess, func) {
	try {
		func();
		setSuccess(true);
	}
	catch (e) {
		setSuccess(false, e);
	}
}

window.miniTests.push.apply(window.miniTests, [
	{
		name:'animate()',
		async: 1000,
		exec: function(setSuccess, playground) {
			var s;
			$(playground).add(s = EE('span', {'@title': 0, $marginTop: '20px', $backgroundColor: '#000'})()[0]);
			check(s.getAttribute('title'), 0);
			check(s.style.marginTop, '20px');
			check((s.style.backgroundColor == '#000') || (s.style.backgroundColor == '#000000') || (s.style.backgroundColor == 'rgb(0, 0, 0)'));

			$(s).animate({'@title': 50, $marginTop: '2px', $backgroundColor: '#ff0'}, 300, 0).then(function() {
				checkFunc(setSuccess, function() {
					check(s.getAttribute('title'), 50);
					check(s.style.marginTop, '2px');
					check((s.style.backgroundColor == '#ff0') || (s.style.backgroundColor == '#ffff00') || (s.style.backgroundColor == 'rgb(255, 255, 0)'));
				});
			});

		}
	},
	{
		name:'MINI.request()',
		async: 1000,
		exec: function(setSuccess, playground) {
			var s = MINI.request('get', '/test/test.txt', null)
			.then(function(txt) {
				checkFunc(setSuccess, function() {
					check(txt.indexOf('Used for testing MINI.request.') > 0);
				});
			}, function() {
				setSuccess(false, 'onFailure called, but should not be called');
			});
			
			check(!!s);
		}
	},
	{
		name:'MINI.request() 404 error',
		async: 1000,
		exec: function(setSuccess, playground) {
			var s = MINI.request('get', 'doesnotexist.txt', null)
			.then(function(txt) {
				setSuccess(false, 'onSuccess called, but should be 404');

			}, function(status) {
				checkFunc(setSuccess, function() {
					check(status,  404);
				});
			});
			
			check(!!s);
		}
	},
	{
		name:'MINI.request() promises',
		async: 1000,
		exec: function(setSuccess, playground) {
			var s = MINI.request('get', '/test/test.txt', null)
			.then(function(txt) {
				checkFunc(setSuccess, function() {
					check(txt.indexOf('Used for testing MINI.request.') > 0);
				});
			})
			.then(function(txt) {
				var p = hhPromise();
				p.set(true, ["123"]);
				return p;
			})
			.then(function(txt) {
				check(txt, "123");
				var p = hhPromise();
				p.set(false, ["xxx"]);
				return p;
			})
			.then(function(value) {
				setSuccess(false, 'then should be skipped after error');
			})
			.error(function(value) {
				check(value, "xxx");
				return 23;
			})
			.always(function(value) {
				check(value, 23);
				setSuccess(true, "ok")
			});
			check(!!s);
		}
	}
]);