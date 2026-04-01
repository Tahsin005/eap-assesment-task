import prisma from "../../lib/prisma.js";
import { handlePrismaError } from "../../utils/prismaErrors.js";

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ 
    where: { email } 
  });
};

export const findUserByUsername = async (username) => {
  return prisma.user.findUnique({ 
    where: { username } 
  });
};

export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      is_active: true,
      createdAt: true,
      updatedAt: true
    }
  });
};


export const createUser = async ({ username, email, password, role }) => {
  try {
    return await prisma.user.create({
      data: { 
        username,
        email,
        password,
        role 
      },
      select: { 
        id: true, 
        username: true, 
        email: true, 
        role: true, 
        is_active: true,
        createdAt: true 
      },
    });
  } catch (error) {
    handlePrismaError(error, "User registered");
  }
};

