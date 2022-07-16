var express = require('express');
var router = express.Router();

var dotenv = require("dotenv");

dotenv.config();

var title = process.env.TITLE;

const auth = require('./../middleware/auth');

/* GET users listing. */
router.get('/', auth, function(req, res, next) 
{
    res.render('settings',{title: title+" | "+"Settings"});
});



module.exports = router;