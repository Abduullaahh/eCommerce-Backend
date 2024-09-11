const mongoose = require('mongoose');
const Order = require('../models/checkout');
const Cart = require('../models/cart');
const { Client, Environment } = require('square');

const checkoutResolver = {
  Mutation: {
    checkout: async (_, { input }) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const { userId, cart, grandTotal, paymentToken } = input;
        // Square client setup
        const client = new Client({
          accessToken: process.env.SQUARE_ACCESS_TOKEN,
          environment: Environment.Sandbox, // Use Environment.Production for live transactions
        });

        // Step 1: Create Payment with Square
        const paymentResponse = await client.paymentsApi.createPayment({
          sourceId: paymentToken,
          idempotencyKey: new Date().toISOString(),
          amountMoney: {
            amount: Math.round(grandTotal * 100), // Square expects amount in cents
            currency: 'USD',
          },
        });

        if (!paymentResponse.result.payment) {
          // Payment failed, abort the transaction
          throw new Error('Payment failed');
        }

        // Step 2: Create the new order with the payment transaction ID
        const newOrder = new Order({
          userId,
          items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
          total: grandTotal,
          status: 'PAID',
          transactionId: paymentResponse.result.payment.id,
        });

        // Save the order in the same transaction
        await newOrder.save({ session });

        // Step 3: Clear the user's cart
        await Cart.deleteMany({ userId }, { session });

        // Commit the transaction after the order and cart have been updated
        await session.commitTransaction();

        return {
          success: true,
          message: 'Checkout successful',
          orderId: newOrder._id.toString(),
          transactionId: paymentResponse.result.payment.id,
        };
      } catch (error) {
        // Log the error response from Square
        if (error.response) {
          console.error('Square API error response:', error.response);
        }
        // Abort the transaction if any error occurs
        await session.abortTransaction();
        console.error('Checkout error:', error);
        return {
          success: false,
          message: `Checkout failed: ${error.message}`,
          orderId: null,
          transactionId: null,
        };
      } finally {
        session.endSession();
      }
    },
  },
};

module.exports = checkoutResolver;