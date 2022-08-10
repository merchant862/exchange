var express = require('express');
var router = express.Router();
var app = express();
var cookieParser = require("cookie-parser");
const Models = require('./../models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var validator = require("node-email-validation");
const dotenv = require('dotenv');
const fetch = require("isomorphic-fetch");
var randtoken = require('rand-token');
var deauth = require('../middleware/deauth');
var ejs = require("ejs");
var path = require("path");

var send = require("../middleware/mail");
const csrfProtection = require('../middleware/check_csrf');

const User = Models.User;
dotenv.config();

app.use(cookieParser())

var title = process.env.TITLE;

function csrfToken(req,res)
{
    var token = req.csrfToken();
    /* res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token; */
    
    return token;
}

/* GET users listing. */
router.get('/', deauth, csrfProtection, function(req, res, next) 
{
    res.cookie('XSRF', csrfToken(req,res),{secure:false, sameSite:'lax',httpOnly: true}); 
    res.render('reset-pass',{page:"login",title: title+" | "+"Reset Password",csrfToken:csrfToken(req,res)});
});


router.post('/', deauth, csrfProtection, async(req, res, next)=>{
  
  const resKey = req.body['g-recaptcha-response']
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`
  var _csrf = req.cookies.XSRF;

  var token = randtoken.generate(10);
   
   //-------------
   
   var email = req.body.email;
   
   var user = await User.findOne(
      {
        where: {email: email}
      });

  if(email != "")
  {
    if(req.body._csrf == _csrf)
    {
      if(user)
      {
         
            if(validator.is_email_valid(email))
            {
                fetch(url, {
                  method: 'post',
                })
                  .then((response) => response.json())
                  .then((google_response) => {
                      if (google_response.success == true)
                      {
                          let salt = bcrypt.genSaltSync(10);
  
                          let hashedToken = bcrypt.hashSync(token,salt);
  
                          final_token = jwt.sign({ "tryToGuess":hashedToken },process.env.SECRET,{expiresIn: '15m'});
  
                          var from = 'Tech Team';
                          var subject = 'Reset Password';
                          
                          User.update(
                            { 
                              password_reset_token: final_token, 
                            },
                            {
                              where: {email: user.email}    
                            });
                            
                            ejs.renderFile(path.join(__dirname, '../views/email_templates/reset-pass.ejs'), 
                                      {
                                        name: user.full_name,
                                        link: 'http://localhost:3000/update-pass?token='+final_token,
                                      })
                                      .then(async(template) =>
                                      {
                                        send(from,email,subject,template);
  
                                        res.status(200).json({"msg":"Email sent, please check your inbox for password reset link!"});
                                        res.end();
                                      })
  
                      }
  
                      else
                      {
                        res.status(401).json({"msg":"Captcha verification failed!"});
                        res.end();
                      }
  
                    });
  
            }
  
            else
            {
               res.status(403).json({"msg":"Wrong Email format!"});
               res.end();
            }
         
      }
  
      else
      {
          res.status(401).json({"msg":"User doesn't exist!"});
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