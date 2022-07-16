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
async function menu(req, res, next,_route,_title)
{   
  let jwt = req.cookies.authorization;

  if(jwt && jwt != null && jwt != "")
  {
    var base64Url = jwt.split('.')[1];

    var d = JSON.parse(atob(base64Url))

    res.render(_route,{title: title+" | "+_title,name: d.name,email: d.email,status:"loggedIn"});
    
    next();
  }

  else
  {
    res.render(_route,{title: title+" | "+_title,status:"loggedOut",page:"login"});

    next();
  }

    /* res.render('partials/authenticated-menu', { name:d.name,email: d.email}); */
};


module.exports = menu;