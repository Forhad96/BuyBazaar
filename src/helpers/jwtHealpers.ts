import jwt, { JwtPayload, Secret } from "jsonwebtoken";
const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  const token = jwt.sign(payload, secret, { algorithm: "HS256", expiresIn });
  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new Error("Token verification failed");
  }
}


export const jwtHelpers = {
  generateToken,
  verifyToken
};
