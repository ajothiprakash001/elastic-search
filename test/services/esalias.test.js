const assert = require('assert');
const app = require('../../src/app');

describe('\'esalias\' service', () => {
  it('registered the service', () => {
    const service = app.service('esalias');

    assert.ok(service, 'Registered the service');
  });
});
