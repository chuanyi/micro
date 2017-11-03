/**
 * cfg:
 *  {app:'myapp', file:'xxx.log', level:'TRACE'/'DEBUG'/'INFO'/'WARN'/'ERROR'}
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
    var logcfg = {
      appenders:{
        out:{ type: 'console' },
        fout:{
          type: 'file',
          filename: cfg.file,
          maxLogSize:10240000
        }
      },
      categories:{
         default:{appenders:['out','fout'], level:cfg.level}
      }
    };
    logcfg.categories[cfg.app] = {appenders:['out','fout'], level:cfg.level};
    log4js.configure(logcfg);
    return log4js.getLogger(cfg.app);
  }
};
