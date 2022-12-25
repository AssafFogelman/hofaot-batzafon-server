const bcrypt = require("bcryptjs");

function generateHashPassword(pass) {
  return bcrypt.hashSync(pass, 10);
}

function comparePassword(password, anotherPassword) {
  return bcrypt.compareSync(password, anotherPassword);
}

const compareHash = (password, hash) => bcrypt.compare(password, hash);

module.exports = { generateHashPassword, comparePassword, compareHash };
