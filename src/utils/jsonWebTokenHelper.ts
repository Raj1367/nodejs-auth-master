import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const JwtSignupHelper = (
  payload: object,
  secret: string,
  options?: SignOptions
): string => {
  return jwt.sign(payload, secret, options);
};

export const JwtVerifyHelper = (
  token: string,
  secret: string
): JwtPayload | string => {
  return jwt.verify(token, secret);
};
