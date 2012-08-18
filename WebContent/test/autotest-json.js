
window.miniTests.push.apply(window.miniTests, [
   	{
		name:'toJSON() / parseJSON simple',
		exec: function() {
			var a = 3;
			check(MINI.parseJSON(MINI.toJSON(a)), 3);
		}
	},
   	{
		name:'toJSON() / parseJSON full',
		exec: function() {
			var b = [3, true, 'bleh', {a: 2}, [2, false]];
			var jb = MINI.parseJSON(MINI.toJSON(b));
			check(jb.length == b.length);
			check(jb[0] == b[0]);
			check(jb[1] == b[1]);
			check(jb[2] == b[2]);
			check(jb[3].a == b[3].a);
			check(jb[4].length == b[4].length);
			check(jb[4][0] == b[4][0]);
			check(jb[4][1] == b[4][1]);
		}
	},
   	{
		name:'toJSON() / parseJSON Objects',
		exec: function() {
			var b = {a: new String("foo"), b: new Number(7), c: new Boolean(true)};
			var jb = MINI.parseJSON(MINI.toJSON(b));
			check(jb.a == b.a);
			check(jb.b == b.b);
			check(jb.c == b.c);
		}
	},
	{
		name:'parseJSON security',
		exec: function() {
			try {
				var undef;
				check(MINI.parseJSON("[2,4,3,check('hello')]") == undef); // either return undef...
			}
			catch (e) {
				// .. or throw exception...
			}
		}
	}
]);