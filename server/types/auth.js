import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    hello: String!
    authHello: String!
  }

  type Mutation {
    register(username: String, password: String): Boolean!
  }
`;
