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
			var m = MINI('div.n p');
			check(m.length, 4);
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
		name: "EL(unknown)",
		exec: function() {
			var undef;
			check(EL("#dsfdfdf") === undef);
		}
	},
	{
		name: "EL(null)",
		exec: function() {
			var undef;
			check(EL(null) === undef);
		}
	},
	{
		name: "EL(id)",
		exec: function() {
			check(EL("#container") === document.getElementById("container"));
		}
	},
	{
		name: "EL(div)",
		exec: function() {
			check(/^div$/i.test(EL("div").tagName));
		}
	},


	{
		name: "EL and $",
		exec: function() {
			check($ === MINI);
			check(EL === MINI.el);
		}
	}

]);
