const elasticSearch = require('./elastic-search/elastic-search.service.js');
const listener = require('./listener/listener.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(elasticSearch);
  app.configure(listener);
};
