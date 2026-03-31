import bcrypt from "bcrypt";
import * as userRepo from "./user.repository.js";
import { findUserByEmail, findUserByUsername } from "../auth/auth.repository.js";

const SALT_ROUNDS = 10;

export const listUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    userRepo.getAllUsers(skip, limit),
    userRepo.countUsers(),
  ]);

  return {
    users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


export const getUser = async (id) => {
  const user = await userRepo.getUserById(id);
  if (!user) throw { status: 404, message: "User not found." };
  return user;
};

export const createAdminUser = async ({ username, email, password, role }) => {
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) throw { status: 409, message: "Email is already in use." };

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) throw { status: 409, message: "Username is already taken." };

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return await userRepo.createUser({
    username,
    email,
    password: hashedPassword,
    role,
  });
};

export const updateUserDetails = async (id, data) => {
  // If password is being updated, hash it
  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }
  
  try {
    return await userRepo.updateUser(id, data);
  } catch (error) {
    throw { status: 404, message: "User not found or update failed." };
  }
};

export const removeUser = async (id) => {
  try {
    return await userRepo.deleteUser(id);
  } catch (error) {
    throw { status: 404, message: "User not found or deletion failed." };
  }
};

export const changeUserRole = async (id, role) => {
  return await userRepo.updateUser(id, { role });
};

export const changeUserStatus = async (id, is_active) => {
  return await userRepo.updateUser(id, { is_active });
};
