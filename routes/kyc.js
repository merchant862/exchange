var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
var multer = require('multer')
const bodyParser = require('body-parser');
const fileUpload = require('../middleware/fileUpload');
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

function filesLength (req) 
{
    return req.files.length; 
}
  

router.get('/', auth, async(req, res, next) =>
{
    authMenu(req,res,next,'kyc',"KYC","","","","","","","","");
});

router.post('/', auth, async(req,res,next) =>
{
    
    var authData = await userData(req);

    var update_tries = await User.update(
        { 
            KYCtries: Models.sequelize.literal('KYCtries +'+1), 
        },
        {
            where: {email: authData.email}    
        })

    var from = 'Tech Team';
    var subject = 'KYC Documents';
    var html = 'Welcome&nbsp;<b>' 
               + authData.full_name + 
              '</b><br/><p>We have received your documents.</p></br><p>You will be nofified once we get you approved.</p>';
    
    if(authData.KYCtries < 3)
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