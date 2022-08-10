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
var randToken = require('rand-token');
var requestIp = require('request-ip');
var deviceDetector = require('device-detector-js');
var ejs = require('ejs');
var path = require('path')
var send = require("../middleware/mail");
const csrfProtection = require('../middleware/check_csrf');

var deauth = require('../middleware/deauth');
const { Template } = require('ejs');

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
    res.cookie('XSRF', csrfToken(req,res),{secure:false, sameSite:'lax',httpOnly: true});
    res.render('login', { page:"signup",title: title+" | "+"Login",csrfToken:csrfToken(req,res)});
});


router.post('/', deauth, csrfProtection, async(req, res, next)=>{
  
  const resKey = req.body['g-recaptcha-response']
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`
  
  var _csrf = req.cookies.XSRF;

   var email = req.body.email;
   var password = req.body.password;
   var from = 'Tech Team';
   var subject = 'Login Attempt';
   
   var user = await User.findOne(
      {
        where: {email: email}
      });

  if(email != "" && password != "")
  {
    if(req.body._csrf == _csrf)
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
                /* token = jwt.sign({"tryToGuess":randToken.generate(15), "id" : user.id,"email" : user.email,"name":user.full_name },process.env.SECRET,{
                  expiresIn: '30d'
                }); */
  
                var clientIp = requestIp.getClientIp(req);
                var devicedetector = new deviceDetector();
                var useragent = req.get('user-agent');
                var device = devicedetector.parse(useragent);
                var userAgent = JSON.stringify(device); 
                var finalAgent = JSON.parse(userAgent);
  
                ejs.renderFile(path.join(__dirname, '../views/email_templates/login.ejs'), 
                  {
                    name: user.full_name,
                    ip: clientIp,
                    agent: finalAgent.client.name,
                    os: finalAgent.os.name,
                    device: finalAgent.device.type,
                  })
                  .then(async(template) =>
                  {
                    send(from,user.email,subject,template);
  
                    fetch(url, {
                      method: 'post',
                    })
                      .then(async(response) => response.json())
                      .then(async(google_response) => {
                          if (google_response.success == true)
                          {
                            var otp = randToken.generate(8);

                            await User.update(
                              {
                                 otp : otp,
                              },
                              {
                                where: {email: email}
                              })
                            
                            send(from,user.email,"OTP Verification","<p>Your OTP is&nbsp;"+otp+"</p>")
                            
                            /* .cookie('authorization',token,{sameSite:'lax',httpOnly: true}) */
                            res.cookie('OTP',randToken.generate(100),{sameSite:'lax',httpOnly: true})
                            .status(200)
                            .json({"msg":"/otp"});
                          }
      
                          else
                          {
                            res.status(403).json({"msg":"Captcha verification failed!"});
                            res.end();
                          }
      
                        });
                  })
  
              }
  
              else
              {
                res.status(403).json({"msg":"Your email is unverified, please verify it to access your account!"})
                res.end();
              }
            }
  
            else
            {
               res.status(401).json({"msg":"Wrong Email format!"});
               res.end();
            }
         }
  
         else
         {
            res.status(401).json({"msg":"Email or Password is wrong!"});
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

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

module.exports = router;