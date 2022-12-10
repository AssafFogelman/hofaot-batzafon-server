const { Card } = require("./cardModel");
const User = require("../Users/userModel");
const express = require("express");
const auth = require("../../middlewares/authorization");
const router = express.Router();
const chalk = require("chalk");
const { generateBizNum } = require("./services/generateBizNum");
const { validateCard } = require("./cardValidation");

/********** סעיף 7 **********/
router.get("/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    return res.send(cards);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

/********** סעיף 8 **********/
router.get("/card/:id", async (req, res) => {
  try {
    const cardID = req.params.id;
    const card = await Card.findOne({ _id: cardID });
    return res.send(card);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

/********** סעיף 9 **********/
router.get("/my-cards", auth, async (req, res) => {
  try {
    let user = req.user;
    if (!user.biz) return res.status(403).json("Unauthorized user!");
    const cards = await Card.find({ user_id: user._id });
    return res.send(cards);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

/********** סעיף 10 **********/
router.post("/", auth, async (req, res) => {
  try {
    let user = req.user;

    if (!user.biz) {
      console.log(
        chalk.redBright("A non biz user attempted to create a card!")
      );
      return res.status(403).json("Un authorize user!");
    }

    user = await User.findById(user._id)
      .select(["-password", "-createdAt", "-__v"])
      .then((user) => user)
      .catch((errorsFromMongoose) => {
        return res.status(500).send(errorsFromMongoose);
      });

    let card = req.body;

    const { error } = validateCard(card);
    if (error) {
      console.log(chalk.redBright(error.details[0].message));
      return res.status(400).send(error.details[0].message);
    }

    card = new Card({
      performanceTitle: card.performanceTitle,
      subTitle: card.subTitle,
      description: card.description,
      wazeLocation: user.wazeLocation, //from biz
      performanceDate: card.performanceDate,
      bizName: user.name, //from biz
      phone: user.phone, //from biz
      bizUrl: user.bizUrl, //from biz
      image: {
        url: card.url
          ? card.url
          : "https://media.istockphoto.com/illustrations/vintage-halftone-microphone-illustration-id165942883?b=1&k=20&m=165942883&s=170667a&w=0&h=7FfhAMhdrHDNX7GdLvFL6KspLK1Iy1DfP1isebkOxZQ=",
        alt: card.alt ? card.alt : "Pic Of " + card.performanceTitle,
      },
      bizNumber: await generateBizNum(),
      user_id: user._id,
    });

    card = await card.save();
    return res.send(card);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error);
  }
});

/********** סעיף 11 **********/
router.put("/:id", auth, async (req, res) => {
  try {
    let user = req.user;
    if (!user.biz) {
      console.log(
        chalk.redBright("A non-business user attempted to edit a card!")
      );
      return res.status(403).json("You are not authorize to edit card!");
    }

    ///////////////*************************************************** */
    user = await User.findById(user._id)
      .select(["-password", "-createdAt", "-__v"])
      .then((user) => user)
      .catch((errorsFromMongoose) => res.status(500).send(errorsFromMongoose));

    //"user" now holds the properties of the biz that wants to add a card

    ///////////////*************************************************** */

    let card = req.body;
    delete card._id;
    const { error } = validateCard(card);
    if (error) {
      const errorMessage = error.details[0].message;
      console.log(chalk.redBright(errorMessage));
      return res.status(400).send(errorMessage);
    }

    card = {
      performanceTitle: card.performanceTitle,
      subTitle: card.subTitle,
      description: card.description,
      wazeLocation: user.wazeLocation,
      performanceDate: card.performanceDate,
      bizName: user.name,
      phone: user.phone,
      bizUrl: user.bizUrl,
      image: {
        url: card.url,
        alt: card.alt,
      },
    };

    const filter = {
      _id: req.params.id,
      userID: user._id,
    };

    card = await Card.findOneAndUpdate(filter, card);
    if (!card) {
      console.log(chalk.redBright("No card with this ID in the database!"));
      return res.status(404).send("No card with this ID in the database!");
    }
    card = await Card.findById(card._id);
    return res.send(card);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

/********** סעיף 12 **********/
router.delete("/:id", auth, async (req, res) => {
  try {
    let user = req.user;
    if (!user.biz) {
      console.log(
        chalk.redBright("A non-business user attempted to create a card!")
      );
      return res.status(403).json("You are not authorize to delete this card!");
    }

    let card = await Card.findOneAndRemove({
      _id: req.params.id,
      user_id: user._id,
    });

    if (!card) {
      console.log(chalk.redBright("Un authorized user!"));
      return res.status(403).send("You are noe authorize to delete cards");
    }

    return res.send(card);
  } catch (error) {
    console.log(chalk.redBright("Could not delet card:", error.message));
    return res.status(500).send(error.message);
  }
});
/********** סעיף 13 **********/

router.patch("/card-like/:id", auth, async (req, res) => {
  try {
    const user = req.user;
    let card = await Card.findOne({ _id: req.params.id });

    const cardLikes = card.likes.find((id) => id === user._id);

    if (!cardLikes) {
      card.likes.push(user._id);
      card = await card.save();
      return res.send(card);
    }

    const cardFiltered = card.likes.filter((id) => id !== user._id);
    card.likes = cardFiltered;
    card = await card.save();
    return res.send(card);
  } catch (error) {
    console.log(chalk.redBright("Could not edit like:", error.message));
    return res.status(500).send(error.message);
  }
});

module.exports = router;
