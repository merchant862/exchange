var express = require('express');
var router = express.Router();
const fetch = require("isomorphic-fetch");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const multer = require('multer');
const auth = require('./../middleware/auth');
const authMenu = require("../middleware/auth-menu");
var send = require("../middleware/mail");
var userData = require("../middleware/auth-data");
const app = express();
var dotenv = require("dotenv");
const Models = require('./../models');
const User = Models.User;

dotenv.config();

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: false }));

var storage = multer.memoryStorage({})
    
var upload = multer(
    { 
        storage: storage,
        limits:(req,file,cb)=>
        {
            if(file.fileSize > 5242880)
            {
                cb(null, false);
                return cb(new Error('Files other than .png, .jpg and .jpeg is not allowed!'));
            }

            else
            {
                cb(null,true);
            }
        },
        fileFilter: (req, file, cb) => 
        {
            if (
                file.mimetype == "image/png" || 
                file.mimetype == "image/jpg" || 
                file.mimetype == "image/jpeg"
                ) 
            {
              cb(null, true);
            } 
            
            else 
            {
              cb(null, false);
              return cb(new Error('Files other than .png, .jpg and .jpeg is not allowed!'));
            }
        }
    })

router.get('/', auth, async(req, res, next) =>
{
    authMenu(req,res,next,'kyc',"KYC","","","","","","","","");
});

router.post('/', auth, upload.array("docs", 2), async(req,res,next) =>
{
    
    var authData = await userData(req);

    const resKey = req.body['g-recaptcha-response']
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`

    var from = 'Tech Team';
    var subject = 'KYC Documents';
    var html = 'Welcome&nbsp;<b>' 
               + authData.full_name + 
              '</b><br/><p>We have received your documents.</p></br><p>You will be nofified once we get you approved.</p>';
        
        try
        {
            if(req.files == "")
            {
                throw new Error("Please choose files!");
            }

            else if(req.files < 2)
            {
                throw new Error("Both documents are required!");
            }

            else if(req.files > 2)
            {
                throw new Error("Something went wrong!");
            }

            else
            {
                await fetch(url, {method: 'post',})
                .then(async(response) => await response.json())
                .then(async(google_response) => 
                {
                    if (google_response.success == true)
                    {
                        await User.update(
                            { 
                                isKYCDone: 'PENDING', 
                            },
                            {
                                where: {email: authData.email}    
                            })
                            .then(async() => 
                            { 
                                send(from,authData.email,subject,html);
    
                                res.status(200).json({"msg":"We have received your documents, you will get notified once we review them!"})
                                res.end();
                                next();
                            })
                            .catch(async()=>
                            {
                                throw new Error("Something went wrong!");
                            });
                    }

                    else
                    {
                        throw new Error("Captcha verification failed!");
                    }
                            
                });
            }
        }
        catch(e)
        {
            console.log(req.files)
            res.status(401).json({"msg":e.message})
            res.end();
        }
})



module.exports = router;