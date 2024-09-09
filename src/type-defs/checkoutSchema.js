const { gql } = require('apollo-server-express');

const checkoutTypeDefs = gql`
    type Checkout {
        success: Boolean!
        message: String!
        orderId: ID
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
    }

    type Mutation {
        checkout(input: CheckoutInput!): Checkout!
    }
`;

module.exports = checkoutTypeDefs;
