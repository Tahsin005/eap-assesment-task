export const sendSuccess = (res, message, data = null, status = 200, meta = null) => {
  const response = {
    success: true,
    message,
    data,
  };
  if (meta) response.meta = meta;
  return res.status(status).json(response);
};

export const sendError = (res, message, status = 500) => {
  return res.status(status).json({
    success: false,
    message,
  });
};
