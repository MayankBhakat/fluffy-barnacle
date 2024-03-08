const bcrypt = require("bcrypt");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

const comparePasswords = (inputPassword, hashedPassword) => {
  return bcrypt.compareSync(inputPassword, hashedPassword);
};

module.exports = { hashPassword, comparePasswords };
