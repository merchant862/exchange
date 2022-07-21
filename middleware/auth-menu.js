var express = require('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const atob = require("atob");
const Models = require('./../models');
const User = Models.User;
var QRCode = require('qrcode')

//var auth = require('./auth');
const app = express();

dotenv.config();

app.use(cookieParser())

var title = process.env.TITLE;

/* GET users listing. */
async function authMenu(req, res, next,_route,_title,_msg_type,_msg)
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

    
var opts = 
    {
      type: 'image/jpeg',
      quality: 0.3,
      margin: 0.5,
      color: {
        dark:"#000000",
        light:"#FFFFFF"
      }
    }

    var code = await QRCode.toDataURL(userData.address, opts)

  res.render(_route,
    {
      title: title+" | "+_title,
      name: d.name,
      email: d.email,
      balance:userData.USDT_balance,
      address:userData.address,
      state:userData.isKYCDone,
      _msg_type,_msg,
      code:code,
    });

};


module.exports = authMenu;