/**
 * cfg:
 *  {file:'xxx.log', level:'TRACE'/'DEBUG'/'INFO'/'WARN'/'ERROR'}
 * use:
 *  LOG.trace('hi');
 *  LOG.debug('hi');
 *  LOG.info('hi');
 *  LOG.warn('hi');
 *  LOG.error('hi');
 */
var log4js = require('log4js');
module.exports = {
  init: function(cfg) {
    log4js.configure({appenders:[
      { type: 'console' },
      {
        type: 'file',
        filename: cfg.file,
        maxLogSize:10240000
      }
    ]});
    var log = log4js.getLogger();
    log.setLevel(cfg.level);
    return log;
  }
};
