// Initializes the `esmapping` service on path `/esmapping`
const createService = require('./esmapping.class.js');
const hooks = require('./esmapping.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');
  const elasticIP = app.get('elastic-ip'); 

  const options = {
    paginate,
    elasticIP
  };

  // Initialize our service with any options it requires
  app.use('/esmapping', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('esmapping');

  service.hooks(hooks);
};
