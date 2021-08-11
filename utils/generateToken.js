import jwt from "jsonwebtoken";

export const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
export const createrefreshToken = (payload) => {
  return jwt.sign(payload, process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
