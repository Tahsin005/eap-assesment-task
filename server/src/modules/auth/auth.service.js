import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  findUserByUsername,
  createUser,
} from "./auth.repository.js";

const SALT_ROUNDS = 10;

export const signup = async ({ username, email, password, role }) => {
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw { 
      status: 409, 
      message: "Email is already in use." 
    };
  }

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    throw { 
      status: 409, 
      message: "Username is already taken." 
    };
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await createUser({
    username,
    email,
    password: hashedPassword,
    role,
  });

  return user;
};

export const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw { 
      status: 401, 
      message: "Invalid email or password." 
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw { 
      status: 401, 
      message: "Invalid email or password." 
    };
  }

  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
