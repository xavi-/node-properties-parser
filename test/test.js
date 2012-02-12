var prop = require("../index.js");

prop.read("./test-cases.properties", function(err, data) {
	console.log("error:");
	console.dir(err);
	console.log("data:");
	console.dir(data);


	var repl = require("repl").start();
	repl.context.data = data;
});

// java ReadProperties test-cases.properties
// javac ReadProperties.java