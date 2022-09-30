const app = require("express")();
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const cookie_parser = require("cookie-parser");
const env = require("dotenv").config();

const cookie_parser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const cors = require("cors");

app.use(cookie_parser());
app.set("trust proxy", 1);

const server = http.createServer(app, {
  cors: {
    origin: [
      "http://localhost:4000",
      "https://smooon.vercel.app",
      "https://smooon.netlify.app",
    ],
  },
});

mongoose
  .connect(process.env.url)
  .then(() => {
    console.log("connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

server.listen(process.env.port, () => {
  console.log("Server is now running");
});
