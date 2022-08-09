var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const authMenu = require("../middleware/auth-menu");
const app = express();
var dotenv = require("dotenv");
var KYCCheckerLevel1 = require("../middleware/KYCheckerLevel1");

dotenv.config();

 
router.get('/', auth, KYCCheckerLevel1, async(req, res, next) =>
{
    authMenu(req,res,next,'kyc_choose_method_2',"Choose Method","","","","","","","","","");
});

module.exports = router;