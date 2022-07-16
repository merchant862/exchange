var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

let title = process.env.TITLE;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('404',{title: title+" | "+"Not Found (404)"});
});

module.exports = router;
