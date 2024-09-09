// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const cartSchema = new Schema({
//   productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
//   quantity: { type: Number, required: true },
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
// });

// const Cart = mongoose.model('Cart', cartSchema);
// module.exports = Cart;
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, default: Date.now }, // Add timestamp field
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;