const logger = require('../../logger.js');
const request_module = require('request-promise');
/* eslint-disable no-unused-vars */
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
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    var req_body = {
      actions: [
        {
          add: {
            index: data.index,
            alias: id,
            filter: data.filter,
            routing: data.routing
          }
        }
      ]
    };
  // console.log('req body: ', req_body);
  
    const url = this.options.elasticIP +"_aliases";
  
    const options = {
      url: url,
      json: true,
      header: {
        'Content-Type': 'application/json'
      },
      body: req_body
    };
  
    return new Promise(function (resolve, reject) {
      request_module.post(options, function (err, res, body) {
        if (!err && res.statusCode < 299) {
          if (body.acknowledged == true) {
            console.log("Alias created successfully");
            resolve({ "status": "success" });
          } else {
            console.log("status code: ", res.statusCode);
            console.log("index creation failed");
            reject({ "status": "error", "message": "alias creation failed. " + res.status });
          }
        } else {
          if (err) {
            console.log("error: ", err);
            reject({ "status": "error", "message": "alias creation failed. " + err });
          }
          console.log("status code: ", res.statusCode);
          reject({ "status": "error", "message": "alias creation failed. " + res.status });
        }
      });
    });
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    var ip = this.options.elasticIP;
    var getURL = ip + "_alias/" + id;
    var getResponse = request_module.get(getURL);
    return getResponse.then(function (data) {
      console.log("Index response " + data);
      data = JSON.parse(data);
      const keys = Object.keys(data);
      var index = keys[0];
      console.log("Index  " + index);
      var req_body = {
        actions: [
          {
            remove: {
              index: index,
              alias: id
            }
          }
        ]
      };
      // console.log('req body: ', req_body);

      const url = ip + "_aliases";
      console.log("alias " + url);
      const options = {
        url: url,
        json: true,
        header: {
          'Content-Type': 'application/json'
        },
        body: req_body
      };

      return new Promise(function (resolve, reject) {
        request_module.post(options, function(err, res, body) {
          if (!err && res.statusCode < 299) {
            if (body.acknowledged == true) {
              console.log("Alias deleted successfully");
              resolve({ "status": "success" });
            } else {
              console.log("status code: ", res.statusCode);
              console.log("index creation failed");
              reject({ "status": "error", "message": "alias deleted failed. " + res.status });
            }
          } else {
            if (err) {
              console.log("error: ", err);
              reject({ "status": "error", "message": "alias deleted failed. " + err });
            }
            console.log("status code: ", res.statusCode);
            reject({ "status": "error", "message": "alias deleted failed. " + res.status });
          }
        });
      });
    }, function (err) {
      logger.error('Failed to get index for the alias id : ' + id, err);
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
