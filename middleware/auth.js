const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
dotenv.config();

app.use(cookieParser());

var title = process.env.TITLE;

const authorization = async(req, res, next) => {
 
  const token = await req.cookies.authorization;
 
  if (!token) 
  {
    return res.redirect('/login');
  }

  else
  {
    await jwt.verify(token, process.env.SECRET, (err,verifiedJWT) => 
    {
      if(err)
      {
        res.redirect('/login');
      }

      else
      {
        next();
      }

    })
  }

};


module.exports = authorization;