const mongoose = require('mongoose');
const Order = require('../models/checkout');
const Cart = require('../models/cart');

const checkoutResolver = {
  Mutation: {
    checkout: async (_, { input }) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const { userId, cart, grandTotal } = input;
        
        const newOrder = new Order({
          userId,
          items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal
          })),
          total: grandTotal,
          status: 'PAID'
        });

        // Save the new order
        await newOrder.save({ session });

        // Remove all cart items for the user
        await Cart.deleteMany({ userId }, { session });

        await session.commitTransaction();
        return {
          success: true,
          message: 'Checkout successful',
          orderId: newOrder._id.toString()
        };
      } catch (error) {
        await session.abortTransaction();
        console.error('Checkout error:', error);
        return {
          success: false,
          message: 'Checkout failed: ' + error.message,
          orderId: null
        };
      } finally {
        session.endSession();
      }
    }
  }
};

module.exports = checkoutResolver;
