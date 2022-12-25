const express = require("express");
const {
  validateForgotPassword,
  validateResetPassword,
} = require("./usersValidations/forgotPassword");
const router = express.Router();
const User = require("./userModel");
const {
  generateAuthToken,
  verifyToken,
  verifyToken2,
  generateAuthToken2,
} = require("../../services/token");

const config = require("config");
const sgMail = require("@sendgrid/mail");
const {
  comparePassword,
  generateHashPassword,
  compareHash,
} = require("../../services/bcrypt");
const chalk = require("chalk");
sgMail.setApiKey(process.env.TWILIOKEY);

const forgotPasswordController = async (req, res) => {
  try {
    //validates the email sent
    const validatedValue = await validateForgotPassword(req.body);

    const userData = await User.findOne({ email: validatedValue.email });
    if (!userData) throw "check your inbox (for not hackers: user not found)";
    console.log("userData:", userData);
    const token = await generateAuthToken2({ email: userData.email }, "1h");

    //send e-mail with the token

    const emailMessage = {
      to: userData.email,
      from: "assaf.fogelman@gmail.com",
      subject: "your link for resetting your password",
      html: `<p>click this link to reset your password</p> <p><a href='http://localhost:3000/resetpassword/${token}'>http://localhost:3000/resetpassword/${token}</a></p>`,
    };

    sgMail
      .send(emailMessage)
      .then(() => {
        console.log("email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    //the link that will be in the e-mail sent:
    console.log("http://localhost:3000/resetpassword/" + token);
    //!we will need to change the address once React is in NodeJs
    //we will use env development and env production

    res.status(200).json({
      msg: "check your inbox",
      link: "http://localhost:3000/resetpassword/" + token,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const checkResetPasswordController = async (req, res) => {
  try {
    const verificationResponse = await verifyToken2(req.params.token);
    //is the token is invalid, verifyToken2 will throw an error to the catch.
    //if it is valid, it will return a response with a status of 200.
    res.status(200).json({ msg: "token is verified", verificationResponse });
  } catch (error) {
    res.status(401).json({ msg: "token not verified", error });
  }
};

const updatePasswordController = async (req, res) => {
  try {
    //joi validation of password
    const validatedValue = await validateResetPassword(req.body);
    //if there will be a problem with the joi validation, joi will throw an error to the catch.

    //is the password the same as the old one?

    //we have already (in the middleware) checked that the user exists in the DB, and retrieved the user's password into the req

    const samePassword = comparePassword(
      req.body.password,
      req.userData.password
    );
    const samePassword2 = await compareHash(
      req.body.password,
      req.userData.password
    );
    console.log("samePassword", samePassword);
    console.log("samePassword2", samePassword2);
    if (samePassword) {
      console.log(
        chalk.redBright("this is the password you already have! pick a new one")
      );
      throw {
        errorCode: 409,
        errorMsg: "this is the password you already have! pick a new one",
      };
    }

    //updating the password (and hashing it)
    await User.findByIdAndUpdate(req.userData.id, {
      password: generateHashPassword(req.body.password),
    });
    //return success message and a token to login
    res.status(200).json({
      msg: "the password has been updated! you are being logged-in",
      token: generateAuthToken(req.userData),
    });
  } catch (error) {
    res.status(400).json({
      msg: "you either need to pick a new password, or you need to pick a stronger one",
      error,
    });
  }
};

module.exports = {
  forgotPasswordController,
  checkResetPasswordController,
  updatePasswordController,
};
