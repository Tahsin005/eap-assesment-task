import prisma from "../../lib/prisma.js";

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
    where: { id }
  });
};

export const createUser = async ({ username, email, password, role }) => {
  return prisma.user.create({
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
      createdAt: true 
    },
  });
};
