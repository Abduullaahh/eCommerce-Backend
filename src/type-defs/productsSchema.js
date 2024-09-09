const { gql } = require('apollo-server-express');

const producttypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    price: Int!
    quantity: Int!
    category: Category
  }

  type Category {
    id: ID!
    name: String!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    addProduct(name: String!, description: String, price: Int!, quantity: Int!, categoryId: ID): Product
    updateProduct(id: ID!, name: String, description: String, price: Int, quantity: Int, categoryId: ID): Product
    deleteProduct(id: ID!): Product
  }
`;

module.exports = producttypeDefs;
