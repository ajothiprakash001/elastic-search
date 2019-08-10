// Initializes the `schema` service on path `/schema`
const createService = require('./elastic-search.class.js');
const hooks = require('./elastic-search.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/elastic-search', createService(options));
  const service = app.service('elastic-search');
  app.use('/elastic-search/create-index', function (req, res) {

  });
  app.use('/elastic-search/search-data/', function(req, res) {
    service.getSearchData(req.body).then(function(data) {
      res.send(data);
    }, function (err) {
      res.send(err);
    });
  });
  service.hooks(hooks);

  // Get our initialized service so that we can register hooks
  
};
