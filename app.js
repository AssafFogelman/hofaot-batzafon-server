require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
require("./DB/connectToDb");
// require("./primeryData/primeryCards")();
const express = require("express");
const app = express();

const usersRouter = require("./Routes/Users/userRouter");
const cardsRouter = require("./Routes/Cards/cardsRouter");
const chalk = require("chalk");
const morgan = require("morgan");
const cors = require("cors");
const path = require("node:path");
const helmet = require("helmet");

app.use(morgan(chalk.cyan(":method :url :status :response-time ms")));
app.use(cors());
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/cards", cardsRouter);
app.use(helmet());

/* React*/

//gives access to the build directory
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(chalk.blueBright.bold(`server run on: http://:localhost:${PORT}`))
);
