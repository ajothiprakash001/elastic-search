/* eslint-disable no-unused-vars */
const request_module = require('request-promise');
const logger = require('../../logger.js');
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {
    var info = {
      type : 'text',
      copy_to: 'search_field'
    }
    const req_body = {
      properties: {}
    };
    data.fields.forEach(element => {
      req_body.properties[element] = info;
    });
    
  // console.log('req body: ', req_body);
  
    const url = this.options.elasticIP + id + '/_mapping';
  
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
            logger.info("index mapping updated successfully");
            resolve({ "status": "success" });
          } else {
            logger.error("status code: ", res.statusCode);
            logger.error("index mapping updated failed");
            reject({ "status": "error", "message": "index creation failed. " + res.status });
          }
        } else {
          if (err) {
            console.log("error: ", err);
            reject({ "status": "error", "message": "index mapping updated failed. " + err });
          }
          console.log("status code: ", res.statusCode);
          reject({ "status": "error", "message": "index mapping updated failed. " + res.status });
        }
      });
    });
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
