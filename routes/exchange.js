var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
const atob = require("atob");

var auth = require('../middleware/auth')

var authMenu = require("../middleware/auth-menu")

var KYCChecker = require("../middleware/KYChecker");

const dotenv = require('dotenv');

dotenv.config();

var app = express();

app.use(cookieParser())

let title = process.env.TITLE;

/* GET home page. */
router.get('/', auth, authMenu, KYCChecker , function(req, res, next) {
    authMenu(req,res,next,"exchange","Exchange");
});

module.exports =  router;