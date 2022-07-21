var express = require('express');
var router = express.Router();
const fetch = require("isomorphic-fetch");
const cookieParser = require("cookie-parser");
const atob = require("atob");
const multer  = require('multer');
const auth = require('./../middleware/auth');
const authMenu = require("../middleware/auth-menu");
var send = require("../middleware/mail");
const app = express();
var dotenv = require("dotenv");
const Models = require('./../models');
const User = Models.User;

dotenv.config();

var title = process.env.TITLE;

app.use(cookieParser())

//--------------------------------
const upload = multer(
{
    limits : {fileSize : 10000000}
}).fields(
    [
    { name: "id", maxCount: 1 },
    { name: "face", maxCount: 1 },
]);
//--------------------------------

router.get('/', auth, function(req, res, next) 
{
    let jwt = req.cookies.authorization;
    var base64Url = jwt.split('.')[1];
    var d = JSON.parse(atob(base64Url))

    authMenu(req,res,next,'kyc',title+" | "+"KYC");

});

router.post('/', auth, upload, function(req,res,next)
{
    let jwt = req.cookies.authorization;
    var base64Url = jwt.split('.')[1];
    var d = JSON.parse(atob(base64Url))
    


    const resKey = req.body['g-recaptcha-response']
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`

    var from = 'Tech Team';
    var subject = 'KYC Documents';
    var html = 'Welcome&nbsp;<b>' 
               + d.name + 
              '</b><br/><p>We have received your documents.</p></br><p>You will be nofified once we get you approved.</p>';
    
    fetch(url, {method: 'post',})
                .then((response) => response.json())
                .then((google_response) => 
                {
                    if (google_response.success == true)
                    {
                        User.update(
                            { 
                               isKYCDone: 'PENDING', 
                            },
                            {
                               where: {email: d.email}    
                            });
                        
                        send(from,d.email,subject,html);

                        authMenu(req,res,next,'kyc',title+" | "+"KYC","success","We have received your documents, you will get notified once we review them!");
                    }
    
                    else
                    {
                        authMenu(req,res,next,'kyc',title+" | "+"KYC","error","Captcha verification failed!");
                    }
                });       
})



module.exports = router;