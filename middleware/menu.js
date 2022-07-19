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
async function menu(req, res, next,_route,_title)
{   
  let jwt = req.cookies.authorization;

  if(jwt && jwt != null && jwt != "")
  {
    var base64Url = jwt.split('.')[1];

    var d = JSON.parse(atob(base64Url))

    var balance = await User.findAll(
      {
          attributes: ['USDT_balance']
      },
      {
          where: {email: d.email }
      }).then((results) => 
      {
         var json =  JSON.stringify(results);
  
         
         var jsonParsedData = JSON.parse(json);
         for(var i = 0; i < jsonParsedData.length; i++)
         {
            var data = jsonParsedData[i]['USDT_balance'];
            
            if(data!="")
            {
              return Math.round((data + Number.EPSILON) * 100) / 100;
            }
  
            else
            {
              return "00.00";
            }
         }
  
      });

    res.render(_route,{title: title+" | "+_title,name: d.name,email: d.email,status:"loggedIn",balance:balance});
    
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