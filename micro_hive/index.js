/**
* cfg:
*   { host: '127.0.0.1',
*     port: 10000,
*     user: '',
*     password: '',
*     database: 'default'
*   }
* use:
*   var ret = yield HIVE.query(sql, args);
*/
var SqlString = require('sqlstring'),
    base64js = require('base64-js'),
    child_process = require('child_process');

var dili = require('os').type().includes('Windows') ? ';':':',
    paths = [
              '.',
              './hive-jdbc-2.2.0-standalone.jar',
              './commons-codec-1.11.jar',
              './org.json.jar'
            ],
    main = 'HiveJdbcClient',
    jdbcUrl = '',
    user = '',
    password = '';

module.exports = {
  init: function(cfg) {
    jdbcUrl = base64js.fromByteArray(Buffer.from('jdbc:hive2://'+cfg.host+':'+cfg.port+'/'+(cfg.database || 'default'), 'utf8'));
    user = '\"'+(cfg.user || '')+'\"';
    password = '\"'+(cfg.password || '')+'\"';
    return {
      query: function*(sql, args) {
        var sql = base64js.fromByteArray(Buffer.from(SqlString.format(sql, args), 'utf8'));
        return new Promise(function(resolve, reject){
          child_process.exec(['java','-cp','\"'+paths.join(dili)+'\"',main,jdbcUrl,sql,user,password].join(' '), {
            cwd:__dirname
          }, function(err, stdout, stderr){
            if (err) {
              reject(err);
            }else{
              if (stdout.startsWith('Error')) {
                reject(stdout);
              }else{
                resolve(JSON.parse(Buffer.from(base64js.toByteArray(stdout.trim())).toString('utf8')));
              }
            }
          });
        });
      }
    }
  }
}
