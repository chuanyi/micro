/**
 * cfg:
 *   { host: '127.0.0.1',
 *     port: 3306,
 *     user: 'root',
 *     password: '1234',
 *     database: 'test'
 *   }
 * use:
 *   var ret = yield MYSQL.query(sql, args);
 *   var ret = yield MYSQL.pageQuery(sql, args, page, size);
 *   yield MYSQL.insert(sql,args);
 *   yield MYSQL.update(sql,args);
 *   yield MYSQL.delete(sql,args);
 */
var poolModule = require('generic-pool');
var mysql = require('mysql');
module.exports = {
  init: function(cfg) {
    var pool = poolModule.Pool({
      name: 'mysql',
      create: function(callback) {
        var client = mysql.createConnection(cfg);
        client.connect();
        return callback(null, client);
      },
      destroy: function(client) {
        return client.end();
      },
      max: 10,
      idleTimeoutMillis: 30000,
      log: false
    });
    var query = function*(sql, args) {
      if (!args) args = [];
      return new Promise(function (resolve, reject) {
        pool.acquire(function(err, client) {
          if (err) {
            reject(err);
          } else {
           var querys =  client.query(sql, args, function(err, res) {
              pool.release(client);
              if (err && err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
                //console.log('query timeout:'+sql);
              }
              if (err) {
                reject(err);
              }else{
                resolve(res);
              }
            });
          }
        });
      });
    };

    var pageQuery = function*(sql, args, page, size) {
    	var carr = yield query('SELECT COUNT(*) count from ( ' + sql + ') as counttb',args);
    	var total = carr[0].count;
    	var ret = yield query(sql + ' LIMIT ' + (page-1) * size + ',' + size, args);
    	return { total: total, rows: ret };
    };

    var pageQueryByOrder = function*(sql, orderSql, args, page, size) {
    	var carr = yield query('SELECT COUNT(*) count from ( ' + sql + ') as counttb',args);
    	var total = carr[0].count;
    	var ret = yield query(sql + ' ' + orderSql + ' LIMIT ' + (page-1) * size + ',' + size, args);
    	return { total: total, rows: ret };
    };

    return {
       query:query,
       pageQuery:pageQuery,
       pageQueryByOrder:pageQueryByOrder,
       insert:query,
       update:query,
       "delete":query
    };
  }
};
