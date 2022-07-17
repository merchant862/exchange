var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

var menu = require("../middleware/menu")

/* GET users listing. */
router.get('/', menu, function(req, res, next) {
  menu(req,res,next,"404","Not Found (404)");
});

module.exports = router;
