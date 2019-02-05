export default {
  Query: {
    hello: () => `Hello World!`,
    authHello: (_, __, { req }) => {
      if (req.session.userId) {
        return `Cookie found! Your id is: ${req.session.userId}`;
      } else {
        return 'Could not find cookie :(';
      }
    }
  },
  Mutation: {
    register: async (_, args, { req }) => {
      req.session.userId = 1;
      return true;
    }
  }
};
