import bcrypt from "bcrypt";

export const generateHashedPassword = async (
  password: string,
  saltRounds: number
): Promise<string | undefined> => {
  try {
    if (!password) {
      throw new Error("Password cannot be empty");
    }
    return bcrypt.hash(password, saltRounds); // This should always return a string
  } catch (err) {
    console.error("Error hashing password:", err);
  }
};
