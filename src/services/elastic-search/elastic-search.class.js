/* eslint-disable no-unused-vars */
const request = require('request-promise');

function getData (url) {
  console.log(url);
  var options = {
    url: url,
    json: true,
    method: 'POST'
  }
  return new Promise(function (resolve, reject) {
    request.get(options, function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    return Promise.resolve([]);
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
    return id;
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }

  getUserId (req, res) {
      var data = req.params.email;
      res.send(data);
  }

  getSearchData(data) {
    console.log('Enter inside method' + data.type);
    var url = 'http://192.168.1.197:9200/';
    url += data.index + '/';
    url += data.type + '/';
    url += '_search?q=';
    url += data.field;
    url += ':*';
    url += data.searchString;
    url += '*';
    // var promise = getData(url);
    return getData(url);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
