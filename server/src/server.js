const app = require("./app");
const connectDB = require("./config/db");
//const logger = require("./controllers/loggerController");
const { PORT } = require("./secret");

app.listen(PORT, async () => {
  console.log(`the server is running at http://localhost:${PORT}`);
  await connectDB();

  //logger.log("info", `the server is running at http://localhost:${PORT}`);
  //await connectDB();
});
