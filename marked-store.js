var deep = require("deep/deep");
var fs = require("fs");
var marked = require("marked");

//__________________________________________________
deep.protocoles.marked = new deep.Store();
deep.protocoles.marked.get = function (path, options) {
	options = options || {};
	if(options.cache !== false && deep.mediaCache.cache["marked::"+path])
		return deep(deep.mediaCache.cache["marked::"+path])
		.store(this);
	var def = deep.Deferred();
	fs.readFile(path, function(err, datas){
		if(err)
		{
			delete deep.mediaCache.cache["marked::"+path];
			return def.reject(err);
		}	
		if(datas instanceof Buffer)
			datas = datas.toString("utf8");
		datas = marked(datas);
		deep.mediaCache.manage(datas, "marked::"+path);
		def.resolve(datas);
	});
	var d = deep(def.promise())
	.store(this);
	if(options.cache !== false || (self.options && self.options.cache !== false))
		deep.mediaCache.manage(d, "marked::"+path);
	return d;
};

