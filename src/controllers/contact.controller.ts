import { Request, Response } from "express";

import {
  successResponse,
  serverError,
  badRequest,
} from "../utils/response.util";
import sendContactUsEmail from "../services/mail.service";
import { contactFormSchema } from "src/types/contactBody";

type MapKey = "type1" | "type2";

export const sendMailHandler = async (
  req: Request<any, any, contactFormSchema>,
  res: Response<any>
) => {
  try {
    const { firstName, lastName, message, email, phoneNumber, specifications } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !message ||
      !email ||
      !phoneNumber ||
      !specifications
    ) {
      return badRequest(
        "Missing fields!! Name, email, phone number and type is required",
        {},
        res
      );
    }
    

    // Send mail to the user
    sendContactUsEmail("New Form Submitted", {
      firstName,
      lastName,
      message,
      email,
      phoneNumber,
      specifications,
    });

    return successResponse("Form Submitted Successfully !!", {}, res);
  } catch (error: any) {
    return serverError(error, res);
  }
};
