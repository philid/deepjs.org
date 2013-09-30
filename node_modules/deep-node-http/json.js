//promised-http client

if(typeof define !== 'function')
	var define = require('amdefine')(module);

define(function (require)
{
	var url = require('url');
	var deep = require("deep/deep");
	var http = require('http');
	/**
	* @param options see http://nodejs.org/api/http.html#http_http_request_options_callback
	* @param datas optional body to send with request
	*/
	var request = function(options, datas){

		var def = deep.Deferred();
		var response = {
			status:null,
			body:null,
			headers:null
		};

		// console.log("http req : send : ", options.headers, datas);
		var maxRedirections = options.maxRedirections || 10;
		try{
		var req = http.request(options, function(res) {
			//console.log("http req : response : ", res);
			response.status = res.statusCode;
			response.headers = res.headers;
			response.body = '';
			res.setEncoding('utf8');
			var er = false;
			res.on('data', function (chunk)
			{
				response.body += chunk.toString();
			});
			res.on("end", function ()
			{
				if(er)
					return;

				if(response.status > 299 && response.status < 400) // receive redirection
				{
					if(maxRedirections === 0)
						throw new Error("deep.store.node.http.JSON : maxRedirections reached : aborting request ! : "+JSON.stringify(options));
					maxRedirections--;
					options.maxRedirections = maxRedirections;
					request(options, datas).done(function (res)
					{
						def.resolve(res);
					});
				}
				else
				{
					try
					{
						response.body = deep.utils.parseBody(response.body, response.headers);
						if(response.status >= 400 && !def.rejected)
							def.reject(response);
						else
							def.resolve(response);
					}
					catch(e)
					{
						if(!def.rejected)
							def.reject(e);
					}
				}
			});
			res.on('error', function(e)
			{
				er = e;
				console.log("deep.store.node.http.JSON : error : ", e);
				if(!def.rejected)
					def.reject(e);
			});
		});

		req.on('error', function(e) {
			def.reject(e);
		});

		if(datas)
			req.write(JSON.stringify(datas));
		req.end();
		}
		catch(e){
			//console.log("catche error in promised-node-http :  error : ", e);
			if(!def.rejected)
				def.reject(e);
		}
		return deep.promise(def);
	};


	deep.store.node.http.JSON = deep.compose.Classes(deep.Store, function (protocole, uri, schema, options)
	{
		this.baseUri = uri;
		this.options = options;
	});

	deep.store.node.http.JSON.prototype.forwardRPC = true;

	deep.store.node.http.JSON.prototype.setCustomHeaders = function (headers, request)
	{
		// body...
	};

	deep.store.node.http.JSON.prototype.setRequestHeaders = function (headers, request)
	{
		for(var i in deep.globalHeaders)
			headers[i] = deep.globalHeaders[i];

		// toDO : add custom headers as Referent, userId, impersonateId, ...
	};

	deep.store.node.http.JSON.prototype.get = deep.store.node.http.JSON.prototype.query = function (id, options)
	{
		//console.log("json.get : ", id);
		if(id == "?" || !id)
			id = "";
		id = this.baseUri + id;

		var noCache = true;
		for (var i = 0; i < this.extensions.length; ++i)
			if(this.extensions[i].test(id))
			{
				noCache = false;
				break;
			}

		//if(!noCache && id !== "" && deep.mediaCache.cache[id])
		///	return deep(deep.mediaCache.cache[id]).store(this);

		var infos = url.parse(id);
		infos.headers = {
			"Accept" : "application/json; charset=utf-8"
		};
		infos.method = "GET";
		this.setRequestHeaders(infos.headers, options.request);

		var self = this;
		return request(infos)
		.done(function(data){
			data = data.body;
			// if(!noCache && (options && options.cache !== false)  || (self.options && self.options.cache !== false))
			// deep.mediaCache.manage(data, id);
			return data;
		})
		.fail(function(error){
			//console.log("deep.store.node.http.JSON.prototype.get error : ",id," - ", error);
			throw deep.errors.Server(error.body||error, error.status||500);
		})
		.done(function (datas) {
			//console.log("json.get : result : ", datas);
			var handler = this;
			return deep(datas).nodes(function (nodes) {
				handler._entries = nodes;
			});
		})
		.done(function (success) {
			//console.log("json.get : "+id+" : result : ", success);
			this.range = deep.Chain.range; // reset range function to default chain behaviour
		});
		// if(!noCache && (options && options.cache !== false)  || (self.options && self.options.cache !== false))
		// deep.mediaCache.manage(d, id);
		//return d;
	};
	deep.store.node.http.JSON.prototype.put = function (object, options)
	{
		console.log("remotejson.put : ", object, options.id);
		options = options || {};
		var id = object.id || options.id;

		if(!id)
			throw deep.errors.PreconditionFailed("deep.store.node.http.JSON.put need id in uri or in object");

		id = this.baseUri + id;
		var self = this;
		var def = deep.Deferred();
		var infos = url.parse(id);
		infos.headers = {
			"Accept" : "application/json; charset=utf-8",
			"Content-Type":"application/json; charset=utf-8;"
		};
		infos.method = "PUT";
		this.setRequestHeaders(infos.headers, options.request);
		return request(infos, object)
		.done(function (success) {
			return success.body;
		})
		.fail(function  (error) {
			console.log("deep.store.node.http.JSON put failed : ", error);
			return deep.errors.Server(error.body||error, error.status||500);
		})
		.fail(function (error) {
			console.log("deep.store.node.http.JSON put failed 2 : ", error);
		})
		.done(function (success) {
			this.range = deep.Chain.range;
		});
	};
	deep.store.node.http.JSON.prototype.post = function (object, options)
	{
		//console.log("remotejsn post: ", object)
		var self = this;
		options = options || {};
		var infos = url.parse(this.baseUri);
		infos.headers = {
			"Accept" : "application/json; charset=utf-8",
			"Content-Type":"application/json; charset=utf-8;"
		};
		infos.method = "POST";
		this.setRequestHeaders(infos.headers, options.request);
		return request(infos, object)
		.done(function (success) {
			//console.log("remotejson success : ", success)
			return success.body;
		})
		.fail(function  (error) {
			return deep.errors.Server(error.body||error, error.status||500);
			//return new Error("deep.store.remotejson.post failed  - details : "+JSON.stringify(error));
		})
		.done(function (success) {
			//console.log("remotejson end chain on post")
			this.range = deep.Chain.range;
		});
	};
	deep.store.node.http.JSON.prototype.del = function (id, options) {
		id = id || "";
		if(!id)
			throw deep.errors.PreconditionFailed("deep.store.node.http.JSON.del need id in uri");

		id = this.baseUri + id;
		var self = this;
		options = options || {};
		var infos = url.parse(id);
		infos.headers = {
			"Accept" : "application/json; charset=utf-8"
			//"Content-Type":"application/json; charset=utf-8;"
		};
		infos.method = "DELETE";
		this.setRequestHeaders(infos.headers, options.request);
		return request(infos)
		.done(function (success) {
			return success.body;
		})
		.fail(function  (error) {
			return deep.errors.Server(error.body||error, error.status||500);
		})
		.done(function (success) {
			this.range = deep.Chain.range;
		});
	};


	deep.store.node.http.JSON.prototype.patch = function (object, options) {
		options = options || {};
		var id = object.id || options.id;
		if(!id)
			throw deep.errors.PreconditionFailed("deep.store.node.http.JSON.patch need id in uri or in object");

		id = this.baseUri + id;
		var self = this;
		var infos = url.parse(id);
		infos.headers = {
			"Accept" : "application/json; charset=utf-8",
			"Content-Type":"application/json; charset=utf-8;"
		};
		infos.method = "PATCH";
		this.setRequestHeaders(infos.headers, options.request);
		return request(infos, object)
		.done(function (success) {
			return success.body;
		})
		.fail(function  (error) {
			return deep.errors.Server(error.body||error, error.status||500);
		})
		.done(function (success) {
			this.range = deep.Chain.range;
		});
	};
	/*
	deep.store.node.http.JSON.prototype.bulk = function (arr, uri, options) {
		var self = this;
		var def = deep.Deferred();
		$.ajax({
			beforeSend :function(req) {
				writeJQueryDefaultHeaders(req);
				req.setRequestHeader("Accept", "application/json; charset=utf-8;");
			},
			type:"POST",
			url:uri,
			dataType:"message/json; charset=utf-8;",
			contentType:"message/json; charset=utf-8;",
			data:JSON.stringify(arr)
		})
		.done(function (success) {
			def.resolve(success);
		})
		.fail(function  (jqXHR, textStatus, errorThrown)
		{
			if(jqXHR.status < 300)
			{
				var test = $.parseJSON(jqXHR.responseText);
				if(typeof test === 'string')
					test = $.parseJSON(test);
				def.resolve(test);
			}
			else
				def.reject(new Error("deep.store.remotejson.bulk failed : "+uri+" - details : "+JSON.stringify(arguments)));
		});
		return deep(deep.promise(def))
		.store(this)
		.done(function (success) {
			this.range = deep.Chain.range;
		});
	};
*/
	deep.store.node.http.JSON.prototype.rpc = function (method, params, id, options) {
		options = options || {};
		if(!id)
			throw deep.errors.PreconditionFailed("deep.store.node.http.JSON.patch need id in uri or in object");
		var callId = 12;//new Date().valueOf();

		id = this.baseUri + id;
		var self = this;
		var infos = url.parse(id);
		infos.headers = {};
		infos.method = "POST";
		this.setRequestHeaders(infos.headers, options.request);
		// console.log("________________ WILL RPC HEADERS (after set request headers): ", infos.headers);
		deep.utils.up({
			"Accept" : "application/json; charset=utf-8",
			"Content-Type":"application/json-rpc; charset=utf-8;"
		},infos.headers);
		return request(infos, {
				id:callId,
				method:method,
				params:params||[],
				jsonrpc:"2.0"
		})
		.done(function (success) {
			console.log("deep.store.node.http.JSON.rpc call remote success : ",success);
			if(success.error)
				if(success.error instanceof Error)
					return success.error;
				else
					return deep.errors.Internal(sucess.error);
				return success.result;
		})
		.fail(function  (error) {
			console.log("rpc call remote error : ",error);
			if(error.error)
				if(error.error instanceof Error)
					return error.error;
				else
					return errors.Server(error.error);
			return deep.errors.Server(error.body||error, error.status||500);
		})
		.done(function (success) {
			this.range = deep.Chain.range;
		});
	};

	
	deep.store.node.http.JSON.prototype.range = function (arg1, arg2, query, options)
	{
		query = query || "";
		query = this.baseUri + query;
		var self = this;
		var start = arg1, end = arg2;
		var def = deep.Deferred();
		options = options || {};
		var infos = url.parse(query);
		infos.headers = {
			"Accept" : "application/json; charset=utf-8",
			//"Content-Type":"application/json; charset=utf-8;",
			"Range" : "items=" +start+"-"+end
		};
		infos.method = "GET";
		this.setRequestHeaders(infos.headers, options.request);

		function success(data)
		{
			var rangePart = [];
			var rangeResult = {};
			var headers = data.headers["Content-Range"];

			headers = headers.substring(6);
			if(headers)
				rangePart = headers.split('/');

			if(headers && rangePart && rangePart.length > 0)
			{
				rangeResult.range = rangePart[0];
				if(rangeResult.range == "0--1")
				{
					rangeResult.totalCount = 0;
					rangeResult.start = 0;
					rangeResult.end = 0;
				}
				else
				{
					rangeResult.totalCount = parseInt(rangePart[1], 10);
					var spl = rangePart[0].split("-");
					rangeResult.start = parseInt(spl[0], 10);
					rangeResult.end = parseInt(spl[1], 10);
				}
			}
			else
				console.log("ERROR deep.store.node.http.JSON.range : range header missing !! ");
			rangeResult = deep.utils.createRangeObject(rangeResult.start, rangeResult.end, rangeResult.totalCount);
			rangeResult.results = data.body;
			return rangeResult;
		}

		return request(info)
		.done(function (data)
		{
			return success(data) ;
		})
		.fail(function (error)
		{
			return deep.errors.Server(error.body||error, error.status||500);
		})
		.done(function (rangeObject) {
			this._entries = deep(rangeObject.results).nodes();
			return rangeObject;
		})
		.done(function (success) {
			this.range = deep.Chain.range;
		});
	};
	return deep.store.node.http.JSON;
});

