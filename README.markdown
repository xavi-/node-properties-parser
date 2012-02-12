# node-properties-parser

A parser for [.properties](http://en.wikipedia.org/wiki/.properties) files written in javascript.  Properties files store key-value pairs.  They are typically used for configuration and internationalization in Java applications.  Here's an example of the format:

	# You are reading the ".properties" entry.
	! The exclamation mark can also mark text as comments.
	website = http://en.wikipedia.org/
	language = English
	# The backslash below tells the application to continue reading
	# the value onto the next line.
	message = Welcome to \
	          Wikipedia!
	# Add spaces to the key
	key\ with\ spaces = This is the value that could be looked up with the key "key with spaces".
	# Unicode
	tab : \u0009
*(taken from [Wikipedia](http://en.wikipedia.org/wiki/.properties#Format))*

Currently works with any version of node.js.

## The API

- `parse(text)`: Parses `text` into key-value pairs.  Returns an object containing the key-value pairs.
- `read(path, callback)`: Opens the file specified by `path` and calls `parse` on its content.  The result is then passed to `callback` as the second parameter.  If an error occurs, the error object is passed to `callback` as the first paramter.
- `readSync(path)`: A synchronous version of `read`.  Opens the file specified by `path` synchronously and calls `parse` on its contents.

## Getting node-properties-parser

The easiest way to get node-properties-parser is with [npm](http://npmjs.org/):

	npm install node-properties-parser

Alternatively you can clone this git repository:

	git://github.com/xavi-/node-properties-parser.git

## Developed by
* Xavi Ramirez

## License
This project is released under [The MIT License](http://www.opensource.org/licenses/mit-license.php).