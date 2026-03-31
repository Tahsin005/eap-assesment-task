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
  
  try {
    return await orderRepo.createOrderWithItems({ customer_name, status: "pending" }, items, userId);
  } catch (err) {
    throw { status: 400, message: err.message };
  }
};

export const updateOrderInfo = async (id, data) => {
  try {
    return await orderRepo.updateOrder(id, data);
  } catch (err) {
    throw { status: 404, message: "Order not found." };
  }
};

export const setOrderStatus = async (id, status) => {
  try {
    return await orderRepo.updateStatus(id, status);
  } catch (err) {
    throw { status: 404, message: "Order not found." };
  }
};

export const cancelOrder = async (id, userId) => {
  try {
    return await orderRepo.cancelOrderAndReturnStock(id, userId);
  } catch (err) {
    throw { status: 400, message: err.message };
  }
};

export const deleteOrder = async (id, userId) => {
  try {
    return await orderRepo.deleteOrder(id, userId);
  } catch (err) {
    throw { status: 404, message: err.message || "Order not found." };
  }
};


// Item level
export const addItemToOrder = async (orderId, itemData, userId) => {
  try {
    return await orderRepo.addItem(orderId, itemData, userId);
  } catch (err) {
    throw { status: 400, message: err.message };
  }
};

export const updateOrderItem = async (orderId, itemId, { quantity }, userId) => {
  try {
    return await orderRepo.updateItemQuantity(orderId, itemId, quantity, userId);
  } catch (err) {
    throw { status: 400, message: err.message };
  }
};

export const removeOrderItem = async (orderId, itemId, userId) => {
  try {
    return await orderRepo.removeItem(orderId, itemId, userId);
  } catch (err) {
    throw { status: 400, message: err.message };
  }
};
