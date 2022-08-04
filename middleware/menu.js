var express = require('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const atob = require("atob");
const Models = require('./../models');
var getWalletBalance = require('./walletBalance');
const User = Models.User;
const KYCdata = require('./KYCdata');

//var auth = require('./auth');
const app = express();

dotenv.config();

app.use(cookieParser())

var title = process.env.TITLE;

/* GET users listing. */
module.exports = async function menu(req, res, next,_route,_title)
{   
  let jwt = req.cookies.authorization;

  if(jwt && jwt != null && jwt != "")
  {
    var base64Url = jwt.split('.')[1];

    var d = JSON.parse(atob(base64Url))

    var balance = await User.findAll(
      {
          attributes: ['USDT_balance']
      },
      {
          where: {email: d.email }
      }).then((results) => 
      {
         var json =  JSON.stringify(results);
  
         
         var jsonParsedData = JSON.parse(json);
         for(var i = 0; i < jsonParsedData.length; i++)
         {
            var data = jsonParsedData[i]['USDT_balance'];
            
            if(data!="")
            {
              return data.toFixed(2);
            }
  
            else
            {
              return "00.00";
            }
         }
  
      });

      var KYC = await KYCdata(req);

      var getCoinBalance = await getWalletBalance(req,res);
      
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
     
    
        var finalBalance =
    
        (parseFloat((await getCoinPrices("BTC")))*getCoinBalance.BTC)+
        (parseFloat((await getCoinPrices("ETH")))*getCoinBalance.ETH)+
        (parseFloat((await getCoinPrices("BNB")))*getCoinBalance.BNB)+
        (parseFloat((await getCoinPrices("SOL")))*getCoinBalance.SOL)+
        (parseFloat((await getCoinPrices("DOT")))*getCoinBalance.DOT)
    
        /* var finalBalance = 
        getCoinBalance.BTC+
        getCoinBalance.ETH+
        getCoinBalance.BNB+
        getCoinBalance.SOL+
        getCoinBalance.DOT */
        var f_b = Number(finalBalance.toFixed(2))+Number(parseFloat(balance).toFixed(2))

    return res.render(
      _route,
      {
        title: title+" | "+_title,
        name: d.name,
        email: d.email,
        status:"loggedIn",
        balance:balance,
        wallet_bal:f_b,
        stateLevel1: KYC.KYC_LEVEL_1,
        stateLevel2: KYC.KYC_LEVEL_2,
      });
    
  }

  else
  {
    res.render(_route,{title: title+" | "+_title,status:"loggedOut",page:"login"});

    return next();
  }

    /* res.render('partials/authenticated-menu', { name:d.name,email: d.email}); */
};