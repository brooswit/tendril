var tendril = require( './tendril' );

var operations = {}
var normalizedPath = require("path").join(__dirname, "operations");

require("fs").readdirSync(normalizedPath).forEach(function(file) {
    operations[file] = require("./operations/" + file);
});


module.exports = tendrilClient = tendril("localhost", "test", operations);
