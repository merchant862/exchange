const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
dotenv.config();

var title = process.env.TITLE;

app.use(cookieParser());

const deauth = async(req, res, next) => {
 
  const token = await req.cookies.authorization;
  
  if(token && token != "")
  {
    res.redirect("/home");
    res.end();
  }

  else
  {
    next();
  }

  /* if (token!="") 
  {
    await jwt.verify(token, process.env.SECRET, (err,verifiedJWT) => 
    {
      if(err)
      {
        res.render('login',{title:title+" | "+"Login",error:"Invalid JWT Token",page:"signup"});
      }

      else
      {
        next();
      }

    })
  }

  else
  {
    return res.render('login',{error:"bla",title:title+" | "+"Login",page:"signup"});  
  } */

};


module.exports = deauth;