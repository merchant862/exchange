var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

const dotenv = require('dotenv');

dotenv.config();

var title = process.env.TITLE;

var app = express();

app.use(cookieParser());

router.get('/', async (req, res) => 
{
    const token = await req.cookies.authorization;
    
    if(token!="")
    {
        res.clearCookie('authorization');
        res.clearCookie('_csrf');
        res.redirect('/login');
    }

    else
    {
        res.redirect('/login');
    }
});

module.exports = router;