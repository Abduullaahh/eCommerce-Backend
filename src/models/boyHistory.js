const mongoose = require('mongoose');

const deliveryHistorySchema = new mongoose.Schema({
  deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryBoy', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  orderNumber: { type: String, required: true },
  deliveryDate: { type: Date, default: Date.now },
  orderTotal: { type: Number, required: true },
}, { timestamps: true });

const DeliveryHistory = mongoose.model('DeliveryHistory', deliveryHistorySchema);

module.exports = DeliveryHistory;