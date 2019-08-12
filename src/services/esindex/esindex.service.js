// Initializes the `esindex` service on path `/esindex`
const createService = require('./esindex.class.js');
const hooks = require('./esindex.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');
  const elasticIP = app.get('elastic-ip'); 

  const options = {
    paginate,
    elasticIP
  };

  // Initialize our service with any options it requires
  app.use('/esindex', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('esindex');

  service.hooks(hooks);
};
