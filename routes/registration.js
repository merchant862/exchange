var express = require('express');
var router = express.Router();
const Models = require('./../models');
const bcrypt = require("bcrypt");
//const jwt = require('jsonwebtoken');
var validator = require("node-email-validation");
var randtoken = require('rand-token');

var send = require("../middleware/mail");

const dotenv = require('dotenv');
const fetch = require("isomorphic-fetch");

var deauth = require('../middleware/deauth');

const User = Models.User;

dotenv.config();

var title = process.env.TITLE;

/* GET users listing. */
router.get('/', deauth,function(req, res, next) 
{
  
  res.render('signup', { title: title+" | "+"Signup",page:"login" } );
});

router.post('/', deauth, async(req, res, next)=>{
  
  const resKey = req.body['g-recaptcha-response']
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`

   //-------------

   var name = req.body.name;
   var email = req.body.email;
   var password = req.body.password;
   var password2 = req.body.password2;
   var phone = req.body.phone;
   var verified = "NO";

   //-------------
   
   var token = randtoken.generate(100);
   
   //-------------
   
   var from = 'Tech Team';
   var subject = 'Account Confirmation';
   var html = 'Welcome&nbsp;<b>' 
               + name + 
              '</b><br/><p>Your account has been created!</p></br>Please verify your email here: <a href="http://localhost:3000/verify?token='+token+'">This Link!</a>';

   //-------------

  var checkEmail = await User.count({where: {email: email}});
  
  const salt = await bcrypt.genSalt(10);
  
  if(name != "" && email != "" && password != "" && phone != "")
  {
    if(checkEmail == 0 )
    {
       if(password == password2)
       {
          if(validator.is_email_valid(email))
          {
            var usr = 
            {
              full_name : name,
              email : email,
              password : await bcrypt.hash(password,salt),
              verified: verified,
              verification_token:token,
              phone: phone
            };
        
            created_user = await User.create(usr);
            
            send(from,email,subject,html);

            fetch(url, {
              method: 'post',
            })
              .then((response) => response.json())
              .then((google_response) => {
                  if (google_response.success == true)
                  {
                    res.status(200).
                    render('signup',{title: title+" | "+"Signup",page:"login", success:'Registration done, check your Email for verification code!' });
                  }

                  else
                  {
                    res.status(403).
                    render("signup",{title: title+" | "+"Signup",page:"login",error:"Captcha verification failed!"});
                  }

                });
            
            
          }

          else
          {
             res.status(201).render("signup",{title: title+" | "+"Signup",page:"login",error:"Wrong Email format!"});
          }
       }

       else
       {
          res.status(201).render("signup",{title: title+" | "+"Signup",page:"login",error:"Passwords don't match!"});
       }
    }

    else
    {
        res.status(201).render("signup",{title: title+" | "+"Signup",page:"login",error:"User with this email already exists, try another one!"});
    }
  }

  else
  {
      res.status(201).render("signup",{title: title+" | "+"Signup",page:"login",error:"Fields can't be empty!"});
  }
  
});

module.exports = router;