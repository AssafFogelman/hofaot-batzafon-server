//checks if the token is invalid
const { verifyToken2 } = require("../services/token");
const User = require("../Routes/Users/userModel");
const validateTokenInParams = async (req, res, next) => {
  try {
    //if there is an error, verifyToken2 throws an error to catch

    const payload = await verifyToken2(req.params.token);
    //to check if the user exists (the token may be valid, but the user may be deleted by now)
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      /* the user does not exist in the DB */
      throw "the user of this token does not exist anymore";
    }

    //we will insert the userData of the user that was found through the email in the token, into the request for further use
    req.userData = user;

    //you may advance
    next();
  } catch (error) {
    res.status(401).json({ msg: "invalid token", error });
  }
};

module.exports = { validateTokenInParams };
