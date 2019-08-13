/* eslint-disable no-unused-vars */
const request_module = require('request-promise');
const logger = require('../../logger.js');

/**
 * Construct ELS specific payload for group by search.
 * @param {*} data 
 */
function constructGroupBySearchBody(data) {
  return {
    "query": {
      "match": {
        "search_field": data.searchStr
      }
    },
    "size": 0,
    "aggs": {
      "group_by": {
        "terms": {
          "field": data.groupBy
        },
        "aggs": {
          "group_by_hits": {
            "top_hits": {
              "size": data.groupSize
            }
          }
        }
      }
    }
  };
}

/**
 * Search data in ELS.
 * @param {*} url 
 * @param {*} inputData 
 */
function searchData(url, inputData) {
  return new Promise(function(resolve,reject){
    request_module.post({
      url: url, 
      json: true,
      body : inputData
    }, function(err, res, body) {
      if (!err && res.statusCode == 200) {
        logger.info("Documents retrieved successfully");
        resolve(body);
      } else {
        logger.error("Document retrieve failed::: " + body.error.reason );
        reject({ "status": "error", "message": "Document retrieve failed. " + body.error.reason });
      }
    });
  });
}

/**
 * Generate system specific response from ELS response.
 * @param {*} data 
 */
function generateResponse(data) {
  var socialNameMap = {};
  var response = {};
  response.total = 0;
  response.data = {};
  if (data.hits.total.value > 0) {
    response.total = data.hits.total.value;
    (data.aggregations.group_by.buckets).forEach(function(data) {
      var socialName = data.key;
      var socialNameData = [];
      (data.group_by_hits.hits.hits).forEach(function(data) {
        socialNameData.push(data._source);
      });
      socialNameMap[socialName] = socialNameData;
    });
    response.data = socialNameMap;
  }
  return response;
}

/**
 * Create or update document.
 * @param {*} data 
 * @param {*} ip 
 */
function createOrUpdateDoc(data, ip) {
  var url = ip + data.index + '/_doc/'
              + data.id + '?routing=' + data.tenant_id + '&refresh=true&pretty';
  return new Promise(function (resolve, reject) {
    request_module.post({
      url: url, 
      json: data.document
    }, function(err, res, body) {
      if (!err && (res.statusCode == 200 || res.statusCode == 201)) {
        logger.info("Document "+ body.result +" successfully ::: ", body);
        resolve({ "status": "success" });
      } else {
        if (err) {
          logger.error("error: ", err);
          reject({ "status": "error", "message": "Document creation failed. " + err });
        }
      }
    });
  });
}

/**
 * Delete a document by id.
 * @param {*} data 
 * @param {*} ip 
 */
function deleteDoc(data, ip) {
  const url = ip + data.index + '/_doc/' + data.id +'?routing='+ data.tenant_id+'&pretty';
  return new Promise(function (resolve, reject) {
    request_module.delete(url, function(err, res, body) {
      body = JSON.parse(body);
      if(body.result == 'deleted'){
        logger.info("Document deleted successfully ::: ");
        resolve({ "status": "success" });
      } else if(body.result == 'not_found'){
        console.log("Id not found ", data.id);
        resolve({ "status": "failure" });
      } else {
        console.log("Error while delete");
        reject({ "status": "failure" });
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

  async  getSearchData(data) {
    if (typeof data == "string") {
      data = JSON.parse(data);
    }
    var searchType = data.countryCode ? data.indexName + '_' + data.countryCode.toUpperCase() : data.indexName;
    var url = this.options.elasticIP + searchType + '/_search?&pretty';
    return generateResponse(await searchData(url, constructGroupBySearchBody(data)));
  }

  processData(data) {
    var entity = JSON.parse(data);
    if (entity.action === 'add') {
      createOrUpdateDoc(entity, this.options.elasticIP).then(function (data) {
        console.log("Document Created/Updated Successfully ::: ", data);
      }, function(err) {
        console.log("Error creating document ::: ", err);
      });
    } else if (entity.action === 'remove') {
      deleteDoc(entity, this.options.elasticIP).then(function (data) {
        console.log("Document deleted Successfully ::: ", data);
      }, function(err) {
        console.log("Error delete document ::: ", err);
      });
    }
  } 
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
