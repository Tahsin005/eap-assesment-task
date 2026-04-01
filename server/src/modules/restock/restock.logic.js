/*
Checks if a product's stock is below its threshold and updates the restock queue accordingly.
*/
export const checkAndSyncRestockQueue = async (product, tx) => {
  if (!product) return;
  const isBelowThreshold = product.stock_quantity <= product.minimum_stock_threshold;

  if (isBelowThreshold) {
    // Determine priority
    let priority = "low";
    if (product.stock_quantity === 0) {
      priority = "high";
    } else if (product.stock_quantity <= product.minimum_stock_threshold / 2) {
      priority = "medium";
    }

    // Upsert into queue
    await tx.restockQueue.upsert({
      where: { product_id: product.id },
      update: { priority },
      create: { product_id: product.id, priority }
    });
  } else {
    // If stock is above threshold, remove from queue if it exists
    await tx.restockQueue.deleteMany({
      where: { product_id: product.id }
    });
  }
};
