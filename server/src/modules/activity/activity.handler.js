import * as activityRepo from "./activity.repository.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const getActivitiesHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      activityRepo.getRecentActivities(skip, limit),
      activityRepo.countActivities()
    ]);

    return sendSuccess(res, "Activity logs fetched successfully.", logs, 200, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    return sendError(res, "Failed to fetch activities.", 500);
  }
};
