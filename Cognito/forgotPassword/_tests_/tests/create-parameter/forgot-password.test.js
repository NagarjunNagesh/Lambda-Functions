const forgotPasswordParameter = require('../../../create-parameter/forgot-password');

describe('createParameter', () => {
  const event = {};
  event['body-json'] = {};
  event['body-json'].username = 'notempty';

  test('With Data: Success', () => {
    const parameters = forgotPasswordParameter.createParameter(event);
    const clientId = parameters.ClientId;
    const username = parameters.Username;
    expect(clientId).not.toBeUndefined();
    expect(username).not.toBeUndefined();
  });
});
