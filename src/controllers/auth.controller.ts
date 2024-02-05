import { Request, Response } from "express";

import * as services from "../services/auth.service";
import { CreateUserInput } from "../schema/user.schema";
import User from "../database/models/user.model";
import bcrypt from "bcrypt";
import {
  successResponse,
  serverError,
  notFoundResponse,
  badRequest,
} from "../utils/response.util";

export const createUserHandler = async (
  req: Request<any, any, CreateUserInput["body"]>,
  res: Response
) => {
  try {

    const user = await services.createUser(req.body);
    return successResponse("Successfully created", user, res);
  } catch (error: any) {
    return serverError(error, res);
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const foundUser = await User.findOne({ where: { email: req.body.email } });

    if (!foundUser) {
      return notFoundResponse("Incorrect Email", {}, res);
    }

    const isMatch = bcrypt.compareSync(req.body.password, foundUser.password);

    if (isMatch) {
      const user = await services.loginUser(foundUser);
      return successResponse("Successfully created", user, res);
    } else {
      return badRequest("Password is not correct", {}, res);
    }
    return;
  } catch (error) {
    console.log(error);
    return serverError(error, res);
  }
};

export const userHandler = async (req: Request, res: Response) => {
  try {
    return successResponse("Successfully created", {}, res);
  } catch (error) {
    return serverError(error, res);
  }
};
