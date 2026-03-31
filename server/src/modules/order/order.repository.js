import prisma from "../../lib/prisma.js";

export const getAllOrders = async (skip = 0, take = 10) => {
  return prisma.order.findMany({
    skip,
    take,
    include: {
      creator: { select: { id: true, username: true } },
      items: { include: { product: { select: { name: true } } } }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const countOrders = async () => {
  return prisma.order.count();
};

export const getOrderById = async (id) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, username: true } },
      items: { include: { product: { select: { id: true, name: true, price: true } } } }
    }
  });
};

export const createOrderWithItems = async (orderData, items, userId) => {
  return prisma.$transaction(async (tx) => {
    // create the order
    const order = await tx.order.create({
      data: {
        ...orderData,
        total_price: 0,
        created_by: userId
      }
    });


    let totalPrice = 0;

    // process each item
    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.product_id }
      });

      if (!product) throw new Error(`Product ${item.product_id} not found.`);
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for product "${product.name}". Available: ${product.stock_quantity}, Requested: ${item.quantity}`);
      }

      const subtotal = product.price * item.quantity;
      totalPrice += subtotal;

      // create OrderItem
      await tx.orderItem.create({
        data: {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: product.price,
          subtotal_price: subtotal
        }
      });

      // update product stock
      const newStock = product.stock_quantity - item.quantity;
      await tx.product.update({
        where: { id: product.id },
        data: { 
          stock_quantity: newStock,
          status: newStock === 0 ? "out_of_stock" : product.status
        }
      });

      // Log Stock Movement
      await tx.stockMovement.create({
        data: {
          product_id: product.id,
          user_id: userId,
          order_id: order.id,
          movement_type: "ORDER_DEDUCT",
          quantity_change: -item.quantity,
          previous_stock: product.stock_quantity,
          new_stock: newStock,
          note: `Order ${order.id} created.`
        }
      });
    }

    // 3. Update total price in order
    return tx.order.update({
      where: { id: order.id },
      data: { total_price: totalPrice },
      include: { items: true }
    });
  });
};

export const addItem = async (orderId, itemData, userId) => {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: itemData.product_id } });
    if (!product) throw new Error("Product not found.");
    if (product.stock_quantity < itemData.quantity) throw new Error("Insufficient stock.");

    const subtotal = product.price * itemData.quantity;

    // Create item
    const newItem = await tx.orderItem.create({
      data: {
        order_id: orderId,
        product_id: itemData.product_id,
        quantity: itemData.quantity,
        unit_price: product.price,
        subtotal_price: subtotal
      }
    });

    // Deduct stock
    const newStock = product.stock_quantity - itemData.quantity;
    await tx.product.update({
      where: { id: product.id },
      data: { stock_quantity: newStock }
    });

    // Log movement
    await tx.stockMovement.create({
      data: {
        product_id: product.id,
        user_id: userId,
        order_id: orderId,
        movement_type: "ORDER_DEDUCT",
        quantity_change: -itemData.quantity,
        previous_stock: product.stock_quantity,
        new_stock: newStock,
        note: `Item added to order ${orderId}.`
      }
    });

    // Update order total
    await tx.order.update({
      where: { id: orderId },
      data: { total_price: { increment: subtotal } }
    });

    return newItem;
  });
};

export const removeItem = async (orderId, itemId, userId) => {
  return prisma.$transaction(async (tx) => {
    const item = await tx.orderItem.findUnique({
      where: { id: itemId },
      include: { product: true }
    });

    if (!item) throw new Error("Order item not found.");
    if (item.order_id !== orderId) throw new Error("Item does not belong to this order.");

    // Delete item
    await tx.orderItem.delete({ where: { id: itemId } });

    // Return stock
    const product = item.product;
    const newStock = product.stock_quantity + item.quantity;
    await tx.product.update({
      where: { id: product.id },
      data: { stock_quantity: newStock }
    });

    // Log movement
    await tx.stockMovement.create({
      data: {
        product_id: product.id,
        user_id: userId,
        order_id: orderId,
        movement_type: "CANCEL_RETURN",
        quantity_change: item.quantity,
        previous_stock: product.stock_quantity,
        new_stock: newStock,
        note: `Item removed from order ${orderId}.`
      }
    });

    // Update order total
    return tx.order.update({
      where: { id: orderId },
      data: { total_price: { decrement: item.subtotal_price } }
    });
  });
};

export const cancelOrderAndReturnStock = async (orderId, userId) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    });

    if (!order) throw new Error("Order not found.");
    if (order.status === "cancelled") throw new Error("Order is already cancelled.");

    // Update status
    await tx.order.update({
      where: { id: orderId },
      data: { status: "cancelled" }
    });

    // Return stock for each item
    for (const item of order.items) {
      const product = item.product;
      const newStock = product.stock_quantity + item.quantity;

      await tx.product.update({
        where: { id: product.id },
        data: { stock_quantity: newStock }
      });

      await tx.stockMovement.create({
        data: {
          product_id: product.id,
          user_id: userId,
          order_id: order.id,
          movement_type: "CANCEL_RETURN",
          quantity_change: item.quantity,
          previous_stock: product.stock_quantity,
          new_stock: newStock,
          note: `Order ${orderId} cancelled.`
        }
      });
    }

    return order;
  });
};

export const updateStatus = async (id, status) => {
  return prisma.order.update({
    where: { id },
    data: { status }
  });
};

export const deleteOrder = async (id, userId) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } }
    });

    if (!order) throw new Error("Order not found.");

    // if order is NOT already cancelled, return the stock first
    if (order.status !== "cancelled") {
      for (const item of order.items) {
        const product = item.product;
        const newStock = product.stock_quantity + item.quantity;

        // update product stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock_quantity: newStock,
            status: "active" // ensure it's active if stock is returned
          }
        });

        // log stock movement (audit trail)
        await tx.stockMovement.create({
          data: {
            product_id: product.id,
            user_id: userId,
            order_id: null, // order is being deleted
            movement_type: "CANCEL_RETURN",
            quantity_change: item.quantity,
            previous_stock: product.stock_quantity,
            new_stock: newStock,
            note: `Stock returned due to deletion of Order ${id}.`
          }
        });
      }
    }

    // now delete the order (Items will cascade delete due to schema change)
    return tx.order.delete({ where: { id } });
  });
};

export const updateOrder = async (id, data) => {
  return prisma.order.update({
    where: { id },
    data
  });
};

export const updateItemQuantity = async (orderId, itemId, quantity, userId) => {
  return prisma.$transaction(async (tx) => {
    const item = await tx.orderItem.findUnique({
      where: { id: itemId },
      include: { product: true }
    });

    if (!item) throw new Error("Item not found.");
    if (item.order_id !== orderId) throw new Error("Unauthorized.");

    const diff = quantity - item.quantity;
    if (diff === 0) return item;

    const product = item.product;
    if (diff > 0 && product.stock_quantity < diff) throw new Error("Insufficient stock.");

    // Update item
    const newSubtotal = item.unit_price * quantity;
    const updatedItem = await tx.orderItem.update({
      where: { id: itemId },
      data: {
        quantity,
        subtotal_price: newSubtotal
      }
    });

    // Update product stock
    const newStock = product.stock_quantity - diff;
    await tx.product.update({
      where: { id: product.id },
      data: { stock_quantity: newStock }
    });

    // Log movement
    await tx.stockMovement.create({
      data: {
        product_id: product.id,
        user_id: userId,
        order_id: orderId,
        movement_type: diff > 0 ? "ORDER_DEDUCT" : "CANCEL_RETURN",
        quantity_change: -diff,
        previous_stock: product.stock_quantity,
        new_stock: newStock,
        note: `Item quantity updated in order ${orderId}.`
      }
    });

    // Update order total
    const priceDiff = (quantity - item.quantity) * item.unit_price;
    await tx.order.update({
      where: { id: orderId },
      data: { total_price: { increment: priceDiff } }
    });

    return updatedItem;
  });
};
