describe('minified-web-forms-test.js', function() {
	
	function countKeys(map) {
		var c = 0;
		for (var key in map)
			if (map.hasOwnProperty(key))
				c++;
		
		return c;
	}

	describe('.values()', function() {
		it('handles empty forms', function() {
	 		check(countKeys($().values()), 0);
	 		check(countKeys($('#formContainer span').values()), 0);
		});
		
		it('handles inputs', function() {
			var a = $("#id3_1").values();
			check(countKeys(a), 1);
			check(a['i3_1'], 'ttt');
		});

		it('handles forms', function() {
			var a = $("#id2").values();
			check(countKeys(a), 2);
			check(a['i2_1'], 'bb');
			check(a['i2_2'], 'bc');
		});
		
		it('handles simple forms plus field', function() {
			var a = $("#id2, #id3_1").values();
			check(countKeys(a), 3);
			check(a['i2_1'], 'bb');
			check(a['i2_2'], 'bc');
			check(a['i3_1'], 'ttt');
		});
		
		it('handles unchecked boxes', function() {
			var a = $("#id1_5").values();
			check(countKeys(a), 0);
		});
		
		it('handles checked boxes', function() {
			var a = $("#id1_7").values();
			check(countKeys(a), 1);
			check(a['i1_7'], 'j');
		});
		
		it('handles multi-checkboxes', function() {
			var a = $("#id1_6a, #id1_6b, #id1_6c").values();
			check(countKeys(a), 1);
			check(a['i1_6'].length, 2);
			check(a['i1_6'][0], 'f');
			check(a['i1_6'][1], 'g');
		});
		
		it('handkes radio boxes', function() {
			var a = $("#id1_8a, #id1_8b, #id1_8c").values();
			check(countKeys(a), 1);
			check(a['i1_8'], 'y');
		});
		
		it('handles text areas', function() {
			var a = $("#id1_9").values();
			check(countKeys(a), 1);
			check(a['i1_9'], 'abc');
		});
		
		it('just works', function() {
			var a = $("#id1").values();
			check(countKeys(a), 9);
			check(a['i1_1'], 'a');
			check(a['i1_2'].length, 3);
			check(a['i1_2'][0], 'b1');
			check(a['i1_2'][1], 'b2');
			check(a['i1_2'][2], 'b3');
			check(a['i1_3'], 'c');
			check(a['i1_4'], 'd');
			check(a['i1_6'].length, 3);
			check(a['i1_6'][0], 'f');
			check(a['i1_6'][1], 'g');
			check(a['i1_6'][2], 'i');
			check(a['i1_7'], 'j');
			check(a['i1_8'], 'y');
			check(a['i1_9'], 'abc');
			check(a['i1_10'], '');
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