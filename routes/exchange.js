var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser");
var randToken = require("rand-token");
var fetch = require("isomorphic-fetch")
var userData = require('../middleware/auth-data');
var sequelize = require('sequelize');
const Models = require('../models');
const User = Models.User;
const Wallets = Models.wallet;
const Orders = Models.orders;
var auth = require('../middleware/auth')
var send = require('../middleware/mail');

var authMenu = require("../middleware/auth-menu")

var KYCCheckerLevel1 = require("../middleware/KYCheckerLevel1");
var KYCCheckerLevel2 = require("../middleware/KYCheckerLevel2");

var getOrders = require("../middleware/ordersByCoin");

const dotenv = require('dotenv');
const ejs = require('ejs')
const path = require('path');
var app = express();

const csrfProtection = require('../middleware/check_csrf');

app.use(cookieParser())

dotenv.config();



let title = process.env.TITLE;

function csrfToken(req,res)
{
    var token = req.csrfToken();
    /* res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token; */
    
    return token;
}

/* GET home page. */
router.get(
    '/', 
    auth, 
    authMenu, 
    KYCCheckerLevel1, 
    KYCCheckerLevel2, 
    csrfProtection, 
    async function(req, res, next) 
{
    var asset = req.query.asset;

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
                res.cookie('XSRF', csrfToken(req,res),{secure:false, sameSite:'lax',httpOnly: true});

                authMenu(
                    req,
                    res,
                    next,
                    "exchange",
                    "Exchange",
                    "",
                    "",
                    asset,
                    await getOrders(req,res,asset,"serial"),
                    await getOrders(req,res,asset,"amount"),
                    await getOrders(req,res,asset,"coin"),
                    await getOrders(req,res,asset,"price"),
                    await getOrders(req,res,asset,"time"),
                    csrfToken(req,res))

                    
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

});

router.post(
    '/:coin', 
    auth, 
    authMenu, 
    KYCCheckerLevel1 , 
    KYCCheckerLevel2, 
    csrfProtection,
    async function(req, res, next) 
    {
    
    var _csrf = req.cookies.XSRF;

    var authData = await userData(req);

    var coin = req.params.coin;

    var amount = req.body.amount;

    var token = "BUY"+coin+randToken.generate(15);

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
                return parseFloat(jsonParsedData[i][coin]) 
            }
        }

        else
        {
            return 0.00;
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
                return ((parseFloat(data['price'])/100)*70);
            })

            return price;
    }

    if(req.body._csrf == _csrf)
    {
        if(amount != "")
        {
            if(amount > 0)
            {
                if(amount > 50000)
                {
                    res.status(400).json({"msg":"Maximum buying limit is $50000!"});
                    res.end;
                }
                else
                {
                    if(amount < 10)
                    {
                        res.status(400).json({"msg":"Minimum buying limit is $10!"});
                        res.end;
                    }

                    else
                    {
                        if(authData.buyLimitDiscountedPrice == 50000)
                        {
                            res.status(401).json({"msg":"Your buying limit on discounted price is over, from now on there will be no discount on prices!"});
                            res.end;
                        }
        
                        else
                        {
                            if(authData.buyLimitDiscountedPrice + amount >= 50000)
                            {
                                res.status(401).json({"msg":"Your buying limit on discounted price is over, from now on there will be no discount on prices!"});
                                res.end;
                            }

                            else
                            {
                                if(amount <= authData.USDT_balance)
                                {
                                    var liveCoinPrice = await getCoinPrices(coin);
                            
                                    var finalAmount = (parseFloat(amount/liveCoinPrice) + coinWalletBalance);
                            
                                    await Models.sequelize.query(`UPDATE wallets SET ${coin}=:amount WHERE f_key = ${authData.id}`,
                                    {
                                        replacements: {
                                            amount: finalAmount.toFixed(5)
                                        },
                                        type: Models.sequelize.QueryTypes.UPDATE
                                    }).then(async()=>
                                            {
                                             await User.update(
                                                {
                                                    USDT_balance : sequelize.literal('USDT_balance-'+amount),
                                                    buyLimitDiscountedPrice : sequelize.literal('buyLimitDiscountedPrice+'+amount),
                                                },
                                                {
                                                    where:
                                                    {
                                                        id : authData.id,
                                                    }
                                                })
                                                .then(async()=>
                                                    {
                                                        var orderData = 
                                                        {
                                                            f_key: authData.id,
                                                            serial: token,
                                                            amount: parseFloat(amount/liveCoinPrice).toFixed(5),
                                                            coin: coin,
                                                            price:liveCoinPrice
                                                        }
                        
                                                        await Orders.create(orderData)
                                                        .then(async()=>
                                                        {
                                                            var from = "Tech Team";
                                                            var subject = "Order Type: Coin Purchase";
                    
                                                            ejs.renderFile(path.join(__dirname, '../views/email_templates/order.ejs'), 
                                                            {
                                                                name: authData.full_name,
                                                                orderID: token,
                                                                coin: coin,
                                                                amount: parseFloat(amount/liveCoinPrice).toFixed(5),
                                                            })
                                                            .then(async(template) =>
                                                            {
                                                                send(from,authData.email,subject,template);
                    
                                                                res.status(200).json(
                                                                    {
                                                                        "msg":parseFloat(amount/liveCoinPrice).toFixed(5)+"  "+coin+" purchased! with OrderID: "+token
                                                                    });
                                                                    res.end;
                                                            })
                                                        })
                                                        .catch(async()=>
                                                        {
                                                            res.status(400).json({"msg":"Order cancelled!"});
                                                            res.end;
                                                        })
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
                            }
                        }
                    }
                }

            }
            else
            {
                res.status(400).json({"msg":"Invalid amount, please try again!"});
                res.end;
            }
        }
    
        else
        {
            res.status(400).json({"msg":"Amount can't be empty!"});
            res.end;
        }
    }

    else
    {
        res.status(401).json({"msg":"Request was tampered"})
        res.end();
    }
    
});

module.exports =  router;