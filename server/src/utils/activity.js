import prisma from "../lib/prisma.js";

// utility to log the activity
export const logActivity = async (text) => {
  try {
    return await prisma.activity.create({
      data: { text },
    });

  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

