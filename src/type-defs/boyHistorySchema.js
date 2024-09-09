const { gql } = require('apollo-server-express');

const deliveryHistoryTypeDefs = gql`
  type DeliveryHistory {
    id: ID!
    deliveryBoyId: ID!
    orderId: ID!
    orderNumber: String!
    deliveryDate: String!
    orderTotal: Float!
  }

  type DeliveryHistorySummary {
    deliveryBoyId: ID!
    totalDeliveries: Int!
    totalEarnings: Float!
  }

  type Query {
    getDeliveryHistory(deliveryBoyId: ID!): [DeliveryHistory]
    getDeliveryHistorySummary(deliveryBoyId: ID!): DeliveryHistorySummary
  }
`;

module.exports = deliveryHistoryTypeDefs;