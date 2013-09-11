var requirejs = require('requirejs');
var fs = require('fs');

var config = {
	//appDir:".",
    baseUrl: './node_modules/smart-desk-ib',
    name: 'main-for-build',
    out: './www/js/smart.desk.ib.min.js',
    "packages": [
    	//{"name":"compose", "main":"compose.js", path:"../compose"},
    	//{"name":"deep", "main":"deep.js", location:"../deep/"}
    ],
    paths: {
    	deep:"../deep",
    	compose:"../compose/compose",
    	swig:"../swig",
    	"deep-ui":"../deep-ui",
        rql: "../rql",
    }
};


var minify = function  () {
	requirejs.optimize(config, function (buildResponse) {
		console.log("optimisation done");
		console.log("response : ", buildResponse);
	    //buildResponse is just a text output of the modules
	    //included. Load the built file for the contents.
	    //Use config.out to get the optimized file contents.
	    var contents = fs.readFileSync(config.out, 'utf8');
	    //console.log("output : ", contents);
	}, function(err) {
		console.log("optimisation fail : ", err);
	    //optimization err callback
	});
}

minify();
