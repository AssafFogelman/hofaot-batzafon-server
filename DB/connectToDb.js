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

console.log(chalk.redBright("process.env.DBADDRESS", process.env.DBADDRESS));
mongoose
  .connect(`${process.env.DBADDRESS}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(chalk.magentaBright.bold("connected to MongoDb!")))
  .catch((error) =>
    console.log(chalk.redBright.bold(`could not connect to mongoDb: ${error}`))
  );
