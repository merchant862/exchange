var express = require('express');
var router = express.Router();
var dotenv = require("dotenv");
var auth = require('../middleware/auth')
var authMenu = require("../middleware/auth-menu")

dotenv.config();

var title = process.env.TITLE;

/* GET home page. */

router.get('/', auth, authMenu, async function(req, res, next) {
    authMenu(req,res,next,"settings","Settings");
});

module.exports =  router;
