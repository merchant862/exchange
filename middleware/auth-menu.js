var express = require('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const atob = require("atob");

//var auth = require('./auth');
const app = express();

dotenv.config();

app.use(cookieParser())

var title = process.env.TITLE;

/* GET users listing. */
async function authMenu(req, res, next,_route,_title)
{   
  let jwt = req.cookies.authorization;
  
  var base64Url = jwt.split('.')[1];

  var d = JSON.parse(atob(base64Url))

  res.render(_route,{title: title+" | "+_title,name: d.name,email: d.email});

  next();
};


module.exports = authMenu;