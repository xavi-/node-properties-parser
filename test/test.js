var fs = require("fs");
var assert = require("assert");
var prop = require("../index.js");

var syncData = prop.read("./test-cases.properties");
prop.read("./test-cases.properties", function(err, data) {
	assert.deepEqual(data, syncData);
	assert.equal(data["lala"], 'ℊ the foo foo lalala;');
	assert.equal(data["website"], 'http://en.wikipedia.org/');
	assert.equal(data["language"], 'English');
	assert.equal(data["message"], 'Welcome to Wikipedia!');
	assert.equal(data["key with spaces"], 'This is the value that could be looked up with the key "key with spaces".');
	assert.equal(data["tab"], '\t');
	assert.equal(data["long-unicode"], '\u00000009');
	assert.equal(data["space separator"], 'key val \n three');
	assert.equal(data["another-test"], ':: hihi');
	assert.equal(data["null-prop"], '');
	assert.ok(data["valueOf"] == null, "Properties are set that shouldn't be (valueOf)");
	assert.ok(data["toString"] == null, "Properties are set that shouldn't be (toString)");

	console.log("Tests all passed...");

	if(process.argv[2] === "repl") {
		var repl = require("repl").start("test-repl> ");
		repl.context.data = data;
		repl.context.prop = prop;
	}
});

var editor1 = prop.createEditor();
editor1.set("basic", "prop1");
assert.equal(editor1.toString().trim(), "basic=prop1");
editor1.set("basic", "prop2", "A comment\nmulti-line1");
assert.equal(editor1.toString().trim(), "# A comment\n# multi-line1\nbasic=prop2");
editor1.set("basic", "prop3", "A comment\nmulti-line2");
assert.equal(editor1.toString().trim(), "# A comment\n# multi-line2\nbasic=prop3");
editor1.set("basic", "prop4");
assert.equal(editor1.toString().trim(), "# A comment\n# multi-line2\nbasic=prop4");
editor1.set("basic", "prop5", null); // Delete's comment
assert.equal(editor1.toString().trim(), "basic=prop5");
editor1.set("basic1", "prop6");
assert.equal(editor1.toString().trim(), "basic=prop5\nbasic1=prop6");
editor1.addHeadComment("Head Comment");
assert.equal(editor1.toString().trim(), "# Head Comment\nbasic=prop5\nbasic1=prop6");
assert.ok(editor1.get("valueOf") == null);
assert.ok(editor1.get("toString") == null);

var editor2 = prop.createEditor("./test-cases.properties");
assert.equal(fs.readFileSync("./test-cases.properties"), editor2.toString());
editor2.set("lala", "prop1")
assert.ok(editor2.toString().indexOf("lala=prop1") > -1);
editor2.set("lala", "prop2", "A comment\nmulti-line1")
assert.ok(editor2.toString().indexOf("# A comment\n# multi-line1\nlala=prop2") > -1);
editor2.set("lala", "prop3", "A comment\nmulti-line2")
assert.ok(editor2.toString().indexOf("# A comment\n# multi-line2\nlala=prop3") > -1);
editor2.set("lala", "prop4")
assert.ok(editor2.toString().indexOf("# A comment\n# multi-line2\nlala=prop4") > -1);
editor2.set("lala", "prop5", null); // Delete's comment
assert.ok(editor2.toString().indexOf("! The exclamation mark can also mark text as comments.\nlala=prop5") > -1);
editor2.set("basic", "prop6");
assert.ok(editor2.toString().indexOf("basic=prop6") > -1);
editor2.addHeadComment("Head Comment");
assert.equal(editor2.toString().indexOf("# Head Comment\n"), 0);
assert.ok(editor2.get("valueOf") == null);
assert.ok(editor2.get("toString") == null);

// java ReadProperties test-cases.properties
// javac ReadProperties.java