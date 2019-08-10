const assert = require('assert');
const app = require('../../src/app');

describe('\'listener\' service', () => {
  it('registered the service', () => {
    const service = app.service('listener');

    assert.ok(service, 'Registered the service');
  });
});
