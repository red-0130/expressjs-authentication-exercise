import bcrypt from "bcrypt";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 12;
export const hashPassord = async (password: string): Promise<[null, string] | [Error, null]> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return [null, hash];
  } catch (error) {
    if (error instanceof Error) {
      return [error, null];
    }
    return [new Error(String(error)), null];
  }
};

export const comparePasswords = async (
  inputPassword: string,
  hashedPassword: string,
): Promise<[null, boolean] | [Error, null]> => {
  try {
    const isMatched = await bcrypt.compare(inputPassword, hashedPassword);
    return [null, isMatched];
  } catch (error) {
    if (error instanceof Error) return [error, null];
    return [new Error(String(error)), null];
  }
};
