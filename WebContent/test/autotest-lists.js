window.miniTests.push.apply(window.miniTests, [
	{
		name: "$().each()",
	 	exec: function() {
			var m = $("#a, #b, #c");
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
		name: "$().filter(func false)",
	 	exec: function() {
	 		var l = [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")];
			var m = $("#a, #b, #c").filter(function(item){contains(l, item);return false;});
			check(m.length, 0);
		}
	},
	{
		name: "$().filter(func true)",
	 	exec: function() {
	 		var l = [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")];
			var m = $("#a, #b, #c").filter(function(item){contains(l, item);return true;});
			check(m.length, 3);
			containsAll(m, l, true);
		}
	},
	{
		name: "$().filter(func interleave)",
	 	exec: function() {
	 		var cnt = 0;
	 		var l = [document.getElementById("a"), document.getElementById("b"), document.getElementById("c")];
	 		var sw = false;
			var m = $("#a, #b, #c").filter(function(item, index){check(index, cnt++); contains(l, item); sw = !sw; return sw;});
			check(m.length, 2);
			containsAll(m, [document.getElementById("a"), document.getElementById("c")], true);
		}
	},

	{
		name: "$().sub()",
	 	exec: function() {
	 		var r1 = $([]);
	 		check(r1.sub(0).length, 0);
	 		check(r1.sub(0, 1).length, 0);
	 		check(r1.sub(-5, 16).length, 0);

	 		var r2 = $([1, 2, 3, 4]);
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
		name: "$().remove(none)",
	 	exec: function() {
			$("#ddfgfdf").remove();
		}
	},
	{
		name: "$().remove()",
	 	exec: function() {
	 		$('#container2').add(EE('span', {'@id':'hello'}, 'hello'));
			$("#hello").remove();
			check($('#hello').length, 0);
		}
	},
	
	{
		name: "$().fill(none)",
	 	exec: function() {
			$("#container2").fill();
		}
	},
	{
		name: "$().fill()",
	 	exec: function() {
	 		$('#container2').add(EE('span', {'@id':'hello'}, 'hello'));
			var l = $("#container2").fill().length;
			check(l, 1);
			check($('#hello').length, 0);
			check($('#container2').length, 1);
		}
	}	

]);

