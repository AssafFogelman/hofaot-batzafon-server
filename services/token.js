const jwt = require("jsonwebtoken");

function generateAuthToken(user) {
  const token = jwt.sign(
    { _id: user._id, biz: user.biz, isAdmin: user.isAdmin },
    process.env.JWTKEY
  );
  return token;
}

const generateAuthToken2 = (payload, expDate = "30d") => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWTKEY,
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
    const userData = jwt.verify(tokenFromUSer, process.env.JWTKEY);

    return userData;
  } catch (error) {
    return null;
  }
}

const verifyToken2 = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWTKEY, (err, payload) => {
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
