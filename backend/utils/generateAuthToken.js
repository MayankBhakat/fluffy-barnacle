const jwt = require("jsonwebtoken");

const generateAuthToken = (
  _id,
  name,
  email,
  verification
) => {
  return jwt.sign(
    { _id, name, email, verification },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7h" }
  );
};

module.exports = generateAuthToken;
