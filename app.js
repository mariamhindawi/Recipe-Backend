var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require ('mongoose');
var cors = require("cors");

require('dotenv').config()

const router = require('./routes/recipe.routes');

const corsOptions = {
    origin: 'https://cool-recipe-app.netlify.app',
    methods: "GET,PUT,POST,DELETE,OPTIONS",
    credentials: true,
    maxAge: 5,
    allowedHeaders: '*',
    preflightContinue: false,
    header:"Content-type: image"
  };

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Connected to database successfully"))
.catch(err=>console.log(err.message))


 app.use('/', router)
module.exports = app;
