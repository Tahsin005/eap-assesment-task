import * as orderRepo from "./order.repository.js";

export const listOrders = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    orderRepo.getAllOrders(skip, limit),
    orderRepo.countOrders()
  ]);

  return {
    orders,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getOrder = async (id) => {
  const order = await orderRepo.getOrderById(id);
  if (!order) throw { status: 404, message: "Order not found." };
  return order;
};

export const placeOrder = async ({ customer_name, items }, userId) => {
  if (!items || items.length === 0) throw { status: 400, message: "Order must have at least one item." };
  return await orderRepo.createOrderWithItems({ customer_name, status: "pending" }, items, userId);
};

export const updateOrderInfo = async (id, data) => {
  return await orderRepo.updateOrder(id, data);
};

export const setOrderStatus = async (id, status) => {
  return await orderRepo.updateStatus(id, status);
};

export const cancelOrder = async (id, userId) => {
  return await orderRepo.cancelOrderAndReturnStock(id, userId);
};

export const deleteOrder = async (id, userId) => {
  return await orderRepo.deleteOrder(id, userId);
};


// Item level
export const addItemToOrder = async (orderId, itemData, userId) => {
  return await orderRepo.addItem(orderId, itemData, userId);
};

export const updateOrderItem = async (orderId, itemId, { quantity }, userId) => {
  return await orderRepo.updateItemQuantity(orderId, itemId, quantity, userId);
};

export const removeOrderItem = async (orderId, itemId, userId) => {
  return await orderRepo.removeItem(orderId, itemId, userId);
};
