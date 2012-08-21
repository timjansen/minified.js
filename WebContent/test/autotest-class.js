window.miniTests.push.apply(window.miniTests, [
   	{
		name:'hasClass()',
		exec: function() {
			var s1 = MINI.elAppend('#container2', 'div', {'@class': 'a b c d e'})[0];
			MINI.el('div', {'@class': ''}, [], '#container2');
			var s3 = MINI.elAppend('#container2', 'div', {'@class': 'a d f'}, [])[0];
			var m = MINI('#container2 div');
			check(m.hasClass('a'), s1, true);
			check(m.hasClass('b'), s1, true);
			check(m.hasClass('c'), s1, true);
			check(m.hasClass('d'), s1, true);
			check(m.hasClass('e'), s1, true);
			check(m.hasClass('f'), s3, true);
			check(!m.hasClass('x'));
		}
	},
	{
		name:'removeClass()',
		exec: function() {
			var s1 = MINI.elAppend('#container2', 'div', {'@class': 'a b c d e'})[0];
			var m = MINI(s1);
			m.removeClass('x');
			check(s1.className, 'a b c d e');
			m.removeClass('a');
			check(s1.className, 'b c d e');
			m.removeClass('e');
			check(s1.className, 'b c d');
			m.removeClass('c');
			check(s1.className, 'b d');
			m.removeClass('b');
			check(s1.className, 'd');
			m.removeClass('d');
			check(s1.className, '');
			m.removeClass('c');
			check(s1.className, '');
		}
	},
	{
		name:'addClass()',
		exec: function() {
			var s1 = MINI.elAppend('#container2', 'div')[0];
			var s2 = MINI.elAppend('#container2', 'div', {'@class':''})[0];
			var m = MINI([s1, s2]);
			m.addClass('a');
			check(s1.className, 'a');
			check(s2.className, 'a');
			m.addClass('a');
			check(s1.className, 'a');
			check(s2.className, 'a');
			m.addClass('b');
			check(s1.className, 'a b');
			check(s2.className, 'a b');
			m.addClass('a');
			check(s1.className, 'b a');
			check(s2.className, 'b a');
			m.addClass('b');
			check(s1.className, 'a b');
			check(s2.className, 'a b');
			m.addClass('c');
			check(s1.className, 'a b c');
			check(s2.className, 'a b c');
		}
	},
	{
		name:'toggleClass()',
		exec: function() {
			var s1 = MINI.elAppend('#container2', 'div', {'@class': 'a b c'})[0];
			var s2 = MINI.elAppend('#container2', 'div')[0];
			var m = MINI('#container2 div');
			m.toggleClass('a');
			check(s1.className, 'b c');
			check(s2.className, 'a');
			m.toggleClass('b');
			check(s1.className, 'c');
			check(s2.className, 'a b');
			m.toggleClass('c');
			check(s1.className, '');
			check(s2.className, 'a b c');
			m.toggleClass('x');
			check(s1.className, 'x');
			check(s2.className, 'a b c x');
			m.toggleClass('x');
			check(s1.className, '');
			check(s2.className, 'a b c');
		}
	}
]);
