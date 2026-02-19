// Minimal mock for mongoose used in unit tests when mongoose is not installed
class Document {}

module.exports = {
  Model: function() {},
  Document,
  Types: {
    ObjectId: function (id) { return id; },
  },
};
