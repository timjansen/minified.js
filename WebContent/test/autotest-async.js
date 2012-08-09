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
			var s = MINI.elAdd(playground, 'span', {'title': '0', style: 'margin-top: 20px; background-color: #000;'});
			$(s).animate({'@title': 50, $margin_top: '2px', $background_color: '#ff0'}, 300, 0, function() {
				checkFunc(setSuccess, function() {
					check(s.getAttribute('title'), 50);
					check(s.style['margin-top'], '2px');
					check((s.style['background-color'] == '#ff0') || (s.style['background-color'] == '#ffff00') || (s.style['background-color'] == 'rgb(255, 255, 0)'));
				});
			}, 100);
			
			check(s.getAttribute('title'), 0);
			check(s.style['margin-top'], '20px');
			check((s.style['background-color'] == '#000') || (s.style['background-color'] == '#000000') || (s.style['background-color'] == 'rgb(0, 0, 0)'));
		}
	},
	{
		name:'MINI.request()',
		async: 1000,
		exec: function(setSuccess, playground) {
			var s = MINI.request('get', 'test.txt', null, function(txt) {
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
			var s = MINI.request('get', 'doesnotexist.txt', null, function(txt) {
				setSuccess(false, 'onSuccess called, but should be 404');

			}, function(status) {
				checkFunc(setSuccess, function() {
					check(status,  404);
				});
			});
			
			check(!!s);
		}
	}
]);