/**
* cfg:
*   {
*     host: '127.0.0.1',
*     port: 10000
*   }
* use:
*   see: https://github.com/SOHU-Co/kafka-node
*   var recv = KAFKA.consumer('topic', {options});
*   recv.on('message', function(msg){
*      console.log(msg);
*   });
*   var prod = KAFKA.producter({options});
*   prod.send([{topic:'xxx', messages:['xxx','xxx']}]);
*/

var kafka = require('kafka-node');
module.exports = {
  init: function(cfg) {
    return {
      consumer: function('topic', opts) {
        return new kafka.Consumer(new kafka.KafkaClient({kafkaHost:CFG.host+':'+CFG.port}), [{topic:topic}], opts || {});
      },
      producer: function(opts) {
        return new kafka.Producer(new kafka.KafkaClient({kafkaHost:CFG.host+':'+CFG.port}), opts || {});
      }
    }
  }
}
