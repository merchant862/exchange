var express = require('express');
const cookieParser = require("cookie-parser");
var app = express();
const csrf = require('csurf');

app.use(cookieParser())

module.exports = csrfProtection = 
csrf(
    { 
      cookie: 
      {
        httpOnly: "true",
        secure: "false",
        sameSite: "lax",
      } 
    });
