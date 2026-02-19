// Minimal mock for @nestjs/mongoose used in unit tests when dependencies are not installed
const Prop = () => () => undefined;
const Schema = () => (target) => target;
const SchemaFactory = {
  createForClass: (cls) => {
    // Return a lightweight schema-like object with methods used in project (index, virtual)
    return {
      _class: cls,
      index: () => undefined,
      virtual: () => ({ get: () => undefined, set: () => undefined }),
    };
  },
};

module.exports = {
  InjectModel: () => () => undefined,
  MongooseModule: {
    forFeature: () => ({}),
  },
  getModelToken: (name) => `${name}Model`,
  Prop,
  Schema,
  SchemaFactory,
};
