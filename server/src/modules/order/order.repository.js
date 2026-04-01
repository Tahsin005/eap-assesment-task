import prisma from "../../lib/prisma.js";
import { handlePrismaError } from "../../utils/prismaErrors.js";
import { checkAndSyncRestockQueue } from "../restock/restock.logic.js";

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
  try {
    // Increase transaction timeout to 15s to prevent P2028 for batch orders
    return await prisma.$transaction(async (tx) => {
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

        if (!product) throw { status: 404, message: `Product ${item.product_id} not found.` };
        if (product.stock_quantity < item.quantity) {
          throw { 
            status: 400, 
            message: `Only ${product.stock_quantity} items available in stock for "${product.name}".` 
          };
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
        const updatedProduct = await tx.product.update({
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

        // 5. Sync Restock Queue using updated product data
        await checkAndSyncRestockQueue(updatedProduct, tx);
      }

      // 3. Update total price in order
      return tx.order.update({
        where: { id: order.id },
        data: { total_price: totalPrice },
        include: { items: true }
      });
    }, {
      maxWait: 5000, 
      timeout: 15000
    });
  } catch (error) {
    handlePrismaError(error, "Order creation");
  }
};


export const cancelOrderAndReturnStock = async (orderId, userId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } }
      });

      if (!order) throw { status: 404, message: "Order not found." };
      if (order.status === "cancelled") throw { status: 400, message: "Order is already cancelled." };

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
  } catch (error) {
    handlePrismaError(error, "Order cancellation");
  }
};

export const updateStatus = async (id, status) => {
  try {
    return await prisma.order.update({
      where: { id },
      data: { status }
    });
  } catch (error) {
    handlePrismaError(error, "Order status update");
  }
};

export const deleteOrder = async (id, userId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } } }
      });

      if (!order) throw { status: 404, message: "Order not found." };

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
  } catch (error) {
    handlePrismaError(error, "Order deletion");
  }
};

export const updateOrder = async (id, data) => {
  try {
    return await prisma.order.update({
      where: { id },
      data
    });
  } catch (error) {
    handlePrismaError(error, "Order update");
  }
};

