var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const authMenu = require("../middleware/auth-menu");
const app = express();
var dotenv = require("dotenv");

dotenv.config();

 
router.get('/', auth, async(req, res, next) =>
{
    authMenu(req,res,next,'kyc_choose_method_1',"Choose Method","","","","","","","","","");
});

module.exports = router;