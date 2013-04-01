window.miniTests.push.apply(window.miniTests, [
	{
		name: "Empty MINI()",
	 	exec: function() {
			var m = MINI();
				check(m);
				check(m.length, 0);
				check(m.set);
				check(!m[0]);
		}
	},
	{
		name: "MINI(Element)",
		 exec: function() {
				var e = document.getElementById("container");
				var m = MINI(e);
				check(m.length, 1);
				check(m[0] === e);
		 }
	},
	{
		name: "MINI(list)",
		exec: function() {
			var e = [4, 2, 3];
			var m = MINI(e);
			check(m.length, 3);
			containsAll(m, e);
			
	 		var m1 = MINI([document.getElementById("a")]);
			containsAll(m1, [document.getElementById("a")], true);
		}
	},
	{
		name: "MINI(null list)",
		exec: function() {
			var e = [null, 4, null, 2, null, 3, null];
			var m = MINI(e);
			check(m.length, 3);
			containsAll(m, [4, 2, 3]);
			
	 		var m1 = MINI([document.getElementById("a"), null, document.getElementById("b"), null]);
			containsAll(m1, [document.getElementById("a"), document.getElementById("b")], true);

	 		var m2 = MINI([null]);
			containsAll(m2, [], true);
		}
	},
	{
		name: "MINI(nested)",
		exec: function() {
			var e = [[[null, 5]], [[[null]]], [[[[1]]]], 4, null, [2, 7, 8], null, 3, null, [99]];
			var m = MINI(e);
			containsAll(m, [5, 1, 4, 2, 7, 8, 3, 99]);
		}
	},
	{
		name: "MINI(empty list)",
		exec: function() {
			var m = MINI([]);
			check(m.length, 0);
		}
	},
	{
		name: "MINI(id)",
		exec: function() {
			var m = MINI('#container');
			check(m.length, 1);
			check(m[0] === document.getElementById("container"));
		}
	},
	{
		name: "MINI(unknown id)",
		exec: function() {
			var m = MINI('#dfsafsdfds');
			check(m.length, 0);
		}
	},
	{
		name: "MINI(id, id)",
		exec: function() {
			var m = MINI('#container, #container2');
			containsAll(m, [document.getElementById("container"), document.getElementById("container2")], true);
		}
	},
	{
		name: "MINI(id, unknown id)",
		exec: function() {
			var m = MINI('#container, #dsfewfe');
			check(m.length, 1);
			contains(m, document.getElementById("container"), true);
		}
	},
	{
		name: "MINI(class)",
		exec: function() {
			var m = MINI('.x');
			containsAll(m, [document.getElementById("a"),document.getElementById("a_b"),
					document.getElementById("b_a"),document.getElementById("b_b"),document.getElementById("c_a")], true);
		}
	},
	{
		name: "MINI(unknown class)",
		exec: function() {
			var m = MINI('.sdsada');
			check(m.length, 0);
		}
	},
	{
		name: "MINI(class, id)",
		exec: function() {
			var m = MINI('.z, #container2');
			containsAll(m, [document.getElementById("a_a"), document.getElementById("a_b"), document.getElementById("c_b"), document.getElementById("container2")], true);
		}
	},
	{
		name: "MINI(elementName)",
		exec: function() {
			var m = MINI('b');
			check(m.length, 3);
			check(/^b$/i.test(m[0].tagName));
			check(/^b$/i.test(m[1].tagName));
			check(/^b$/i.test(m[2].tagName));
		}
	},
	{
		name: "MINI(unknown elementName)",
		exec: function() {
			var m = MINI('blink');
			check(m.length, 0);
		}
	},
	{
		name: "MINI(unknown elementName, unknown id, unknown class)",
		exec: function() {
			var m = MINI('blink, #dfsdj, .sddsad');
			check(m.length, 0);
		}
	},
	{
		name: "MINI(unknown elementName, unknown id, unknown class, id)",
		exec: function() {
			var m = MINI('blink, #dfsdj, .sddsad, #container');
			containsAll(m, [document.getElementById("container")], true);
		}
	},
	{
		name: "MINI(id elementName)",
		exec: function() {
			var m = MINI('#a b');
			check(m.length, 1);
			check(/^b$/i.test(m[0].tagName));
		}
	},
	{
		name: "MINI(id id elementName)",
		exec: function() {
			var m = MINI('#b #b_a p');
			check(m.length, 1);
			check(/^p$/i.test(m[0].tagName));
		}
	},
	{
		name: "MINI(elementName class elementName elementName)",
		exec: function() {
			var m = MINI('div .n div p');
			check(m.length, 2);
			check(/^p$/i.test(m[0].tagName));
			check(/^p$/i.test(m[1].tagName));
		}
	},
	{
		name: "MINI(elementName.class)",
		exec: function() {
			var m = MINI('div.n');
			check(m.length, 2);
		}
	},
	{
		name: "MINI(elementName.unknownclass)",
		exec: function() {
			var m = MINI('div.xxx');
			check(m.length, 0);
		}
	},
	{
		name: "MINI(unknownElementName.class)",
		exec: function() {
			var m = MINI('blink.x');
			check(m.length, 0);
		}
	},
	{
		name: "MINI(elementName.class elementName)",
		exec: function() {
			var m = MINI('#container div.n p');
			check(m.length == 4 || m.length == 3); // Minified's impl will return 4, native CSS 3
		}
	},
	{
		name: "MINI(Element, empty context)",
		exec: function() {
			var e = document.getElementById("container");
			var m = MINI(e, []);
			check(m.length, 0);
		}
	},
	{
		name: "MINI(id, empty context)",
		exec: function() {
			var m = MINI("#container", []);
			check(m.length, 0);
		}
	},
	{
		name: "MINI(elementName, empty context)",
		exec: function() {
			var m = MINI("div", []);
			check(m.length, 0);
		}
	},
		
	{
		name: "MINI(elementName, self context)",
		exec: function() {
			var m = MINI("#container", "#container");
			check(m.length, 0);
		}
	},
	{
		name: "MINI(*, context)",
		exec: function() {
			var m = MINI("*", "#c");
			check(m.length, 6);
			contains(m, document.getElementById("c_b"));
			contains(m, document.getElementById("c_a"));
		}
	},
	{
		name: "MINI(id, context)",
		exec: function() {
			var m = MINI("#a", "#container");
			containsAll(m, [document.getElementById("a")], true);
		}
	},
	{
		name: "MINI(element.class, multi context)",
		exec: function() {
			var m = MINI("div.z", ".x,.n,.m");
			containsAll(m, [document.getElementById("a_a"), document.getElementById("a_b"), document.getElementById("c_b")], true);
		}
	},

	{
		name: "MINI(*, context, childOnly)",
		exec: function() {
			var m = MINI("*", "#c", true);
			check(m.length, 3);
			contains(m, document.getElementById("c_b"));
			contains(m, document.getElementById("c_a"));
		}
	},

	{
		name: "MINI(element name, context, childOnly)",
		exec: function() {
			var m = MINI("div", "#c", true);
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
			check($ === MINI);
			check($$ === MINI.$$);
		}
	},
	
	{
		name: "MINI() whitespace exception (debug)",
		debugFailure: "Whitespace check did not work.",
		exec: function() {
			MINI(' div.n');
		}
	},
	{
		name: "MINI() pseudo class exception (debug)",
		debugFailure: "pseudo check did not work.",
		exec: function() {
			MINI('a:visited');
		}
	}

]);
