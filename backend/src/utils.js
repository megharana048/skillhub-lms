import jwt from "jsonwebtoken";

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function asyncHandler(controller) {
  return (request, response, next) =>
    Promise.resolve(controller(request, response, next)).catch(next);
}

function tokenFor(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export { ApiError, asyncHandler, tokenFor };
