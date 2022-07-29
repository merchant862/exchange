var express = require('express');
var router = express.Router();
var dotenv = require("dotenv");
var auth = require('../middleware/auth')
var authMenu = require("../middleware/auth-menu")
var KYCChecker = require("../middleware/KYChecker");
var getOrders = require("../middleware/getAllOrders");

dotenv.config();

router.get('/', auth, authMenu, KYCChecker, async function(req, res, next) 
{
    
    authMenu(
        req,
        res,
        next,
        "wallet",
        "Wallet",
        "",
        "",
        "",
        await getOrders(req,res,"serial"),
        await getOrders(req,res,"amount"),
        await getOrders(req,res,"coin"),
        await getOrders(req,res,"price"),
        await getOrders(req,res,"date"))
});

module.exports = router;