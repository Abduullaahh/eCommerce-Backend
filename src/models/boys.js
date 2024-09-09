const mongoose = require('mongoose');
const Order = require('./checkout'); // Make sure to import the Order model

const deliveryBoySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['AVAILABLE', 'BUSY'], default: 'AVAILABLE' }
}, { timestamps: true });

// Pre-remove hook
deliveryBoySchema.pre('remove', async function(next) {
  try {
    // Update all assigned orders
    await Order.updateMany(
      { assignedTo: this._id, delivery: 'ASSIGNED' },
      { $set: { assignedTo: null, delivery: 'NOT' } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('DeliveryBoy', deliveryBoySchema);