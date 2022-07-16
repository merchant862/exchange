var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
const atob = require("atob");

var auth = require('../middleware/auth')

const dotenv = require('dotenv');

dotenv.config();

var app = express();

app.use(cookieParser())

let title = process.env.TITLE;

/* GET home page. */
router.get('/', auth, function(req, res, next) {
    res.render('exchange',{title: title+" | "+"Exchange"});
});

module.exports =  router;