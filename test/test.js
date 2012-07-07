var assert = require("assert");
var prop = require("../index.js");

prop.read("./test-cases.properties", function(err, data) {
	console.log("error:");
	console.dir(err);
	console.log("data:");
	console.dir(data);

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

	var repl = require("repl").start();
	repl.context.data = data;
});

// java ReadProperties test-cases.properties
// javac ReadProperties.java