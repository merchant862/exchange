var express = require('express');
var router = express.Router();
var dotenv = require("dotenv");
var auth = require('../middleware/auth')

dotenv.config();

var title = process.env.TITLE;

/* GET home page. */

router.get('/', auth, async function(req, res, next) {
    res.render('settings',{title: title+" | "+"Settings"});
});

module.exports =  router;
