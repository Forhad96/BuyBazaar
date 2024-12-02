import dotenv from "dotenv";
import path from "path";
import { cwd } from "process";

dotenv.config({ path: path.join(cwd(), ".env") });

export const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expire_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_token_secret: process.env.RESET_PASS_TOKEN_SECRET,
    reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  reset_pass_link: process.env.RESET_PASS_LINK,
};
