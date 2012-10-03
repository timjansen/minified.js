function createForm() {
	$('#container2').fill(
			[MINI.el('form', {'@id': 'id1', '@name': 'form1'}, [
       			    MINI.el('input', {'@id': 'id1_1', '@name': 'i1_1', '@value': 'a'}),
       			    MINI.el('input', {'@id': 'id1_2a', '@name': 'i1_2', '@value': 'b1'}),
       			    MINI.el('input', {'@id': 'id1_2b', '@name': 'i1_2', '@value': 'b2'}),
       			    MINI.el('input', {'@id': 'id1_2c', '@name': 'i1_2', '@value': 'b3'}),
       			    MINI.el('input', {'@id': 'id1_3', '@name': 'i1_3', '@value': 'c', '@type': 'hidden'}),
       			    MINI.el('input', {'@id': 'id1_4', '@name': 'i1_4', '@value': 'd', '@type': 'password'}),
       			    MINI.el('input', {'@id': 'id1_5', '@name': 'i1_5', '@value': 'e', '@type': 'checkbox'}),
       			    MINI.el('input', {'@id': 'id1_6a', '@name': 'i1_6', '@value': 'f', '@type': 'checkbox', '@checked': 'checked'}),
       			    MINI.el('input', {'@id': 'id1_6b', '@name': 'i1_6', '@value': 'g', '@type': 'checkbox', '@checked': 'checked'}),
       			    MINI.el('input', {'@id': 'id1_6c', '@name': 'i1_6', '@value': 'h', '@type': 'checkbox'}),
       			    MINI.el('input', {'@id': 'id1_6d', '@name': 'i1_6', '@value': 'i', '@type': 'checkbox', '@checked': 'checked'}),
       			    MINI.el('input', {'@id': 'id1_7', '@name': 'i1_7', '@value': 'j', '@type': 'checkbox', '@checked': 'checked'}),
       			    MINI.el('input', {'@id': 'id1_8a', '@name': 'i1_8', '@value': 'x', '@type': 'radio'}),
       			    MINI.el('input', {'@id': 'id1_8b', '@name': 'i1_8', '@value': 'y', '@type': 'radio', '@checked': 'checked'}),
       			    MINI.el('input', {'@id': 'id1_8c', '@name': 'i1_8', '@value': 'z', '@type': 'radio'}),
       			    MINI.el('textarea', {'@id': 'id1_9', '@name': 'i1_9'}, "abc"),
       			    MINI.el('input', {'@id': 'id1_10', '@name': 'i1_10'})
			    ]
			),
			MINI.el('form', {'@id': 'id2', '@name': 'form2'}, [
          			    MINI.el('input', {'@id': 'id2_1', '@name': 'i2_1', '@value': 'bb'}),
          			    MINI.el('input', {'@id': 'id2_2', '@name': 'i2_2', '@value': 'bc'})
   			    ]
   			),
   		 MINI.el('input', {'@id': 'id3_1', '@name': 'i3_1', '@value': 'ttt'}),
   		 MINI.el('span', 'test')]
	);
}

function each(list, cb) {
	for (var n in list)
		if (list.hasOwnProperty(n))
			cb(n, list[n]);
	return list;
}

function countKeys(map) {
	var c = 0;
	each(map, function() {
		c++;
	});
	return c;
}

window.miniTests.push.apply(window.miniTests, [
   	{
		name: "MINI().serialize(empty)",
	 	exec: function() {
	 		createForm();
	 		check(countKeys(MINI().serialize()), 0);
	 		check(countKeys(MINI('span').serialize()), 0);
		}
	},
	{
		name: "MINI().serialize(1 input)",
	 	exec: function() {
	 		createForm();
			var a = MINI("#id3_1").serialize();
			check(countKeys(a), 1);
			check(a['i3_1'], 'ttt');
		}
	},
	{
		name: "MINI().serialize(simple form)",
	 	exec: function() {
	 		createForm();
			var a = MINI("#id2").serialize();
			check(countKeys(a), 2);
			check(a['i2_1'], 'bb');
			check(a['i2_2'], 'bc');
		}
	},
	{
		name: "MINI().serialize(form+input)",
	 	exec: function() {
	 		createForm();
			var a = MINI("#id2, #id3_1").serialize();
			check(countKeys(a), 3);
			check(a['i2_1'], 'bb');
			check(a['i2_2'], 'bc');
			check(a['i3_1'], 'ttt');
		}
	},
	{
		name: "MINI().serialize(unchecked)",
	 	exec: function() {
	 		createForm();
			var a = MINI("#id1_5").serialize();
			check(countKeys(a), 0);
		}
	},
	{
		name: "MINI().serialize(checked)",
	 	exec: function() {
	 		createForm();
			var a = MINI("#id1_7").serialize();
			check(countKeys(a), 1);
			check(a['i1_7'], 'j');
		}
	},
	{
		name: "MINI().serialize(multi checkbox)",
	 	exec: function() {
	 		createForm();
			var a = MINI("#id1_6a, #id1_6b, #id1_6c").serialize();
			check(countKeys(a), 1);
			check(a['i1_6'].length, 2);
			check(a['i1_6'][0], 'f');
			check(a['i1_6'][1], 'g');
		}
	},
	{
		name: "MINI().serialize(radio)",
	 	exec: function() {
	 		createForm();
			var a = MINI("#id1_8a, #id1_8b, #id1_8c").serialize();
			check(countKeys(a), 1);
			check(a['i1_8'], 'y');
		}
	},	
	{
		name: "MINI().serialize(textarea)",
	 	exec: function() {
	 		createForm();
			var a = MINI("#id1_9").serialize();
			check(countKeys(a), 1);
			check(a['i1_9'], 'abc');
		}
	},
	{
		name: "MINI().serialize(full form)",
	 	exec: function() {
	 		createForm();
			var a = MINI("#id1").serialize();
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
		}
	}
]);
