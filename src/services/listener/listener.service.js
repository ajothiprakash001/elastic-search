// Initializes the `listener` service on path `/listener`
const createService = require('./listener.class.js');
const hooks = require('./listener.hooks');
var amqp = require('amqplib/callback_api');

module.exports = function (app) {

  const paginate = app.get('paginate');
  const queueName = app.get("queue");

  const options = {
    paginate
  };
  const elasticSearch = app.service('esdoc');

  amqp.connect('amqp://localhost:5672', function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      console.log(" [*] Waiting for messages inside %s. To exit press CTRL+C", queueName);

      channel.consume(queueName, function (msg) {
        console.log(" [x] Received %s", msg.content);
        elasticSearch.processData(msg.content);
      }, {
          noAck: true
        });
    });
  });
};
