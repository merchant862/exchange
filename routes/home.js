var express = require('express');
var router = express.Router();

var dotenv = require("dotenv");

var KYCCheckerLevel1 = require("../middleware/KYCheckerLevel1");

dotenv.config();

const auth = require('./../middleware/auth');

var authMenu = require("../middleware/auth-menu")

/* GET users listing. */
router.get('/', auth, KYCCheckerLevel1, function(req, res, next) 
{
    authMenu(req,res,next,"settings","Settings");
});



module.exports = router;