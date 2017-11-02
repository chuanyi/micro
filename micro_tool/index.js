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
 *  var date = TOOL.getDateTime(timeVal)
 *  var ret = TOOL.toStr(v, 'default');
 *  var ret = TOOL.toInt(v, 0);
 *
 *  TOOL.co(function*(){});
 *
 *  TOOL.rmdir.sync(tempP);   // recursive remove or make dir
 *  TOOL.mkdir.sync(p);
 */
var uuid = require('node-uuid');
var co = require('co');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

function tov(i) {
	if (i < 10) return '0' + i;
	return '' + i;
}

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
			rmdir: function(path) {
				rimraf.sync(path);
			},
			mkdir: function(path) {
				mkdirp.sync(path);
			},
			nowDateTime: function() {
				var d, s;
				d = new Date();
				s = '' + d.getFullYear();
				s += '-' + tov(d.getMonth() + 1);
				s += '-' + tov(d.getDate());
				s += " " + tov(d.getHours());
				s += ":" + tov(d.getMinutes());
				s += ":" + tov(d.getSeconds());
				return s;
			},
			getDateTime: function(timeVal) {
				var d, s;
				d = new Date(timeVal);
				s = '' + d.getFullYear();
				s += '-' + tov(d.getMonth() + 1);
				s += '-' + tov(d.getDate());
				s += " " + tov(d.getHours());
				s += ":" + tov(d.getMinutes());
				s += ":" + tov(d.getSeconds());
				return s;
			},
			nowDate: function() {
				var d, s;
				d = new Date();
				s = '' + d.getFullYear();
				s += '-' + tov(d.getMonth() + 1);
				s += '-' + tov(d.getDate());
				return s;
			},
			nowTime: function() {
				var d, s;
				d = new Date();
				s = tov(d.getHours());
				s += ":" + tov(d.getMinutes());
				s += ":" + tov(d.getSeconds());
				return s;
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
			}
		}
	}
};
