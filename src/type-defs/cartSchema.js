const { gql } = require('apollo-server-express');

const carttypeDefs = gql`
  type Cart {
    productId: ID!
    quantity: Int!
    userId: ID!
  }

  type Query {
    cart(userId: ID!): [Cart]
  }

  type Mutation {
    addToCart(productId: ID!, quantity: Int!, userId: ID!): Cart
    removeFromCart(productId: ID!, quantity: Int!, userId: ID!): Cart
  }
`;

module.exports = carttypeDefs;
