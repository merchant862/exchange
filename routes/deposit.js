var express = require('express');
var router = express.Router();
var dotenv = require("dotenv");
var auth = require('../middleware/auth')
var authMenu = require("../middleware/auth-menu")
var KYCCheckerLevel1 = require("../middleware/KYCheckerLevel1");

dotenv.config();

router.get('/', auth, KYCCheckerLevel1, authMenu, async function(req, res, next) 
{   
    authMenu(req,res,next,"deposit","Deposit Funds");
});

module.exports =  router;
