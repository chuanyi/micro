/**
 * Embedded persistent or in memory database for Node.js
 * cfg:
 *  {file:'xxx.db'}
 * use:
 *  API is a subset of MongoDB's and it's plenty fast
 *  see https://github.com/louischatriot/nedb
 *  multy db files:
 *  var db2 = new NEDB.Datastore({filename: 'xxx', autoload: true})
 */
var Datastore = require('nedb');
module.exports = {
  init: function(cfg) {
    var db = new Datastore({filename: cfg.file, autoload: true});
    db.Datastore = Datastore;
    return db;
  }
};
