var fs = require('fs'),
    ini = require('ini'),
    cfgs = [], plugins = [];
/**
 * var app = require('micro_app')('xxx.ini');
 * app.use({plugin:{k:v,...}});               - npm plugins
 * app.use({name:'',init(cfg){}}, {k:v,...}); - anonymous plugin
 * app.run();
 */
module.exports = function(cfg_file) {
   global.CFG = ini.parse(fs.readFileSync(cfg_file, 'utf8'));
   return {
     use(plugin, cfg) {
       if (cfg) {
         cfgs.push(cfg);
         plugins.push(plugin);
       }else{
         Object.keys(plugin).forEach((p)=>{
           cfgs.push(plugin[p]);
           var pl = require('micro_'+p.toLowerCase());
           pl.name = p.toUpperCase();
           plugins.push(pl);
         });
       }
     },
     run() {
       // merge config : code first, ini second
       for (var i = 0; i < plugins.length; i++) {
         Object.keys(CFG).forEach((k)=>{
           if (k.toUpperCase().startsWith(plugins[i].name+'.')) {
             var k2 = k.split('.')[1];
             if (!cfgs[i][k2]) {
               cfgs[i][k2] = CFG[k];
             }
           }
         });
         // init run
         global[plugins[i].name] = plugins[i].init(cfgs[i]);
       }
     }
   };
}
