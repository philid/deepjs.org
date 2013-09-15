/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */

var deep = require("deep/deep");
var connect = require("connect");
var urlrouter = require('urlrouter');

require("autobahn/stores/json");
require("deep-swig/node")();
require("./marked-store");

var app = connect()
.use(urlrouter(function (app)
{
//______________________________________________ HOME
	app.get('/', function (req, res, next)
	{
		req.view = {
			page:"swig::./www/index.swig",
			context:{
				menuActive:"home",
				baseline:"json::./baselines.json",
				content:["marked::./tutos/first.md"]
			}
		};
		return next();
	});
//______________________________________________ TUTOS ROOT
	app.get('/tutos', function (req, res, next)
	{
		req.view = {
			page:"swig::./www/index.swig",
			context:{
				menuActive:"tutos",
				baseline:"json::./baselines.json",
				content:["marked::./tutos/nodejs/simple.md"]
			}
		};
		return next();
	});
//______________________________________________ TUTOS
	app.get('/tutos/:tuto([a-zA-Z\-\/]+)', function (req, res, next)
	{
		req.view = {
			page:"swig::./www/index.swig",
			context:{
				menuActive:"tutos",
				baseline:"json::./baselines.json",
				content:["marked::./tutos/"+req.params.tuto+".md"]
			}
		};
		return next();
	});
//______________________________________________ ABOUT
	app.get('/about', function (req, res, next)
	{
		req.view = {
			page:"swig::./www/index.swig",
			context:{
				menuActive:"about",
				baseline:"json::./baselines.json",
				content:["marked::./www/about.md"]
			}
		};
		return next();
	});
//______________________________________________ ABOUT
	app.get('/community', function (req, res, next)
	{
		req.view = {
			page:"swig::./www/index.swig",
			context:{
				menuActive:"community",
				baseline:"json::./baselines.json",
				content:["marked::./www/community.md"]
			}
		};
		return next();
	});
//______________________________________________ ABOUT
	app.get('/modules', function (req, res, next)
	{
		req.view = {
			page:"swig::./www/index.swig",
			context:{
				menuActive:"modules",
				baseline:"json::./baselines.json",
				content:["marked::./www/modules.md"]
			}
		};
		return next();
	});
}))
.use(function(req, res, next){
	if(req.view)
		deep(req.view)
		.deepLoad()
		.done(function(success){
			success.context.content.join("\n");
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(success.page(success.context));
		})
		.fail(function(error){
			//deep.utils.dumpError(error);
			res.writeHead(error.status || 500, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(error));
		});
	else
		return next();
})
.use(connect.static(__dirname + '/www', { maxAge: 86400000, redirect:false }))
.use("/API", connect.static(__dirname + '/node_modules/deep/DOCS/apidocs', { maxAge: 86400000, redirect:false }))
.use(function(req, res, next){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end("error : 404");
})
.listen(3000);


