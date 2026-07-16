import jwt from "jsonwebtoken";
import User from "./models/User.js";
import { ApiError, asyncHandler } from "./utils.js";

const protect = asyncHandler(async (request, _response, next) => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is required.");
  }

  const decoded = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select("-password");

  if (!user || !user.isActive) {
    throw new ApiError(401, "User session is invalid.");
  }

  request.user = user;
  next();
});

function authorize(...roles) {
  return (request, _response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return next(new ApiError(403, "You do not have permission for this action."));
    }
    next();
  };
}

function notFound(request, _response, next) {
  next(new ApiError(404, `Route not found: ${request.originalUrl}`));
}

function errorHandler(error, _request, response, _next) {
  if (error.name === "CastError") {
    return response.status(400).json({ success: false, message: "Invalid identifier." });
  }

  if (error.code === 11000) {
    return response.status(409).json({ success: false, message: "Record already exists." });
  }

  return response.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error.",
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
}

export { authorize, errorHandler, notFound, protect };
