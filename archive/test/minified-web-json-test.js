describe('minified-web-json-test.js', function() {
	
	describe('toJSON()/parseJSON()', function() {
		it('works with numbers', function() {
   			var a = 3;
   			var x = $.toJSON(a);
   			check($.parseJSON(x), 3);
		});
		it('works with objects', function() {
   			var b = {a: new String("foo"), b: new Number(7), c: new Boolean(true)};
   			var jb = $.parseJSON($.toJSON(b));
   			check(jb.a, b.a, "Testing String");
   			check(jb.b, b.b, "Testing Number");
   			check(jb.c, b.c, "Testing Boolean");
		});
		it('just works', function() {
   			var b = [3, true, 'bleh', {a: 2}, [2, false]];
   			var jb = $.parseJSON($.toJSON(b));
   			check(jb.length == b.length);
   			check(jb[0] == b[0]);
   			check(jb[1] == b[1]);
   			check(jb[2] == b[2]);
   			check(jb[3].a == b[3].a);
   			check(jb[4].length == b[4].length);
   			check(jb[4][0] == b[4][0]);
   			check(jb[4][1] == b[4][1]);
		});
		it('rejects invalid JSON', function() {
   			try {
   				var undef;
   				check($.parseJSON("[2,4,3,check('hello')]") == undef); // either return undef...
   			}
   			catch (e) {
   				// .. or throw exception...
   			}
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