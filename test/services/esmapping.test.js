const assert = require('assert');
const app = require('../../src/app');

describe('\'esmapping\' service', () => {
  it('registered the service', () => {
    const service = app.service('esmapping');

    assert.ok(service, 'Registered the service');
  });
});
