import { nativeEnum, object, string, TypeOf } from "zod";
import { UserType } from "../database/models/user.model";


export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "password is required",
    }).min(6, "Password too short - should be minimum of 6 character"),
    passwordConfirmation: string({
      required_error: "Confirmation password is required",
    }),
    role: nativeEnum(UserType, {
      required_error: "Role is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    phone_number: string({
      required_error: "Phone number is required",
    })
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"], 
  }),
});

export const loginUserSchema = object({
  body: object({
    password: string({
      required_error: "password is required",
    }).min(6, "Password too short - should be minimum of 6 character"),
    email: string({
      required_error: "Email is required",
    }).email("Invalid Credentials"),
  })
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
