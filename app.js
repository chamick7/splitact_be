const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

global.__basedir = __dirname;

const accountRouter = require("./api/router/accountRouter");
const activityRouter = require("./api/router/activityRouter");
const fileRouter = require("./api/router/fileRouter");
const contactRouter = require("./api/router/contactRouter");

//connect Mongodb
mongoose
  .connect(
    "mongodb://" +
      process.env.DB_USERNAME +
      ":" +
      process.env.DB_PASSWORD +
      "@128.199.227.162:4444/splitactDB?authSource=admin",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .catch((err) => {
    console.log(err);
  });

// app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  let allowedOrigins = ["http://localhost:3000", "https://splitact.com"];
  let origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "hello splitact backend",
  });
});

app.use(express.static(__dirname + "/public"));
//select api
app.use("/account", accountRouter);
app.use("/activity", activityRouter);
app.use("/file", fileRouter);
app.use("/contact", contactRouter);
app.use("/test", (req, res, next) => {
  res.status(200).end();
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
