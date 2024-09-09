const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    login(email: String!, password: String!): AuthPayload!
  }

  type Mutation {
    signUp(name: String!, email: String!, password: String!): AuthPayload!
  }
`;

module.exports = typeDefs;
