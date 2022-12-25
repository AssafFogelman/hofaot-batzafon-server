const jwt = require("jsonwebtoken");
const config = require("config");

function generateAuthToken(user) {
  const token = jwt.sign(
    { _id: user._id, biz: user.biz, isAdmin: user.isAdmin },
    config.get("jwtKey")
  );
  return token;
}

const generateAuthToken2 = (payload, expDate = "30d") => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.get("jwtKey"),
      { expiresIn: expDate },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
};
/* default value - 30d */
/* payload - the data */
/* (err, token)  - a function to determine what to do if there is an error or if we get a generated token */

function verifyToken(tokenFromUSer) {
  try {
    const userData = jwt.verify(tokenFromUSer, config.get("jwtKey"));

    return userData;
  } catch (error) {
    return null;
  }
}

const verifyToken2 = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get("jwtKey"), (err, payload) => {
      if (err) reject(err);
      else resolve(payload);
    });
  });
};

module.exports = {
  generateAuthToken,
  verifyToken,
  verifyToken2,
  generateAuthToken2,
};
