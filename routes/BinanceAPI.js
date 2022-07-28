var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
var fetch = require("isomorphic-fetch")

var auth = require('../middleware/auth')

var KYCChecker = require("../middleware/KYChecker");

const dotenv = require('dotenv');

dotenv.config();

var app = express();

app.use(cookieParser())

router.get('/', auth, KYCChecker, async function(req,res,next)
{
    var asset = req.query.asset;

    var getCoinPrices = async(_coin) =>
    {
            var price =  fetch('https://api.binance.com/api/v3/ticker/price?symbol='+_coin+'USDT', 
            {
                method: 'GET',
            })
            .then(async(response) => response.json())
            .then(async(data) => 
            {
                return ((parseFloat(data['price'])/100)*70);
            })

            return (await price).toFixed(2);
    }

    if(req.url.includes('?'))
    {
        if(asset != "")
        {
            if(
                asset == "BTC" || 
                asset == "ETH" || 
                asset == "BNB" || 
                asset == "SOL" || 
                asset == "DOT"
            )
            { 
                var price = await getCoinPrices(asset);
                res.status(200).json({"price": price});  
            }
            
            else
            {
                res.status(404).redirect('404');
            }
        }

        else
        {
            res.status(404).redirect('404');
        }
    }

    else
    {
        res.status(404).redirect('404');
    }
})

module.exports = router;