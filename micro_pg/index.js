/**
 * cfg:
 *   { host: '127.0.0.1',
 *     port: 3406,
 *     user: 'root',
 *     password: '123ABCdef*#',
 *     database: 'mgrdb'
 *   }
 * use:
 *   var ret = yield PG.query(sql, args);
 *   var ret = yield PG.pageQuery(sql, args, page, size);
 *   yield PG.insert(sql,args);
 *   yield PG.update(sql,args);
 *   yield PG.delete(sql,args);
 */
const { Pool, Client } = require('pg');

module.exports = {
  init: function (cfg) {
    var connectionString = 'postgresql://' + cfg.user + ':' + cfg.password + '@' + cfg.host + ':' + cfg.port + '/' + cfg.database;
    var pool = new Pool({
      connectionString: connectionString,
    });
    var query = function* (sql, args) {
      //console.log(sql);
      if (!args) args = [];
      return new Promise(function (resolve, reject) {
        pool.connect((err, client, done) => {
          if (err) {
            reject(err);
          }
          //replace '?' in sql text
          var i = 0;
          while (sql.indexOf('?') > 0) {
            sql = sql.replace(/\?/, '\$' + ++i);
          }
          const queryobj = {
            text: sql,
            values: args
          }
          client.query(queryobj, (err, res) => {
            done()
            if (err) {
              LOG.error('执行报错的SQL：' + sql);
              LOG.error(err);
              reject(err);
            } else {
              resolve(res.rows);
            }
          })
        })
      });
    };

    var pageQuery = function* (sql, args, page, size) {
      var carr = yield query('SELECT COUNT(*) count from ( ' + sql + ') as counttb', args);
      var total = carr[0].count;
      var ret = yield query(sql + ' LIMIT ' + size + ' offset ' + ((page - 1) * size), args);
      return { total: total, rows: ret };
    };

    var pageQueryByOrder = function* (sql, orderSql, args, page, size) {
      var carr = yield query('SELECT COUNT(*) count from ( ' + sql + ') as counttb', args);
      var total = carr[0].count;
      var ret = yield query(sql + ' ' + orderSql + ' LIMIT ' + size + ' offset ' +  ((page - 1) * size), args);
      return { total: total, rows: ret };
    };

    return {
      pool: pool,
      query: query,
      pageQuery: pageQuery,
      pageQueryByOrder: pageQueryByOrder,
      insert: query,
      update: query,
      "delete": query
    };
  }
};
