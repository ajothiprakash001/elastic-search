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

    const req_body = {
      settings: data.settings,
      mappings: data.mappings
    };
  // console.log('req body: ', req_body);
  
    const url = this.options.elasticIP + id;
  
    const options = {
      url: url,
      json: true,
      header: {
        'Content-Type': 'application/json'
      },
      body: req_body
    };
  
    return new Promise(function (resolve, reject) {
      request_module.put(options, function (err, res, body) {
        if (!err && res.statusCode < 299) {
          console.log("Creation response", body);
          if (body.acknowledged == true) {
            logger.info("index created successfully");
            resolve({ "status": "success" });
          } else {
            logger.error("status code: ", res.statusCode);
            logger.error("index creation failed");
            reject({ "status": "error", "message": "index creation failed. " + res.status });
          }
        } else {
          if (err) {
            console.log("error: ", err);
            reject({ "status": "error", "message": "index creation failed. " + err });
          }
          console.log("status code: ", res.statusCode);
          reject({ "status": "error", "message": "index creation failed. " + res.status });
        }
      });
    });
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    const url = this.options.elasticIP + id;
  
    const options = {
      url: url,
    };
  
    return new Promise(function (resolve, reject) {
      request_module.delete(options, function(err, res, body) {
        if (!err && res.statusCode < 299) {
          body = JSON.parse(body);
          console.log("Deleted response body" + body);
          if (body.acknowledged === true) {
            console.log("index deleted successfully");
            resolve({ "status": "success" });
          } else {
            console.log("status code: ", res.statusCode);
            console.log("index deletion failed");
            reject({ "status": "error", "message": "index deletion failed. " + res.status });
          }
        } else {
          if (err) {
            console.log("error: ", err);
            reject({ "status": "error", "message": "index deletion failed. " + err });
          }
          console.log("status code: ", res.statusCode);
          reject({ "status": "error", "message": "index deletion failed. " + res.status });
        }
      });
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
