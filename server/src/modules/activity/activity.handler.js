import { getRecentActivities } from "./activity.repository.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const getActivitiesHandler = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const logs = await getRecentActivities(limit);

    return sendSuccess(res, "Recent activities fetched successfully.", logs);
  } catch (err) {
    return sendError(res, "Failed to fetch activities.", 500);
  }
};
