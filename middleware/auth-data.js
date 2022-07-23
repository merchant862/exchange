const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const atob = require("atob");
var express = require('express');
const Models = require('../models');
const User = Models.User;
var app = express()

dotenv.config();

app.use(cookieParser())

module.exports = async function getdata(req)
{   
  let jwt = req.cookies.authorization;
  
  var base64Url = jwt.split('.')[1];

  var d = JSON.parse(atob(base64Url));

  var data = await User.findAll(
    {
        where: {email: d.email }
    }).then((results) => 
    {
        var json =  JSON.stringify(results);
  
        var jsonParsedData = JSON.parse(json);
        for(var i = 0; i < jsonParsedData.length; i++)
        {
            return jsonParsedData[i] 
        }

    });

    return data;
};