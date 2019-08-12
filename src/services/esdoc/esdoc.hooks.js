

module.exports = {
  before: {
    all: [],
    find: [],
    get: [
      (data) => {
        console.log('Entered get request' + data.id);
        data.id = parseInt(data.id) + 2;
        return data;
      }
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
