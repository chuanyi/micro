# Micro

A microservice nodejs app skeleton, easy to use and extend.

## Introduction

When starting your any node project, you need to read config files, write running logs, abstract common-use utilities, find and integret thirdparty middlewares(koa web, mysql, kafka, redis, mongodb, etc. ).  But what you really need to do is writing your business logic!

So we started this project called **Micro** which includes a simple plugable framework and some popular plugins(tool, log, mysql, postgres, elasticsearch, nedb, hive, kafka, ...).  Using Micro, you just focus on your logic code.

## Usage

### Install

> npm install micro_app

### Your first app

Write your config file - myapp.ini

```ini
id=myapp
name=My first app
myapp.param1=hello
myapp.param1_desc=Param 1
```

Write your app file - app.js

```javascript
var app = require('micro-app')(__dirname+'/myapp.ini');
app.use({
  name:'MYPLUGIN',
  init(cfg){
    console.log(CFG.id, CFG.name, CFG.get('param1'), cfg.param2);  // your code here
  }
},{param2:'world'});
app.run();
```

**Plugin**: Any plugin is a javascript object with a name and init function.

```javascript
{
  name:'PLUGINNAME',
  init:function(cfg) { // cfg is plugin special 
    return {
      method1:function(){}
    }
  }
}
```

After app.use(), plugin will accessable in global environment:  PLUGINNAME.method1().

**Config**: Configurations(in ini file) can be access using global object `CFG`.

```javascript
CFG.id
CFG['id']
CFG.get('id')
CFG['myapp.param1']
CFG.get('param1')  // equals CFG.get('myapp.param1') as id=myapp
```

*NOTE: plugins configurations can write in ini, only name with format:  `pluginname.param = xxx` , when init is called, code configuration has higher priority than file configuration.*

## Plugins

### TOOL

> npm install micro_tool

```javascript
/* -- usage -- */

// null check & conv
TOOL.isEmpty(v);
var ret = TOOL.toStr(v, 'default');
var ret = TOOL.toInt(v, 0);

// uuid
var id = TOOL.uuid();

// date & time
var now = TOOL.nowDate();
var now = TOOL.nowTime();
var now = TOOL.nowDateTime();
var date = TOOL.getDateTime(timeVal);
var date = TOOL.strToDateTime('2012-12-33 12:33:33');
TOOL.moment  // see http://momentjs.com/docs/

// co & sleep
TOOL.co(function*(){});
yield TOOL.sleep(microseconds);

// recursive remove or make dir sync.
TOOL.rmdir(path);   
TOOL.mkdir(path);
```

### LOG

> npm install micro_log

```javascript
/* -- config -- */
// {app:'myapp', file:'xxx.log', level:'TRACE'} // 'TRACE'/'DEBUG'/'INFO'/'WARN'/'ERROR'

/* -- usage -- */
LOG.trace('hi');
LOG.debug('hi');
LOG.info('hi');
LOG.warn('hi');
LOG.error('hi');
```

### WEB

> npm install micro_web

```javascript
/* -- config -- */
{
  port: 16001,                      // listen port
  view_path: __dirname + '/views',  // optional
  temp_path: __dirname + '/temp',   // optional
  statics: [                        // optional
    __dirname + '/public',
    __dirname + '/data/files',      // like download
  ]
}

/* -- depends -- */
// TOOL

/* -- usage -- */

// Router handler
WEB.get('/route', function*(){
  console.log(this.query.xxx);          // query params
  console.log(this.request.body);       // json body request
  var parts = WEB.parse(this);          // file upload
  var part;
  var result = [];
  while (part = yield parts) {
    if (typeof (part.pipe) != 'undefined') {
      var dataF = path + '/' + part.filename;
      if (part.filename != '') {
        yield WEB.saveTo(part, dataF);
        var fieldname = part.filename;
        var obj = {name:part.filename,msg:"upload success."}
        result.push(obj);
      }
    }
  }

  this.body = "hi";                       // render plain text
  this.body = {ok:true, msg:'success'};   // render json
  yield this.render('xxx');               // render html
});
WEB.post('/api', function*(){});

// template
var ret = WEB.render_str('ejs_template_string', {obj:xxx});
var ret = WEB.render_file('ejs_template_file', {obj:xxx});

// formdata & fetch
var form = new WEB.FormData();
form.append('fieldname', fs.createReadStream('xxxx.xxx'));
form.append('filedname', 'xxx');
WEB.fetch(url, {method:'POST', body: form}).then(function(res){
  return res.json();
}).then(function(json){
  resolve(json);
}).catch(function(error){
  resolve({ok:false, msg:'network failure'});
});
```

### MYSQL

> npm install micro_mysql

```javascript
/* -- config -- */
{ 
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'test'
}

/* -- usage -- */
var ret = yield MYSQL.query(sql, args);
var ret = yield MYSQL.pageQuery(sql, args, page, size);
yield MYSQL.insert(sql,args);
yield MYSQL.update(sql,args);
yield MYSQL.delete(sql,args);
```

