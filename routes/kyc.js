var express = require('express');
var router = express.Router();
const fetch = require("isomorphic-fetch");
const cookieParser = require("cookie-parser");
const atob = require("atob");
const multer  = require('multer');
const auth = require('./../middleware/auth');
const app = express();
var dotenv = require("dotenv");

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

    res.render("kyc",{title:title+" | "+"KYC",name:d.name,email:d.email})

});

router.post('/', auth, upload, function(req,res,next)
{
    let jwt = req.cookies.authorization;
    var base64Url = jwt.split('.')[1];
    var d = JSON.parse(atob(base64Url))

    const resKey = req.body['g-recaptcha-response']
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`
    
    fetch(url, {method: 'post',})
                .then((response) => response.json())
                .then((google_response) => 
                {
                    if (google_response.success == true)
                    {
                        res.render("kyc",
                        {
                            title:title
                            ,name:d.name
                            ,email:d.email
                            ,success:"We have received your documents, you will get notified once we review them!"
                        });
                    }
    
                    else
                    {
                        res.render("kyc",
                        {
                            title:title
                            ,name:d.name
                            ,email:d.email
                            ,error:"Captcha verification failed!"
                        });                    
                    }
                });       
})



module.exports = router;