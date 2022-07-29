var express = require('express');
const fileupload = require("express-fileupload");
var router = express.Router();
const fetch = require("isomorphic-fetch");
const cookieParser = require("cookie-parser");
const multer  = require('multer');
const auth = require('./../middleware/auth');
const authMenu = require("../middleware/auth-menu");
var send = require("../middleware/mail");
var userData = require("../middleware/auth-data");
const app = express();
var dotenv = require("dotenv");
const Models = require('./../models');
const User = Models.User;

dotenv.config();

var title = process.env.TITLE;

app.use(cookieParser())
app.use(fileupload());

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
    authMenu(req,res,next,'kyc',"KYC","","","","","","","","");
});

router.post('/', auth, async(req,res,next) =>
{
    
    var authData = await userData(req);

    const resKey = req.body['g-recaptcha-response']
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`

    var from = 'Tech Team';
    var subject = 'KYC Documents';
    var html = 'Welcome&nbsp;<b>' 
               + authData.name + 
              '</b><br/><p>We have received your documents.</p></br><p>You will be nofified once we get you approved.</p>';
    
        fetch(url, {method: 'post',})
        .then(async(response) => await response.json())
        .then(async(google_response) => 
        {
            if (google_response.success == true)
            {
                upload(req,res,next)
                 
                    if(req.files != "")
                    { 
                        await User.update(
                            { 
                            isKYCDone: 'PENDING', 
                            },
                            {
                            where: {email: authData.email}    
                            });
                        
                        send(from,authData.email,subject,html);
    
                        res.status(200).json({"msg":"We have received your documents, you will get notified once we review them!"})
                        res.end();
                    }

                    else
                    {
                        res.status(401).json({"msg":"Both images are required!"})
                        res.end();
                    }
                
                
            }

            else
            {
                res.status(401).json({"msg":"Captcha verification failed!"})
                res.end();
            }
        });
    
})



module.exports = router;