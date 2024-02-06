import { signJwt } from "../utils/jwt.util";
import User, { UserAttributes } from "../database/models/user.model";
import { omit } from "lodash";

export async function createUser(user: any): Promise<any> {
  try {
    delete user.passwordConfirmation;
    const newUser = await User.create(user);
    console.log(newUser);
    
    return {
      user: omit(newUser?.toJSON(), "password", "createdAt", "updatedAt"),
    };
  } catch (error: any) {
    // console.log(error);
    throw error?.errors[0]?.message;
  }
}

export async function loginUser(user: any): Promise<any> {
  try {
    const token = signJwt(
      { id: user.id, role: user.role },
      { expiresIn: "2 days" }
    );
    return {
      user: omit(user?.toJSON(), "password", "createdAt", "updatedAt"),
      token: token,
    };
  } catch (error: any) {
    throw error;
  }
}
