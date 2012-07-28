
window.miniTests.push.apply(window.miniTests, [
   	{
		name:'toJSON() / parseJSON',
		exec: function() {
			var a = 3;
			check(MINI.parseJSON(MINI.toJSON(a)), 3);
			
			var b = [3, true, 'bleh', {a: 2}];
			var jb = MINI.parseJSON(MINI.toJSON(b));
			check(jb.length == b.length);
			check(jb[0] == b[0]);
			check(jb[1] == b[1]);
			check(jb[2] == b[2]);
			check(jb[3].a == b[3].a);
		}
	},
	{
		name:'parseJSON security',
		exec: function() {
			try {
				check(MINI.parseJSON("[2,4,3,check('hello')]") == undef); // either return undef...
			}
			catch (e) {
				// .. or throw exception...
			}
		}
	}
]);