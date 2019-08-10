// Initializes the `listener` service on path `/listener`
const createService = require('./listener.class.js');
const hooks = require('./listener.hooks');
var amqp = require('amqplib/callback_api');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/listener', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('listener');

  service.hooks(hooks);
//   amqp.connect('amqp://localhost:5672', function(error0, connection) {
//     if (error0) {
//         throw error0;
//     }
//     connection.createChannel(function(error1, channel) {
//         if (error1) {
//             throw error1;
//         }

//         var queue = 'hello';

//         // channel.assertQueue(queue, {
//         //     durable: false
//         // });

//         console.log(" [*] Waiting for messages inside %s. To exit press CTRL+C", queue);

//         channel.consume(queue, function(msg) {
//             console.log(" [x] Received %s", msg.content.toString());
//         }, {
//             noAck: true
//         });
//     });
// });
};
