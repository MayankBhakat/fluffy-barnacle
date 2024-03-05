import * as jwt from "jsonwebtoken";

const generateAuthToken = (
  _id: string,
  name: string,
  email: string,
  verification: string,
): string => {
  return jwt.sign(
    { _id, name, email, verification},
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "7h" }
  );
};

export default generateAuthToken;
