/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */

var deep = require("deep/deep");
var connect = require("connect");
require("autobahn/stores/json");
require("autobahn/stores/text");
require("deep-swig/node");

deep.debug = true;

//_________________________

var argv = require('optimist')
    .usage('Launch web app. You could override any local.json settings option and/or specify local.json mode.\nUsage example : $0 -mode [string] --no-security.bypass -mail.host [string] ...\nSee optimist page for more infos (https://github.com/substack/node-optimist).')
    .alias('m', 'mode')
    .describe('m', 'give settings mode (see local.json "mode" property')
    .argv;


var app = connect()
.use(connect.cookieParser())
.use(connect.cookieSession({ secret: 'deep powaaaaa', cookie: { maxAge: 60 * 60 * 1000 }}))
.use(connect.static(__dirname + '/www', { maxAge: 86400000 /* one day */ }))
.use(connect.directory(__dirname + '/www'))
.use(function(req, res){
	res.end('hello world\n');
})
.listen(3000);



if(require.main == module){
	require("repl").start({
		prompt: "node via stdin > ",
		input: process.stdin,
		output: process.stdout
	});
}

