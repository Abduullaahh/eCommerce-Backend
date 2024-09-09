const mongoose = require('mongoose');
const DeliveryHistory = require('./boyHistory');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PAID'],
    default: 'PAID'
  },
  delivery: {
    type: String,
    enum: ['NOT', 'ASSIGNED', 'YES'],
    default: 'NOT'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryBoy' }
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  // Check if this is an existing order (not a new one) and if the delivery status is changing to 'YES'
  if (!this.isNew && this.isModified('delivery') && this.delivery === 'YES') {
    try {
      await DeliveryHistory.create({
        deliveryBoyId: this.assignedTo,
        orderId: this._id,
        orderNumber: this.orderNumber || `ORD-${this._id.toString().slice(-6)}`,
        orderTotal: this.total
      });
    } catch (error) {
      console.error('Error creating delivery history:', error);
    }
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;