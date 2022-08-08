var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
var fetch = require("isomorphic-fetch")

var auth = require('../middleware/auth')

var KYCCheckerLevel1 = require("../middleware/KYCheckerLevel1");
var KYCCheckerLevel2 = require("../middleware/KYCheckerLevel2");

const dotenv = require('dotenv');

dotenv.config();

var app = express();

app.use(cookieParser())

router.get('/', auth, KYCCheckerLevel1, KYCCheckerLevel2, async function(req,res,next)
{
    var asset = req.query.asset;

    var getCoinPrices = async(_coin) =>
    {
            var price = await fetch('https://poloniex.com/public?command=returnOrderBook&currencyPair=USDT_'+_coin+'&depth=8', 
            {
                method: 'GET',
            })
            .then(async(response) => {return response.json()})
            
            return  price
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
                res.status(200).json(price);  
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