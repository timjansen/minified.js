window.miniTests.push.apply(window.miniTests, [
	{
		name: "MINI().each()",
	 	exec: function() {
			var m = MINI("#a, #b, #c");
			check(m.length, 3, "list check");
			var cnt = 0;
			m.each(function(item, index) {
				check(index == cnt++);
				contains(m, item, true);
			});
			check(cnt, 3, "count check");
		}
	},
	{
		name: "MINI().filter(func false)",
	 	exec: function() {
	 		var l = [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")];
			var m = MINI("#a, #b, #c").filter(function(item){contains(l, item);return false;});
			check(m.length, 0);
		}
	},
	{
		name: "MINI().filter(func true)",
	 	exec: function() {
	 		var l = [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")];
			var m = MINI("#a, #b, #c").filter(function(item){contains(l, item);return true;});
			check(m.length, 3);
			containsAll(m, l, true);
		}
	},
	{
		name: "MINI().filter(func interleave)",
	 	exec: function() {
	 		var cnt = 0;
	 		var l = [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")];
	 		var sw = false;
			var m = MINI("#a, #b, #c").filter(function(item, index){check(index, cnt++); contains(l, item); sw = !sw; return sw;});
			check(m.length, 2);
			containsAll(m, [document.getElementById("a"), document.getElementById("c")], true);
		}
	},

	{
		name: "MINI().sub()",
	 	exec: function() {
	 		var r1 = MINI([]);
	 		check(r1.sub(0).length, 0);
	 		check(r1.sub(0, 1).length, 0);
	 		check(r1.sub(-5, 16).length, 0);

	 		var r2 = MINI([1, 2, 3, 4]);
	 		check(r2.sub(0, 4).length, 4);
	 		check(r2.sub(0, 4)[0], 1);
	 		check(r2.sub(0, 4)[1], 2);
	 		check(r2.sub(0, 4)[2], 3);
	 		check(r2.sub(0, 4)[3], 4);

	 		check(r2.sub(0, 1).length, 1);
	 		check(r2.sub(0, 1)[0], 1);

	 		check(r2.sub(3, 4).length, 1);
	 		check(r2.sub(3, 4)[0], 4);

	 		check(r2.sub(4, 5).length, 0);

	 		check(r2.sub(-1).length, 1);
	 		check(r2.sub(-1)[0], 4);
	 		check(r2.sub(-3, -1).length, 2);
	 		check(r2.sub(-3, -1)[0], 2);
	 		check(r2.sub(-3, -1)[1], 3);
	 	}
	},
	
	
	{
		name: "MINI().remove(none)",
	 	exec: function() {
			MINI("#ddfgfdf").remove();
		}
	},
	{
		name: "MINI().remove()",
	 	exec: function() {
	 		MINI('#container2').add(EE('span', {'@id':'hello'}, 'hello'));
			MINI("#hello").remove();
			check(MINI('#hello').length, 0);
		}
	},
	
	{
		name: "MINI().fill(none)",
	 	exec: function() {
			MINI("#container2").fill();
		}
	},
	{
		name: "MINI().fill()",
	 	exec: function() {
	 		MINI('#container2').add(EE('span', {'@id':'hello'}, 'hello'));
			var l = MINI("#container2").fill().length;
			check(l, 1);
			check(MINI('#hello').length, 0);
			check(MINI('#container2').length, 1);
		}
	},
	
	{
		name: "MINI().offset()",
	 	exec: function() {
	 		var r1 = MINI('#asdsd').offset();
	 		check(r1.x, 0);
	 		check(r1.y, 0);
	 		var r2 = MINI('#results').offset();
	 		check(r2.x > 0);
	 		check(r2.y > 0);
		}
	}
	

]);

