const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config()

const accountRouter = require("./api/router/accountRouter");
const activityRouter = require("./api/router/activityRouter");



//connect Mongodb
mongoose.connect('mongodb+srv://'+ process.env.DB_USERNAME +':'+ process.env.DB_PASSWORD +'@splitact.wudub.mongodb.net/'+ process.env.DB_NAME +'?retryWrites=true&w=majority',{
 useUnifiedTopology: true ,
  useNewUrlParser: true
}).catch(err => {
  console.log(err);
  
}) 


app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

app.get('/',(req,res,next) => {
  res.status(200).json({
    message:'hello splitact backend'
  })
})

//select api
app.use("/account", accountRouter);
app.use("/activity",activityRouter);

app.use('/test',(req,res,next) => {
  
  res.status(200).end()
})


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