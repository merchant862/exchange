var express = require('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const atob = require("atob");

//var auth = require('./auth');
const app = express();

dotenv.config();

app.use(cookieParser())

async function getdata(req, res, next)
{   
  let jwt = req.cookies.authorization;
  
  var base64Url = jwt.split('.')[1];

  var d = JSON.parse(atob(base64Url));

  return d.email;
};


module.exports = getdata;