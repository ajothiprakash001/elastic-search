/* eslint-disable no-unused-vars */
const request_module = require('request-promise');

// function getData (url) {
//   console.log(url);
//   var options = {
//     url: url,
//     json: true,
//     method: 'POST'
//   }
//   return new Promise(function (resolve, reject) {
//     request.get(options, function(err, res, body) {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(body);
//       }
//     });
//   });
// }

// function createEntity (url) {
//   console.log(url);
//   var options = {
//     url: url,
//     json: true,
//     method: 'POST',
//     body: {
      
//     }
//   }
//   return new Promise(function (resolve, reject) {
//     request.post(options, function(err, res, body) {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(body);
//       }
//     });
//   });
// }

function createOrUpdateDoc(data, ip) {
  var req_body = data.document;
// console.log('req body: ', req_body);

  const url = ip + data.index + '/_doc/' + data.id ;
  const qs = {
    routing: data.tenant_id,
    refresh: true
  }
  const options = {
    url: url,
    qs: qs,
    json: true,
    header: {
      'Content-Type': 'application/json'
    },
    body: req_body
  };
  console.log("document create options " + options);
  return new Promise(function (resolve, reject) {
    request_module.put(options, function (err, res, body) {
      if (!err && res.statusCode < 299) {
        if (body.acknowledged == true) {
          console.log("Document created successfully");
          resolve({ "status": "success" });
        } else {
          console.log("status code: ", res.statusCode);
          console.log("Document creation failed");
          reject({ "status": "error", "message": "Document creation failed. " + res.status });
        }
      } else {
        if (err) {
          console.log("error: ", err);
          reject({ "status": "error", "message": "Document creation failed. " + err });
        }
        console.log("status code: ", res.statusCode);
        reject({ "status": "error", "message": "Document creation failed. " + res.status });
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

  getSearchData(data, api) {
    console.log('Enter inside method' + data, api);
    var url = api;
    url += data.index + '/';
    url += '_search?q=';
    url += data.field;
    url += ':*';
    url += data.searchString;
    url += '*';
    // var promise = getData(url);
    return getData(url);
  }

  receivedData(data) {
    const entity = JSON.parse(data);
    if (entity.action === 'add') {
      console.log("Entering addition " + data);
      createOrUpdateDoc(data, this.options.elasticIP).then(function (data) {
        console.log("Document Successfully created");
      }, function (err) {
        console.log("Error creating document");
      });
    } else if (entity.action === 'remove') {
      removeDoc(data);
    }
  }

  

  removeDoc(data) {
    const url = this.options.elasticIP + data.index + '/_doc/' + id;
  
    const options = {
      url: url,
    };
  
    return new Promise(function (resolve, reject) {
      request_module.delete(options, function(err, res, body) {
        if (!err && res.statusCode < 299) {
          body = JSON.parse(body);
          console.log("Deleted response body" + body);
          if (body.acknowledged === true) {
            console.log("Document deleted successfully");
            resolve({ "status": "success" });
          } else {
            console.log("status code: ", res.statusCode);
            console.log("Document deletion failed");
            reject({ "status": "error", "message": "Document deletion failed. " + res.status });
          }
        } else {
          if (err) {
            console.log("error: ", err);
            reject({ "status": "error", "message": "Document deletion failed. " + err });
          }
          console.log("status code: ", res.statusCode);
          reject({ "status": "error", "message": "Document deletion failed. " + res.status });
        }
      });
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
