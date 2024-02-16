import { Request, Response, NextFunction } from "express";
import User, { UserType } from "../database/models/user.model";
import { verifyJwt } from "../utils/jwt.util";
import { authenticateFailed } from "../utils/response.util";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  console.log('user_token',token);
  if (!token) {
    return next();
  }

  const { decoded, expired } = verifyJwt(token);

  if (expired) {
    return authenticateFailed(res, "Token expired !");
  }

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }
};

export const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user) {
    return authenticateFailed(res, "Unauthorized !");
  }

  const authUser = await User.findByPk(user.id);
  if (!authUser) {
    return authenticateFailed(res, "Invalid authentication token!");
  }

  // Also implement other checks like:
  // 1. If the last sent refresh token to user is in logged out state in database.
  // 2. If the last sent refresh token to user is in blocked state in database.

  return next();
};

export const authorizeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user) {
    return authenticateFailed(res, "Unauthorized !");
  }

  const authUser = await User.findByPk(user.id);
  if (!authUser) {
    return authenticateFailed(res, "Invalid authentication token!");
  }

  if (user.role !== UserType.admin) {
    return authenticateFailed(res, "Access denied !");
  }

  return next();
};
