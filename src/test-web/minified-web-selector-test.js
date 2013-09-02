describe('minified-web-selector-test.js', function() {
	
	describe('$()', function() {
		it('can be called without arguments', function() {
   			var m = $();
			check(m);
			check(m.length, 0);
			check(m.set);
			check(!m[0]);
		});
		it('can be called with an element', function() {
			var e = document.getElementById("container");
			var m = $(e);
			check(m.length, 1);
			check(m[0] === e);
		});
		it('can be called with window', function() {
			var e = window;
			var m = $(e);
			check(m.length, 1);
			check(m[0] === e);
		});
		it('can be called with a list', function() {
   			var e = [4, 2, 3];
   			var m = $(e);
   			check(m.length, 3);
   			containsAll(m, e);
   			
   	 		var m1 = $([document.getElementById("a")]);
   			containsAll(m1, [document.getElementById("a")], true);
		});
		it('removes nulls from lists', function() {
   			var e = [null, 4, null, 2, null, 3, null];
   			var m = $(e);
   			check(m.length, 3);
   			containsAll(m, [4, 2, 3]);
   			
   	 		var m1 = $([document.getElementById("a"), null, document.getElementById("b"), null]);
   			containsAll(m1, [document.getElementById("a"), document.getElementById("b")], true);

   	 		var m2 = $([null]);
   			containsAll(m2, [], true);
		});
		it('flattens empty lists', function() {
   			var e = [[[null, 5]], [[[null]]], [[[[1]]]], 4, null, [2, 7, 8], null, 3, null, [99]];
   			var m = $(e);
   			containsAll(m, [5, 1, 4, 2, 7, 8, 3, 99]);
		});
		it('handles empty lists', function() {
   			var m = $([]);
   			check(m.length, 0);
		});
		it('looks up ids', function() {
   			var m = $('#container');
   			check(m.length, 1);
   			check(m[0] === document.getElementById("container"));
			
		});
		it('returns empty lists for unknown ids', function() {
   			var m = $('#dfsafsdfds');
   			check(m.length, 0);
			
		});
		it('supports ids as context', function() {
   			var m = $('#container, #container2');
   			containsAll(m, [document.getElementById("container"), document.getElementById("container2")], true);
			
		});
		it('eliminates dupes', function() {
   			var m = $('#container, #container');
   			containsAll(m, [document.getElementById("container")], true);
		});
		it('eliminates unknown ids', function() {
   			var m = $('#container, #dsfewfe');
   			check(m.length, 1);
   			contains(m, document.getElementById("container"), true);
		});
		it('selects classes', function() {
   			var m = $('.x');
   			containsAll(m, [document.getElementById("a"),document.getElementById("a_b"),
   					document.getElementById("b_a"),document.getElementById("b_b"),document.getElementById("c_a")], true);
		});
		it('selects classes with dash', function() {
   			var m = $('.r-r');
   			check(m.length, 1);
   			containsAll(m, [document.getElementById("c_a")], true);
		});
		it('handles unknown classes', function() {
   			var m = $('.sdsada');
   			check(m.length, 0);
		});
		it('finds classes in id context', function() {
   			var m = $('.z, #container2');
   			containsAll(m, [document.getElementById("a_a"), document.getElementById("a_b"), document.getElementById("c_b"), document.getElementById("container2")], true);
		});
		it('selects element names', function() {
   			var m = $('b');
   			check(m.length, 3);
   			check(/^b$/i.test(m[0].tagName));
   			check(/^b$/i.test(m[1].tagName));
   			check(/^b$/i.test(m[2].tagName));
		});
		it('handles unknown elements', function() {
   			var m = $('blink');
   			check(m.length, 0);
		});
		it('handles the unknown', function() {
   			var m = $('blink, #dfsdj, .sddsad');
   			check(m.length, 0);
		});
		it('eliminates the unknown', function() {
   			var m = $('blink, #dfsdj, .sddsad, #container');
   			containsAll(m, [document.getElementById("container")], true);
		});
		it('supports double-step selectors', function() {
   			var m = $('#a b');
   			check(m.length, 1);
   			check(/^b$/i.test(m[0].tagName));

   			var m2 = $('#a div');
   			check(m2.length, 2);
		});
		it('supports tripple-step selectors', function() {
   			var m = $('#b #b_a p');
   			check(m.length, 1);
   			check(/^p$/i.test(m[0].tagName));
		});
		it('supports quad-step selectors', function() {
   			var m = $('div .n div p');
   			check(m.length, 2);
   			check(/^p$/i.test(m[0].tagName));
   			check(/^p$/i.test(m[1].tagName));
		});
		it('supports name.class', function() {
   			var m = $('div.n');
   			check(m.length, 2);
		});
		it('supports name.cl-a-ss', function() {
   			var m = $('div.r-r');
   			check(m.length, 1);
   			check(m[0], document.getElementById('c_a'));
		});
		it('supports name.unknownClass', function() {
  			var m = $('div.xxx');
   			check(m.length, 0);
		});
		it('supports unknownName.class', function() {
   			var m = $('blink.x');
   			check(m.length, 0);
		});
		it('supports elementName.class elementName', function() {
   			var m = $('#container div.n p');
   			check(m.length == 4 || m.length == 3); // Minified's impl will return 4, native CSS 3
		});
		it('returns empty for $(element, emptyContext)', function() {
   			var e = document.getElementById("container");
   			var m = $(e, []);
   			check(m.length, 0);
		});
		it('returns empty for $(element, emptyContext)', function() {
   			var m = $("#container", []);
   			check(m.length, 0);
		});
		it('returns empty for $(elementName, emptyContext)', function() {
   			var m = $("div", []);
   			check(m.length, 0);
		});
		it('returns empty when selector equals context', function() {
   			var m = $("#container", "#container");
   			check(m.length, 0);
		});
		it('handles * selector', function() {
   			var m = $("*", "#c");
   			check(m.length, 6);
   			contains(m, document.getElementById("c_b"));
   			contains(m, document.getElementById("c_a"));
		});
		it('eliminates result dupes when context is duplicated', function() {
   			var m = $("*", "#c, #c");
   			check(m.length, 6);
   			contains(m, document.getElementById("c_b"));
   			contains(m, document.getElementById("c_a"));
		});
		it('finds id in context', function() {
   			var m = $("#a", "#container");
   			containsAll(m, [document.getElementById("a")], true);
		});
		it('handles multi-contexts', function() {
   			var m = $("div.z", ".x,.n,.m");
   			containsAll(m, [document.getElementById("a_a"), document.getElementById("a_b"), document.getElementById("c_b")], true);
		});
		it('supports the child-only parameter', function() {
   			var m = $("div", "#c", true);
   			containsAll(m, [document.getElementById("c_a"), document.getElementById("c_b")], true);
		});
		it('supports the child-only parameter with *', function() {
   			var m = $("*", "#c", true);
   			check(m.length, 3);
   			contains(m, document.getElementById("c_b"));
   			contains(m, document.getElementById("c_a"));
		});
		
	});
	
	describe('$$()', function() {
		it('returns undef for empty lists', function() {
			var undef;
   			check($$("#dsfdfdf") === undef);
		});
		it('returns undef if list is empty/null', function() {
			var undef;
   			check($$(null) === undef);
		});
		it('looks up ids', function() {
			check($$("#container") === document.getElementById("container"));
		});
		it('takes the first element of a list', function() {
			check(/^div$/i.test($$("div").tagName));
		});
	});

	
	describe('.select()', function() {
		it('just works', function() {
			var m = $("#c").select("div", true);
   			containsAll(m, [document.getElementById("c_a"), document.getElementById("c_b")], true);
		});
	});
	
	describe('.trav()', function() {
		it('traverses properties', function() {
   			var m = $('#a').trav('nextSibling');
   			containsAll(m, [document.getElementById("b"), document.getElementById("c")], true, 'two siblings');
   			m.each(function(v, index) {
   				if (v.nodeType != 1)
   					fail("Node is not element: " + v);
   			});

   			m = $('#c').trav('nextSibling');
   			containsAll(m, [], true, 'no sibling');

   			m = $('#a_a, #b_a, #c_b').trav('nextSibling');
   			containsAll(m, [document.getElementById("a_b"), document.getElementById("b_b")], true, 'multi-list');

   			m = $('#b_b').trav('parentNode');
   			contains(m, document.getElementById("b"), true, 'parent 1');
   			contains(m, document.getElementById("container"), true, 'parent 2');
		});
		it('traverses properties with selector', function() {
   			var m = $('#a').trav('nextSibling', '.n');
   			containsAll(m, [document.getElementById("b")], true, 'class selector');

   			m = $('#a').trav('nextSibling', 'div');
   			containsAll(m, [document.getElementById("b"), document.getElementById("c")], true, 'tagname selector');

   			m = $('#a').trav('nextSibling', 'div.m');
   			containsAll(m, [document.getElementById("c")], true, 'class+tag selector');

   			m = $('#b_a, #b_b').trav('parentNode', '.n');
   			containsAll(m, [document.getElementById("b")], true, 'list input');

   			m = $('#b_a, #b_b').trav('parentNode', '#b');
   			containsAll(m, [document.getElementById("b")], true, 'id selector');

   			m = $('#b_a, #b_b').trav('parentNode', '#container .n');
   			containsAll(m, [document.getElementById("b")], true, 'complex selector');

   			m = $('#b_a, #b_b').trav('parentNode', '#container div');
   			containsAll(m, [document.getElementById("b")], true, 'multi-hit selector');
   			
   			m = $('#a').trav('nextSibling', function(v) { return v.nodeType == 1 && v !== document.getElementById("b"); });
   			containsAll(m, [document.getElementById("c")], true, 'tagname selector');
		});
		it('traverses properties with selector and count', function() {
   			var m = $('#a').trav('nextSibling', 'div', 1);
   			containsAll(m, [document.getElementById("b")], true, 'single step');

   			m = $("#a_a, #b_b, #a_a").trav('parentNode', '*', 1);
   			containsAll(m, [document.getElementById("a"), document.getElementById("b")], true, 'dupe list input with single step');

   			m = $('#a_a, #b_a, #b_b, #c_b').trav('parentNode', '*', 1);
   			containsAll(m, [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")], true, 'list input, partial merge');

   			m = $('#a').trav('nextSibling', '*', 11);
   			containsAll(m, [document.getElementById("b"), document.getElementById("c")], true, 'large max');
   			
   			m = $('#b_a, #b_b').trav('parentNode', 'div', 1);
   			containsAll(m, [document.getElementById("b")], true, 'merged single step');

   			m = $('#b_a, #b_b').trav('parentNode', '*', 2);
   			containsAll(m, [document.getElementById("b"), document.getElementById("container")], true, 'double step');

   			m = $('#a_a, #b_a, #b_b, #c_b').trav('parentNode', '*', 2);
   			containsAll(m, [document.getElementById("a"), document.getElementById("b"), document.getElementById("c"), document.getElementById("container")], true, 'double steps list input');
		});
		it('traverses properties with count', function() {
   			var m = $("#a_a, #b_b, #a_a").trav('parentNode', 1);
   			containsAll(m, [document.getElementById("a"), document.getElementById("b")], true, 'dupe list input with single step');

   			m = $('#a_a, #b_a, #b_b, #c_b').trav('parentNode', 1);
   			containsAll(m, [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")], true, 'list input, partial merge');

   			m = $('#b_a, #b_b').trav('parentNode', 2);
   			containsAll(m, [document.getElementById("b"), document.getElementById("container")], true, 'double step');

   			m = $('#a_a, #b_a, #b_b, #c_b').trav('parentNode', 2);
   			containsAll(m, [document.getElementById("a"), document.getElementById("b"), document.getElementById("c"), document.getElementById("container")], true, 'double steps list input');
		});
	});

	describe('.is()', function() {
		it('just works', function() {
   			check($('#a').is(), true, 'default');
   			check($(1).is(), false, '!default');
   			check($('#a').is('*'), true, '*');
   			check($(['x']).is('*'), false, '!*');
   			check($('#a').is('.x'), true, 'class');
   			check($('#b').is('.x'), false, '!class');
   			check($('#a').is('div'), true, 'tag');
   			check($('#a p').is('div'), false, '!tag');
   			check($('#a').is('div.x'), true, 'tag+class');
   			check($('#b').is('div.x'), false, 'tag+!class');
   			check($('#a').is('p.x'), false, '!tag+class');
   			check($('#a').is(function(v) { return v == document.getElementById('a');}), true, 'func');
   			check($('#b').is(function(v) { return v == document.getElementById('a');}), false, '!func');
   			check($('#c_a').is('.r-r'), true, 'dash-class');
   			check($('#c_b').is('.r-r'), false, '!dash-class');

   			check($('#a, #b').is(), true, 'multi default');
   			check($([$('#a'), document]).is(), false, 'multi !default');
   			check($('#a, #b').is('*'), true, 'multi *');
   			check($([$('#a'), document]).is('*'), false, 'multi !*');
   			check($('#b_a, #b_b').is('.x'), true, 'multi class');
   			check($('#a_a, #b_a, #b_b').is('.x'), false, 'multi !class');
   			check($('#a, #b').is(function(v) { return v == document.getElementById('a');}), false, 'multi !func');
   			
   			check($('#a, #b').is('span, div, p'), true, 'complex');
   			check($('#a, #b').is('#a, #b'), true, 'complex 2');
   			check($('#a, #b').is('span, a, p'), false, '!complex');
		});
	});
	
	describe('.only()', function() {
		it('just works', function() {
   			containsAll($('#a').only(), [document.getElementById('a')], 'default');
   			containsAll($(document).only(), [], '!default');
   			containsAll($('#a').only('*'), [document.getElementById('a')], '*');
   			containsAll($(document).only('*'), [], '!*');
   			containsAll($('#a').only('.x'), [document.getElementById('a')], 'class');
   			containsAll($('#b').only('.x'), [], '!class');
   			containsAll($('#a').only('div'), [document.getElementById('a')], 'tag');
   			containsAll($('#a p').only('div'), [], '!tag');
   			containsAll($('#a').only('div.x'), [document.getElementById('a')], 'tag+class');
   			containsAll($('#b').only('div.x'), [], 'tag+!class');
   			containsAll($('#a').only('p.x'), [], '!tag+class');
   			containsAll($('#a').only(function(v) { return v == document.getElementById('a');}), [document.getElementById('a')], 'func');
   			containsAll($('#b').only(function(v) { return v == document.getElementById('a');}), [], '!func');

   			containsAll($('#a, #b').only(), [document.getElementById('a'), document.getElementById('b')], 'multi default');
   			containsAll($([$('#a'), document]).only(), [document.getElementById('a')], 'multi !default');
   			containsAll($('#a, #b').only('*'), [document.getElementById('a'), document.getElementById('b')], 'multi *');
   			containsAll($([$('#a'), document]).only('*'), [document.getElementById('a')], 'multi !*');
   			containsAll($('#b_a, #b_b').only('.x'), [document.getElementById('b_a'), document.getElementById('b_b')], 'multi class');
   			containsAll($('#a_a, #b_a, #b_b').only('.x'), [document.getElementById('b_a'), document.getElementById('b_b')], 'multi !class');
   			containsAll($('#a, #b').only(function(v) { return v == document.getElementById('a');}), [document.getElementById('a')], 'multi !func');
   			
   			containsAll($('#a, #b').only('span, div, p'), [document.getElementById('a'), document.getElementById('b')], 'complex');
   			containsAll($('#a, #b').only('#a, #b'), [document.getElementById('a'), document.getElementById('b')], 'complex 2');
   			containsAll($('#a, #b').only('span, a, p'), [], '!complex');
   			
   			var fd1 = $([EE('span', {$: 'a b c-c'}), EE('span', {$: 'c-c b a'}), EE('span', {$: 'b c-c a'})]);
   			check(fd1.only('.c-c').length, 3, 'dash-test');
   			check(fd1.only('.d-d').length, 0, '!dash-test');
  			check(fd1.only('span.c-c').length, 3, 'class.dash-test');
  			check(fd1.only('div.c-c').length, 0, '!class.dash-test');
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