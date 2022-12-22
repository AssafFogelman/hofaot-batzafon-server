const express = require("express");
const { validateForgotPassword } = require("./usersValidations/forgotPassword");
const router = express.Router();
const User = require("./userModel");
const {
  generateAuthToken,
  verifyToken,
  verifyToken2,
} = require("../../services/token");

const config = require("config");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(config.get("twilioKey"));

const forgotPasswordController = async (req, res) => {
  try {
    const validatedValue = await validateForgotPassword(req.body);

    const userData = await User.findOne({ email: validatedValue.email });
    if (!userData) throw "check your inbox (for not hackers: user not found)";
    const token = await generateAuthToken({ email: userData.email }, "1h");

    //send e-mail with the token

    const emailMessage = {
      to: userData.email,
      from: "assaf.fogelman@gmail.com",
      subject: "your link for reseting your password",
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
    //if it is valid, it will retirn a response with a status of 200.
    res.status(200).json({ msg: "token is verified", verificationResponse });
  } catch (error) {
    res.status(401).json({ msg: "token not verified", error });
  }
};

module.exports = { forgotPasswordController, checkResetPasswordController };
