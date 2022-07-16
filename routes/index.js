var express = require('express');
var router = express.Router();

const dotenv = require('dotenv');

var menu = require("../middleware/menu");

dotenv.config();

let title = process.env.TITLE;

/* GET home page. */
router.get('/', menu, function(req, res, next) {
  menu(req,res,next,"index","");
});

module.exports =  router;
