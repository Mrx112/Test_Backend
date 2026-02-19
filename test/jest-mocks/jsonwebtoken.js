// Minimal jsonwebtoken mock for tests
module.exports = {
  sign: (payload, secret, opts) => 'mocked-jwt-token',
  verify: (token, secret) => ({ sub: '1', email: 'a@b.com', username: 'john' }),
  decode: (token) => ({ sub: '1', email: 'a@b.com', username: 'john' }),
};
