var express = require('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const atob = require("atob");
const Models = require('./../models');
const User = Models.User;

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

  var userData = await User.findAll(
    {
        where: {email: d.email }
    }).then((results) => 
    {
       var json =  JSON.stringify(results);

       
       var jsonParsedData = JSON.parse(json);
       for(var i = 0; i < jsonParsedData.length; i++)
       {
          var data = jsonParsedData[i];
          
          return data;  
       }

    });

  res.render(_route,
    {
      title: title+" | "+_title,
      name: d.name,
      email: d.email,
      balance:userData.USDT_balance,
      address:userData.address,
    });

};


module.exports = authMenu;