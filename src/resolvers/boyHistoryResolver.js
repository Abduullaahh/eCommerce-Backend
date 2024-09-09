const mongoose = require('mongoose');
const DeliveryHistory = require('../models/boyHistory');

const deliveryHistoryResolvers = {
  Query: {
    getDeliveryHistory: async (_, { deliveryBoyId }) => {
      try {
        const history = await DeliveryHistory.find({ deliveryBoyId }).sort({ deliveryDate: -1 });
        return history;
      } catch (error) {
        throw new Error('Error fetching delivery history: ' + error.message);
      }
    },
    getDeliveryHistorySummary: async (_, { deliveryBoyId }) => {
      try {
        const summary = await DeliveryHistory.aggregate([
          { $match: { deliveryBoyId: mongoose.Types.ObjectId.createFromHexString(deliveryBoyId) } },
          { 
            $group: {
              _id: '$deliveryBoyId',
              totalDeliveries: { $sum: 1 },
              totalEarnings: { $sum: '$orderTotal' }
            }
          },
          {
            $project: {
              deliveryBoyId: '$_id',
              totalDeliveries: 1,
              totalEarnings: 1,
              _id: 0
            }
          }
        ]);

        return summary[0] || { deliveryBoyId, totalDeliveries: 0, totalEarnings: 0 };
      } catch (error) {
        throw new Error('Error fetching delivery history summary: ' + error.message);
      }
    }
  }
};

module.exports = deliveryHistoryResolvers;