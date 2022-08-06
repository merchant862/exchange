var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
var multer = require('multer')
const bodyParser = require('body-parser');
const fileUpload = require('../middleware/fileUpload');
const auth = require('../middleware/auth');
var KYCData = require('../middleware/KYCdata');
const authMenu = require("../middleware/auth-menu");
var send = require("../middleware/mail");
var userData = require("../middleware/auth-data");
const app = express();
var dotenv = require("dotenv");
const Models = require('../models');
const User = Models.User;
const userKYC = Models.user_kyc
var path = require('path');
var ejs = require('ejs');

dotenv.config();

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: false }));

function filesLength (req) 
{
    return req.files.length; 
}
  

router.get('/', auth, async(req, res, next) =>
{
    authMenu(req,res,next,'kyc-level-1',"KYC","","","","","","","","");
});

router.post('/', auth, async(req,res,next) =>
{
    var authData = await userData(req);
    var KYC = await KYCData(req);

    var update_tries = await userKYC.update(
        { 
            no_of_tries: Models.sequelize.literal('no_of_tries +'+1), 
        },
        {
            where: {f_key: KYC.f_key}    
        })

    var from = 'Tech Team';
    var subject = 'KYC Documents Level 1';
    
    if(KYC.no_of_tries < 3)
    {
        fileUpload(req, res, async (err) =>
        { 
            if (err instanceof multer.MulterError) 
            {
                update_tries;
                res.status(401).json({"msg":err.message})
                res.end();
            } 
    
            else if(err)
            {
                update_tries;
                res.status(401).json({"msg":err.message})
                res.end();
            }
    
            else if(filesLength(req) == 0)
            {
                update_tries;
                res.status(401).json({"msg":"Please choose files!"})
                res.end();
            }
    
            else if(filesLength(req) < 2)
            {
                update_tries;
                res.status(401).json({"msg":"Both documents are required!"})
                res.end();
            }
    
            else if(filesLength(req) > 2)
            {
                update_tries;
                res.status(401).json({"msg":"More than 2 files selected"})
                res.end();
            }
    
            else
            {
                var imgsrc = 'assets/uploads/';
                await userKYC.update(
                    { 
                        KYC_LEVEL_1: 'PENDING', 
                        no_of_tries:0,
                    },
                    {
                        where: {f_key: KYC.f_key}    
                    })
                    .then(async() => 
                    { 
                        ejs.renderFile(path.join(__dirname, '../views/email_templates/kyc.ejs'), 
                        {
                            name: authData.full_name,
                            level: "1",
                        })
                        .then(async(template) => 
                        {
                            send(from,authData.email,subject,template);
    
                            res.status(200).json({"msg":"We have received your documents, you will get notified once we review them!"})
                            res.end();
                            next();
                        })
                    })
                    .catch(async()=>
                    {
                        update_tries;
                        res.status(401).json({"msg":"Something went wrong!"})
                        res.end();
                    });
            }
        })
    }

    else
    {
        update_tries;
        res.status(401).json({"msg":"You have reached maximum no. of KYC tries, please comeback after 3 hours!"})
        res.end();
    }
    
})



module.exports = router;