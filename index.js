/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */

var deep = require("deep/deep");
var connect = require("connect");
var urlrouter = require('urlrouter');

require("autobahn/stores/json");
require("deep-swig/node");
require("./marked-store");


var app = connect()
.use(urlrouter(function (app) {

  app.get('/', function (req, res, next) {
	deep({
		page:"swig::./www/index.swig",
		content:"marked::./tutos/first.md"
	})
	.deepLoad()
	.done(function(success){
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(success.page({
			content:success.content,
			menuActive:"home"
		}));
	})
	.fail(function(error){
		//deep.utils.dumpError(error);
		res.writeHead(error.status || 500, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(error));
	});
  });

  app.get('/tutos', function (req, res, next) {
	deep({
		page:"swig::./www/index.swig",
		content:"marked::./tutos/first.md"
	})
	.deepLoad()
	.done(function(success){
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(success.page({
			content:success.content,
			menuActive:"tutos"
		}));
	})
	.fail(function(error){
		//deep.utils.dumpError(error);
		res.writeHead(error.status || 500, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(error));
	});
  });

  app.get('/tutos/:tuto(.*)', function (req, res, next) {
  	console.log("specific tutos : ", req.params.tuto)
	deep({
		page:"swig::./www/index.swig",
		content:"marked::./tutos/"+req.params.tuto+".md"
	})
	.deepLoad()
	.done(function(success){
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(success.page({
			content:success.content,
			menuActive:"tutos"
		}));
	})
	.fail(function(error){
		//deep.utils.dumpError(error);
		res.writeHead(error.status || 500, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(error));
	});
  });
  
}))
.use(connect.static(__dirname + '/www', { maxAge: 86400000, redirect:false }))
.listen(3000);


