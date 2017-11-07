/**
 * cfg:
 *  {}
 * use:
 *
 *  TOOL.isEmpty(v);
 *
 *  var id = TOOL.uuid();
 *
 *  var now = TOOL.nowDate();
 *  var now = TOOL.nowTime();
 *  var now = TOOL.nowDateTime();
 *  var date = TOOL.getDateTime(timeVal);
 *  var date = TOOL.strToDateTime('2012-12-33 12:33:33');
 *  TOOL.moment  // see http://momentjs.com/docs/
 * 
 *  var ret = TOOL.toStr(v, 'default');
 *  var ret = TOOL.toInt(v, 0);
 *
 *  TOOL.co(function*(){});
 *
 *  TOOL.rmdir.sync(tempP);   // recursive remove or make dir
 *  TOOL.mkdir.sync(p);
 *
 */
var co = require('co'),
    uuid = require('node-uuid'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp'),
    moment = require('moment');

module.exports = {
	init: function(cfg) {
		return {
			isEmpty: function(v) {
				if (typeof(v) == 'undefined' || v == 'undefined' || v == null || v == 'null' || v == '') {
					return true;
				}
				return false;
			},
			uuid: function() {
				return uuid.v1().toString();
			},
			co: co,
			moment: moment,
			rmdir: function(path) {
				rimraf.sync(path);
			},
			mkdir: function(path) {
				mkdirp.sync(path);
			},
			nowDateTime: function() {
				return moment().format('YYYY-MM-DD HH:mm:ss');
			},
			getDateTime: function(timeVal) {
				return moment(new Date(timeVal)).format('YYYY-MM-DD HH:mm:ss');
			},
			nowDate: function() {
				return moment().format('YYYY-MM-DD');
			},
			nowTime: function() {
				return moment().format('HH:mm:ss');
			},
			strToDateTime: function(str) {
                return moment(str, 'YYYY-MM-DD HH:mm:ss').toDate();
			},
			toStr: function(v, def) {
				if (typeof (v) == 'undefined' || v == '' || v == null) {
					return def;
				}
				return v.toString();
			},
			toInt: function(v, def) {
				if (typeof (v) == 'undefined' || v == '') {
					return def;
				}
				return parseInt(v);
			},
			sleep: function*(tick) {
			  return new Promise(function(resolve, reject){
			    setTimeout(function(){
			      resolve(null);
			    }, tick);
			  });
			}
		}
	}
};
