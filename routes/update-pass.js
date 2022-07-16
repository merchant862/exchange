var express = require('express');
var router = express.Router();
const Models = require('./../models');
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { parse } = require('path');
var deauth = require('../middleware/deauth');

const User = Models.User;
dotenv.config();

var title = process.env.TITLE;

router.get('/', deauth, function(req, res, next) 
{
    res.render('update-pass',{title:title+" | "+"Password Updation",page:"login"});
});


router.post('/', deauth, async function(req, res, next) 
{
    const resKey = req.body['g-recaptcha-response']
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`

    let pass1 = req.body.password1;
    let pass2 = req.body.password2;
    let token = req.body.token;
    
    if(token != "")
    {
        var user = await User.findOne(
            {
                where: {password_reset_token: token}
            });

        if(!user)
        { 
            res.status(400).render("update-pass",{title:title+" | "+"Password Updation",page:"login",error:"Invalid link"});
        } 

        else
        {
            if(pass1 != "" && pass2 != "" && token != "")
            {  
                if(pass1 == pass2)
                {
                    fetch(url, {
                        method: 'post',
                    })
                        .then((response) => response.json())
                        .then((google_response) => {
                            if (google_response.success == true)
                            {
                                jwt.verify(token, process.env.SECRET ,(err,result)=>
                                {
                                    if(!err)
                                    {
                                        var salt =  bcrypt.genSaltSync(10);

                                        var hashed_pass = bcrypt.hashSync(pass1.toString(),parseInt(salt));
                                        
                                        User.update({ 
                                            password_reset_token: '',
                                            password: hashed_pass 
                                        },
                                        {
                                            where: {email: user.email}    
                                        });
                                
                                        res.status(200).render("update-pass",{title:title+" | "+"Password Updation",page:"login",success:"Password updated!"});
                                    }

                                    else
                                    {
                                        res.status(403).render("update-pass",{title:title+" | "+"Password Updation",page:"login",error:"Token expired!"});
                                    }
                                });

                            }
    
                            else
                            {
                            res.status(403).
                            render("update-pass",{title:title+" | "+"Password Updation",page:"login",error:"Captcha verification failed!"});
                            }
    
                        });
                }
    
                else
                {
                    res.status(400).render("update-pass",{title:title+" | "+"Password Updation",page:"login",error:"Passwords don't match!"});   
                }
            }

            else
            {
                res.status(400).render("update-pass",{title:title+" | "+"Password Updation",page:"login",error:"Fields can't be empty!"});
            }
        }
    }

    else
    {
      res.status(400).render("update-pass",{title:title+" | "+"Password Updation",page:"login",error:"Invalid token"});
    }
});

module.exports = router;