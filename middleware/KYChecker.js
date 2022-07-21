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

async function getdata(req, res, next)
{   
  let jwt = req.cookies.authorization;
  
  if (jwt && jwt != "")
  {
    var base64Url = jwt.split('.')[1];

    var d = JSON.parse(atob(base64Url));

    var isDone = await User.findAll(
            
            {
                where: 
                {
                    email: d.email,
                }
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

            if(isDone.isKYCDone == "NO" || isDone.isKYCDone == "PENDING")
            {
            res.redirect("/kyc");
            }

            else
            {
                next();
            }
  }

  else
  {
     res.redirect("/login");
  }

};

module.exports = getdata;