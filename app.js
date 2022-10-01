const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cookie_parser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const cors = require("cors");

app.use(cookie_parser());
app.use(express.json());
app.set("trust proxy", 1);
mongoose
  .connect(process.env.url)
  .then(() => {
    console.log("Successfully connected to the database.");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://smooon.vercel.app"],
  })
);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is now running");
});
