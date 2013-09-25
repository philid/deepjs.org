/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */

var deep = require("deep/deep");
var connect = require("connect");
var mappers = require("deep-route/mappers");
require("autobahn/stores/json");
require("deep-markdown");
require("deep-swig/node")();
// git describe --abbrev=0 --tags       // knowing last tag

var map = {
	"/":{
		context:{
			content:["marked::./node_modules/deep/README.md"]
		}
	},
	"/tutorials":{
		context:{
			menuActive:"tutos",
			content:["marked::./node_modules/deep/DOCS/first.md"]
		}
	},
	'/tutorials/:tuto([a-zA-Z\-\/]+)':{
		context:{
			menuActive:"tutos",
			content:["marked::./node_modules/deep/DOCS/{tuto}.md"]
		}
	},
	'/about':{
		context:{
			menuActive:"about",
			content:["marked::./www/about.md"]
		}
	},
	'/community':{
		context:{
			menuActive:"community",
			content:["marked::./www/community.md"]
		}
	},
	'/modules':{
		context:{
			menuActive:"modules",
			content:["marked::./www/modules.md"]
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

