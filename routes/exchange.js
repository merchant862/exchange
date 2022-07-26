var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
var fetch = require("isomorphic-fetch")
var userData = require('../middleware/auth-data');
const Models = require('../models');
const Wallets = Models.wallet;

var auth = require('../middleware/auth')

var authMenu = require("../middleware/auth-menu")

var KYCChecker = require("../middleware/KYChecker");

const dotenv = require('dotenv');

dotenv.config();

var app = express();

app.use(cookieParser())

let title = process.env.TITLE;

/* GET home page. */
router.get('/', auth, authMenu, KYCChecker , async function(req, res, next) {
    authMenu(req,res,next,"exchange","Exchange");
});

router.post('/:coin', auth, authMenu, KYCChecker , async function(req, res, next) {
    
    var authData = await userData(req);

    var coin = req.params.coin;

    var amount = req.body.amount;

    var coinWalletBalance = await Wallets.findAll(
    {
        attributes:[coin]
    },
    {  
        where:{f_key: authData.id}
    }).then(async(data) =>
    {
        if(data != "")
        {
            var json =  JSON.stringify(data);
          
            var jsonParsedData = JSON.parse(json);
            
            for(var i = 0; i < jsonParsedData.length; i++)
            {
                return (jsonParsedData[i][coin]) 
            }
        }

        else
        {
            return 0;
        }

    })

    var getCoinPrices = async(_coin) =>
    {
            var price = await fetch('https://api.binance.com/api/v3/ticker/price?symbol='+_coin+'USDT', 
            {
                method: 'GET',
            })
            .then(async(response) => response.json())
            .then(async(data) => 
            {
                var price = parseFloat(data['price']);
                
                return price;
            })

            return price;
    }

    if(amount <= authData.USDT_balance)
    {
        var liveCoinPrice = await getCoinPrices(coin);

        var finalAmount = amount/liveCoinPrice;
  
            await Models.sequelize.query(`UPDATE users SET USDT_balance=:USDT_balance WHERE id = ${authData.id}`,
                {
                    replacements: {
                        USDT_balance:[authData.USDT_balance-amount]
                    },
                    type: Models.sequelize.QueryTypes.UPDATE
                }).then(async()=>
                {
                    await Models.sequelize.query(`UPDATE wallets SET ${coin}=:amount WHERE f_key = ${authData.id}`,
                    {
                        replacements: {
                            amount: [parseFloat(coinWalletBalance)+finalAmount.toFixed(5)]
                        },
                        type: Models.sequelize.QueryTypes.UPDATE
                    })
                    .then(async()=>
                        {
                            res.status(200).json({"msg":finalAmount.toFixed(5)+"  "+coin+" purchased!"});
                            res.end;
                        }).catch(async()=>
                        {
                            res.status(400).json({"msg":"Purchase failed"});
                            res.end;
                        })
                }).catch(async()=>
                {
                    res.status(400).json({"msg":"Error occured"});
                    res.end;
                })
    }

    else
    {
        res.status(400).json({"msg":"Insufficient balance!"});
        res.end;
    }
    
});

module.exports =  router;