import { Request, Response } from "express";

import * as services from "../services/auth.service";
import { CreateUserInput } from "../schema/user.schema";
import User from "../database/models/user.model";
import bcrypt from "bcrypt";
import "dotenv/config";
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
    console.log(error);

    return serverError(error, res);
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const foundUser = await User.findOne({ where: { email: req.body.email } });

    if (!foundUser) {
      return notFoundResponse("Incorrect Email", {}, res);
    }

    const isMatch = bcrypt.compareSync(req.body.password, foundUser.password);

    if (isMatch) {
      const user = await services.loginUser(foundUser);
      return successResponse("Successfully found", user, res);
    } else {
      return badRequest("Password is not correct", {}, res);
    }

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

export const getUserHandler = async (req: Request, res: Response) => {
  try {

    const user = await User.findByPk(res.locals?.user.id);
    return successResponse("User details fetched successfully !!", { user: { name: user.name, email: user.email, role: user.role, phone: user.phone_number } }, res);
  } catch (error) {
    return serverError(error, res);
  }
};


export const getUserProfileUpdateHandler = async (req: Request, res: Response) => {
  try {
    const updateData = req.body;

    // `res.locals.user.id` contains the ID of the user to update
    const userId = res.locals.user.id;

    // Update the user's details in the database
    const [numberOfAffectedRows, [updatedUser]] = await User.update(updateData, {
      where: { id: userId },
      returning: true, // This option is needed to get the updated user object back (only supported by PostgreSQL)
    });

    // Check if the user was updated successfully
    if (numberOfAffectedRows > 0) {
      // Assuming you have a function `successResponse` to send back the response
      return successResponse("User details updated successfully", { user: { name: updatedUser.name, email: updatedUser.email } }, res);
    } else {
      // No rows affected, implying the user was not found or not updated
      return res.status(404).send({ message: "User not found or data not changed" });
    }
  } catch (error) {
    return serverError(error, res); // Assuming `serverError` is a function to handle sending error responses
  }
};
export const getUserProfilePasswordUpdateHandler = async (req: Request, res: Response) => {
  try {
    const updatePassword = req.body.password;

    // `res.locals.user.id` contains the ID of the user to update
    const userId = res.locals.user.id;

    console.log(updatePassword);
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(updatePassword, Number(process.env.SALT_ROUNDS));
      console.log(hashedPassword);
    } catch (error) {
      console.log(error);

    }
    // return;

    // Update the user's details in the database
    const [numberOfAffectedRows, [updatedUser]] = await User.update({ password: hashedPassword }, {
      where: { id: userId },
      returning: true,
    });

    // Check if the user was updated successfully
    if (numberOfAffectedRows > 0) {
      // Assuming you have a function `successResponse` to send back the response
      return successResponse("User password successfully", { user: { name: updatedUser.name, email: updatedUser.email } }, res);
    } else {
      // No rows affected, implying the user was not found or not updated
      return res.status(404).send({ message: "User not found or data not changed" });
    }
  } catch (error) {
    return serverError(error, res); // Assuming `serverError` is a function to handle sending error responses
  }
};