const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type DeliveryBoy {
    id: ID
    name: String!
    phone: String!
    status: String!
  }

  type Order {
    id: ID!
    orderNumber: String
    total: Float
    status: String
    delivery: String
    createdAt: String
    assignedTo: DeliveryBoy
  }

  type AssignDeliveryResponse {
    success: Boolean!
    message: String
    order: Order
  }

  type DeleteDeliveryBoyResponse {
    success: Boolean!
    message: String
  }

  type Query {
    pendingOrders: [Order!]!
    assignedOrders: [Order!]!
    completedOrders: [Order!]!
    deliveryBoys: [DeliveryBoy!]!
  }

  type Mutation {
    assignDelivery(orderId: ID!, deliveryBoyId: ID): AssignDeliveryResponse!
    addDeliveryBoy(name: String!, phone: String!): DeliveryBoy!
    deleteDeliveryBoy(id: ID!): DeleteDeliveryBoyResponse!
    updateDeliveryStatus(orderId: ID!): UpdateDeliveryStatusResponse!
    cancelAssignment(orderId: ID!): CancelAssignmentResponse!
  }

  type UpdateDeliveryStatusResponse {
    success: Boolean!
    message: String
    order: Order
  }

  type CancelAssignmentResponse {
    success: Boolean!
    message: String
    order: Order
  }
`;

module.exports = typeDefs;