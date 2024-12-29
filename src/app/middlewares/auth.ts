import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHealpers";
import { Secret } from "jsonwebtoken";
import { config } from "../config";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Authorization token is missing");
      }

      let verifiedUser;
      try {
        verifiedUser = jwtHelpers.verifyToken(
          token,
          config.jwt.access_token_secret as Secret
        );
      } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid authorization token");
      }

      if (!verifiedUser) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Token verification failed");
      }

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "You do not have permission to access this resource");
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
      }
    }
  };
};

export default auth;

