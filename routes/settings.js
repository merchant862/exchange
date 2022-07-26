var express = require('express');
var router = express.Router();
var dotenv = require("dotenv");
var auth = require('../middleware/auth')
var authMenu = require("../middleware/auth-menu")
var bcrypt = require("bcrypt");
var KYCChecker = require("../middleware/KYChecker");
var authData = require("../middleware/auth-data");
let bodyParser = require('body-parser');
var Models = require("../models");
var User = Models.User;;

dotenv.config();

var title = process.env.TITLE;

router.use(bodyParser.json());

/* GET home page. */

router.get('/', auth, authMenu, KYCChecker, async function(req, res, next) 
{
    authMenu(req,res,next,"settings","Settings");
});

router.post('/mob',auth, authMenu, KYCChecker, async function(req, res, next) 
{
    var data = await authData(req);

    
    var mobile = req.body.mobile;
    
    
    if(mobile != "")
    {
       await User.update(
        {
            phone: mobile,
        },
        {
            where: 
            {
                email: data.email,
            }
        }
       ).then(()=>
        {
            res.status(200).json({"msg":"Mobile No. updated!"});
            res.end();
        })
    }

    else
    {
        res.status(400).json({"msg":"Mobile No. can't be empty!"});
        res.end();
    }
})

router.post('/pass', auth, authMenu, KYCChecker, async(req,res,next) => 
{
    var data = await authData(req);

    var currentPass = req.body.currentPass;
    var newPass = req.body.newPass;
    var newPass2 = req.body.newPass2;

    const salt = await bcrypt.genSalt(10);

    if(currentPass != "" && newPass != "" && newPass2 != "")
    {
        await bcrypt.compare(currentPass, data.password)
        .then(async(e)=>
        {
            if(e)
            {
                if(newPass == newPass2)
                {
                    var hash = await bcrypt.hash(newPass,salt);

                    await User.update(
                        {
                            password: hash
                        },
                        {
                            where:
                            {
                                email: data.email,
                            }
                        })
                        .then(async(e)=>
                        {
                            res.status(200).json({"msg":"Password updated!"});
                            res.end();
                        })
                        .catch((e)=>
                        {
                            res.status(400).json({"msg":"Password was not updated!"});
                            res.end();
                        })
                }

                else
                {
                    res.status(400).json({"msg":"Passwords don't match!"});
                    res.end();
                }
            }
            
            else
            {
                res.status(400).json({"msg":"Incorrect password!"});
                res.end();
            }
        })
    }

    else
    {
        res.status(400).json({"msg":"Fields can't be empty!"});
        res.end();
    }
})

//await bcrypt.compare(plaintextPassword, hash);

module.exports =  router;
