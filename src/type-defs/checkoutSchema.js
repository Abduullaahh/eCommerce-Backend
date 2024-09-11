const { gql } = require('apollo-server-express');

const checkoutTypeDefs = gql`
  type Checkout {
    success: Boolean!
    message: String!
    orderId: ID
    transactionId: String
  }

  input CartItem {
    productId: ID!
    name: String!
    price: Float!
    quantity: Int!
    subtotal: Float!
  }

  input CheckoutInput {
    userId: ID!
    cart: [CartItem!]!
    grandTotal: Float!
    paymentToken: String!
  }

  type CheckoutResult {
    success: Boolean!
    message: String!
    orderId: ID
    transactionId: String
  }

  type Mutation {
    checkout(input: CheckoutInput!): CheckoutResult!
  }
`;

module.exports = checkoutTypeDefs;
