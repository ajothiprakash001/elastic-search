const elasticSearch = require('./esdoc/esdoc.service.js');
const listener = require('./listener/listener.service.js');
const esindex = require('./esindex/esindex.service.js');
const esalias = require('./esalias/esalias.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(elasticSearch);
  app.configure(listener);
  app.configure(esindex);
  app.configure(esalias);
};
