/**
 * cfg:
 *   { host: '127.0.0.1',
 *     port: 9200,
 *     log_level:'debug' //{error,warning,info,debug,trace}
 *   }
 * use:
 *    for doc https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
 */
var elasticsearch = require('elasticsearch');
module.exports = {
  init: function(cfg) {
    var client = new elasticsearch.Client({
      host: cfg.host + ':' + cfg.port,
      log: (cfg.log_level || 'debug')
    });
    return client;
  }
};
