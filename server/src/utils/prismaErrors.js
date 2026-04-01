import { Prisma } from "@prisma/client";

export const handlePrismaError = (error, modelName = "Record") => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        // Unique constraint failed
        const fields = error.meta?.target || [];
        const fieldName = fields.length > 0 ? fields[fields.length - 1] : "field";
        throw { 
          status: 409, 
          message: `${modelName} with this ${fieldName} already exists.` 
        };
      }
      case "P2003": {
        // Foreign key constraint failed
        throw { 
          status: 400, 
          message: `Cannot complete operation on ${modelName} because it is referenced by other records.` 
        };
      }
      case "P2025": {
        // Record to update/delete not found
        throw { 
          status: 404, 
          message: `${modelName} not found.` 
        };
      }
      case "P2014": {
        // Relation violation
        throw { 
          status: 400, 
          message: `The change violates a required relation for ${modelName}.` 
        };
      }
      case "P2000": {
        // Value too long
        throw { 
          status: 400, 
          message: `Provided value for ${modelName} is too long.` 
        };
      }
      default:
        // Other known prisma errors
        throw { 
          status: 500, 
          message: `Database error (${error.code}) occurred while processing ${modelName}.` 
        };
    }
  }

  // If it's not a known prisma error, just throw it as is
  throw error;
};
