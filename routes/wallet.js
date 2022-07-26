var express = require('express');
var router = express.Router();
var dotenv = require("dotenv");
var auth = require('../middleware/auth')
var authMenu = require("../middleware/auth-menu")
var KYCChecker = require("../middleware/KYChecker");
let bodyParser = require('body-parser');

dotenv.config();

router.get('/', auth, authMenu, KYCChecker, async function(req, res, next) 
{
    authMenu(req,res,next,"wallet","Wallet");
});

module.exports = router;