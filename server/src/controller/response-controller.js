export const successResponse = (
  res,
  { statusCode = 200, message = "success", payload = {} }
) => {
  res.status(statusCode).json({
    success: true,
    message: message,
    payload: payload,
  });
};

export const errorResponse = (res, { status = 400, message = "error" }) => {
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
