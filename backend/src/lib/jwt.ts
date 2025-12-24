import jwt from "jsonwebtoken";
import { config } from "../config";

export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  const secret = config.jwt.secret; // the secret key
  if (!secret || secret.trim() === "") {
    throw new Error("JWT_SECRET is not configured or is empty");
  }
  const options: jwt.SignOptions = {
    expiresIn: config.jwt.accessTokenExpiry,
  } as jwt.SignOptions;
  return jwt.sign(payload, secret, options);
}

export function generateRefreshToken(payload: TokenPayload): string {
  const secret = config.jwt.refreshSecret; // the secret key
  if (!secret || secret.trim() === "") {
    throw new Error("JWT_REFRESH_SECRET is not configured or is empty");
  }
  const options: jwt.SignOptions = {
    expiresIn: config.jwt.refreshTokenExpiry,
  } as jwt.SignOptions;
  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken(token: string): TokenPayload {
  const secret = config.jwt.secret;
  return jwt.verify(token, secret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const secret = config.jwt.refreshSecret;
  return jwt.verify(token, secret) as TokenPayload;
}
