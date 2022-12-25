const validateRegistration = require("./usersValidations/registration");
const validateSignin = require("./usersValidations/signIn");
const {
  comparePassword,
  generateHashPassword,
} = require("../../services/bcrypt");
const { generateAuthToken } = require("../../services/token");
const _ = require("lodash");
const router = require("express").Router();
const User = require("./userModel");
const auth = require("../../middlewares/authorization");
const chalk = require("chalk");
const {
  forgotPasswordController,
  checkResetPasswordController,
  updatePasswordController,
} = require("./userControllers");
const {
  validateTokenInParams,
} = require("../../middlewares/checkTokenInParams.middleware");

router.post("/register", async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    console.log(chalk.redBright(error.details[0].message));
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    console.log(chalk.redBright("Registration Error: User already registered"));
    return res.status(400).send("User already registered.");
  }

  user = new User(
    _.pick(req.body, [
      "name",
      "email",
      "password",
      "biz",
      "phone",
      "bizUrl",
      "wazeLocation",
      "cards",
    ])
  );

  user.password = generateHashPassword(user.password);
  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/login", async (req, res) => {
  const { error } = validateSignin(req.body);
  if (error) {
    console.log(chalk.redBright(error.details[0].message));
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    console.log(chalk.redBright("Invalid email"));
    return res.status(400).send("Invalid email.");
  }

  const validPassword = comparePassword(req.body.password, user.password);
  if (!validPassword) {
    console.log(chalk.redBright("Invalid password"));
    return res.status(400).send("Invalid password.");
  }

  res.json({
    token: generateAuthToken(user),
  });
});

router.get("/userInfo", auth, (req, res) => {
  let user = req.user;

  User.findById(user._id)
    .select(["-password", "-createdAt", "-__v"])
    .then((user) => res.send(user))
    .catch((errorsFromMongoose) => res.status(500).send(errorsFromMongoose));
});

//receives the user's email, checks if it is valid. creates a token, and sends it to the user's email address.
router.post("/forgotpassword", forgotPasswordController);

//check the validation of the token
router.get("/resetpassword/:token", checkResetPasswordController);

//validateTokenInParams - check the validation of the token
//updatePasswordController - update password
router.post(
  "/resetpassword/:token",
  validateTokenInParams,
  updatePasswordController
);

module.exports = router;
