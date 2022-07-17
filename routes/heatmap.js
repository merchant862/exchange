var express = require('express');
var router = express.Router();

const dotenv = require('dotenv');

var menu = require("../middleware/menu")

dotenv.config();

/* GET home page. */
router.get('/', menu, async function(req, res, next) {
    menu(req,res,next,"heatmap","Heatmap");
});

module.exports =  router;
