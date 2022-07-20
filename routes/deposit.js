var express = require('express');
var router = express.Router();
var dotenv = require("dotenv");
var auth = require('../middleware/auth')
var authMenu = require("../middleware/auth-menu")
var auth_data = require('../middleware/auth-data');
var web3 = require('../middleware/web3')
var KYCChecker = require("../middleware/KYChecker");

dotenv.config();

router.get('/', auth, KYCChecker, authMenu, async function(req, res, next) 
{
    authMenu(req,res,next,"deposit","Deposit Funds");
});

module.exports =  router;
