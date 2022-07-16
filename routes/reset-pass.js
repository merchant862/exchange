var express = require('express');
var router = express.Router();
const Models = require('./../models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var validator = require("node-email-validation");
const dotenv = require('dotenv');
const fetch = require("isomorphic-fetch");
var randtoken = require('rand-token');
var deauth = require('../middleware/deauth');

var send = require("../middleware/mail");

const User = Models.User;
dotenv.config();

var title = process.env.TITLE;

/* GET users listing. */
router.get('/', deauth, function(req, res, next) 
{
    res.render('reset-pass',{page:"login",title: title+" | "+"Reset Password"});
});


router.post('/', deauth, async(req, res, next)=>{
  
  const resKey = req.body['g-recaptcha-response']
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`

  var token = randtoken.generate(10);
   
   //-------------
   
   var email = req.body.email;
   
   var user = await User.findOne(
      {
        where: {email: email}
      });

  if(email != "")
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

                        final_token = jwt.sign({ hashedToken },process.env.SECRET,{expiresIn: '15m'});

                        var from = 'Tech Team';
                        var subject = 'Reset Password';
                        var html = 'Dear&nbsp;User<br/><p>We received your request to change the password!</p></br>Please visit this link: <a href="http://localhost:3000/update-pass">http://localhost:3000/update-pass</a> </br> Copy this token and paste there to reset your password: <p>'+final_token;
                        
                        User.update(
                          { 
                            password_reset_token: final_token, 
                          },
                          {
                            where: {email: user.email}    
                          });
                          
                          send(from,email,subject,html);

                          res.status(200).
                          render("reset-pass",{page:"login",title: title+" | "+"Reset Password",success:"Email sent, please check your inbox for password reset link!"});
                    }

                    else
                    {
                      res.status(403).
                      render("reset-pass",{page:"login",title: title+" | "+"Reset Password",error:"Captcha verification failed!"});
                    }

                  });

          }

          else
          {
             res.status(401).render("reset-pass",{page:"login",title: title+" | "+"Reset Password","error":"Wrong Email format!"});
          }
       
    }

    else
    {
        res.status(404).render("reset-pass",{page:"login",title: title+" | "+"Reset Password","error":"User doesn't exist!"});
    }
  }

  else
  {
      res.status(201).render("reset-pass",{page:"login",title: title+" | "+"Reset Password","error":"Fields can't be empty!"});
  }
  
});

module.exports = router;