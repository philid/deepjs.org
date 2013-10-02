/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */

var deep = require("deep");
deep.globals.rootPath = __dirname+"/";
require("deep-node-fs/json").createDefault();
require("deep-markdown");
//deep.protocoles.markdown.options.rootPath = deep.globals.rootPath;
require("deep-swig")();
// git describe --abbrev=0  --tags       // knowing last tag

var express = require('express');
var mappers = require("autobahn/middleware/html");


var map = {
	"/":{
		page:"swig::./www/index.swig",
		context:{
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
			menuActive:"home",
			baseline:"json::./www/baselines.json",
			content:[]
		}
	}
}, map);

var app = express()
//.use(require('connect-repl')())
.use(mappers.simpleMap(map))
.use(express.static(__dirname + '/www', { maxAge: 86400000, redirect:false }))
.use("/API", express.static(__dirname + '/node_modules/deep/DOCS/apidocs', { maxAge: 86400000, redirect:false }))
.use(function(req, res, next){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end("error : 404");
})
.listen(3000);

// /_____________________________________________


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

repl.start({
  prompt: "node via stdin> ",
  input: process.stdin,
  output: process.stdout
});



