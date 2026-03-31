import * as stockRepo from "./stock.repository.js";

export const listMovements = async (page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit;
  
  const [movements, total] = await Promise.all([
    stockRepo.getAllMovements(skip, limit, filters),
    stockRepo.countMovements(filters)
  ]);

  return {
    movements,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getMovement = async (id) => {
  const movement = await stockRepo.getMovementById(id);
  if (!movement) throw { status: 404, message: "Stock movement not found." };
  return movement;
};
