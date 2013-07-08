var MINI = require('minified'), $ = MINI.$, $$ = MINI.$$, EE = MINI.EE;

$(function() {
	var GRADIENT_PREFIX = ['', '-moz-', '-ms-', '-webkit-'];
	var COLOR_DURATION = 2000;
	var COLORS = ['#f00', '#0f0', '#00f', '#0ff', '#f0f', '#ff0'];
	var CLEN = COLORS.length;
	var moving = findColor(), prev = findColor(), next = findColor();
	var state = {percentage: 0, preColor: COLORS[moving], postColor: COLORS[next], running: false};
	var targets = $('.shareButton');
	var stopFunc;
	var shareDivCreated = 0;
	
	function findColor() {
		var f = Math.max(0, Math.min(Math.round(Math.random() * CLEN - 0.5), CLEN));
		return f != moving ? f : findColor();
	}

	function stepFade() {
		state.running = true;
		$(state).animate({percentage: 100, preColor: COLORS[prev], postColor: COLORS[moving]}, COLOR_DURATION, 1)
		        .then(function() {
		        	state.percentage = 0;
		        	state.running = false;
		        	next = moving;
		        	moving = prev;
		        	prev = findColor();
		        });
	}
		
	function startAnim() {
		if (!stopFunc)
			stopFunc = $.loop(function(t) {
				if (!state.running)
					stepFade();
				
				var deg = Math.round((t / 360 * 10 - 75)*100)/100;
				var gradientString = 'linear-gradient('+deg+'deg, ' + state.preColor + ' 0%, ' 
					+COLORS[moving]+ ' ' + Math.round(100*state.percentage)/100+'%, ' 
					+state.postColor + ' 100%); ';
				var bgColor = '';
				$(GRADIENT_PREFIX).each(function(p) {
					bgColor += 'background: ' + p + gradientString;
				});
				targets.set('$$', bgColor);
			});
	}
	
	function stopAnim() {
		if (stopFunc)
			stopFunc();
		stopFunc = null;
		targets.set('$$', '');
	}
	
	function createShareDiv() {
		if (shareDivCreated++)
			return; 

		$('#shareExt').add([EE('iframe', {'@allowtransparency':'true', '@frameborder': 0, '@scrolling': 'no', $width:'100px', $height: '20px',
										  '@src': "http://ghbtns.com/github-btn.html?user=timjansen&repo=minified.js&type=watch&count=true"}),
						    EE('iframe', {'@allowtransparency':'true', '@frameborder': 0, '@scrolling': 'no', $width:'100px', $height: '20px',
										  '@src': "https://platform.twitter.com/widgets/tweet_button.html"}),
		                    EE('div', {$: 'g-plusone', $display: 'inline', '@data-size': 'medium'})
		                    ]);
		$('head').add(EE('script', {type: 'text/javascript', async: true, src: 'https://apis.google.com/js/plusone.js'}));
	}

	var shareDivToggle = $('#shareDiv').toggle({$$fade: 0, $$slide: 0}, {$$fade: 1, $$slide: 1}, 700, 1);
		
	
	targets.on('mouseover', function() { createShareDiv(); startAnim(); });
	targets.on('mouseout', stopAnim);
	targets.on('click', function() { createShareDiv(); shareDivToggle(); });
	
	if (window.location.hash == '#share') {
		createShareDiv();
		shareDivToggle(true);
	}
	
	window.setTimeout(createShareDiv, 2500);
});


