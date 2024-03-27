import { Router } from "express";
import validate from "../middlewares/validator.middleware";
import * as userControllers from "../controllers/auth.controller";
import { authorizeUser } from "../middlewares/jwt.middleware";
import { createUserSchema, loginUserSchema } from "../schema/user.schema";

export const userRouter = Router();

userRouter.post(
  "/v1/register",
  validate(createUserSchema),
  userControllers.createUserHandler
);
userRouter.post(
  "/v1/login",
  validate(loginUserSchema),
  userControllers.loginHandler
);
userRouter.get(
  "/v1/getUserDetails",
  [authorizeUser],
  userControllers.getUserHandler
);
userRouter.put("/v1/updateProfile", [authorizeUser],
userControllers.getUserProfileUpdateHandler);
userRouter.put("/v1/update-profile-password", [authorizeUser],
userControllers.getUserProfilePasswordUpdateHandler);

userRouter.post("/v1", [authorizeUser], userControllers.userHandler);
