var express = require('express');
var router = express.Router();
const Models = require('./../models');
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
var deauth = require('../middleware/deauth');
var app = express();
var cookieParser = require("cookie-parser");
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

router.get('/', deauth, csrfProtection, async function(req, res, next) 
{
    var token = req.query.token;
    
    if(req.url.includes('?'))
    {
        if(token != "")
        {
            res.cookie('XSRF', csrfToken(req,res),{secure:false, sameSite:'lax',httpOnly: true});
            res.render('update-pass',{title:title+" | "+"Password Updation",page:"login",csrfToken:csrfToken(req,res)});    
        }

        else
        {
            res.status(404).redirect('404');
        }
    }

    else
    {
        res.status(404).redirect('404');
    }
});


router.post('/', deauth, csrfProtection, async function(req, res, next) 
{
    const resKey = req.body['g-recaptcha-response']
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`

    let pass1 = req.body.password1;
    let pass2 = req.body.password2;
    let token = req.query.token;
    var _csrf = req.cookies.XSRF;
    
    if(token != "")
    {
        var user = await User.findOne(
            {
                where: {password_reset_token: token}
            });

        if(req.body._csrf == _csrf)
        {
            if(!user)
            {   
                res.status(401).json({"msg":"Invalid link"});
            } 
    
            else
            {
                if(pass1 != "" && pass2 != "")
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
                                                password_reset_token: null,
                                                password: hashed_pass 
                                            },
                                            {
                                                where: {email: user.email}    
                                            });
                                    
                                            res.status(200).json({"msg":"Password updated, redirecting to login!"});
                                            res.end();
                                        }
    
                                        else
                                        {
                                            res.status(401).json({"msg":"Token expired!"});
                                            res.end();
                                        }
                                    });
    
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
                        res.status(401).json({"msg":"Passwords don't match!"});
                        res.end();   
                    }
                }
    
                else
                {
                    res.status(401).json({"msg":"Fields can't be empty!"});
                    res.end();
                }
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
        res.status(401).json({"msg":"Invalid token"});
        res.end(); 
    }
});

module.exports = router;