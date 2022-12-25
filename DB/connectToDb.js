const mongoose = require("mongoose");
const chalk = require("chalk");

// mongoose
//   .connect("mongodb://127.0.0.1:27017/shows-project", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log(chalk.magentaBright.bold("connected to MongoDb!")))
//   .catch((error) =>
//     console.log(chalk.redBright.bold(`could not connect to mongoDb: ${error}`))
//   );

mongoose
  .connect(
    "mongodb+srv://deepkfiz:deepkfiz7121@cluster0.mqwwdma.mongodb.net/hofaotBatzafon?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(chalk.magentaBright.bold("connected to MongoDb!")))
  .catch((error) =>
    console.log(chalk.redBright.bold(`could not connect to mongoDb: ${error}`))
  );
