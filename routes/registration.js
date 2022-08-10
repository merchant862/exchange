var express = require('express');
var router = express.Router();
var app = express();
var cookieParser = require("cookie-parser");
const Models = require('./../models');
const bcrypt = require("bcrypt");
var validator = require("node-email-validation");
var randtoken = require('rand-token');
var phone_validator = require('libphonenumber-js');
var path = require('path');
var ejs = require('ejs');
const csrfProtection = require('../middleware/check_csrf');

var send = require("../middleware/mail");

const dotenv = require('dotenv');
const fetch = require("isomorphic-fetch");

var deauth = require('../middleware/deauth');

var web3 = require('../config/web3');

const User = Models.User;
const userkYC = Models.user_kyc;
dotenv.config();

var title = process.env.TITLE;

var seed = process.env.SEED;

app.use(cookieParser())

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
  res.render('signup', { title: title+" | "+"Signup",page:"login",csrfToken:csrfToken(req,res) } );
});

router.post('/', deauth, csrfProtection, async(req, res, next)=>{
  
  const resKey = req.body['g-recaptcha-response']
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`
  var _csrf = req.cookies.XSRF;

   //-------------

   var name = req.body.name;
   var email = req.body.email;
   var password = req.body.password;
   var password2 = req.body.password2;
   var phone = req.body.phone;
   var country = req.body.country;
   var verified = "NO";
   var key = await web3.eth.accounts.create(seed).privateKey;
   var address = await web3.eth.accounts.privateKeyToAccount(key).address;

   //-------------
   
   var token = randtoken.generate(100);
   
   //-------------
   
   var from = 'Tech Team';
   var subject = 'Account Confirmation';
   
   //-------------

  var checkEmail = await User.count({where: {email: email}});
  
  const salt = await bcrypt.genSalt(10);
  
  if(name != "" && email != "" && password != "" && phone != "" && country != "")
  {
    if(req.body._csrf == _csrf)
    {
      if(checkEmail == 0 )
      {
         if(password.length > 8)
         {
          if(password == password2)
          {
             if(validator.is_email_valid(email))
             {
               try
               {
                 var num = phone_validator.parsePhoneNumber(phone,country).formatInternational();
   
                 if(!num && !phone_validator.isValidNumber(num) && !phone_validator.isPossibleNumber(num))
                 {
                   res.status(403).json({"msg":"Invalid Mobile Number!"});
                   res.end();
                 }
     
                 else
                 {
                   var usr = 
                   {
                     full_name : name,
                     email : email,
                     password : await bcrypt.hash(password,salt),
                     verified: verified,
                     verification_token:token,
                     phone: num,
                     country: country,
                     USDT_balance: 0,
                     buyLimitDiscountedPrice: 0,
                     address: address,
                     privateKey: key
                   };
               
                   created_user = await User.create(usr);
       
                   var userID = await User.findAll(
                     {
                       where:
                       {
                         email: email
                       }
                     }).then((results) => 
                     {
                         var json =  JSON.stringify(results);
                   
                         var jsonParsedData = JSON.parse(json);
                         for(var i = 0; i < jsonParsedData.length; i++)
                         {
                             return jsonParsedData[i]["id"] 
                         }
                 
                     });
                   
                   var kycData = 
                   {
                     f_key: userID,
                     KYC_LEVEL_1: 'NO',
                     KYC_LEVEL_2: 'NO',
                     KYC_LEVEL_1_TRY: 0,
                     KYC_LEVEL_2_TRY: 0,
                   }
                   
                   var add_KYC_data = await userkYC.create(kycData);
   
                   ejs.renderFile(path.join(__dirname, '../views/email_templates/registration.ejs'), 
                   {
                     name: name,
                     link: 'http://localhost:3000/verify?token='+token,
                   })
                   .then(async(template) =>
                   {
                      send(from,email,subject,template);
   
                      fetch(url, {
                       method: 'post',
                     })
                       .then((response) => response.json())
                       .then((google_response) => {
                           if (google_response.success == true)
                           {
                             res.status(200).json({"msg":"Registration done, check your Email for verification code!"});
                             res.end();
                           }
         
                           else
                           {
                             res.status(401).json({"msg":"Captcha verification failed!"});
                             res.end();
                           }
         
                         });
                   })
   
                 }
               }
               
               catch(e)
               {
                   res.status(403).json({"msg":e.message});
                   res.end();
               }
             }
   
             else
             {
               res.status(403).json({"msg":"Wrong Email format!"});
               res.end();
             }
          }
   
          else
          {
             res.status(401).json({"msg":"Passwords don't match!"});
             res.end();
          }
         }
  
         else
         {
            res.status(401).json({"msg":"Password length should be greater than 8 characters!"});
            res.end();
         }
         
      }
  
      else
      {
        res.status(401).json({"msg":"User with this email already exists, try another one!"});
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