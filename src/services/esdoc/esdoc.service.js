// Initializes the `schema` service on path `/schema`
const createService = require('./esdoc.class.js');
const hooks = require('./esdoc.hooks');
const logger = require('../../logger.js');

module.exports = function (app) {
  const elasticIP = app.get('elastic-ip');
  const paginate = app.get('paginate');
  // const logger = app.get('logger');

  const options = {
    paginate,
    elasticIP
  };

  // Initialize our service with any options it requires
  app.use('/esdoc', createService(options));
  const service = app.service('esdoc');
  app.use('/elastic-search/search-data/', function(req, res) {
    logger.error("Successfully logged info");
    service.getSearchData(req.body, elasticIP).then(function(data) {
      res.send(data);
    }, function (err) {
      res.send(err);
    });
  });
  service.hooks(hooks);

  // Get our initialized service so that we can register hooks
  
};
