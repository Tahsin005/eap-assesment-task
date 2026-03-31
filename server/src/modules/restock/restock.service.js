import * as restockRepo from "./restock.repository.js";
import { getProductById } from "../product/product.repository.js";

export const listQueue = async () => {
  return await restockRepo.getQueue();
};

export const getQueueItem = async (id) => {
  const item = await restockRepo.getQueueItemById(id);
  if (!item) throw { status: 404, message: "Restock item not found." };
  return item;
};

export const addRestockItem = async ({ product_id, priority }) => {
  const product = await getProductById(product_id);
  if (!product) throw { status: 404, message: "Product not found." };

  try {
    return await restockRepo.addToQueue({ product_id, priority });
  } catch (error) {
    if (error.code === 'P2002') {
      throw { status: 409, message: "Product is already in the restock queue." };
    }
    throw error;
  }
};

export const editPriority = async (id, priority) => {
  try {
    return await restockRepo.updatePriority(id, priority);
  } catch (error) {
    throw { status: 404, message: "Restock item not found." };
  }
};

export const deleteQueueItem = async (id) => {
  try {
    return await restockRepo.removeFromQueue(id);
  } catch (error) {
    throw { status: 404, message: "Restock item not found." };
  }
};
