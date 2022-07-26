var express = require('express');
var router = express.Router();
const Models = require('./../models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
var validator = require("node-email-validation");
const dotenv = require('dotenv');
const fetch = require("isomorphic-fetch");

var deauth = require('../middleware/deauth');

const User = Models.User;
dotenv.config();

let title = process.env.TITLE;

/* GET users listing. */
router.get('/', deauth,function(req, res, next) 
{
    res.render('login', { page:"signup",title: title+" | "+"Login"});
});


router.post('/', deauth, async(req, res, next)=>{
  
  const resKey = req.body['g-recaptcha-response']
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`


   var email = req.body.email;
   var password = req.body.password;
   
   var user = await User.findOne(
      {
        where: {email: email}
      });

  if(email != "" && password != "")
  {
    if(user)
    {
       //var hashedPass = await bcrypt.hash(password,salt); 
       const is_password_valid = await comparePassword(password,user.password);

       if(is_password_valid)
       {
          if(validator.is_email_valid(email))
          {
            if(user.verified == "YES")
            {   

              token = jwt.sign({ "id" : user.id,"email" : user.email,"name":user.full_name },process.env.SECRET,{
                expiresIn: '30d'
              });

              fetch(url, {
                method: 'post',
              })
                .then(async(response) => response.json())
                .then(async(google_response) => {
                    if (google_response.success == true)
                    {
                      res.cookie('authorization',token,
                        {sameSite:'lax',httpOnly: true}
                        )
                        .status(200);
                        res.redirect("/home");
                    }

                    else
                    {
                      res.status(403).
                      render("login",{page:"signup",title: title+" | "+"Login",error:"Captcha verification failed!"});
                    }

                  });

            }

            else
            {
              res.status(403).render("login",{page:"signup", title: title+" | "+"Login","error":"Your email is unverified, please verify it to access your account!"})
            }
          }

          else
          {
             res.status(401).render("login",{page:"signup",title: title+" | "+"Login","error":"Wrong Email format!"});
          }
       }

       else
       {
          res.status(401).render("login",{page:"signup",title: title+" | "+"Login","error":"Email or Password is wrong!"});
       }
    }

    else
    {
        res.status(404).render("login",{page:"signup",title: title+" | "+"Login","error":"User doesn't exist, signup to access!"});
    }
  }

  else
  {
      res.status(201).render("login",{page:"signup",title: title+" | "+"Login","error":"Fields can't be empty!"});
  }
  
});

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

module.exports = router;