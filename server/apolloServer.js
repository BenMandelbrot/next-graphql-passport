import { ApolloServer } from "apollo-server-express";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";

const typesArray = fileLoader(path.join(__dirname, "./types"));
const resolversArray = fileLoader(path.join(__dirname, "./resolvers"));

const SERVER = new ApolloServer({
  typeDefs: mergeTypes(typesArray, { all: true }),
  resolvers: mergeResolvers(resolversArray),
  introspection: true,
  subscriptions: true,
  playground: {
    endpoint: `/graphql`,
    settings: {
      "editor.theme": "light",
      "request.credentials": "include"
    }
  },
  context: ({ req }) => {
    return {
      req
    };
  }
});

export default SERVER;
