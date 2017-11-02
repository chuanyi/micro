/**
 * cfg:
 *  {
 *    port: 16001,
 *    view_path: __dirname + '/views',  // optional
 *    temp_path: __dirname + '/temp',   // optional
 *    statics: [                        // optional
 *      __dirname + '/public',
 *      __dirname + '/data/files', // download
 *    ]
 *  }
 * depends:
 *  TOOL
 * use:
 *  WEB.get('/route', function*(){
 *     console.log(this.query.xxx);          // query params
 *     console.log(this.request.body);       // json body request
 *     var parts = WEB.parse(this);           // file upload
 *     var part;
 *     var result = [];
 *     while (part = yield parts) {
 *         if (typeof (part.pipe) != 'undefined') {
 *            var dataF = path + '/' + part.filename;
 *            if (part.filename != '') {
 *               yield WEB.saveTo(part, dataF);
 *               var fieldname = part.filename;
 *               var obj = {name:part.filename,msg:"上传成功"}
 *               result.push(obj);
 *             }
 *         }
 *     }
 *
 *     this.body = "hi";                       // render plain text
 *     this.body = {ok:true, msg:'success'}; // render json
 *     yield this.render('xxx');                   // render html
 *  });
 *  WEB.post('/api', function*(){});
 *
 *  var ret = WEB.render_str('ejs_template_string', {obj:xxx});
 *  var ret = WEB.render_file('ejs_template_file', {obj:xxx});
 *
 *  var form = new WEB.FormData();
 *     form.append('fieldname', fs.createReadStream('xxxx.xxx'));
 *     form.append('filedname', 'xxx');
 *  WEB.fetch(url, {method:'POST', body: form}).then(function(res){
 *     return res.json();
 *  }).then(function(json){
 *     resolve(json);
 *  }).catch(function(error){
 *     resolve({ok:false, msg:'网络请求失败'});
 *  });
 */
var fs = require('fs');
var koa = require('koa')();
var serve = require('koa-static');
var router = require('koa-router')();
var parse = require('co-busboy');
var saveTo = require('save-to');
var koaBody = require('koa-body')();
var bodyParser = require('koa-bodyparser');
var ejs = require('ejs');
var fetch = require('node-fetch');
var FormData = require('form-data');
var qs = require('koa-qs');
var render = require('koa-ejs');
module.exports = {
  init: function(cfg) {
    qs(koa, 'first');
    koa.use(bodyParser({'formLimit':'10mb','jsonLimit':'10mb','textLimit':'10mb'}));
    if (cfg.statics) {
      for (var i = 0; i < cfg.statics.length; i++) {
        koa.use(serve(cfg.statics[i]));
      }
      koa.use(serve(cfg.temp_path));
    }
    if (cfg.view_path) {
      render(koa, { root: cfg.view_path, layout: false, cache: false, debug: false });
    }
    koa.use(router.routes());
    if (cfg.temp_path) {
      TOOL.rmdir(cfg.temp_path);
      TOOL.mkdir(cfg.temp_path);
    }
    koa.listen(parseInt(cfg.port));
    router.parse = parse;
    router.saveTo = saveTo;
    router.render_str = function(str, obj) {
       return ejs.render(str, obj);
    }
    router.render_file = function(file, obj) {
       return ejs.render(fs.readFileSync(file, 'utf8'), obj);
    }
    router.FormData = FormData;
    router.fetch = fetch;
    return router;
  }
};
