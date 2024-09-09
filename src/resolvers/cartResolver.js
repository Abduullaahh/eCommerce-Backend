const Cart = require('../models/cart');
const Product = require('../models/products');
const mongoose = require('mongoose');

const CartResolvers = {
  Query: {
    cart: async (parent, { userId }, context) => {
      try {
        console.log("Fetching cart for user:", userId); // Add logging
        // Remove expired items before fetching the cart
        await Cart.deleteMany({ userId, addedAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) } });
        return await Cart.find({ userId });
      } catch (error) {
        throw new Error("Failed to fetch cart: " + error.message);
      }
    },
  },
  Mutation: {
    addToCart: async (parent, args) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        console.log("Adding to cart:", args); // Add logging
        const existingCartItem = await Cart.findOne({ productId: args.productId, userId: args.userId });
        const product = await Product.findById(args.productId);

        if (!product) {
          throw new Error("Product not found");
        }

        if (product.quantity < args.quantity) {
          throw new Error("Not enough product in stock");
        }

        let cartItem;
        if (existingCartItem) {
          existingCartItem.quantity += args.quantity;
          existingCartItem.addedAt = new Date();
          cartItem = await existingCartItem.save({ session });
        } else {
          const newCartItem = new Cart({
            productId: args.productId,
            quantity: args.quantity,
            userId: args.userId,
            addedAt: new Date(),
          });
          cartItem = await newCartItem.save({ session });
        }

        // Update product quantity
        product.quantity -= args.quantity;
        await product.save({ session });

        await session.commitTransaction();
        return cartItem;
      } catch (error) {
        await session.abortTransaction();
        throw new Error("Failed to add to cart: " + error.message);
      } finally {
        session.endSession();
      }
    },
    removeFromCart: async (parent, args) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        console.log("Removing from cart:", args); // Add logging
        const cartItem = await Cart.findOne({ productId: args.productId, userId: args.userId });
        if (!cartItem) {
          throw new Error("Product not found in cart");
        }

        const product = await Product.findById(args.productId);
        if (!product) {
          throw new Error("Product not found");
        }

        if (cartItem.quantity > 1) {
          cartItem.quantity -= 1;
          await cartItem.save({ session });
        } else {
          await Cart.findOneAndDelete({ productId: args.productId, userId: args.userId }, { session });
        }

        // Update product quantity
        product.quantity += 1;
        await product.save({ session });

        await session.commitTransaction();
        return cartItem.quantity > 1 ? cartItem : null;
      } catch (error) {
        await session.abortTransaction();
        throw new Error("Failed to remove from cart: " + error.message);
      } finally {
        session.endSession();
      }
    },
  },
};

module.exports = CartResolvers;
