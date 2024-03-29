var fs = require("fs");
var assert = require("assert");
var prop = require("../index.js");

var syncData = prop.read(__dirname + "/test-cases.properties");
prop.read(__dirname + "/test-cases.properties", function(err, data) {
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
	assert.equal(data["foofoo"], 'barbar');
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
assert.equal(editor1.toString(), "basic=prop1");
editor1.set("basic", "prop2", "A comment\nmulti-line1");
assert.equal(editor1.toString(), "# A comment\n# multi-line1\nbasic=prop2");
editor1.set("basic", "prop3", "A comment\nmulti-line2");
assert.equal(editor1.toString(), "# A comment\n# multi-line2\nbasic=prop3");
editor1.set("basic", "prop4");
assert.equal(editor1.toString(), "# A comment\n# multi-line2\nbasic=prop4");
editor1.set("basic", "prop5", null); // Delete's comment
assert.equal(editor1.toString(), "basic=prop5");
editor1.set("basic1", "prop6");
assert.equal(editor1.toString(), "basic=prop5\nbasic1=prop6");
editor1.addHeadComment("Head Comment");
assert.equal(editor1.toString(), "# Head Comment\nbasic=prop5\nbasic1=prop6");
assert.ok(editor1.get("valueOf") == null);
assert.ok(editor1.get("toString") == null);

var editor2 = prop.createEditor(__dirname + "/test-cases.properties");
assert.equal(fs.readFileSync(__dirname + "/test-cases.properties").toString(), editor2.toString());
editor2.set("lala", "prop1");
assert.ok(editor2.toString().indexOf("lala=prop1") > -1);
editor2.set("lala", "prop2", "A comment\nmulti-line1");
assert.ok(editor2.toString().indexOf("# A comment\n# multi-line1\nlala=prop2") > -1);
editor2.set("lala", "prop3", "A comment\nmulti-line2");
assert.ok(editor2.toString().indexOf("# A comment\n# multi-line2\nlala=prop3") > -1);
editor2.set("lala", "prop4");
assert.ok(editor2.toString().indexOf("# A comment\n# multi-line2\nlala=prop4") > -1);
editor2.set("lala", "prop5", null); // Delete's comment
assert.ok(editor2.toString().indexOf("! The exclamation mark can also mark text as comments.\nlala=prop5") > -1);
editor2.set("basic-non-existing", "prop6");
assert.ok(editor2.toString().indexOf("\nbasic-non-existing=prop6") > -1);
editor2.addHeadComment("Head Comment");
assert.equal(editor2.toString().indexOf("# Head Comment\n"), 0);
assert.ok(editor2.get("valueOf") == null);
assert.ok(editor2.get("toString") == null);

var editor3 = prop.createEditor();
editor3.set("stay", "ok");

editor3.unset("key");
editor3.unset("key", null);
editor3.unset("key", undefined);
assert.equal(editor3.toString().trim(), "stay=ok");

editor3.set("key", "val");
editor3.unset("key");
assert.equal(editor3.toString().trim(), "stay=ok");

editor3.set("key", "val");
editor3.set("key", null);
assert.equal(editor3.toString().trim(), "stay=ok");

editor3.set("key", "val");
editor3.set("key", undefined);
assert.equal(editor3.toString().trim(), "stay=ok");

var editor4 = prop.createEditor({ separator: ' ' });
editor4.set("stay", "ok");
assert.equal(editor4.toString().trim(), "stay ok");

prop.createEditor(__dirname + "/test-cases.properties", function(err, editor) {
	assert.ifError(err);

	var properties = {};
	properties.lala = 'whatever';
	properties.website = 'whatever';
	properties.language = 'whatever';
	properties.message = 'whatever';
	properties['key with spaces'] = 'whatever';
	properties.tab = 'whatever';
	properties['long-unicode'] = 'whatever';
	properties['another-test'] = 'whatever';
	for (var item in properties) {
		editor.set(item, properties[item]);
	}

	assert.equal(
		editor.toString(),
		'# You are reading the ".properties" entry.\n' +
		'! The exclamation mark can also mark text as comments.\n' +
		'lala=whatever\n' +
		'website = whatever\n' +
		'language = Dutch\n' +
		'language = whatever\n' +
		'# The backslash below tells the application to continue reading\n' +
		'# the value onto the next line.\n' +
		'message = whatever\n' +
		'# Add spaces to the key\n' +
		'key\\ with\\ spaces = whatever\n' +
		'# Unicode\n' +
		'tab : whatever\n' +
		'long-unicode : whatever\n' +
		'space\\ separator     key val \\n three\n' +
		'another-test :whatever\n' +
		'   null-prop\n' +
		'foo\\\n' +
		'    foo=bar\\\n' +
		'        bar\n'
	);

	const now = Date.now();
	editor.save(__dirname + `/test-save-${now}.properties`, function(err) {
		assert.ifError(err);
		fs.rmSync(__dirname + `/test-save-${now}.properties`);
	});
	editor.save(__dirname + `/test-save-sync-${now}.properties`);
	fs.rmSync(__dirname + `/test-save-sync-${now}.properties`);
});

// Escaping keys
var editor4 = prop.createEditor();
editor4.set("space test", "value");
editor4.set("equals=key", "value");
editor4.set("colon:key", "value");
editor4.set("new\nline", "value");
editor4.set("üñîçø∂é", "value");

assert.equal(
	editor4.toString(),
	"space\\ test=value\n" +
	"equals\\=key=value\n" +
	"colon\\:key=value\n" +
	"new\\nline=value\n" +
	"\\u00fc\\u00f1\\u00ee\\u00e7\\u00f8\\u2202\\u00e9=value"
);

const editor5 = prop.editorFromString("");
assert.equal(editor5.toString(), "");

const editor6 = prop.editorFromString("one=1\ntwo=2");
assert.equal(editor6.get("one"), "1");
assert.equal(editor6.get("two"), "2");

// javac ReadProperties.java
// java ReadProperties test-cases.properties
