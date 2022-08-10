var express = require('express');
var router = express.Router();
var app = express();
var cookieParser = require("cookie-parser");
const Models = require('./../models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
var randToken = require('rand-token');
const csrfProtection = require('../middleware/check_csrf');

var deauth = require('../middleware/deauth');

const User = Models.User;
dotenv.config();

app.use(cookieParser())

let title = process.env.TITLE;

function csrfToken(req,res)
{
    var token = req.csrfToken();
    /* res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token; */
    
    return token;
}

/* GET users listing. */
router.get('/', deauth, csrfProtection, async(req, res, next)=>
{
    var OTP_COOKIE = await req.cookies.OTP;

    if(!OTP_COOKIE && OTP_COOKIE == "")
    {
        res.status(403).redirect('/404');
    }

    else
    {
        res.cookie('XSRF', csrfToken(req,res),{secure:false, sameSite:'lax',httpOnly: true});
        res.render('otp', { page:"login",title: title+" | "+"OTP",csrfToken:csrfToken(req,res)});
    }
});


router.post('/', deauth, csrfProtection, async(req, res, next)=>{
  
  var _csrf = req.cookies.XSRF;

   var otp = req.body.otp;
   
   
   var user = await User.findOne(
      {
        where: {otp: otp}
      });

  if(otp != "")
  {
    if(req.body._csrf == _csrf)
    {
      if(user)
      {
        if(user.otp == otp)
        {   
            await User.update(
                {
                   otp : null,
                },
                {
                  where: {otp: otp}
                })
            
          token = jwt.sign({"tryToGuess":randToken.generate(15), "id" : user.id,"email" : user.email,"name":user.full_name },process.env.SECRET,{
            expiresIn: '30d'
          });

          res.clearCookie('OTP');

          res.cookie('authorization',token,{sameSite:'lax',httpOnly: true})
          .status(200)
          .json({"msg":"/"});
        }

        else
        {
          res.status(403).json({"msg":"Invalid OTP!"})
          res.end();
        }
      }
  
      else
      {
          res.status(404).json({"msg":"User doesn't exist, signup to access!"});
          res.end();
      }
    }

    else
    {
      res.status(403).json({"msg":"Request was tampered!"});
      res.end();
    }
  }

  else
  {
      res.status(401).json({"msg":"Fields can't be empty!"});
      res.end();
  }
  
});


module.exports = router;