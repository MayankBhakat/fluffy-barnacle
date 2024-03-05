import * as bcrypt from "bcrypt";

const saltRounds: number = 10;
const salt: string = bcrypt.genSaltSync(saltRounds);

const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, salt);
};

const comparePasswords = (inputPassword: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(inputPassword, hashedPassword);
};

export { hashPassword, comparePasswords };
