// Initializes the `esalias` service on path `/esalias`
const createService = require('./esalias.class.js');
const hooks = require('./esalias.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');
  const elasticIP = app.get('elastic-ip'); 
  const options = {
    paginate,
    elasticIP
  };

  // Initialize our service with any options it requires
  app.use('/esalias', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('esalias');

  service.hooks(hooks);
};
