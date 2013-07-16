window.miniTests.push.apply(window.miniTests, [
	{
		name: "Empty $()",
	 	exec: function() {
			var m = $();
				check(m);
				check(m.length, 0);
				check(m.set);
				check(!m[0]);
		}
	},
	{
		name: "$(Element)",
		 exec: function() {
				var e = document.getElementById("container");
				var m = $(e);
				check(m.length, 1);
				check(m[0] === e);
		 }
	},
	{
		name: "$(list)",
		exec: function() {
			var e = [4, 2, 3];
			var m = $(e);
			check(m.length, 3);
			containsAll(m, e);
			
	 		var m1 = $([document.getElementById("a")]);
			containsAll(m1, [document.getElementById("a")], true);
		}
	},
	{
		name: "$(null list)",
		exec: function() {
			var e = [null, 4, null, 2, null, 3, null];
			var m = $(e);
			check(m.length, 3);
			containsAll(m, [4, 2, 3]);
			
	 		var m1 = $([document.getElementById("a"), null, document.getElementById("b"), null]);
			containsAll(m1, [document.getElementById("a"), document.getElementById("b")], true);

	 		var m2 = $([null]);
			containsAll(m2, [], true);
		}
	},
	{
		name: "$(nested)",
		exec: function() {
			var e = [[[null, 5]], [[[null]]], [[[[1]]]], 4, null, [2, 7, 8], null, 3, null, [99]];
			var m = $(e);
			containsAll(m, [5, 1, 4, 2, 7, 8, 3, 99]);
		}
	},
	{
		name: "$(empty list)",
		exec: function() {
			var m = $([]);
			check(m.length, 0);
		}
	},
	{
		name: "$(id)",
		exec: function() {
			var m = $('#container');
			check(m.length, 1);
			check(m[0] === document.getElementById("container"));
		}
	},
	{
		name: "$(unknown id)",
		exec: function() {
			var m = $('#dfsafsdfds');
			check(m.length, 0);
		}
	},
	{
		name: "$(id, id)",
		exec: function() {
			var m = $('#container, #container2');
			containsAll(m, [document.getElementById("container"), document.getElementById("container2")], true);
		}
	},
	{
		name: "$(id, unknown id)",
		exec: function() {
			var m = $('#container, #dsfewfe');
			check(m.length, 1);
			contains(m, document.getElementById("container"), true);
		}
	},
	{
		name: "$(class)",
		exec: function() {
			var m = $('.x');
			containsAll(m, [document.getElementById("a"),document.getElementById("a_b"),
					document.getElementById("b_a"),document.getElementById("b_b"),document.getElementById("c_a")], true);
		}
	},
	{
		name: "$(unknown class)",
		exec: function() {
			var m = $('.sdsada');
			check(m.length, 0);
		}
	},
	{
		name: "$(class, id)",
		exec: function() {
			var m = $('.z, #container2');
			containsAll(m, [document.getElementById("a_a"), document.getElementById("a_b"), document.getElementById("c_b"), document.getElementById("container2")], true);
		}
	},
	{
		name: "$(elementName)",
		exec: function() {
			var m = $('b');
			check(m.length, 3);
			check(/^b$/i.test(m[0].tagName));
			check(/^b$/i.test(m[1].tagName));
			check(/^b$/i.test(m[2].tagName));
		}
	},
	{
		name: "$(unknown elementName)",
		exec: function() {
			var m = $('blink');
			check(m.length, 0);
		}
	},
	{
		name: "$(unknown elementName, unknown id, unknown class)",
		exec: function() {
			var m = $('blink, #dfsdj, .sddsad');
			check(m.length, 0);
		}
	},
	{
		name: "$(unknown elementName, unknown id, unknown class, id)",
		exec: function() {
			var m = $('blink, #dfsdj, .sddsad, #container');
			containsAll(m, [document.getElementById("container")], true);
		}
	},
	{
		name: "$(id elementName)",
		exec: function() {
			var m = $('#a b');
			check(m.length, 1);
			check(/^b$/i.test(m[0].tagName));

			var m2 = $('#a div');
			check(m2.length, 2);
		}
	},
	{
		name: "$(id id elementName)",
		exec: function() {
			var m = $('#b #b_a p');
			check(m.length, 1);
			check(/^p$/i.test(m[0].tagName));
		}
	},
	{
		name: "$(elementName class elementName elementName)",
		exec: function() {
			var m = $('div .n div p');
			check(m.length, 2);
			check(/^p$/i.test(m[0].tagName));
			check(/^p$/i.test(m[1].tagName));
		}
	},
	{
		name: "$(elementName.class)",
		exec: function() {
			var m = $('div.n');
			check(m.length, 2);
		}
	},
	{
		name: "$(elementName.unknownclass)",
		exec: function() {
			var m = $('div.xxx');
			check(m.length, 0);
		}
	},
	{
		name: "$(unknownElementName.class)",
		exec: function() {
			var m = $('blink.x');
			check(m.length, 0);
		}
	},
	{
		name: "$(elementName.class elementName)",
		exec: function() {
			var m = $('#container div.n p');
			check(m.length == 4 || m.length == 3); // Minified's impl will return 4, native CSS 3
		}
	},
	{
		name: "$(Element, empty context)",
		exec: function() {
			var e = document.getElementById("container");
			var m = $(e, []);
			check(m.length, 0);
		}
	},
	{
		name: "$(id, empty context)",
		exec: function() {
			var m = $("#container", []);
			check(m.length, 0);
		}
	},
	{
		name: "$(elementName, empty context)",
		exec: function() {
			var m = $("div", []);
			check(m.length, 0);
		}
	},
		
	{
		name: "$(elementName, self context)",
		exec: function() {
			var m = $("#container", "#container");
			check(m.length, 0);
		}
	},
	{
		name: "$(*, context)",
		exec: function() {
			var m = $("*", "#c");
			check(m.length, 6);
			contains(m, document.getElementById("c_b"));
			contains(m, document.getElementById("c_a"));
		}
	},
	{
		name: "$(id, context)",
		exec: function() {
			var m = $("#a", "#container");
			containsAll(m, [document.getElementById("a")], true);
		}
	},
	{
		name: "$(element.class, multi context)",
		exec: function() {
			var m = $("div.z", ".x,.n,.m");
			containsAll(m, [document.getElementById("a_a"), document.getElementById("a_b"), document.getElementById("c_b")], true);
		}
	},

	{
		name: "$(*, context, childOnly)",
		exec: function() {
			var m = $("*", "#c", true);
			check(m.length, 3);
			contains(m, document.getElementById("c_b"));
			contains(m, document.getElementById("c_a"));
		}
	},

	{
		name: "$(element name, context, childOnly)",
		exec: function() {
			var m = $("div", "#c", true);
			containsAll(m, [document.getElementById("c_a"), document.getElementById("c_b")], true);
		}
	},

	{
		name: "$$(unknown)",
		exec: function() {
			var undef;
			check($$("#dsfdfdf") === undef);
		}
	},
	{
		name: "$$(null)",
		exec: function() {
			var undef;
			check($$(null) === undef);
		}
	},
	{
		name: "$$(id)",
		exec: function() {
			check($$("#container") === document.getElementById("container"));
		}
	},
	{
		name: "$$(div)",
		exec: function() {
			check(/^div$/i.test($$("div").tagName));
		}
	},


	{
		name: "$$ and $",
		exec: function() {
			check($ === MINI.$);
			check($$ === MINI.$$);
		}
	},
	
	{
		name: "$().select()",
		exec: function() {
			var m = $("#c").select("div", true);
			containsAll(m, [document.getElementById("c_a"), document.getElementById("c_b")], true);
		}
	},

	{
		name: "$().trav()",
		exec: function() {
			var m = $("#a_a, #b_b").trav('parentNode');
			containsAll(m, [document.getElementById("a"), document.getElementById("b")], true);
		}
	},

	
	{
		name: "$() whitespace exception (debug)",
		debugFailure: "Whitespace check did not work.",
		exec: function() {
			$(' div.n');
		}
	},
	{
		name: "$() pseudo class exception (debug)",
		debugFailure: "pseudo check did not work.",
		exec: function() {
			$('a:visited');
		}
	}

]);
