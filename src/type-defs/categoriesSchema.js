const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Category {
    id: ID!
    name: String!
  }

  type Query {
    categories: [Category!]!
  }

  type Mutation {
    addCategory(name: String!): Category!
  }
`;

module.exports = typeDefs;