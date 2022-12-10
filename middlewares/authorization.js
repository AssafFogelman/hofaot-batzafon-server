const chalk = require("chalk");

const { verifyToken } = require("../services/token");

function authorizationMiddlware(req, res, next) {
  const tokenFromClient = req.header("x-auth-token");

  if (!tokenFromClient) {
    console.log(
      chalk.redBright("Authorization Error: User did not send a token!")
    );
    return res.status(401).json("Found no token in header");
  }
  const userInfo = verifyToken(tokenFromClient);

  if (!userInfo) {
    console.log(chalk.redBright("Authorization Error: Invalid Token!"));
    return res.status(401).json("Invalid  Token!");
  }

  req.user = userInfo;

  return next();
}

module.exports = authorizationMiddlware;
