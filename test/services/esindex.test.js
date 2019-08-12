const assert = require('assert');
const app = require('../../src/app');

describe('\'esindex\' service', () => {
  it('registered the service', () => {
    const service = app.service('esindex');

    assert.ok(service, 'Registered the service');
  });
});
