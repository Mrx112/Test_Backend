// Lightweight bcryptjs mock for tests
module.exports = {
  hash: async (s, salt) => 'hashed',
  compare: async (plain, hashed) => false,
};
