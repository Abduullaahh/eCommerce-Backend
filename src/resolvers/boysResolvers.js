const Order = require('../models/checkout');
const DeliveryBoy = require('../models/boys');

const resolvers = {
  Query: {
    pendingOrders: async () => {
      const orders = await Order.find({ delivery: 'NOT' }).sort({ createdAt: -1 });
      return orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6)}`,
        total: order.total || 0,
        status: order.status,
        delivery: order.delivery,
        createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString(),
        assignedTo: null,
      }));
    },
    assignedOrders: async () => {
      const orders = await Order.find({ delivery: 'ASSIGNED' }).populate('assignedTo').sort({ createdAt: -1 });
      return orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6)}`,
        total: order.total || 0,
        status: order.status,
        delivery: order.delivery,
        createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString(),
        assignedTo: order.assignedTo,
      }));
    },
    completedOrders: async () => {
      const orders = await Order.find({ delivery: 'YES' }).populate('assignedTo').sort({ createdAt: -1 });
      return orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-6)}`,
        total: order.total || 0,
        status: order.status,
        delivery: order.delivery,
        createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString(),
        assignedTo: order.assignedTo,
      }));
    },
    deliveryBoys: async () => {
      return await DeliveryBoy.find();
    },
  },
  Mutation: {
    assignDelivery: async (_, { orderId, deliveryBoyId }) => {
      try {
        console.log(`Attempting to assign order ${orderId} to delivery boy ${deliveryBoyId}`);
        
        const order = await Order.findById(orderId);
        if (!order) {
          console.log(`Order with ID ${orderId} not found`);
          return { success: false, message: 'Order not found' };
        }

        const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
        if (!deliveryBoy) {
          console.log(`Delivery Boy with ID ${deliveryBoyId} not found`);
          return { success: false, message: 'Delivery Boy not found' };
        }

        if (order.delivery !== 'NOT') {
          return { success: false, message: 'Order is not in pending status' };
        }

        if (deliveryBoy.status !== 'AVAILABLE') {
          return { success: false, message: 'Delivery Boy is not available' };
        }

        order.delivery = 'ASSIGNED';
        order.assignedTo = deliveryBoyId;
        await order.save();

        deliveryBoy.status = 'BUSY';
        await deliveryBoy.save();

        return { 
          success: true, 
          message: 'Delivery assigned successfully', 
          order: {
            ...order.toObject(),
            id: order._id,
            assignedTo: deliveryBoy
          }
        };
      } catch (error) {
        console.error('Error assigning delivery:', error);
        return { success: false, message: 'An error occurred while assigning delivery' };
      }
    },
    addDeliveryBoy: async (_, { name, phone }) => {
      try {
        const newDeliveryBoy = new DeliveryBoy({ name, phone });
        await newDeliveryBoy.save();
        return newDeliveryBoy;
      } catch (error) {
        console.error('Error adding delivery boy:', error);
        throw new Error('An error occurred while adding delivery boy');
      }
    },
    deleteDeliveryBoy: async (_, { id }) => {
      try {
        const deliveryBoy = await DeliveryBoy.findById(id);
        if (!deliveryBoy) {
          return { success: false, message: 'Delivery boy not found' };
        }

        // Trigger the pre-remove hook
        await deliveryBoy.remove();

        return { success: true, message: 'Delivery boy deleted successfully' };
      } catch (error) {
        console.error('Error deleting delivery boy:', error);
        return { success: false, message: 'An error occurred while deleting delivery boy' };
      }
    },
    updateDeliveryStatus: async (_, { orderId }) => {
      try {
        const order = await Order.findById(orderId).populate('assignedTo');
        if (!order) {
          return { success: false, message: 'Order not found' };
        }

        if (order.delivery !== 'ASSIGNED') {
          return { success: false, message: 'Order is not in assigned status' };
        }

        order.delivery = 'YES';
        await order.save();

        // Update delivery boy status to AVAILABLE
        if (order.assignedTo) {
          order.assignedTo.status = 'AVAILABLE';
          await order.assignedTo.save();
        }

        return { 
          success: true, 
          message: 'Delivery status updated successfully', 
          order 
        };
      } catch (error) {
        console.error('Error updating delivery status:', error);
        return { success: false, message: 'An error occurred while updating delivery status' };
      }
    },
    cancelAssignment: async (_, { orderId }) => {
      try {
        const order = await Order.findById(orderId).populate('assignedTo');
        if (!order) {
          return { success: false, message: 'Order not found' };
        }

        if (order.delivery !== 'ASSIGNED') {
          return { success: false, message: 'Order is not in assigned status' };
        }

        const deliveryBoy = order.assignedTo;
        
        order.delivery = 'NOT';
        order.assignedTo = null;
        await order.save();

        if (deliveryBoy) {
          deliveryBoy.status = 'AVAILABLE';
          await deliveryBoy.save();
        }

        return { 
          success: true, 
          message: 'Assignment cancelled successfully', 
          order 
        };
      } catch (error) {
        console.error('Error cancelling assignment:', error);
        return { success: false, message: 'An error occurred while cancelling assignment' };
      }
    },
  },
};

module.exports = resolvers;