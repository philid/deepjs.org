/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */

var deep = require("deep");
deep.globals.rootPath = __dirname+"/";
require("deep-node-fs/json").createDefault();
require("deep-markdown");
require("deep-swig")();
// git describe --abbrev=0  --tags       // knowing last tag

var express = require('express');
var htmlMappers = require("autobahn/middleware/html");
var staticMappers = require("autobahn/middleware/statics");

var map = {
	"/":{
		context:{
			menuActive:"home",
			content:["markdown::./node_modules/deep/README.md"]
		}
	},
	"/tutorials":{
		context:{
			menuActive:"tutos",
			content:["markdown::./node_modules/deep/DOCS/menu.md", "markdown::./node_modules/deep/DOCS/first.md"]
		}
	},
	'/tutorials/:tuto([a-zA-Z\-\/]+)':{
		context:{
			menuActive:"tutos",
			content:["markdown::./node_modules/deep/DOCS/{tuto}.md"]
		}
	},
	'/about':{
		context:{
			menuActive:"about",
			content:["markdown::./www/about.md"]
		}
	},
	'/community':{
		context:{
			menuActive:"community",
			content:["markdown::./www/community.md"]
		}
	},
	'/modules':{
		context:{
			menuActive:"modules",
			content:["markdown::./www/modules.md"]
		}
	}
};

deep.utils.sheet({
	"dq.bottom::/*":{
		page:"swig::./www/index.swig",
		context:{
			version:"json::./www/version.json",
			baseline:"json::./www/baselines.json"
		}
	}
}, map);


var statics = {
	"/":[ { path:__dirname + '/www', options:{ maxAge: 86400000, redirect:false } } ],
	"/API":[ { path:__dirname + '/node_modules/deep/DOCS/apidocs', options : { maxAge: 86400000, redirect:false } } ]
};

var app = express();

staticMappers.map(statics, app);

app
.use(htmlMappers.simpleMap(map))
.use(function(req, res, next){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end("error : 404");
})
//.use(require('connect-repl')())
.listen(3000);

// /_____________________________________________

/*
var net = require("net"),
    repl = require("repl");

connections = 0;
net.createServer(function (socket) {
  connections += 1;
  repl.start({
    prompt: "node via TCP socket> ",
    input: socket,
    output: socket
  }).on('exit', function() {
    socket.end();
  });
}).listen(5001);


//__________________________________________ DON'T WORK : need to find why?
repl.start({
  prompt: "node via stdin> ",
  input: process.stdin,
  output: process.stdout
});
*/


