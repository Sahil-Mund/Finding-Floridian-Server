import jwt from "jsonwebtoken";
import "dotenv/config";

export function signJwt(object: object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
    ...(options && options),
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);    
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
