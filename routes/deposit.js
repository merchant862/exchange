var express = require('express');
var router = express.Router();
var dotenv = require("dotenv");
var auth = require('../middleware/auth')
var authMenu = require("../middleware/auth-menu")
var KYCChecker = require("../middleware/KYChecker");
const e = require('express');


dotenv.config();

router.get('/', auth, KYCChecker, authMenu, async function(req, res, next) 
{
    authMenu(req,res,next,"deposit","Deposit Funds");
});

module.exports =  router;
