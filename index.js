/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */

var deep = require("deep/deep");
deep.globals.rootPath = __dirname+"/";

var connect = require("connect");
var mappers = require("deep-route/mappers");
require("deep-node-fs/json").createDefault();
require("deep-markdown");
require("deep-swig")();
// git describe --abbrev=0 --tags       // knowing last tag
//deep.protocoles.markdown.options.rootPath = deep.globals.rootPath;

var map = {
	"/":{
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



var app = connect()
.use(mappers.getHTMLMaper(map))
.use(connect.static(__dirname + '/www', { maxAge: 86400000, redirect:false }))
.use("/API", connect.static(__dirname + '/node_modules/deep/DOCS/apidocs', { maxAge: 86400000, redirect:false }))
.use(function(req, res, next){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end("error : 404");
})
.listen(3000);