### POSTGRES

> npm install micro_pg

```javascript
/* -- config -- */
{ 
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: '',
  database: 'test'
}

/* -- usage -- */
var ret = yield PG.query(sql, args);
var ret = yield PG.pageQuery(sql, args, page, size);
yield PG.insert(sql,args);
yield PG.update(sql,args);
yield PG.delete(sql,args);
```

### NEDB

> npm install micro_nedb

```javascript
// Embedded persistent or in memory database for Node.js

/* -- config -- */
{file:'xxx.db'}

/* -- usage -- */
//see https://github.com/louischatriot/nedb
NEDB.insert({});
NEDB.find({cond}, function(err, docs){});

// multy db files:
var db2 = new NEDB.Datastore({filename: 'xxx', autoload: true})
```

### KAFKA

> npm install micro_kafka

```javascript
/* -- config -- */
{
  host: '127.0.0.1',
  port: 9092
}

/* -- usage -- */
// see: https://github.com/SOHU-Co/kafka-node
var recv = KAFKA.consumer('topic', {options});
recv.on('message', function(msg){
  console.log(msg);
});
var prod = KAFKA.producer({options});
prod.send([{topic:'xxx', messages:['xxx','xxx']}], function(err){});
```

### HIVE

> npm install micro_hive

```javascript
/* -- config -- */
{ host: '127.0.0.1',
  port: 10000,
  user: '',
  password: '',
  database: 'default'
}

/* -- usage -- */
var ret = yield HIVE.query(sql, args);
```

### ES

> npm install micro_es

```javascript
/* -- config -- */
{ 
  host: '127.0.0.1',
  port: 9200,
  log_level:'debug' // {error,warning,info,debug,trace}
}

/* -- usage -- */
// see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
ES.find({}, function(err, docs){});
```

## Example

**Example 1**: Assume we have an app which receives msg from kafka and post to elastic-search.

```javascript
/**
 * Myapp - trans message from kafka to elastic-search
 * author: xxx
 */
var app = require('micro_app')(__dirname+'./myapp.ini');
// load micro plugins, ES & KAFKA configs are in ini file.
app.use({
  TOOL:{},
  LOG:{
    file:ROOT+'/logs/'+CFG.get('id')+'.log',
    level:CFG.get('log_level')
  },
  ES:{},
  KAFKA:{}   
});
// load my plugin
app.use({
  init:function(cfg){
    var consumer = KAFKA.consumer('topic');
    consumer.on('message', function(msg){
      var logs = JSON.parse(msg.data);
      var body = [];
      for (var i = 0; i<logs.length; i++) {
        body.push({index:{_index:'logs', _type:'logs'}});
        body.push(logs[i]);
      }
      ES.bulk({body:body}, function(err, resp){
        if (err) {
          LOG.warn('es bulk fail:'+err);
        }
      });
    });
  }
}, {});
// run app
app.run();
LOG.info('myapp started ok.');
```

And myapp.ini:

```ini
id=myapp
name=kafkaToElasticsearch

es.host=127.0.0.1
es.port=9200

kafka.host=127.0.0.1
kafka.port=9092

myapp.log_level=INFO
```

And package.json:

```json
{
  "name": "myapp",
  "version": "1.0.0",
  "description": "trans message from kafka to elastic-search",
  "main": "myapp.js",
  "dependencies": {
    "micro_app": "",
    "micro_es": "",
    "micro_kafka": "",
    "micro_log": "",
    "micro_tool": ""
  },
  "author": "anonymous",
  "license": ""
}
```

**Example 2**: Let's build a rest api with mysql backend.

```javascript
/**
 * Myapp2 - rest api with mysql backend
 * author: xxx
 */
var app = require('micro_app')(__dirname+'./myapp2.ini');
// load micro plugins, WEB & MYSQL configs are in ini file.
app.use({
  TOOL:{},
  LOG:{
    file:ROOT+'/logs/'+CFG.get('id')+'.log',
    level:CFG.get('log_level')
  },
  WEB:{},
  MYSQL:{}
});
// load my plugin
app.use({
  init:function(cfg){
    WEB.get('/api/v1/blogs', function*(){
      var ret = yield MYSQL.query('select id,author,ctx,sdate from t_blog where cate=?', this.query.cate);
      this.body = {ok:true, data:ret};
    });
  }
}, {});
// run app
app.run();
LOG.info('myapp2 started ok.');
```

And myapp2.ini:

```ini
id=myapp2
name=restapi

web.port=8001

mysql.host=127.0.0.1
mysql.port=3406
mysql.database=test
mysql.user=root
mysql.password=

myapp2.log_level=INFO
```

And package.json:

```json
{
  "name": "myapp2",
  "version": "1.0.0",
  "description": "rest api with mysql backend",
  "main": "myapp2.js",
  "dependencies": {
    "micro_app": "",
    "micro_web": "",
    "micro_mysql": "",
    "micro_log": "",
    "micro_tool": ""
  },
  "author": "anonymous",
  "license": ""
}
```

## License

MIT.