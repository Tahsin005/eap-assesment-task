import * as restockRepo from "./restock.repository.js";
import { getProductById } from "../product/product.repository.js";

export const listQueue = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const [queue, total] = await Promise.all([
    restockRepo.getQueue(skip, limit),
    restockRepo.countQueue()
  ]);

  return {
    queue,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getQueueItem = async (id) => {
  const item = await restockRepo.getQueueItemById(id);
  if (!item) throw { status: 404, message: "Restock item not found." };
  return item;
};

export const deleteQueueItem = async (id) => {
  try {
    return await restockRepo.removeFromQueue(id);
  } catch (error) {
    throw { status: 404, message: "Restock item not found." };
  }
};
