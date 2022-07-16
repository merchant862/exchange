var express = require('express');
var router = express.Router();

const dotenv = require('dotenv');

var menu = require('../middleware/menu');

dotenv.config();

let title = process.env.TITLE;

/* GET home page. */
router.get('/', menu, async function(req, res, next) {
    menu(req,res,next,"indices","Indices");
});

module.exports =  router;
